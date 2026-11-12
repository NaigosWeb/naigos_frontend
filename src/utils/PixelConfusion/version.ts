/**
 * Web edition of the PixelConfusion version banner.
 *
 * The desktop tool is the reference implementation; this page mirrors its
 * three-part version number so both surfaces describe the same feature set.
 */

export const PC_APP_NAME = 'PixelConfusion'
export const PC_APP_NAME_CN = '像素混淆器'

export const PC_VERSION_PARTS: readonly [number, number, number] = [1, 0, 0]
export const PC_VERSION_LABELS: readonly [string, string, string] = [
    '大更新',
    '中期更新',
    '小更新'
]

export const PC_VERSION = PC_VERSION_PARTS.join('.')

export const PC_VERSION_COMPONENTS = PC_VERSION_PARTS
    .map((value, index) => `${PC_VERSION_LABELS[index]} ${value}`)
    .join(' · ')

export const PC_VERSION_DETAIL = `${PC_VERSION}（${PC_VERSION_COMPONENTS}）`

export const PC_VERSION_BADGE = `v${PC_VERSION}`
