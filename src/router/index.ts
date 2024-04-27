import VimEditor from '@/components/VimEditor.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: VimEditor
    }
  ]
})

export default router
