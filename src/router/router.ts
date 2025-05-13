import HomeView from '@/views/HomeView.vue'
import SubPage from '@/views/SubPage.vue'
import KaartPage from '@/views/KaartPage.vue'

import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/Home',
    },
    {
      path: '/Home',
      name: 'Home',
      component: HomeView,
    },
    {
      path: '/SubPage',
      name: 'SubPage',
      component: SubPage,
    },
    {
      path: '/KaartPage',
      name: 'KaartPage',
      component: KaartPage,
    },
    { path: '/:pathMatch(.*)*', redirect: '/home' },
  ],
})

export default router
