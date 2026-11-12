import type {
    PCAction,
    PCBatchParamsImpl,
    PCMethod,
    PCTransformParamsImpl
} from "@/interfaces/PixelConfusionImpl";

export const MAX_ITERATIONS = 1_000_000;
export const DEFAULT_BATCH_COUNT = 10;
export const MAX_BATCH_COUNT = 50;

const MAX_ITERATIONS_BIGINT = BigInt(MAX_ITERATIONS);

function parseInteger(value: string, label: string): bigint {
    const text = value.trim();
    if (!/^[+-]?\d+$/.test(text)) {
        throw new Error(`${label}必须为整数。`);
    }
    return BigInt(text);
}

function parseCommon(
    method: PCMethod,
    offsetText: string,
    aText: string,
    bText: string,
    width: number,
    height: number
): { offset: bigint | null; a: bigint; b: bigint } {
    if (method !== "gilbert" && method !== "arnold") {
        throw new Error("未知算法。");
    }

    const offsetTrimmed = offsetText.trim();
    const offset = method === "gilbert" && offsetTrimmed
        ? parseInteger(offsetTrimmed, "偏移量")
        : null;
    const a = method === "arnold" ? parseInteger(aText, "参数 a") : 1n;
    const b = method === "arnold" ? parseInteger(bText, "参数 b") : 1n;

    if (method === "arnold" && width !== height) {
        throw new Error("标准 Arnold 猫映射需要正方形图片。长方形图片可以选择 Gilbert。");
    }

    return { offset, a, b };
}

export function buildTransformRequest(
    method: PCMethod,
    action: PCAction,
    iterationsText: string,
    offsetText: string,
    aText: string,
    bText: string,
    width: number,
    height: number
): PCTransformParamsImpl {
    if (method !== "gilbert" && method !== "arnold") {
        throw new Error("未知算法。");
    }
    if (action !== "scramble" && action !== "restore") {
        throw new Error("未知操作。");
    }
    if (width <= 0 || height <= 0) {
        throw new Error("图片宽高必须大于 0。");
    }

    const iterationsValue = parseInteger(iterationsText, "迭代次数");
    if (iterationsValue < 1n || iterationsValue > MAX_ITERATIONS_BIGINT) {
        throw new Error("次数需在 1 到 1000000 之间。");
    }

    const { offset, a, b } = parseCommon(
        method,
        offsetText,
        aText,
        bText,
        width,
        height
    );

    return {
        method,
        action,
        iterations: Number(iterationsValue),
        offset,
        a,
        b
    };
}

/**
 * Validate one batch range and return the shared algorithm parameters.
 * Mirrors the desktop `build_batch_request` checks and messages.
 */
export function buildBatchRequest(
    method: PCMethod,
    actions: PCAction[],
    start: number,
    countText: string,
    offsetText: string,
    aText: string,
    bText: string,
    width: number,
    height: number
): PCBatchParamsImpl {
    if (method !== "gilbert" && method !== "arnold") {
        throw new Error("未知算法。");
    }
    if (width <= 0 || height <= 0) {
        throw new Error("图片宽高必须大于 0。");
    }

    const countValue = parseInteger(countText, "等差迭代次数");
    if (countValue < 1n || countValue > BigInt(MAX_BATCH_COUNT)) {
        throw new Error("等差迭代次数需在 1 到 50 之间。");
    }
    const count = Number(countValue);

    if (!Number.isInteger(start) || start < 1 || start + count - 1 > MAX_ITERATIONS) {
        throw new Error("本批迭代范围需在 1 到 1000000 之间。");
    }
    if (!actions.length || actions.some(action => action !== "restore" && action !== "scramble")) {
        throw new Error("未知的批量处理方向。");
    }

    const { offset, a, b } = parseCommon(
        method,
        offsetText,
        aText,
        bText,
        width,
        height
    );

    return {
        method,
        actions: [...actions],
        start,
        count,
        offset,
        a,
        b
    };
}
