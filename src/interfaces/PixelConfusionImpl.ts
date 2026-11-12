export type PCMethod = 'gilbert' | 'arnold'
export type PCAction = 'scramble' | 'restore'
/** Presentation direction: restore is "reverse", scramble is "forward". */
export type PCDirection = 'reverse' | 'forward'
export type PCIterationMode = 'single' | 'batch'
/** Stage layout: one result, one batch grid, or both direction grids. */
export type PCStageMode = 'single' | 'batch' | 'auto'
export type PCStatusTone = 'idle' | 'ok' | 'busy' | 'error'
export type PCPillTone = 'idle' | 'loaded' | 'busy'
export type PCPreviewStatus = 'loading' | 'ready' | 'error'

export interface PCImageImpl {
    canvas: HTMLCanvasElement
    imageData: ImageData
    width: number
    height: number
}

export interface PCSourceImpl extends PCImageImpl {
    name: string
    meta: string
    stem: string
}

export interface PCTransformParamsImpl {
    method: PCMethod
    action: PCAction
    iterations: number
    offset: bigint | null
    a: bigint
    b: bigint
}

export interface PCBatchParamsImpl {
    method: PCMethod
    actions: PCAction[]
    start: number
    count: number
    offset: bigint | null
    a: bigint
    b: bigint
}

export interface PCBatchResultsImpl {
    reverse: PCBatchItemImpl[]
    forward: PCBatchItemImpl[]
}

/** One generated iteration thumbnail; the full image is recomputed on demand. */
export interface PCBatchItemImpl {
    direction: PCDirection
    iteration: number
    thumbnail: ImageData
}

export interface PCResultPaneImpl {
    title: string
    direction: PCDirection | null
    meta: string
    items: PCBatchItemImpl[]
    placeholderTitle: string
    placeholderSubtitle: string
}

export interface PCPreviewImpl {
    direction: PCDirection
    iteration: number
    batchText: string
    dimsText: string
    thumbnail: ImageData
    image: PCImageImpl | null
    status: PCPreviewStatus
    tone: PCStatusTone
    message: string
}

export interface PCWorkerTransformRequestImpl extends PCTransformParamsImpl {
    id: number
    kind: 'transform'
    width: number
    height: number
    pixels: ArrayBuffer
}

export interface PCWorkerBatchRequestImpl {
    id: number
    kind: 'batch'
    method: PCMethod
    actions: PCAction[]
    start: number
    count: number
    offset: bigint | null
    a: bigint
    b: bigint
    width: number
    height: number
    pixels: ArrayBuffer
    thumbnailSize: number
}

export type PCWorkerRequestImpl =
    | PCWorkerTransformRequestImpl
    | PCWorkerBatchRequestImpl

export interface PCWorkerProgressImpl {
    id: number
    kind: 'progress'
    fraction: number
    text: string
}

export interface PCWorkerDoneImpl {
    id: number
    kind: 'done'
    pixels: ArrayBuffer
    elapsed: number
}

export interface PCWorkerBatchItemImpl {
    id: number
    kind: 'batch_item'
    direction: PCDirection
    iteration: number
    width: number
    height: number
    pixels: ArrayBuffer
}

export interface PCWorkerBatchDoneImpl {
    id: number
    kind: 'batch_done'
    elapsed: number
    generated: number
}

export interface PCWorkerErrorImpl {
    id: number
    kind: 'error'
    message: string
}

export type PCWorkerResponseImpl =
    | PCWorkerProgressImpl
    | PCWorkerDoneImpl
    | PCWorkerBatchItemImpl
    | PCWorkerBatchDoneImpl
    | PCWorkerErrorImpl

export interface PCPillStateImpl {
    text: string
    tone: PCPillTone
}
