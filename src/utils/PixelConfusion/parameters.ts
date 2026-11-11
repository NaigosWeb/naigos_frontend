import type { PCAction, PCMethod, PCTransformParamsImpl } from "@/interfaces/PixelConfusionImpl";

export const MAX_ITERATIONS = 1_000_000;
const MAX_ITERATIONS_BIGINT = BigInt(MAX_ITERATIONS);

function parseInteger(value: string, label: string): bigint {
    const text = value.trim();
    if (!/^[+-]?\d+$/.test(text)) {
        throw new Error(`${label}必须为整数。`);
    }
    return BigInt(text);
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

    const offsetTrimmed = offsetText.trim();
    const offset = method === "gilbert" && offsetTrimmed
        ? parseInteger(offsetTrimmed, "偏移量")
        : null;
    const a = method === "arnold" ? parseInteger(aText, "参数 a") : 1n;
    const b = method === "arnold" ? parseInteger(bText, "参数 b") : 1n;

    if (method === "arnold" && width !== height) {
        throw new Error("标准 Arnold 猫映射需要正方形图片。长方形图片可以选择 Gilbert。");
    }

    return {
        method,
        action,
        iterations: Number(iterationsValue),
        offset,
        a,
        b
    };
}
