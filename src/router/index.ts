import { createRouter, createWebHistory } from 'vue-router'
import MainRouter from "@/router/RouterList/MainRouter";
import SogouInputThemeRouter from "@/router/RouterList/SogouInputThemeRouter";
import SignRouter from "@/router/RouterList/SignRouter";
import ApplyDeveloperRouter from "@/router/RouterList/ApplyDeveloperRouter";
import PersonCenterRouter from "@/router/RouterList/PersonCenterRouter";
import BlueArchiveRouter from "@/router/RouterList/BlueArchiveRouter";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    MainRouter,
    SogouInputThemeRouter,
    SignRouter,
    ApplyDeveloperRouter,
    PersonCenterRouter,
    BlueArchiveRouter
  ]
})

import {useFooterStore} from "@/stores/FooterStore";
router.beforeEach((to, from, next) => {
  const footerStore = useFooterStore();
  ['blue_archive', 'sogou_input_theme'].includes(to.path.split('/')[1])?
      footerStore.changeFooterStatus(false): footerStore.changeFooterStatus(true);
  next();
})

export default router
