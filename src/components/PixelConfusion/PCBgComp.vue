<script setup lang="ts">
// 像素混淆页面的可爱背景：奶油粉渐变 + 像素点阵 + 漂浮糖果块 + 闪光
// 纯 CSS 绘制，不额外加载图片，保证页面轻盈
</script>

<template>
  <div class="pc_bg" aria-hidden="true">
    <span class="pc_bg_blob blob_a"/>
    <span class="pc_bg_blob blob_b"/>
    <span class="pc_bg_blob blob_c"/>
    <span class="pc_bg_grid"/>
    <span class="pc_bg_pixel p1"/>
    <span class="pc_bg_pixel p2"/>
    <span class="pc_bg_pixel p3"/>
    <span class="pc_bg_pixel p4"/>
    <span class="pc_bg_pixel p5"/>
    <span class="pc_bg_pixel p6"/>
    <span class="pc_bg_pixel p7"/>
    <span class="pc_bg_pixel p8"/>
    <span class="pc_bg_sparkle s1"/>
    <span class="pc_bg_sparkle s2"/>
    <span class="pc_bg_sparkle s3"/>
    <span class="pc_bg_sparkle s4"/>
    <span class="pc_bg_sparkle s5"/>
    <span class="pc_bg_sparkle s6"/>
  </div>
</template>

<style scoped lang="sass">
@keyframes pc_bg_float
  0%
    transform: translate3d(0, 0, 0) scale(1)
  50%
    transform: translate3d(26px, -20px, 0) scale(1.08)
  100%
    transform: translate3d(-18px, 14px, 0) scale(.94)
@keyframes pc_bg_drift
  0%
    transform: translate3d(0, 0, 0) rotate(var(--r, 0deg))
  50%
    transform: translate3d(7px, -16px, 0) rotate(calc(var(--r, 0deg) + 10deg))
  100%
    transform: translate3d(-5px, 5px, 0) rotate(calc(var(--r, 0deg) - 6deg))
@keyframes pc_bg_twinkle
  0%, 100%
    opacity: .12
    transform: scale(.65) rotate(0deg)
  50%
    opacity: .9
    transform: scale(1.05) rotate(18deg)
@keyframes pc_bg_grid_breathe
  0%, 100%
    opacity: .55
  50%
    opacity: .95

.pc_bg
  position: fixed
  inset: 0
  z-index: -1
  overflow: hidden
  pointer-events: none
  background: radial-gradient(ellipse 72% 56% at 50% 6%, rgba(255, 255, 255, .6), rgba(255, 255, 255, 0) 72%), linear-gradient(180deg, rgba(255, 255, 255, .18), rgba(255, 255, 255, .32)), linear-gradient(158deg, #fff8ef 0%, #fff1f6 38%, #f7f1ff 68%, #eef7ff 100%)
.pc_bg_grid
  position: absolute
  inset: -2px
  background-image: linear-gradient(rgba(240, 112, 158, .055) 1px, transparent 1px), linear-gradient(90deg, rgba(240, 112, 158, .055) 1px, transparent 1px)
  background-size: 34px 34px
  mask-image: radial-gradient(ellipse 78% 68% at 50% 18%, #000 0%, rgba(0, 0, 0, .35) 52%, transparent 82%)
  -webkit-mask-image: radial-gradient(ellipse 78% 68% at 50% 18%, #000 0%, rgba(0, 0, 0, .35) 52%, transparent 82%)
  animation: pc_bg_grid_breathe 12s ease-in-out infinite
.pc_bg_blob
  position: absolute
  border-radius: 50%
  filter: blur(64px)
  opacity: .45
  will-change: transform
.blob_a
  width: 440px
  height: 440px
  left: -120px
  top: -110px
  background: radial-gradient(circle at 32% 30%, rgba(255, 196, 214, .95), rgba(255, 226, 197, .35) 70%)
  animation: pc_bg_float 19s ease-in-out infinite alternate
.blob_b
  width: 380px
  height: 380px
  right: -100px
  top: 14%
  background: radial-gradient(circle at 60% 40%, rgba(190, 222, 255, .9), rgba(214, 232, 255, .25) 72%)
  animation: pc_bg_float 23s 1.2s ease-in-out infinite alternate-reverse
.blob_c
  width: 420px
  height: 420px
  left: 34%
  bottom: -180px
  background: radial-gradient(circle at 50% 50%, rgba(236, 214, 255, .85), rgba(255, 232, 244, .2) 70%)
  animation: pc_bg_float 26s .6s ease-in-out infinite alternate
.pc_bg_pixel
  position: absolute
  width: 14px
  height: 14px
  border-radius: 4px
  background: rgba(245, 169, 200, .55)
  box-shadow: 0 4px 10px rgba(227, 142, 178, .25)
  animation: pc_bg_drift 11s ease-in-out infinite alternate
.p1
  --r: 14deg
  left: 4.5%
  top: 22%
  width: 18px
  height: 18px
  background: rgba(255, 190, 214, .6)
  animation-duration: 10s
.p2
  --r: -18deg
  left: 12%
  top: 68%
  width: 11px
  height: 11px
  background: rgba(160, 207, 250, .55)
  animation-duration: 13s
  animation-delay: .8s
.p3
  --r: 28deg
  right: 6%
  top: 30%
  width: 20px
  height: 20px
  background: rgba(180, 226, 205, .55)
  animation-duration: 12s
  animation-delay: 1.6s
.p4
  --r: -8deg
  right: 13%
  top: 62%
  width: 12px
  height: 12px
  background: rgba(255, 206, 150, .6)
  animation-duration: 9s
  animation-delay: .4s
.p5
  --r: 40deg
  left: 24%
  top: 10%
  width: 9px
  height: 9px
  background: rgba(214, 130, 190, .5)
  animation-duration: 15s
  animation-delay: 2.2s
.p6
  --r: -24deg
  right: 27%
  bottom: 9%
  width: 16px
  height: 16px
  background: rgba(255, 178, 206, .55)
  animation-duration: 14s
  animation-delay: 1s
.p7
  --r: 8deg
  left: 8%
  bottom: 14%
  width: 10px
  height: 10px
  background: rgba(150, 198, 246, .5)
  animation-duration: 12.5s
  animation-delay: 1.4s
.p8
  --r: -32deg
  right: 4%
  bottom: 32%
  width: 13px
  height: 13px
  background: rgba(190, 235, 210, .55)
  animation-duration: 11.5s
  animation-delay: 2.6s
.pc_bg_sparkle
  position: absolute
  width: 16px
  height: 16px
  animation: pc_bg_twinkle 4.2s ease-in-out infinite
  opacity: .3
  &::before,
  &::after
    content: ""
    position: absolute
    border-radius: 999px
    background: linear-gradient(180deg, #ffd0e2, #f79bc0)
  &::before
    left: 50%
    top: 0
    width: 2px
    height: 100%
    transform: translateX(-50%)
  &::after
    top: 50%
    left: 0
    height: 2px
    width: 100%
    transform: translateY(-50%)
.s1
  left: 18%
  top: 16%
  width: 20px
  height: 20px
  animation-delay: .2s
.s2
  right: 20%
  top: 12%
  width: 13px
  height: 13px
  animation-duration: 3.4s
  animation-delay: 1.1s
.s3
  left: 3%
  top: 52%
  width: 12px
  height: 12px
  animation-duration: 5s
  animation-delay: .6s
.s4
  right: 3.5%
  top: 46%
  width: 22px
  height: 22px
  animation-duration: 4.6s
  animation-delay: 1.8s
.s5
  left: 30%
  bottom: 6%
  width: 14px
  height: 14px
  animation-duration: 3.8s
  animation-delay: 2.4s
.s6
  right: 30%
  top: 74%
  width: 17px
  height: 17px
  animation-duration: 5.4s
  animation-delay: .9s
  &::before,
  &::after
    background: linear-gradient(180deg, #ffe6b8, #f7c873)
@media (max-width: 900px)
  .p5, .p6, .s3, .s6
    display: none
@media (max-width: 720px)
  .pc_bg_pixel, .pc_bg_sparkle
    display: none
  .pc_bg_blob
    filter: blur(48px)
    opacity: .45
@media (prefers-reduced-motion: reduce)
  .pc_bg_grid, .pc_bg_blob, .pc_bg_pixel, .pc_bg_sparkle
    animation: none
</style>
