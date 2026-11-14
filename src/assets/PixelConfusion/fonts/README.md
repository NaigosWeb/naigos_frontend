# 像素混淆页的标题圆体

`pc-rounded-bold.woff2` 是 [Resource Han Rounded](https://github.com/CyanoHao/Resource-Han-Rounded)
（资源圆体）CN 版的 **Bold** 字重，经子集化后只保留本页用到的字符。

## 来源与授权

| | |
|---|---|
| 字体 | Resource Han Rounded CN（思源黑体 / Source Han Sans 的圆角化衍生） |
| 版本 | v0.990（`RHR-CN-0.990.7z` → `ResourceHanRoundedCN-Bold.ttf`） |
| 上游 | https://github.com/CyanoHao/Resource-Han-Rounded |
| 授权 | **SIL Open Font License 1.1**，见同目录 [LICENSE.md](./LICENSE.md) |
| 商用 | 允许（不可单独售卖字体文件；修改版需继续以 OFL 发布） |

网页里使用的字族名是 `"PixelConfusion Rounded"`，没有沿用上游名称——
按 OFL，修改版（子集化属于修改）不应使用原字体的保留名称。

## 为什么是子集

原文件 13.3 MB/字重，直接转 woff2 是 4.83 MB，不可能进网页。
按本页实际出现的 506 个字符（其中 382 个汉字）裁剪后是 **91 KB**。

## 字符范围

`.dsh-imgwork/make_webfont.py` 会扫描下列文件里的所有可打印字符，
加上 ASCII 与常见中英标点：

```
src/views/PixelConfusionView.vue
src/components/PixelConfusion/*.vue
src/utils/PixelConfusion/*.ts
src/interfaces/PixelConfusionImpl.ts
src/stores/PixelConfusion/*.ts
src/composables/usePCTheme.ts
```

## 重新生成

页面新增了标题文案、且新字不在子集里时，会回退到系统字体（不会出豆腐块，
但字体风格会不一致）。重新生成：

```bash
# 1. 下载并解压（约 36 MB，含全部字重）
#    https://github.com/CyanoHao/Resource-Han-Rounded/releases/download/v0.990/RHR-CN-0.990.7z

# 2. 子集化
python .dsh-imgwork/make_webfont.py \
  ResourceHanRoundedCN-Bold.ttf \
  src/assets/PixelConfusion/fonts/pc-rounded-bold.woff2
```

依赖 `fonttools` 与 `brotli`（`pip install fonttools brotli`）。

## 使用范围

只用于 **≥14px 的标题层**（`--pc-font-round`）。
11–13px 的正文细字仍走系统字体：该字体没有 hinting，
小字号下会比微软雅黑略软，实测 12px 时灰阶 109 级 / 雅黑 79 级。
