import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('@/pages/IndexPage.vue'), meta: { requiresAuth: true } },
      {
        path: 'learning',
        component: () => import('@/pages/LearningPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'mysolutions',
        component: () => import('@/pages/MySolutionPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'learning/:id',
        component: () => import('@/pages/PostDetails.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'translation/:learningId',
        component: () => import('@/pages/TranslatePage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'translation/:learningId/edit/:translationId',
        component: () => import('@/pages/TranslatePage.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },

  {
    path: '/login',
    component: () => import('@/pages/auth/LoginPage.vue'),
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('@/pages/ErrorNotFound.vue'),
  },
];

export default routes;
