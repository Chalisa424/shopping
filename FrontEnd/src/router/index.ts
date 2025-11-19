import { nextTick } from "vue";
import {
  type RouteLocationNormalized,
  createRouter,
  createWebHistory,
} from "vue-router";

const routes = [
 {
    path: '/',
    component: () => import('../layouts/AuthLayout.vue'),
    children: [
      {
        path: '',
        redirect: { name: 'LoginView' },
      },
      {
        path: 'login',
        name: 'LoginView',
        meta: { title: 'เข้าสู่ระบบ' },
        component: () => import('../views/loginView.vue'),
      },
    ],
  },

  
  // Product View
  {
    path:'/products',
    name:'ProductView',
    meta:{
      title:'รายการสินค้า'
  },
    component: () => import("../views/productView.vue"),
  },
  
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to: RouteLocationNormalized) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: "smooth",
      };
    }
    return { top: 0 };
  },
});

const DEFAULT_TITLE = "Shopping App";
router.afterEach(async (to: RouteLocationNormalized) => {
  await nextTick();
  document.title = `${
    to.meta.title ? `${to.meta.title} | ` : ""
  }${DEFAULT_TITLE}`;
});

export default router;
