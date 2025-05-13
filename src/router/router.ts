import KaartPage from '@/views/KaartPage.vue'

import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/KaartPage',
    },
    {
      path: '/KaartPage',
      name: 'KaartPage',
      component: KaartPage,
    },
    { path: '/:pathMatch(.*)*', redirect: '/KaartPage' },
  ],
})

export default router
