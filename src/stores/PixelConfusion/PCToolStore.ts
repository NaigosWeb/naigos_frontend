import { computed, ref, shallowRef, watch } from "vue";
import { defineStore } from "pinia";
import { ElMessage } from "element-plus";
import type {
    PCAction,
    PCBatchItemImpl,
    PCBatchParamsImpl,
    PCBatchResultsImpl,
    PCDirection,
    PCImageImpl,
    PCIterationMode,
    PCMethod,
    PCPillStateImpl,
    PCPreviewImpl,
    PCResultPaneImpl,
    PCSourceImpl,
    PCStageMode,
    PCStatusTone,
    PCTransformParamsImpl,
    PCWorkerBatchItemImpl,
    PCWorkerBatchRequestImpl,
    PCWorkerResponseImpl,
    PCWorkerTransformRequestImpl
} from "@/interfaces/PixelConfusionImpl";
import {
    buildBatchRequest,
    buildTransformRequest,
    DEFAULT_BATCH_COUNT,
    MAX_BATCH_COUNT,
    MAX_ITERATIONS
} from "@/utils/PixelConfusion/parameters";
import {
    canvasFromImageData,
    decodeImageFile,
    downloadCanvas,
    fileExtensionLabel,
    fileStem,
    formatBytes,
    formatDimensions,
    isSupportedImageFile,
    makeDemoImage,
    PC_FILE_ACCEPT
} from "@/utils/PixelConfusion/image";

const THUMBNAIL_SIZE = 240;

type PCOperation = "source" | "transform" | "batch" | "preview" | "save" | null;

interface PendingTransformRequest {
    kind: "transform";
    id: number;
    width: number;
    height: number;
    onProgress: (fraction: number, text: string) => void;
    resolve: (result: { imageData: ImageData; elapsed: number }) => void;
    reject: (error: Error) => void;
}

interface PendingBatchRequest {
    kind: "batch";
    id: number;
    onProgress: (fraction: number, text: string) => void;
    onItem: (message: PCWorkerBatchItemImpl) => void;
    resolve: (result: { elapsed: number; generated: number }) => void;
    reject: (error: Error) => void;
}

type PendingWorkerRequest = PendingTransformRequest | PendingBatchRequest;

let worker: Worker | null = null;
let pendingRequest: PendingWorkerRequest | null = null;
let requestSequence = 0;
let pickerInput: HTMLInputElement | null = null;

function ensureWorker(): Worker {
    if (worker) return worker;
    const instance = new Worker(
        new URL("../../utils/PixelConfusion/pc.worker.ts", import.meta.url),
        { type: "module" }
    );
    instance.onmessage = (event: MessageEvent<PCWorkerResponseImpl>) => {
        const message = event.data;
        const pending = pendingRequest;
        if (!pending || message.id !== pending.id) return;

        if (message.kind === "progress") {
            pending.onProgress(message.fraction, message.text);
            return;
        }
        if (message.kind === "batch_item") {
            if (pending.kind === "batch") pending.onItem(message);
            return;
        }

        pendingRequest = null;

        if (message.kind === "error") {
            pending.reject(new Error(message.message));
            return;
        }

        if (message.kind === "batch_done") {
            if (pending.kind !== "batch") {
                pending.reject(new Error("处理结果无效。"));
                return;
            }
            pending.resolve({
                elapsed: message.elapsed,
                generated: message.generated
            });
            return;
        }

        if (pending.kind !== "transform") {
            pending.reject(new Error("处理结果无效。"));
            return;
        }

        try {
            const pixels = new Uint8ClampedArray(message.pixels);
            const imageData = new ImageData(pixels, pending.width, pending.height);
            pending.resolve({ imageData, elapsed: message.elapsed });
        } catch (error) {
            pending.reject(error instanceof Error ? error : new Error("处理结果无效。"));
        }
    };
    instance.onerror = (event: ErrorEvent) => {
        const pending = pendingRequest;
        pendingRequest = null;
        pending?.reject(new Error(event.message || "图片处理线程异常。"));
    };
    worker = instance;
    return instance;
}

function transformInWorker(
    image: PCImageImpl,
    params: PCTransformParamsImpl,
    onProgress: (fraction: number, text: string) => void
): Promise<{ imageData: ImageData; elapsed: number }> {
    const instance = ensureWorker();
    const id = ++requestSequence;
    const width = image.width;
    const height = image.height;
    const pixels = new Uint8ClampedArray(image.imageData.data);

    return new Promise((resolve, reject) => {
        pendingRequest = {
            kind: "transform",
            id,
            width,
            height,
            onProgress,
            resolve,
            reject
        };
        const request: PCWorkerTransformRequestImpl = {
            id,
            kind: "transform",
            method: params.method,
            action: params.action,
            iterations: params.iterations,
            offset: params.offset,
            a: params.a,
            b: params.b,
            width,
            height,
            pixels: pixels.buffer as ArrayBuffer
        };
        try {
            instance.postMessage(request, [pixels.buffer as ArrayBuffer]);
        } catch (error) {
            pendingRequest = null;
            reject(error instanceof Error ? error : new Error("无法启动图片处理。"));
        }
    });
}

function transformBatchInWorker(
    image: PCImageImpl,
    params: PCBatchParamsImpl,
    handlers: {
        onProgress: (fraction: number, text: string) => void;
        onItem: (message: PCWorkerBatchItemImpl) => void;
    }
): Promise<{ elapsed: number; generated: number }> {
    const instance = ensureWorker();
    const id = ++requestSequence;
    const width = image.width;
    const height = image.height;
    const pixels = new Uint8ClampedArray(image.imageData.data);

    return new Promise((resolve, reject) => {
        pendingRequest = {
            kind: "batch",
            id,
            onProgress: handlers.onProgress,
            onItem: handlers.onItem,
            resolve,
            reject
        };
        const request: PCWorkerBatchRequestImpl = {
            id,
            kind: "batch",
            method: params.method,
            actions: params.actions,
            start: params.start,
            count: params.count,
            offset: params.offset,
            a: params.a,
            b: params.b,
            width,
            height,
            pixels: pixels.buffer as ArrayBuffer,
            thumbnailSize: THUMBNAIL_SIZE
        };
        try {
            instance.postMessage(request, [pixels.buffer as ArrayBuffer]);
        } catch (error) {
            pendingRequest = null;
            reject(error instanceof Error ? error : new Error("无法启动批量处理。"));
        }
    });
}

function notifyError(title: string, message: string): void {
    ElMessage.error({
        message: `${title}：${message}`,
        duration: 5000,
        grouping: true,
        showClose: true
    });
}

function directionFor(action: PCAction): PCDirection {
    return action === "restore" ? "reverse" : "forward";
}

function actionFor(direction: PCDirection): PCAction {
    return direction === "reverse" ? "restore" : "scramble";
}

function directionLabel(direction: PCDirection): string {
    return direction === "reverse" ? "反向" : "正向";
}

function actionLabel(action: PCAction): string {
    return action === "restore" ? "反向混淆" : "正向混淆";
}

export const usePCToolStore = defineStore("PCTool", () => {
    // Single-run parameters and result.
    const method = ref<PCMethod>("gilbert");
    const source = shallowRef<PCSourceImpl | null>(null);
    const result = shallowRef<PCImageImpl | null>(null);
    const resultAction = ref<PCAction>("scramble");

    const iterations = ref("1");
    const offset = ref("");
    const paramA = ref("1");
    const paramB = ref("1");

    // Iteration mode and batch state.
    const iterationMode = ref<PCIterationMode>("single");
    const autoMixed = ref(false);
    const batchCountText = ref(String(DEFAULT_BATCH_COUNT));
    const batchCount = ref(DEFAULT_BATCH_COUNT);
    const batchStart = ref(1);
    const batchIndex = ref(1);
    const batchDirection = ref<PCDirection | null>(null);
    const batchResults = shallowRef<PCBatchResultsImpl>({ reverse: [], forward: [] });
    const batchHasResults = ref(false);
    const batchAttempted = ref(false);

    // Shared run state.
    const busy = ref(false);
    const operation = ref<PCOperation>(null);
    const busyLabel = ref("正在处理");
    const progress = ref(0);
    const statusText = ref("就绪 · 选择图片或使用内置测试图");
    const statusTone = ref<PCStatusTone>("idle");
    const preview = shallowRef<PCPreviewImpl | null>(null);

    let previewToken = 0;

    const setStatus = (text: string, tone: PCStatusTone = "idle") => {
        statusText.value = text;
        statusTone.value = tone;
    };

    // ------------------------------------------------------------ computed
    const stageMode = computed<PCStageMode>(() => {
        if (iterationMode.value === "single") return "single";
        return autoMixed.value ? "auto" : "batch";
    });

    const methodDescription = computed(() => {
        if (method.value === "gilbert") {
            return { text: "广义希尔伯特曲线 · 支持任意宽高", warning: false };
        }
        const nonSquare = !!source.value && source.value.width !== source.value.height;
        return {
            text: "标准猫映射 · 仅支持正方形图片",
            warning: nonSquare
        };
    });

    const methodHint = computed(() => {
        if (iterationMode.value === "batch") {
            return method.value === "gilbert"
                ? "批量次数由上方“等差迭代次数”控制。"
                : "批量次数由上方控制；仅支持正方形图片。";
        }
        return method.value === "gilbert"
            ? "默认使用黄金比例偏移。"
            : "仅支持正方形图片。";
    });

    const sourcePill = computed<PCPillStateImpl>(() => {
        if (operation.value === "source") return { text: "读取中", tone: "busy" };
        if (operation.value === "transform" || operation.value === "batch") {
            return { text: "处理中", tone: "busy" };
        }
        if (source.value) return { text: "已载入", tone: "loaded" };
        return { text: "未选择", tone: "idle" };
    });

    const visibleResultExists = computed(() => {
        if (iterationMode.value === "batch") {
            return batchHasResults.value
                || batchResults.value.reverse.length > 0
                || batchResults.value.forward.length > 0;
        }
        return result.value !== null;
    });

    const activeStep = computed(() => {
        if (busy.value) return source.value ? 3 : 1;
        if (visibleResultExists.value) return 4;
        if (source.value) return 2;
        return 1;
    });

    const isTransforming = computed(() => operation.value === "transform");
    const isBatchRunning = computed(() => operation.value === "batch");
    const canTransform = computed(() => !!source.value && !busy.value);
    const canUseResult = computed(() =>
        iterationMode.value === "single" && !!result.value && !busy.value);
    const canRunAutoBatch = computed(() =>
        iterationMode.value === "batch" && autoMixed.value && canTransform.value);

    const sourceDims = computed(() => source.value
        ? formatDimensions(source.value.width, source.value.height)
        : "— × —");

    const resultDims = computed(() => {
        if (isTransforming.value) return "处理中…";
        if (iterationMode.value !== "single") return "— × —";
        return result.value
            ? formatDimensions(result.value.width, result.value.height)
            : "— × —";
    });

    const batchEnd = computed(() => batchStart.value + batchCount.value - 1);
    const batchRangeText = computed(() =>
        `第 ${batchIndex.value} 批 · ${batchStart.value}–${batchEnd.value} 次`);
    const nextBatchStart = computed(() => batchStart.value + batchCount.value);
    const nextBatchEnd = computed(() =>
        nextBatchStart.value + batchCount.value - 1);
    const canNextBatch = computed(() => {
        if (!batchHasResults.value) return false;
        return nextBatchEnd.value <= MAX_ITERATIONS;
    });
    const canRunAutoNextBatch = computed(() =>
        canRunAutoBatch.value && batchHasResults.value && canNextBatch.value);
    const nextBatchMeta = computed(() => {
        if (!batchHasResults.value) {
            return `本批 ${batchStart.value}–${batchEnd.value} 次`;
        }
        if (!canNextBatch.value) return "已达迭代上限";
        return `下一批 ${nextBatchStart.value}–${nextBatchEnd.value} 次`;
    });
    const batchCountInvalid = computed(() => {
        const text = batchCountText.value.trim();
        if (!/^\d+$/.test(text)) return "等差迭代次数必须为整数。";
        const value = Number(text);
        if (value < 1 || value > MAX_BATCH_COUNT) {
            return `等差迭代次数需在 1 到 ${MAX_BATCH_COUNT} 之间。`;
        }
        return "";
    });

    const primaryPane = computed<PCResultPaneImpl>(() => {
        const direction = batchDirection.value;
        const items = direction === "reverse"
            ? batchResults.value.reverse
            : direction === "forward"
                ? batchResults.value.forward
                : [];
        const title = direction
            ? `${directionLabel(direction)}结果集`
            : "结果集";
        let placeholderTitle = "还没有批量结果";
        let placeholderSubtitle = "点击正向混淆或反向混淆开始";
        if (isBatchRunning.value) {
            placeholderTitle = direction
                ? `正在生成${directionLabel(direction)}结果集…`
                : "正在生成结果集…";
            placeholderSubtitle = batchRangeText.value;
        } else if (batchAttempted.value) {
            placeholderTitle = "本批没有结果";
            placeholderSubtitle = batchRangeText.value;
        }
        return {
            title,
            direction,
            meta: batchAttempted.value ? batchRangeText.value : "",
            items,
            placeholderTitle,
            placeholderSubtitle
        };
    });

    const makeAutoPane = (
        direction: PCDirection,
        items: PCBatchItemImpl[]
    ): PCResultPaneImpl => {
        let placeholderTitle = "还没有批量结果";
        let placeholderSubtitle = "点击自动混淆开始";
        if (isBatchRunning.value) {
            placeholderTitle = `正在生成${directionLabel(direction)}结果集…`;
            placeholderSubtitle = batchRangeText.value;
        } else if (batchAttempted.value) {
            placeholderTitle = "本批没有结果";
            placeholderSubtitle = batchRangeText.value;
        }
        return {
            title: `${directionLabel(direction)}结果集`,
            direction,
            meta: batchAttempted.value ? batchRangeText.value : "",
            items,
            placeholderTitle,
            placeholderSubtitle
        };
    };

    const reversePane = computed<PCResultPaneImpl>(() =>
        makeAutoPane("reverse", batchResults.value.reverse));
    const forwardPane = computed<PCResultPaneImpl>(() =>
        makeAutoPane("forward", batchResults.value.forward));

    // ------------------------------------------------------------ resetting
    const resetBatchState = () => {
        batchStart.value = 1;
        batchIndex.value = 1;
        batchDirection.value = null;
        batchResults.value = { reverse: [], forward: [] };
        batchHasResults.value = false;
        batchAttempted.value = false;
        progress.value = 0;
    };

    const setSource = (
        image: PCImageImpl,
        name: string,
        meta: string,
        stem: string
    ) => {
        source.value = { ...image, name, meta, stem };
        result.value = null;
        resultAction.value = "scramble";
        preview.value = null;
        previewToken += 1;
        resetBatchState();
    };

    const openImagePicker = () => {
        if (busy.value) return;
        if (!pickerInput) {
            pickerInput = document.createElement("input");
            pickerInput.type = "file";
            pickerInput.accept = PC_FILE_ACCEPT;
            pickerInput.style.display = "none";
            document.body.appendChild(pickerInput);
            pickerInput.addEventListener("change", () => {
                const file = pickerInput?.files?.[0];
                if (file) void loadFile(file);
                if (pickerInput) pickerInput.value = "";
            });
        }
        pickerInput.click();
    };

    const loadFile = async (file: File) => {
        if (busy.value) return;
        if (!isSupportedImageFile(file)) {
            setStatus("操作未完成 · 请选择常见的单帧图片", "error");
            notifyError("无法读取图片", "请选择 PNG / JPG / WEBP / BMP 单帧图片。");
            return;
        }

        busy.value = true;
        operation.value = "source";
        busyLabel.value = "正在读取图片";
        progress.value = 0;
        setStatus("正在读取图片…", "busy");

        try {
            const image = await decodeImageFile(file);
            setSource(
                image,
                file.name,
                `${formatDimensions(image.width, image.height)} · ${fileExtensionLabel(file.name)} · ${formatBytes(file.size)}`,
                fileStem(file.name)
            );
            setStatus("已载入图片 · 选择算法后开始处理", "ok");
        } catch (error) {
            setStatus("操作未完成 · 请检查输入图片或参数", "error");
            notifyError(
                "无法读取图片",
                error instanceof Error ? error.message : "请选择常见的单帧图片。"
            );
        } finally {
            busy.value = false;
            operation.value = null;
        }
    };

    const useDemo = () => {
        if (busy.value) return;
        const image = makeDemoImage();
        setSource(
            image,
            "catmap-demo.png",
            `${formatDimensions(image.width, image.height)} · PNG`,
            "catmap-demo"
        );
        setStatus("已载入图片 · 选择算法后开始处理", "ok");
    };

    const clearSource = () => {
        if (busy.value) return;
        source.value = null;
        result.value = null;
        preview.value = null;
        previewToken += 1;
        resetBatchState();
        setStatus("就绪 · 选择图片或使用内置测试图", "idle");
    };

    // ------------------------------------------------------------ controls
    const changeMethod = (value: PCMethod) => {
        if (busy.value || method.value === value) return;
        method.value = value;
        if (iterationMode.value === "batch") {
            resetBatchState();
            setStatus("算法已切换 · 批次已重置", "idle");
        }
    };

    const setIterationMode = (mode: PCIterationMode) => {
        if (busy.value || mode === iterationMode.value) return;
        iterationMode.value = mode;
        if (mode === "single") autoMixed.value = false;
        result.value = null;
        preview.value = null;
        resetBatchState();
        if (mode === "batch") {
            setStatus("多次迭代 · 设置次数后点正向或反向按钮", "idle");
        } else {
            setStatus("单次混淆 · 点击正向或反向按钮处理一张", "idle");
        }
    };

    const setAutoMixed = (value: boolean) => {
        if (busy.value || iterationMode.value !== "batch") {
            autoMixed.value = false;
            return;
        }
        const next = !!value;
        if (next === autoMixed.value) return;
        autoMixed.value = next;
        result.value = null;
        resetBatchState();
        setStatus(
            next
                ? "正反自动混淆已开启 · 点击自动混淆开始"
                : "正反自动混淆已关闭 · 批次已重置",
            "idle"
        );
    };

    const setBatchCountText = (value: string) => {
        batchCountText.value = value;
    };

    const stepBatchCount = (delta: number) => {
        if (busy.value) return;
        const trimmed = batchCountText.value.trim();
        const base = /^\d+$/.test(trimmed)
            ? Number(trimmed)
            : batchCount.value;
        const next = Math.min(
            MAX_BATCH_COUNT,
            Math.max(1, base + delta)
        );
        batchCountText.value = String(next);
    };

    const stepIterations = (delta: number) => {
        if (busy.value) return;
        const current = Number.parseInt(iterations.value, 10);
        const base = Number.isFinite(current) ? current : 1;
        const next = Math.min(MAX_ITERATIONS, Math.max(1, base + delta));
        iterations.value = String(next);
    };

    watch(batchCountText, text => {
        if (busy.value) return;
        const trimmed = text.trim();
        if (!/^\d+$/.test(trimmed)) return;
        const value = Number(trimmed);
        if (value < 1 || value > MAX_BATCH_COUNT) return;
        if (value === batchCount.value) return;
        batchCount.value = value;
        if (iterationMode.value !== "batch") return;
        resetBatchState();
        setStatus(`等差迭代次数已设为 ${value} · 批次已重置`, "idle");
    }, { flush: "sync" });

    watch([offset, paramA, paramB], () => {
        if (iterationMode.value !== "batch" || busy.value) return;
        const hasPartial = batchResults.value.reverse.length > 0
            || batchResults.value.forward.length > 0;
        if (!batchHasResults.value && !hasPartial && batchIndex.value === 1) {
            return;
        }
        resetBatchState();
        setStatus("参数已变更 · 批次已重置", "idle");
    }, { flush: "sync" });

    // ------------------------------------------------------------ transforms
    const runDirection = (action: PCAction) => {
        if (iterationMode.value === "batch") {
            if (autoMixed.value) return;
            void runBatch([action], 1, 1);
            return;
        }
        void runTransform(action);
    };

    const runTransform = async (action: PCAction) => {
        if (!source.value || busy.value || iterationMode.value !== "single") return;

        let params: PCTransformParamsImpl;
        try {
            params = buildTransformRequest(
                method.value,
                action,
                iterations.value,
                offset.value,
                paramA.value,
                paramB.value,
                source.value.width,
                source.value.height
            );
        } catch (error) {
            notifyError("参数有误", error instanceof Error ? error.message : "请检查参数。");
            return;
        }

        const label = actionLabel(action);
        busy.value = true;
        operation.value = "transform";
        busyLabel.value = `正在${label}`;
        progress.value = 0;
        setStatus(`正在${label}…`, "busy");

        try {
            const transformed = await transformInWorker(
                source.value,
                params,
                (fraction, text) => {
                    progress.value = fraction;
                    setStatus(`${text} · ${Math.round(fraction * 100)}%`, "busy");
                }
            );
            const imageData = transformed.imageData;
            result.value = {
                canvas: canvasFromImageData(imageData),
                imageData,
                width: imageData.width,
                height: imageData.height
            };
            resultAction.value = action;
            progress.value = 1;
            setStatus(
                `${label}完成 · ${formatDimensions(imageData.width, imageData.height)} · ${transformed.elapsed.toFixed(2)} 秒`,
                "ok"
            );
        } catch (error) {
            progress.value = 0;
            setStatus("操作未完成 · 请检查输入图片或参数", "error");
            notifyError(
                "操作失败",
                error instanceof Error ? error.message : "请检查输入图片或参数。"
            );
        } finally {
            busy.value = false;
            operation.value = null;
        }
    };

    const appendBatchItem = (message: PCWorkerBatchItemImpl) => {
        let thumbnail: ImageData;
        try {
            thumbnail = new ImageData(
                new Uint8ClampedArray(message.pixels),
                message.width,
                message.height
            );
        } catch (error) {
            notifyError(
                "结果预览失败",
                error instanceof Error ? error.message : "缩略图数据无效。"
            );
            return;
        }
        const item: PCBatchItemImpl = {
            direction: message.direction,
            iteration: message.iteration,
            thumbnail
        };
        const current = batchResults.value;
        batchResults.value = message.direction === "reverse"
            ? { reverse: [...current.reverse, item], forward: current.forward }
            : { reverse: current.reverse, forward: [...current.forward, item] };
    };

    const runBatch = async (
        actions: PCAction[],
        start: number,
        index: number
    ) => {
        if (!source.value || busy.value || iterationMode.value !== "batch") return;

        let params: PCBatchParamsImpl;
        try {
            params = buildBatchRequest(
                method.value,
                actions,
                start,
                batchCountText.value,
                offset.value,
                paramA.value,
                paramB.value,
                source.value.width,
                source.value.height
            );
        } catch (error) {
            notifyError(
                "参数有误",
                error instanceof Error ? error.message : "请检查等差迭代次数和算法参数。"
            );
            return;
        }

        const count = params.count;
        const end = params.start + count - 1;

        batchCount.value = count;
        batchStart.value = params.start;
        batchIndex.value = index;
        batchDirection.value = params.actions.length === 1
            ? directionFor(params.actions[0])
            : null;
        batchResults.value = { reverse: [], forward: [] };
        batchHasResults.value = false;
        batchAttempted.value = true;
        result.value = null;
        busy.value = true;
        operation.value = "batch";
        progress.value = 0;
        setStatus(`正在生成第 ${index} 批 · ${start}–${end} 次…`, "busy");

        try {
            const summary = await transformBatchInWorker(
                source.value,
                params,
                {
                    onProgress: (fraction, text) => {
                        progress.value = fraction;
                        setStatus(`${text} · ${Math.round(fraction * 100)}%`, "busy");
                    },
                    onItem: appendBatchItem
                }
            );
            const reverseCount = batchResults.value.reverse.length;
            const forwardCount = batchResults.value.forward.length;
            batchHasResults.value = reverseCount + forwardCount > 0;
            progress.value = 1;
            const countText = params.actions.length === 2
                ? `正反各 ${count} 张`
                : `${count} 张`;
            setStatus(
                `第 ${index} 批完成 · ${start}–${end} 次 · ${countText} · ${summary.elapsed.toFixed(2)} 秒`,
                "ok"
            );
        } catch (error) {
            batchHasResults.value = false;
            progress.value = 0;
            setStatus("批量处理未完成 · 请检查输入图片或参数", "error");
            notifyError(
                "批量处理失败",
                error instanceof Error ? error.message : "请检查输入图片或参数。"
            );
        } finally {
            busy.value = false;
            operation.value = null;
        }
    };

    const runNextBatch = () => {
        if (iterationMode.value !== "batch" || autoMixed.value || busy.value) return;
        if (!batchHasResults.value || !canNextBatch.value) return;
        const direction = batchDirection.value ?? "forward";
        void runBatch(
            [actionFor(direction)],
            nextBatchStart.value,
            batchIndex.value + 1
        );
    };

    const runAutoBatch = () => {
        if (!canRunAutoBatch.value) return;
        void runBatch(["restore", "scramble"], 1, 1);
    };

    const runAutoNextBatch = () => {
        if (!canRunAutoNextBatch.value) return;
        void runBatch(
            ["restore", "scramble"],
            nextBatchStart.value,
            batchIndex.value + 1
        );
    };

    // ------------------------------------------------------------ preview
    const openBatchPreview = async (item: PCBatchItemImpl) => {
        if (busy.value || !source.value) return;

        const token = ++previewToken;
        const image = source.value;
        preview.value = {
            direction: item.direction,
            iteration: item.iteration,
            batchText: batchRangeText.value,
            dimsText: formatDimensions(image.width, image.height),
            thumbnail: item.thumbnail,
            image: null,
            status: "loading",
            tone: "busy",
            message: "正在生成原尺寸预览…"
        };
        busy.value = true;
        operation.value = "preview";
        progress.value = 0;
        setStatus(`正在生成第 ${item.iteration} 次预览…`, "busy");

        try {
            const params = buildTransformRequest(
                method.value,
                actionFor(item.direction),
                String(item.iteration),
                offset.value,
                paramA.value,
                paramB.value,
                image.width,
                image.height
            );
            const transformed = await transformInWorker(
                image,
                params,
                (fraction, text) => {
                    progress.value = fraction * 0.9;
                    setStatus(`${text} · ${Math.round(fraction * 100)}%`, "busy");
                }
            );
            if (token !== previewToken || !preview.value) {
                setStatus("预览已关闭", "idle");
                return;
            }
            const imageData = transformed.imageData;
            preview.value = {
                ...preview.value,
                image: {
                    canvas: canvasFromImageData(imageData),
                    imageData,
                    width: imageData.width,
                    height: imageData.height
                },
                status: "ready",
                tone: "idle",
                message: `原图已就绪 · ${formatDimensions(imageData.width, imageData.height)}`
            };
            progress.value = 1;
            setStatus(
                `第 ${item.iteration} 次预览已生成 · ${transformed.elapsed.toFixed(2)} 秒`,
                "ok"
            );
        } catch (error) {
            const message = error instanceof Error ? error.message : "请检查参数。";
            if (token === previewToken && preview.value) {
                preview.value = {
                    ...preview.value,
                    status: "error",
                    tone: "error",
                    message
                };
            }
            progress.value = 0;
            setStatus("预览生成未完成 · 请检查参数", "error");
        } finally {
            busy.value = false;
            operation.value = null;
        }
    };

    const closePreview = () => {
        previewToken += 1;
        preview.value = null;
    };

    const usePreviewAsSource = () => {
        const current = preview.value;
        if (!current?.image || busy.value) return;
        const label = directionLabel(current.direction);
        const fileName = `第${current.iteration}次${label}结果`;
        setSource(
            current.image,
            `${fileName}.png`,
            `${formatDimensions(current.image.width, current.image.height)} · PNG`,
            fileName
        );
        setStatus(`已将第 ${current.iteration} 次${label}结果作为输入`, "ok");
    };

    const savePreviewImage = async () => {
        const current = preview.value;
        if (!current?.image || busy.value) return;
        const filename = `${source.value?.stem || "pixelconfusion"}_${current.direction}_${current.iteration}.png`;

        busy.value = true;
        operation.value = "save";
        busyLabel.value = "正在保存 PNG";
        preview.value = {
            ...current,
            tone: "busy",
            message: "正在保存 PNG…"
        };
        setStatus("正在保存 PNG…", "busy");
        try {
            await downloadCanvas(current.image.canvas, filename);
            progress.value = 1;
            if (preview.value) {
                preview.value = {
                    ...preview.value,
                    tone: "ok",
                    message: `已保存 · ${filename}`
                };
            }
            setStatus(`已保存 · ${filename}`, "ok");
        } catch (error) {
            if (preview.value) {
                preview.value = {
                    ...preview.value,
                    tone: "error",
                    message: "保存失败 · 请重试"
                };
            }
            setStatus("保存失败 · 请重试", "error");
            notifyError(
                "保存失败",
                error instanceof Error ? error.message : "请重试。"
            );
        } finally {
            busy.value = false;
            operation.value = null;
        }
    };

    // ------------------------------------------------------------ single output
    const useResultAsSource = () => {
        if (!result.value || busy.value) return;
        setSource(
            result.value,
            "上一轮处理结果.png",
            `${formatDimensions(result.value.width, result.value.height)} · PNG`,
            "上一轮处理结果"
        );
        setStatus("已将结果作为输入", "ok");
    };

    const saveResult = async () => {
        if (!result.value || busy.value) return;
        const suffix = resultAction.value === "restore" ? "reverse" : "forward";
        const filename = `${source.value?.stem || "pixelconfusion"}_${suffix}.png`;

        busy.value = true;
        operation.value = "save";
        busyLabel.value = "正在保存 PNG";
        setStatus("正在保存 PNG…", "busy");
        try {
            await downloadCanvas(result.value.canvas, filename);
            progress.value = 1;
            setStatus(`已保存 · ${filename}`, "ok");
        } catch (error) {
            setStatus("保存失败 · 请重试", "error");
            notifyError(
                "保存失败",
                error instanceof Error ? error.message : "请重试。"
            );
        } finally {
            busy.value = false;
            operation.value = null;
        }
    };

    return {
        method,
        source,
        result,
        resultAction,
        iterations,
        offset,
        paramA,
        paramB,
        iterationMode,
        autoMixed,
        batchCountText,
        batchCount,
        batchStart,
        batchIndex,
        batchDirection,
        batchResults,
        batchHasResults,
        batchAttempted,
        busy,
        operation,
        busyLabel,
        progress,
        statusText,
        statusTone,
        preview,
        stageMode,
        sourcePill,
        activeStep,
        methodDescription,
        methodHint,
        isTransforming,
        isBatchRunning,
        canTransform,
        canUseResult,
        canRunAutoBatch,
        canRunAutoNextBatch,
        sourceDims,
        resultDims,
        batchRangeText,
        canNextBatch,
        nextBatchMeta,
        batchCountInvalid,
        primaryPane,
        reversePane,
        forwardPane,
        openImagePicker,
        loadFile,
        useDemo,
        clearSource,
        changeMethod,
        setIterationMode,
        setAutoMixed,
        setBatchCountText,
        stepBatchCount,
        stepIterations,
        runDirection,
        runNextBatch,
        runAutoBatch,
        runAutoNextBatch,
        openBatchPreview,
        closePreview,
        usePreviewAsSource,
        savePreviewImage,
        useResultAsSource,
        saveResult
    };
});

if (import.meta.hot) {
    import.meta.hot.dispose(() => {
        worker?.terminate();
        worker = null;
        pendingRequest = null;
    });
}
