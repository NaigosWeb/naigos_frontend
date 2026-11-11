/**
 * Pure pixel-permutation algorithms, ported from the PixelConfusion desktop
 * project. No DOM access lives here so the same code can run in a worker.
 *
 * The Gilbert subdivision is adapted from Jakub Červený's gilbert2d (2018);
 * SPDX-License-Identifier: BSD-2-Clause.
 */

export type PCProgressCallback = (fraction: number, text: string) => void;

const GOLDEN_RATIO = (Math.sqrt(5) - 1) / 2;
const PAINT_CHUNK = 500_000;
const ARNOLD_ROW_CHUNK = 128;
const LOCAL_PATH_LIMIT = 4096;
const LOCAL_PATH_CACHE_LIMIT = 256;

type GilbertChild = [number, number, number, number, number, number];
type ArnoldMatrix = [bigint, bigint, bigint, bigint];

function children(
    x: number,
    y: number,
    ax: number,
    ay: number,
    bx: number,
    by: number
): GilbertChild[] {
    const w = Math.abs(ax + ay);
    const h = Math.abs(bx + by);
    const dax = (ax > 0 ? 1 : 0) - (ax < 0 ? 1 : 0);
    const day = (ay > 0 ? 1 : 0) - (ay < 0 ? 1 : 0);
    const dbx = (bx > 0 ? 1 : 0) - (bx < 0 ? 1 : 0);
    const dby = (by > 0 ? 1 : 0) - (by < 0 ? 1 : 0);
    // Python's // floors negative values, which matters for reversed vectors.
    let ax2 = Math.floor(ax / 2);
    let ay2 = Math.floor(ay / 2);
    let bx2 = Math.floor(bx / 2);
    let by2 = Math.floor(by / 2);

    if (2 * w > 3 * h) {
        if (Math.abs(ax2 + ay2) % 2 && w > 2) {
            ax2 += dax;
            ay2 += day;
        }
        return [
            [x, y, ax2, ay2, bx, by],
            [x + ax2, y + ay2, ax - ax2, ay - ay2, bx, by]
        ];
    }

    if (Math.abs(bx2 + by2) % 2 && h > 2) {
        bx2 += dbx;
        by2 += dby;
    }
    return [
        [x, y, bx2, by2, ax2, ay2],
        [x + bx2, y + by2, ax, ay, bx - bx2, by - by2],
        [
            x + ax - dax + bx2 - dbx,
            y + ay - day + by2 - dby,
            -bx2,
            -by2,
            -(ax - ax2),
            -(ay - ay2)
        ]
    ];
}

function* points(
    x: number,
    y: number,
    ax: number,
    ay: number,
    bx: number,
    by: number
): Generator<[number, number]> {
    const w = Math.abs(ax + ay);
    const h = Math.abs(bx + by);
    if (h === 1 || w === 1) {
        const [vx, vy] = h === 1 ? [ax, ay] : [bx, by];
        const dx = (vx > 0 ? 1 : 0) - (vx < 0 ? 1 : 0);
        const dy = (vy > 0 ? 1 : 0) - (vy < 0 ? 1 : 0);
        for (let i = 0; i < w * h; i++) {
            yield [x + i * dx, y + i * dy];
        }
        return;
    }
    for (const child of children(x, y, ax, ay, bx, by)) {
        yield* points(...child);
    }
}

/**
 * A permutation of row-major pixel indices for any positive dimensions.
 * Mirrors the desktop Gilbert curve fill order exactly.
 */
export function gilbertOrder(
    width: number,
    height: number,
    onProgress?: PCProgressCallback
): Uint32Array {
    if (width <= 0 || height <= 0) {
        throw new Error("图片宽高必须大于 0。");
    }
    const total = width * height;
    if (total > 0xffffffff) {
        throw new Error("图片像素数量超出浏览器可处理范围。");
    }

    const order = new Uint32Array(total);
    const cache = new Map<string, Uint32Array>();
    let cursor = 0;
    let reportedPercent = -1;

    const report = () => {
        if (!onProgress) return;
        const percent = Math.floor((cursor * 100) / total);
        if (percent > reportedPercent) {
            reportedPercent = percent;
            onProgress(cursor / total, "生成 Gilbert 曲线路径");
        }
    };

    const localPath = (ax: number, ay: number, bx: number, by: number) => {
        const key = `${ax},${ay},${bx},${by}`;
        const cached = cache.get(key);
        if (cached) return cached;
        const count = Math.abs(ax + ay) * Math.abs(bx + by);
        const path = new Uint32Array(count);
        let index = 0;
        for (const [x, y] of points(0, 0, ax, ay, bx, by)) {
            path[index++] = x + y * width;
        }
        if (cache.size >= LOCAL_PATH_CACHE_LIMIT) {
            const oldest = cache.keys().next();
            if (!oldest.done) cache.delete(oldest.value);
        }
        cache.set(key, path);
        return path;
    };

    const fill = (
        x: number,
        y: number,
        ax: number,
        ay: number,
        bx: number,
        by: number
    ) => {
        const w = Math.abs(ax + ay);
        const h = Math.abs(bx + by);
        const count = w * h;

        if (w === 1 || h === 1) {
            const [vx, vy] = h === 1 ? [ax, ay] : [bx, by];
            const dx = (vx > 0 ? 1 : 0) - (vx < 0 ? 1 : 0);
            const dy = (vy > 0 ? 1 : 0) - (vy < 0 ? 1 : 0);
            const base = x + y * width;
            const step = dx + dy * width;
            for (let i = 0; i < count; i++) {
                order[cursor + i] = base + i * step;
            }
            cursor += count;
        } else if (count <= LOCAL_PATH_LIMIT) {
            const path = localPath(ax, ay, bx, by);
            const base = x + y * width;
            for (let i = 0; i < count; i++) {
                order[cursor + i] = base + path[i];
            }
            cursor += count;
        } else {
            for (const child of children(x, y, ax, ay, bx, by)) {
                fill(...child);
            }
        }
        report();
    };

    if (width >= height) {
        fill(0, 0, width, 0, 0, height);
    } else {
        fill(0, 0, 0, height, width, 0);
    }

    if (cursor !== total) {
        throw new Error("曲线路径长度异常。");
    }
    if (onProgress) {
        onProgress(1, "生成 Gilbert 曲线路径");
    }
    return order;
}

/** JavaScript Math.round(phi * total), without Python's ties-to-even. */
export function defaultOffset(total: number): number {
    return Math.floor(GOLDEN_RATIO * total + 0.5);
}

export function resolveGilbertShift(
    signedIterations: number,
    offset: bigint | null,
    total: number
): number {
    const offsetValue = offset ?? BigInt(defaultOffset(total));
    const modulus = BigInt(total);
    let shift = (BigInt(signedIterations) * offsetValue) % modulus;
    if (shift < 0n) shift += modulus;
    return Number(shift);
}

/** out[curve[i]] = in[curve[(i + shift) % total]]. */
export function gilbertTransform(
    pixels: Uint8ClampedArray,
    order: Uint32Array,
    shift: number,
    total: number,
    onProgress?: PCProgressCallback
): Uint8ClampedArray {
    if (pixels.length !== total * 4) {
        throw new Error("像素数据与图片尺寸不一致。");
    }
    if (order.length !== total) {
        throw new Error("曲线尺寸与图片不一致。");
    }
    if (total === 0) {
        return new Uint8ClampedArray(0);
    }

    const normalizedShift = ((shift % total) + total) % total;
    if (normalizedShift === 0) {
        return new Uint8ClampedArray(pixels);
    }

    const output = new Uint8ClampedArray(total * 4);
    for (let start = 0; start < total; start += PAINT_CHUNK) {
        const end = Math.min(start + PAINT_CHUNK, total);
        for (let i = start; i < end; i++) {
            let sourceIndex = i + normalizedShift;
            if (sourceIndex >= total) sourceIndex -= total;
            const destination = order[i] * 4;
            const source = order[sourceIndex] * 4;
            output[destination] = pixels[source];
            output[destination + 1] = pixels[source + 1];
            output[destination + 2] = pixels[source + 2];
            output[destination + 3] = pixels[source + 3];
        }
        if (onProgress) onProgress(end / total, "重排像素");
    }
    return output;
}

function normalizeBigInt(value: bigint, modulus: bigint): bigint {
    const result = value % modulus;
    return result < 0n ? result + modulus : result;
}

function multiplyMatrix(
    left: ArnoldMatrix,
    right: ArnoldMatrix,
    modulus: bigint
): ArnoldMatrix {
    const [a, b, c, d] = left;
    const [e, f, g, h] = right;
    return [
        (a * e + b * g) % modulus,
        (a * f + b * h) % modulus,
        (c * e + d * g) % modulus,
        (c * f + d * h) % modulus
    ];
}

/**
 * Power of [[1, a], [b, ab + 1]] modulo size; negative powers are the inverse.
 * BigInt keeps large or negative a/b behaving like the Python implementation.
 */
export function arnoldMatrix(
    size: number,
    iterations: number,
    a: bigint = 1n,
    b: bigint = 1n
): ArnoldMatrix {
    if (size <= 0) {
        throw new Error("图片边长必须大于 0。");
    }
    const modulus = BigInt(size);
    let matrix: ArnoldMatrix = iterations < 0
        ? [a * b + 1n, -a, -b, 1n]
        : [1n, a, b, a * b + 1n];
    matrix = matrix.map(value => normalizeBigInt(value, modulus)) as ArnoldMatrix;

    let result: ArnoldMatrix = [
        1n % modulus,
        0n,
        0n,
        1n % modulus
    ];
    let exponent = Math.abs(iterations);
    while (exponent) {
        if (exponent & 1) {
            result = multiplyMatrix(result, matrix, modulus);
        }
        matrix = multiplyMatrix(matrix, matrix, modulus);
        exponent >>= 1;
    }
    return result;
}

/** Positive iterations restore the forward Arnold coordinate permutation. */
export function arnoldTransform(
    pixels: Uint8ClampedArray,
    width: number,
    height: number,
    iterations: number,
    a: bigint = 1n,
    b: bigint = 1n,
    onProgress?: PCProgressCallback
): Uint8ClampedArray {
    if (width <= 0 || height <= 0) {
        throw new Error("图片宽高必须大于 0。");
    }
    if (width !== height) {
        throw new Error("标准 Arnold 猫映射需要正方形图片，请选择 Gilbert 或更换图片。");
    }
    if (pixels.length !== width * height * 4) {
        throw new Error("像素数据与图片尺寸不一致。");
    }

    const [aa, bb, cc, dd] = arnoldMatrix(width, iterations, a, b);
    const m00 = Number(aa);
    const m01 = Number(bb);
    const m10 = Number(cc);
    const m11 = Number(dd);
    const output = new Uint8ClampedArray(width * height * 4);

    for (let start = 0; start < height; start += ARNOLD_ROW_CHUNK) {
        const end = Math.min(start + ARNOLD_ROW_CHUNK, height);
        for (let y = start; y < end; y++) {
            const baseX = (m01 * y) % width;
            const baseY = (m11 * y) % height;
            for (let x = 0; x < width; x++) {
                const sourceX = (m00 * x + baseX) % width;
                const sourceY = (m10 * x + baseY) % height;
                const destination = (y * width + x) * 4;
                const source = (sourceY * width + sourceX) * 4;
                output[destination] = pixels[source];
                output[destination + 1] = pixels[source + 1];
                output[destination + 2] = pixels[source + 2];
                output[destination + 3] = pixels[source + 3];
            }
        }
        if (onProgress) onProgress(end / height, "重排 Arnold 像素");
    }
    return output;
}
