<script setup lang="ts">
import MikaCakeHomeBG from "@/assets/MikaCake/mika_cake_home_bg.jpg"
import HomeButtonItem from "@/assets/MikaCake/play_button_item.png"
import TitleItem from "@/assets/MikaCake/DreamyDeliciousChallenge.png"
</script>

<template>
  <div class="mc_bg">
    <img :src="MikaCakeHomeBG" alt="bg"/>
  </div>
  <div class="mc_home_box">
    <img :src="TitleItem" alt="title"/>
    <img class="mc_home_button" :src="HomeButtonItem" alt="button"/>
    <p style="font-size: 26px">尚在开发中</p>
  </div>
</template>

<style scoped lang="css">
@keyframes bg_in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes mc_home_button_in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.mc_bg {
  animation: bg_in .8s forwards;
  position: fixed;
  width: 100%;
  height: 100vh;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  img {
    min-height: 100%
  }
}
.mc_home_box {
  opacity: 0;
  animation: mc_home_button_in .8s .4s forwards;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  .mc_home_button:hover {
    filter: drop-shadow(0 5px 5px rgb(250, 169, 208));
  }
  .mc_home_button {
    transition: filter 0.3s;
    cursor: pointer;
    width: 428px;
    height: 115px;
  }
}
.mc_home_button_box {
  cursor: pointer;
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 20%;
}
</style>