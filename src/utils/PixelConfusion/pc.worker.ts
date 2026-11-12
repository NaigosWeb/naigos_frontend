/// <reference lib="webworker" />

import type {
    PCDirection,
    PCWorkerBatchItemImpl,
    PCWorkerBatchRequestImpl,
    PCWorkerRequestImpl,
    PCWorkerResponseImpl,
    PCWorkerTransformRequestImpl
} from "@/interfaces/PixelConfusionImpl";
import {
    arnoldTransform,
    gilbertOrder,
    gilbertTransform,
    resolveGilbertShift
} from "./algorithm";
import { makeThumbnail } from "./thumbnail";

const workerScope = self as unknown as DedicatedWorkerGlobalScope;

interface OrderCache {
    width: number;
    height: number;
    order: Uint32Array;
}

/** Only the newest Gilbert path is retained, which bounds worker memory. */
let orderCache: OrderCache | null = null;

function send(message: PCWorkerResponseImpl, transfer?: Transferable[]): void {
    if (transfer) {
        workerScope.postMessage(message, transfer);
    } else {
        workerScope.postMessage(message);
    }
}

function gilbertPath(
    width: number,
    height: number,
    onProgress?: (fraction: number, text: string) => void
): Uint32Array {
    if (orderCache && orderCache.width === width && orderCache.height === height) {
        return orderCache.order;
    }
    const order = gilbertOrder(width, height, onProgress);
    orderCache = { width, height, order };
    return order;
}

function directionFor(action: "restore" | "scramble"): PCDirection {
    return action === "restore" ? "reverse" : "forward";
}

function labelFor(action: "restore" | "scramble"): string {
    return action === "restore" ? "反向混淆" : "正向混淆";
}

function sendBatchItem(
    requestId: number,
    direction: PCDirection,
    iteration: number,
    thumbnail: ReturnType<typeof makeThumbnail>
): void {
    const pixels = thumbnail.pixels;
    const message: PCWorkerBatchItemImpl = {
        id: requestId,
        kind: "batch_item",
        direction,
        iteration,
        width: thumbnail.width,
        height: thumbnail.height,
        pixels: pixels.buffer as ArrayBuffer
    };
    send(message, [pixels.buffer]);
}

function runTransform(
    request: PCWorkerTransformRequestImpl,
    reportProgress: (fraction: number, text: string) => void,
    started: number
): void {
    const pixels = new Uint8ClampedArray(request.pixels);
    const total = request.width * request.height;
    if (pixels.length !== total * 4) {
        throw new Error("像素数据与图片尺寸不一致。");
    }

    const signedIterations = request.action === "restore"
        ? request.iterations
        : -request.iterations;

    let result: Uint8ClampedArray;
    if (request.method === "gilbert") {
        const order = gilbertPath(
            request.width,
            request.height,
            (fraction, text) => reportProgress(fraction * 0.35, text)
        );
        const shift = resolveGilbertShift(signedIterations, request.offset, total);
        result = gilbertTransform(
            pixels,
            order,
            shift,
            total,
            (fraction, text) => reportProgress(0.35 + fraction * 0.65, text)
        );
    } else {
        result = arnoldTransform(
            pixels,
            request.width,
            request.height,
            signedIterations,
            request.a,
            request.b,
            reportProgress
        );
    }

    reportProgress(1, request.method === "gilbert" ? "重排像素" : "重排 Arnold 像素");
    send(
        {
            id: request.id,
            kind: "done",
            pixels: result.buffer,
            elapsed: (performance.now() - started) / 1000
        },
        [result.buffer]
    );
}

function runBatch(
    request: PCWorkerBatchRequestImpl,
    reportProgress: (fraction: number, text: string) => void,
    started: number
): void {
    const pixels = new Uint8ClampedArray(request.pixels);
    const total = request.width * request.height;
    if (pixels.length !== total * 4) {
        throw new Error("像素数据与图片尺寸不一致。");
    }

    // The curve is built once per size; folding its progress into the first
    // item would make the overall batch bar jump backwards on later batches.
    const order = request.method === "gilbert"
        ? gilbertPath(request.width, request.height)
        : null;
    const totalItems = request.actions.length * request.count;
    let completed = 0;

    for (let index = 0; index < request.count; index++) {
        const iteration = request.start + index;
        for (const action of request.actions) {
            const direction = directionFor(action);
            const label = labelFor(action);
            const base = completed;
            const reportItem = (fraction: number) => {
                const clamped = Math.max(0, Math.min(1, fraction));
                reportProgress(
                    (base + clamped * 0.8) / totalItems,
                    `${label} · 第 ${iteration} 次`
                );
            };
            const signedIterations = action === "restore" ? iteration : -iteration;

            let result: Uint8ClampedArray;
            if (request.method === "gilbert" && order) {
                const shift = resolveGilbertShift(
                    signedIterations,
                    request.offset,
                    total
                );
                result = gilbertTransform(pixels, order, shift, total, reportItem);
            } else {
                result = arnoldTransform(
                    pixels,
                    request.width,
                    request.height,
                    signedIterations,
                    request.a,
                    request.b,
                    reportItem
                );
            }

            const thumbnail = makeThumbnail(
                result,
                request.width,
                request.height,
                request.thumbnailSize
            );
            sendBatchItem(request.id, direction, iteration, thumbnail);

            completed++;
            reportProgress(
                completed / totalItems,
                `${label} · 第 ${iteration} 次`
            );
        }
    }

    send({
        id: request.id,
        kind: "batch_done",
        elapsed: (performance.now() - started) / 1000,
        generated: completed
    });
}

workerScope.onmessage = (event: MessageEvent<PCWorkerRequestImpl>) => {
    const request = event.data;
    const started = performance.now();
    let lastProgress = -1;

    const reportProgress = (fraction: number, text: string) => {
        const clamped = Math.max(0, Math.min(1, fraction));
        if (clamped < 1 && clamped - lastProgress < 0.005) return;
        lastProgress = clamped;
        send({
            id: request.id,
            kind: "progress",
            fraction: clamped,
            text
        });
    };

    try {
        if (request.kind === "batch") {
            runBatch(request, reportProgress, started);
        } else {
            runTransform(request, reportProgress, started);
        }
    } catch (error) {
        send({
            id: request.id,
            kind: "error",
            message: error instanceof Error ? error.message : "图片处理失败。"
        });
    }
};

export {};
