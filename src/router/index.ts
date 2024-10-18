import { createRouter, createWebHistory } from 'vue-router'
import HomeRouter from "@/router/RouterList/HomeRouter";
import SignRouter from "@/router/RouterList/SignRouter";
import BlueArchiveRouter from "@/router/RouterList/BlueArchiveRouter";
import ApplyRouter from "@/router/RouterList/ApplyRouter";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
      HomeRouter,
      SignRouter,
      BlueArchiveRouter,
      ApplyRouter,
  ]
})

// router.beforeEach((to, from, next) => {
//   const footerStore = useFooterStore();
//   ['blue_archive', 'sogou_input_theme'].includes(to.path.split('/')[1])?
//       footerStore.changeFooterStatus(false): footerStore.changeFooterStatus(true);
//   next();
// })

export default router
