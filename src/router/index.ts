import Form from '@/components/Form.vue'
import SecretWords from '@/components/SecretWords.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Form,
    },
    {
      path: '/secret',
      name: 'secret',
      component: SecretWords,
    }
  ],
})

export default router
