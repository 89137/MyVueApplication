// Import the necessary modules from Vue Router
import KaartPage from '@/views/KaartPage.vue'
import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/KaartPage',
      name: 'KaartPage',
      component: KaartPage,
    },
    { path: '/:pathMatch(.*)*', redirect: '/home' },
  ],
})

export default router
