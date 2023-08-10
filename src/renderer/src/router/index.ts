import { createRouter, createWebHistory } from 'vue-router';
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/home',
      name: 'home',
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
      path: '/',
      component: () => import('@renderer/views/Login.vue'),
      name: 'login'
    },
    {
      path: '/update',
      component: () => import('@renderer/views/Update.vue'),
      name: 'update'
    },
    {
      path: '/notice',
      component: () => import('@renderer/views/Notice.vue'),
      name: 'notice'
    }
  ]
});
router.beforeEach((to, from) => {
  if (to.path == '/notice') {
    if (from.path == '/' || from.path.includes('index.html')) {
      return true;
    } else {
      return false;
    }
  }
  return true;
});
export default router;
