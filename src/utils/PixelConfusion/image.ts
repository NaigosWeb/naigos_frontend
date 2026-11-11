import type { PCImageImpl } from "@/interfaces/PixelConfusionImpl";

export const PC_FILE_ACCEPT =
    ".png,.jpg,.jpeg,.webp,.bmp,image/png,image/jpeg,image/webp,image/bmp";

export const PC_FORMAT_LABEL = "PNG / JPG / WEBP / BMP · 单帧";

const SUPPORTED_EXTENSION = /\.(png|jpe?g|webp|bmp)$/i;
const SUPPORTED_MIME = new Set([
    "image/png",
    "image/jpeg",
    "image/webp",
    "image/bmp",
    "image/x-bmp"
]);

export function isSupportedImageFile(file: File): boolean {
    if (file.type) {
        if (SUPPORTED_MIME.has(file.type.toLowerCase())) return true;
        return SUPPORTED_EXTENSION.test(file.name);
    }
    return SUPPORTED_EXTENSION.test(file.name);
}

function createCanvas(width: number, height: number): HTMLCanvasElement {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas;
}

function context2d(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) {
        throw new Error("浏览器不支持 Canvas 2D。");
    }
    return context;
}

async function decodeWithImageElement(file: File): Promise<{
    source: HTMLImageElement;
    cleanup: () => void;
}> {
    const url = URL.createObjectURL(file);
    try {
        const image = new Image();
        image.decoding = "async";
        image.src = url;
        await image.decode();
        return {
            source: image,
            cleanup: () => URL.revokeObjectURL(url)
        };
    } catch (error) {
        URL.revokeObjectURL(url);
        throw error;
    }
}

async function decodeBitmap(file: File): Promise<{
    source: ImageBitmap | HTMLImageElement;
    cleanup: () => void;
}> {
    if (typeof createImageBitmap === "function") {
        try {
            const bitmap = await createImageBitmap(file);
            return {
                source: bitmap,
                cleanup: () => bitmap.close()
            };
        } catch {
            // Some browsers cannot decode every accepted format through
            // createImageBitmap; the image element path is a useful fallback.
        }
    }
    return await decodeWithImageElement(file);
}

export async function decodeImageFile(file: File): Promise<PCImageImpl> {
    const decoded = await decodeBitmap(file);
    try {
        const width = decoded.source.width;
        const height = decoded.source.height;
        if (!width || !height) {
            throw new Error("图片尺寸无效。");
        }
        const canvas = createCanvas(width, height);
        const context = context2d(canvas);
        context.drawImage(decoded.source, 0, 0);
        const imageData = context.getImageData(0, 0, width, height);
        return { canvas, imageData, width, height };
    } finally {
        decoded.cleanup();
    }
}

export function canvasFromImageData(imageData: ImageData): HTMLCanvasElement {
    const canvas = createCanvas(imageData.width, imageData.height);
    context2d(canvas).putImageData(imageData, 0, 0);
    return canvas;
}

export function clonePCImage(image: PCImageImpl): PCImageImpl {
    const pixels = new Uint8ClampedArray(image.imageData.data);
    const imageData = new ImageData(pixels, image.width, image.height);
    return {
        canvas: canvasFromImageData(imageData),
        imageData,
        width: image.width,
        height: image.height
    };
}

export function formatDimensions(width: number, height: number): string {
    return `${width} × ${height}`;
}

export function formatBytes(size: number): string {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
    return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

export function fileExtensionLabel(name: string): string {
    const match = /\.([^.]+)$/.exec(name);
    return match ? match[1].toUpperCase() : "IMG";
}

export function fileStem(name: string): string {
    const trimmed = name.replace(/\.[^.]+$/, "");
    return trimmed || "catmap-demo";
}

function roundedRect(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
): void {
    const r = Math.min(radius, width / 2, height / 2);
    context.beginPath();
    context.moveTo(x + r, y);
    context.lineTo(x + width - r, y);
    context.quadraticCurveTo(x + width, y, x + width, y + r);
    context.lineTo(x + width, y + height - r);
    context.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
    context.lineTo(x + r, y + height);
    context.quadraticCurveTo(x, y + height, x, y + height - r);
    context.lineTo(x, y + r);
    context.quadraticCurveTo(x, y, x + r, y);
    context.closePath();
}

/** A self-contained geometric test image, matching the desktop demo's layout. */
export function makeDemoImage(): PCImageImpl {
    const size = 640;
    const canvas = createCanvas(size, size);
    const context = context2d(canvas);

    const background = context.createLinearGradient(0, 0, 0, size);
    background.addColorStop(0, "#eef4fa");
    background.addColorStop(1, "#e7eff9");
    context.fillStyle = background;
    context.fillRect(0, 0, size, size);

    context.fillStyle = "#dfeaf4";
    roundedRect(context, 48, 54, 548, 548, 34);
    context.fill();

    context.fillStyle = "#ffffff";
    roundedRect(context, 42, 42, 546, 546, 34);
    context.fill();

    context.fillStyle = "#f1ad48";
    context.beginPath();
    context.ellipse(200, 198, 100, 100, 0, 0, Math.PI * 2);
    context.fill();

    context.strokeStyle = "#ffffff";
    context.lineWidth = 3;
    context.beginPath();
    context.ellipse(200, 198, 86, 86, 0, 0, Math.PI * 2);
    context.stroke();

    context.fillStyle = "#3e7cd3";
    roundedRect(context, 346, 116, 194, 154, 18);
    context.fill();

    context.fillStyle = "#44aa8b";
    context.beginPath();
    context.moveTo(112, 496);
    context.lineTo(236, 320);
    context.lineTo(360, 496);
    context.closePath();
    context.fill();

    context.fillStyle = "#9568bf";
    for (let x = 390; x < 540; x += 24) {
        roundedRect(context, x, 360, 13, 146, 6);
        context.fill();
    }

    context.fillStyle = "#263750";
    context.font = '16px "Segoe UI", "Microsoft YaHei", sans-serif';
    context.textBaseline = "alphabetic";
    context.fillText("PIXELCONFUSION  /  LOCAL TEST IMAGE", 100, 558);

    context.fillStyle = "#ee2a7b";
    context.beginPath();
    context.ellipse(556, 556, 6, 6, 0, 0, Math.PI * 2);
    context.fill();

    return {
        canvas,
        imageData: context.getImageData(0, 0, size, size),
        width: size,
        height: size
    };
}

export function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
    return new Promise((resolve, reject) => {
        canvas.toBlob(blob => {
            if (blob) resolve(blob);
            else reject(new Error("PNG 编码失败。"));
        }, "image/png");
    });
}

export async function downloadCanvas(
    canvas: HTMLCanvasElement,
    filename: string
): Promise<void> {
    const blob = await canvasToBlob(canvas);
    const url = URL.createObjectURL(blob);
    try {
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = filename;
        anchor.rel = "noopener";
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
    } finally {
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
}
