import { computed, ref, shallowRef } from "vue";
import { defineStore } from "pinia";
import { ElMessage } from "element-plus";
import type {
    PCAction,
    PCImageImpl,
    PCMethod,
    PCPillStateImpl,
    PCSourceImpl,
    PCStatusTone,
    PCTransformParamsImpl,
    PCWorkerRequestImpl,
    PCWorkerResponseImpl
} from "@/interfaces/PixelConfusionImpl";
import { buildTransformRequest, MAX_ITERATIONS } from "@/utils/PixelConfusion/parameters";
import {
    canvasFromImageData,
    clonePCImage,
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

type PCOperation = "source" | "transform" | "save" | null;

interface PendingWorkerRequest {
    id: number;
    width: number;
    height: number;
    onProgress: (fraction: number, text: string) => void;
    resolve: (result: { imageData: ImageData; elapsed: number }) => void;
    reject: (error: Error) => void;
}

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

        pendingRequest = null;
        if (message.kind === "error") {
            pending.reject(new Error(message.message));
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
            id,
            width,
            height,
            onProgress,
            resolve,
            reject
        };
        const request: PCWorkerRequestImpl = {
            id,
            method: params.method,
            action: params.action,
            iterations: params.iterations,
            offset: params.offset,
            a: params.a,
            b: params.b,
            width,
            height,
            pixels: pixels.buffer
        };
        try {
            instance.postMessage(request, [pixels.buffer]);
        } catch (error) {
            pendingRequest = null;
            reject(error instanceof Error ? error : new Error("无法启动图片处理。"));
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

export const usePCToolStore = defineStore("PCTool", () => {
    const method = ref<PCMethod>("gilbert");
    const source = shallowRef<PCSourceImpl | null>(null);
    const result = shallowRef<PCImageImpl | null>(null);
    const resultAction = ref<PCAction>("scramble");

    const iterations = ref("1");
    const offset = ref("");
    const paramA = ref("1");
    const paramB = ref("1");

    const busy = ref(false);
    const operation = ref<PCOperation>(null);
    const busyLabel = ref("正在处理");
    const progress = ref(0);
    const statusText = ref("就绪 · 选择图片或使用内置测试图");
    const statusTone = ref<PCStatusTone>("idle");

    const setStatus = (text: string, tone: PCStatusTone = "idle") => {
        statusText.value = text;
        statusTone.value = tone;
    };

    const sourcePill = computed<PCPillStateImpl>(() => {
        if (operation.value === "source") return { text: "读取中", tone: "busy" };
        if (operation.value === "transform") return { text: "处理中", tone: "busy" };
        if (source.value) return { text: "已载入", tone: "loaded" };
        return { text: "未选择", tone: "idle" };
    });

    const activeStep = computed(() => {
        if (busy.value) return source.value ? 3 : 1;
        if (result.value) return 4;
        if (source.value) return 2;
        return 1;
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

    const methodHint = computed(() => method.value === "gilbert"
        ? "复原时请保持次数与偏移量一致；留空自动使用默认黄金比例偏移。"
        : "复原时请保持次数、a、b 一致；坐标变换仅在正方形图片上成立。");

    const isTransforming = computed(() => operation.value === "transform");
    const canTransform = computed(() => !!source.value && !busy.value);
    const canUseResult = computed(() => !!result.value && !busy.value);

    const sourceDims = computed(() => source.value
        ? formatDimensions(source.value.width, source.value.height)
        : "— × —");
    const resultDims = computed(() => isTransforming.value
        ? "处理中…"
        : result.value
            ? formatDimensions(result.value.width, result.value.height)
            : "— × —");

    const clearResult = () => {
        result.value = null;
        resultAction.value = "scramble";
    };

    const setSource = (
        image: PCImageImpl,
        name: string,
        meta: string,
        stem: string
    ) => {
        source.value = { ...image, name, meta, stem };
        clearResult();
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
            progress.value = 0;
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
        progress.value = 0;
        setStatus("已载入图片 · 选择算法后开始处理", "ok");
    };

    const clearSource = () => {
        if (busy.value) return;
        source.value = null;
        clearResult();
        progress.value = 0;
        setStatus("就绪 · 选择图片或使用内置测试图", "idle");
    };

    const changeMethod = (value: PCMethod) => {
        if (busy.value || method.value === value) return;
        method.value = value;
    };

    const stepIterations = (delta: number) => {
        if (busy.value) return;
        const current = Number.parseInt(iterations.value, 10);
        const base = Number.isFinite(current) ? current : 1;
        const next = Math.min(MAX_ITERATIONS, Math.max(1, base + delta));
        iterations.value = String(next);
    };

    const runTransform = async (action: PCAction) => {
        if (!source.value || busy.value) return;

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

        const label = action === "restore" ? "复原" : "混淆";
        busy.value = true;
        operation.value = "transform";
        busyLabel.value = `正在${label}`;
        progress.value = 0;
        setStatus(`正在${label}图片…`, "busy");

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

    const useResultAsSource = () => {
        if (!result.value || busy.value) return;
        const cloned = clonePCImage(result.value);
        setSource(
            cloned,
            "上一轮处理结果.png",
            `${formatDimensions(cloned.width, cloned.height)} · PNG`,
            "上一轮处理结果"
        );
        progress.value = 0;
        setStatus("已将结果作为输入", "ok");
    };

    const saveResult = async () => {
        if (!result.value || busy.value) return;
        const suffix = resultAction.value === "restore" ? "restored" : "scrambled";
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
        busy,
        operation,
        busyLabel,
        progress,
        statusText,
        statusTone,
        sourcePill,
        activeStep,
        methodDescription,
        methodHint,
        isTransforming,
        canTransform,
        canUseResult,
        sourceDims,
        resultDims,
        openImagePicker,
        loadFile,
        useDemo,
        clearSource,
        changeMethod,
        stepIterations,
        runTransform,
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
