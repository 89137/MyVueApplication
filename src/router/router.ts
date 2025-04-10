import HomeView from '@/views/HomeView.vue'
import SubPage from '@/views/SubPage.vue'
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
  ],
})

export default router
