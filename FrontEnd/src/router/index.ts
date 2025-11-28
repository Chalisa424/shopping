import { nextTick } from "vue";
import {
  type RouteLocationNormalized,
  createRouter,
  createWebHistory,
} from "vue-router";

const routes = [
  // User Login
  {
    path: "/",
    component: () => import("../layouts/AuthLayout.vue"),
    children: [
      {
        path: "",
        redirect: { name: "LoginView" },
      },
      {
        path: "login",
        name: "LoginView",
        meta: { title: "เข้าสู่ระบบ" },
        component: () => import("../views/loginView.vue"),
      },
    ],
  },

  // Product View (User)
  {
    path: "/products",
    component: () => import("../layouts/ShopLayout.vue"),
    children: [
      {
        path: "",
        name: "ProductView",
        meta: { title: "รายการสินค้า" },
        component: () => import("../views/ProductView.vue"),
      },
    ],
  },
  // Cart (User)
  {
    path: "/cart",
    component: () => import("../layouts/ShopLayout.vue"),
    children: [
      {
        path: "",
        name: "CartView",
        meta: { title: "รถเข็น" },
        component: () => import("../views/CartView.vue"),
      },
    ],
  },

  // Admin
  {
    path: "/admin",
    component: () => import("../layouts/AdminLayout.vue"),
    children: [
      {
        path: "",
        redirect: { name: "AdminLoginView" },
      },
      {
        path: "Login",
        name: "AdminLoginView",
        meta: { title: "เข้าสู่ระบบผู้ดูแล" },
        component: () => import("../views/admin/AdminLoginView.vue"),
      },
      {
        path: "order",
        name: "AdminOrderView",
        meta: { title: "จัดการสินค้า" },
        component: () => import("../views/admin/AdminOrderView.vue"),
      },
    ],
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
