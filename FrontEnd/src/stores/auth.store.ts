import { defineStore } from "pinia";
import router from "../router";

import type { Me, LoginRequest } from "../models/auth.model";
import { login, getMe } from "../services/auth.service";

interface AuthState {
  user?: Me;
  LoggedIn: boolean;
}

export const authStore = defineStore("auth", {
  state: (): AuthState => ({
    user: undefined,
    LoggedIn: false,
  }),

  actions: {
    async login(payload: LoginRequest) {
      try {
        //เรียก api login
        const res = await login(payload);
        //เก็บ token ลง localstorage
        localStorage.setItem("Token", res.data.token);

        await this.fetchUser();
      } catch (err) {
        console.error(err);
      }
    },
    //fetch user ใน store
    async fetchUser() {
      try {
        const res = await getMe();
        this.user = res.data;
        this.LoggedIn = true;
      } catch (err) {
        console.error(err);
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

    try{
        const result = await Promise.all([getMe()]);
        auth.user = result[0].data;
    }catch (e: any){
        console.error('Error fetching user data:', e);

        if (e.response) {
            if (e.response.status === 401 || e.response.status === 403) {
                localStorage.removeItem('Token');
                auth.LoggedIn = false;
                auth.user = undefined;
                router.push({ name: 'LoginView' });
            }
        }
    }
}