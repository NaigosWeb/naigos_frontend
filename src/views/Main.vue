<script setup lang="ts">
import Header from "@/components/Header/Header.vue";
import MainContainer from "@/components/MainContainer/MainContainer.vue";
</script>

<template>
  <div class="main_container_bg_box">
    <img class="main_bg" id="main_bg_arona" src="@/assets/arona.jpg" alt="arona"/>
    <img class="main_bg" id="main_bg_purana" src="@/assets/purana.jpg" alt="purana"/>
  </div>
  <Header/>
  <MainContainer/>
  <nav>
    <RouterView></RouterView>
  </nav>
</template>

<style scoped lang="sass">


#main_bg_arona
  position: fixed
  left: 0
#main_bg_purana
  position: fixed
  right: 0
.main_bg
  height: 100vh
  z-index: -1
</style>



<!--<template>-->
<!--  <div class="main_container">-->
<!--    <div class="main_container_left">-->
<!--      <SideMenu/>-->
<!--    </div>-->
<!--    <div class="main_container_right">-->
<!--      <div class="main_container_bg_box">-->
<!--        <img class="main_bg" id="main_bg_arona" src="@/assets/arona.jpg" alt="arona"/>-->
<!--        <img class="main_bg" id="main_bg_purana" src="@/assets/purana.jpg" alt="purana"/>-->
<!--      </div>-->
<!--      <Header/>-->
<!--&lt;!&ndash;      <div style="width: 100%; height: 50px; background-color: #e0d2ff"></div>&ndash;&gt;-->
<!--    </div>-->
<!--  </div>-->
<!--</template>-->

<!--<script setup lang="ts">-->
<!--import  Header from "@/components/Header/Header.vue";-->
<!--import SideMenu from "@/components/SideMenu/SideMenu.vue";-->
<!--</script>-->

<!--<style scoped lang="sass">-->
<!--.main_container-->
<!--  display: grid-->
<!--  grid-template-columns: 15% 85%-->
<!--  .main_container_left-->
<!--    border-right: 1px solid #949494-->
<!--  .main_container_right-->
<!--    position: relative-->
<!--    #main_bg_arona-->
<!--      position: fixed-->
<!--      left: 15%-->
<!--    #main_bg_purana-->
<!--      position: fixed-->
<!--      right: 0-->
<!--    .main_bg-->
<!--      height: 100vh-->
<!--      z-index: -1-->
<!--</style>-->


<!--<script setup lang="ts">-->
<!--import { RouterLink, RouterView } from 'vue-router'-->
<!--import HelloWorld from '@/components/HelloWorld.vue'-->
<!--</script>-->

<!--<template>-->
<!--  <header>-->
<!--    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />-->

<!--    <div class="wrapper">-->
<!--      <HelloWorld msg="You did it!" />-->

<!--      <nav>-->
<!--        <RouterLink to="/">Home</RouterLink>-->
<!--        <RouterLink to="/about">About</RouterLink>-->
<!--      </nav>-->
<!--    </div>-->
<!--  </header>-->

<!--  <RouterView />-->
<!--</template>-->

<!--<style scoped>-->
<!--header {-->
<!--  line-height: 1.5;-->
<!--  max-height: 100vh;-->
<!--}-->

<!--.logo {-->
<!--  display: block;-->
<!--  margin: 0 auto 2rem;-->
<!--}-->

<!--nav {-->
<!--  width: 100%;-->
<!--  font-size: 12px;-->
<!--  text-align: center;-->
<!--  margin-top: 2rem;-->
<!--}-->

<!--nav a.router-link-exact-active {-->
<!--  color: var(&#45;&#45;color-text);-->
<!--}-->

<!--nav a.router-link-exact-active:hover {-->
<!--  background-color: transparent;-->
<!--}-->

<!--nav a {-->
<!--  display: inline-block;-->
<!--  padding: 0 1rem;-->
<!--  border-left: 1px solid var(&#45;&#45;color-border);-->
<!--}-->

<!--nav a:first-of-type {-->
<!--  border: 0;-->
<!--}-->

<!--@media (min-width: 1024px) {-->
<!--  header {-->
<!--    display: flex;-->
<!--    place-items: center;-->
<!--    padding-right: calc(var(&#45;&#45;section-gap) / 2);-->
<!--  }-->

<!--  .logo {-->
<!--    margin: 0 2rem 0 0;-->
<!--  }-->

<!--  header .wrapper {-->
<!--    display: flex;-->
<!--    place-items: flex-start;-->
<!--    flex-wrap: wrap;-->
<!--  }-->

<!--  nav {-->
<!--    text-align: left;-->
<!--    margin-left: -1rem;-->
<!--    font-size: 1rem;-->

<!--    padding: 1rem 0;-->
<!--    margin-top: 1rem;-->
<!--  }-->
<!--}-->
<!--</style>-->
