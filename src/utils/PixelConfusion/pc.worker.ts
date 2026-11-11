/// <reference lib="webworker" />

import type {
    PCWorkerRequestImpl,
    PCWorkerResponseImpl
} from "@/interfaces/PixelConfusionImpl";
import {
    arnoldTransform,
    gilbertOrder,
    gilbertTransform,
    resolveGilbertShift
} from "./algorithm";

const workerScope = self as unknown as DedicatedWorkerGlobalScope;

function send(message: PCWorkerResponseImpl, transfer?: Transferable[]): void {
    if (transfer) {
        workerScope.postMessage(message, transfer);
    } else {
        workerScope.postMessage(message);
    }
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
            const order = gilbertOrder(
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
    } catch (error) {
        send({
            id: request.id,
            kind: "error",
            message: error instanceof Error ? error.message : "图片处理失败。"
        });
    }
};

export {};
