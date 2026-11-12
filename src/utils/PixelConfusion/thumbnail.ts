/**
 * Worker-side thumbnail generation.
 *
 * Batch results keep only thumbnails in memory (the full image is recomputed
 * when a tile is opened), so this helper runs inside the worker and returns a
 * small, self-contained pixel buffer. Each target pixel averages its whole
 * source cell, which matches the desktop's resampling pass closely and keeps
 * large images clean instead of aliased.
 */

export interface PCThumbnailImpl {
    pixels: Uint8ClampedArray
    width: number
    height: number
}

function cellBounds(
    target: number,
    targets: number,
    source: number
): [start: number, end: number] {
    const start = Math.floor((target * source) / targets);
    const end = Math.max(start + 1, Math.floor(((target + 1) * source) / targets));
    return [start, Math.min(end, source)];
}

/**
 * Area-averaged downscale of an RGBA buffer. Images already within `maxSize`
 * are copied unchanged so the transform stays lossless for small inputs.
 */
export function makeThumbnail(
    pixels: Uint8ClampedArray,
    width: number,
    height: number,
    maxSize: number
): PCThumbnailImpl {
    if (width <= 0 || height <= 0) {
        throw new Error("图片宽高必须大于 0。");
    }
    if (pixels.length !== width * height * 4) {
        throw new Error("像素数据与图片尺寸不一致。");
    }

    const limit = Math.max(1, Math.floor(maxSize));
    const scale = Math.min(1, limit / Math.max(width, height));
    if (scale >= 1) {
        return {
            pixels: new Uint8ClampedArray(pixels),
            width,
            height
        };
    }

    const targetWidth = Math.max(1, Math.round(width * scale));
    const targetHeight = Math.max(1, Math.round(height * scale));
    const output = new Uint8ClampedArray(targetWidth * targetHeight * 4);

    for (let y = 0; y < targetHeight; y++) {
        const [sourceY, sourceYEnd] = cellBounds(y, targetHeight, height);
        for (let x = 0; x < targetWidth; x++) {
            const [sourceX, sourceXEnd] = cellBounds(x, targetWidth, width);
            let red = 0;
            let green = 0;
            let blue = 0;
            let alpha = 0;

            for (let pixelY = sourceY; pixelY < sourceYEnd; pixelY++) {
                let offset = (pixelY * width + sourceX) * 4;
                for (let pixelX = sourceX; pixelX < sourceXEnd; pixelX++) {
                    red += pixels[offset];
                    green += pixels[offset + 1];
                    blue += pixels[offset + 2];
                    alpha += pixels[offset + 3];
                    offset += 4;
                }
            }

            const samples = (sourceXEnd - sourceX) * (sourceYEnd - sourceY);
            const target = (y * targetWidth + x) * 4;
            output[target] = Math.round(red / samples);
            output[target + 1] = Math.round(green / samples);
            output[target + 2] = Math.round(blue / samples);
            output[target + 3] = Math.round(alpha / samples);
        }
    }

    return {
        pixels: output,
        width: targetWidth,
        height: targetHeight
    };
}
