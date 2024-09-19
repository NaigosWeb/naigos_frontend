import { createRouter, createWebHistory } from 'vue-router'
import Main from "@/views/Main.vue";
import BaT1Comp from "@/components/BlueArchive/BaT1Comp.vue";
import BaDefaultComp from "@/components/BlueArchive/BaDefaultComp.vue";

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
    },
    {
      path: '/apply_developer',
      name: 'applyDeveloper',
      component: () => import('@/views/ApplyDeveloper/APMainPage.vue'),
      redirect: '/apply_developer/details',
      children: [
        {
          path: 'details',
          name: 'applyDeveloperDetails',
          component: () => import('@/components/ApplyDeveloper/APDetails.vue')
        },
        {
          path: 'contract',
          name: 'applyDeveloperContract',
          component: () => import('@/components/ApplyDeveloper/APDetails.vue')
        },
        {
          path: 'form',
          name: 'applyDeveloperForm',
          component: () => import('@/components/ApplyDeveloper/APDetails.vue')
        }
      ]
    },
    {
      path: '/person_center',
      name: 'personCenter',
      component: () => import('@/views/PersonCenter.vue')
    },
    {
      path: '/ba',
      name: 'ba',
      component: () => import('@/views/BlueArchive.vue'),
      children: [
        {
          path: '',
          name: 'bad',
          component: BaDefaultComp
        },
        {
          path: 't1',
          name: 't1',
          component: BaT1Comp
        }
      ]
    }
  ]
})

export default router
