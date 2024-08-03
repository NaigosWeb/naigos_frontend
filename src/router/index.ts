import { createRouter, createWebHistory } from 'vue-router'
import Main from "@/views/Main.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: Main
    },
    {
      path: '/sogou_input_theme',
      name: 'sogou_input_theme',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/SogouInputTheme.vue')
    },
    {
      path: '/sign',
      name: 'sign',
      component: () => import('@/views/Sign/LoginAndSignup.vue')
    }
  ]
})

export default router
