export type PCMethod = 'gilbert' | 'arnold'
export type PCAction = 'scramble' | 'restore'
export type PCStatusTone = 'idle' | 'ok' | 'busy' | 'error'
export type PCPillTone = 'idle' | 'loaded' | 'busy'

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

export interface PCWorkerRequestImpl extends PCTransformParamsImpl {
    id: number
    width: number
    height: number
    pixels: ArrayBuffer
}

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

export interface PCWorkerErrorImpl {
    id: number
    kind: 'error'
    message: string
}

export type PCWorkerResponseImpl =
    | PCWorkerProgressImpl
    | PCWorkerDoneImpl
    | PCWorkerErrorImpl

export interface PCPillStateImpl {
    text: string
    tone: PCPillTone
}
