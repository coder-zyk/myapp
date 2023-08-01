import { getSessionStorage } from '@renderer/util/storage';
import { createRouter, createWebHistory } from 'vue-router';
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@renderer/views/Redirect.vue'),
      redirect: '/user',
      children: [
        {
          path: '/user',
          component: () => import('@renderer/views/index.vue'),
          name: 'user'
        },
        {
          path: '/chat',
          component: () => import('@renderer/views/chatroom/index.vue'),
          name: 'chat'
        },
        {
          path: '/subject/math',
          component: () => import('@renderer/views/subject/math/index.vue'),
          name: 'math'
        }
      ]
    },
    {
      path: '/login',
      component: () => import('@renderer/views/Login.vue'),
      name: 'login'
    }
  ]
});
router.beforeEach((to) => {
  if (!getSessionStorage('user') && !['/login', '/404'].includes(to.path))
    return { path: '/login' };
  else {
    return true;
  }
});
export default router;
