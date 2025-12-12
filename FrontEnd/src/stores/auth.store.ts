import { defineStore } from "pinia";
import router from "../router";
import type { Me, LoginRequest } from "../models/auth.model";
import { login } from "../services/auth.service";
import { adminLogin as adminLoginApi } from "../services/admin.service";
import { jwtDecode } from "jwt-decode";

interface AuthState {
  user?: Me;
  LoggedIn: boolean;
}

export const authStore = defineStore("auth", {
  state: (): AuthState => ({
    user: undefined,
    LoggedIn: false,
  }),
  //เฉพาะ ตาม role ที่กำหนด
  getters: {
    isAuthenticated: (state) => state.LoggedIn && !!state.user,
    isAdmin: (state) =>
      state.user?.role && state.user.role.toLowerCase() === "admin",
    isUser: (state) =>
      state.user?.role && state.user.role.toLowerCase() === "user",
  },

  actions: {
    // user login
    async login(payload: LoginRequest) {
      try {
        //เรียก api login
        const res = await login(payload);
        const token = res.data.token;

        //เก็บ token ลง localstorage
        localStorage.setItem("Token", token);

        //decode token เพื่อดึงข้อมูล user
        const decoded: any = jwtDecode(token);

        this.user = {
          id: decoded.id,
          username: decoded.username,
          fullName: decoded.fullname,
          phone: decoded.phone,
          role: decoded.role,
        };

        this.LoggedIn = true;
      } catch (err) {
        console.error(err);
      }
    },

    // admin login
    async adminLogin(payload: LoginRequest) {
      try {
        const res = await adminLoginApi(payload);
        const token = res.data.token;

        localStorage.setItem("Token", token);
        const decoded: any = jwtDecode(token);
        this.user = {
          id: decoded.id,
          username: decoded.username,
          fullName: decoded.fullname,
          phone: decoded.phone,
          role: decoded.role,
        };

        this.LoggedIn = true;
      } catch (err) {
        console.error(err);
        throw err;
      }
    },

    //fetch user ใน store
    async fetchUser() {
      try {
        const token = localStorage.getItem("Token");

        if (!token) {
          this.user = undefined;
          this.LoggedIn = false;
          return;
        }

        const decoded: any = jwtDecode(token);

        this.user = {
          id: decoded.id,
          username: decoded.username,
          fullName: decoded.fullname, // ถ้าใน token เป็น fullname ให้ใช้แบบนี้
          phone: decoded.phone,
          role: decoded.role,
        };

        this.LoggedIn = true;
      } catch (err) {
        console.error(err);
        localStorage.removeItem("Token");
        this.user = undefined;
        this.LoggedIn = false;
      }
    },

    //logout
    async logout() {
      localStorage.removeItem("Token");
      this.user = undefined;
      this.LoggedIn = false;
      router.push({ name: "LoginView" });
    },
  },
});

export const fetchUser = async () => {
  const auth = authStore();

  try {
    const token = localStorage.getItem("Token");

    if (!token) {
      auth.user = undefined;
      auth.LoggedIn = false;
      return;
    }

    const decoded: any = jwtDecode(token);

    auth.user = {
      id: decoded.id,
      username: decoded.username,
      fullName: decoded.fullname,
      phone: decoded.phone,
      role: decoded.role,
    };

    auth.LoggedIn = true;
  } catch (e: any) {
    console.error("Error fetching user data:", e);
    localStorage.removeItem("Token");
    auth.LoggedIn = false;
    auth.user = undefined;
    router.push({ name: "LoginView" });
  }
};
