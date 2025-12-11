<template>
  <div class="min-h-screen flex flex-col items-center justify-center">
    <!-- โลโก้ -->
    <div class="flex justify-center mb-6 mt-4">
      <img :src="logo" alt="Pokemon" class="h-30" />
    </div>

    <div class="w-full max-w-md rounded-3xl bg-white px-8 py-10 shadow-2xl">
      <!-- หัวข้อ -->
      <h2 class="text-2xl font-bold text-center text-slate-700 mb-6">
        สร้างบัญชีผู้ใช้
      </h2>

      <!-- ฟอร์ม -->
      <form class="space-y-4" @submit.prevent="handleRegister">
        <!-- Full Name -->
        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700">
            ชื่อ - นามสกุล
          </label>
          <input
            v-model="form.fullName"
            type="text"
            class="w-full rounded-lg border border-slate-500 px-3 py-2.5 text-sm
                   outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-300"
            placeholder="ชื่อ - นามสกุล"
          />
        </div>

        <!-- Phone -->
        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700">
            เบอร์โทรศัพท์
          </label>
          <input
            v-model="form.phone"
            type="text"
            class="w-full rounded-lg border border-slate-500 px-3 py-2.5 text-sm
                   outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-300"
            placeholder="เบอร์โทรศัพท์"
          />
        </div>

        <!-- Username -->
        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700">
            Username
          </label>
          <input
            v-model="form.username"
            type="text"
            class="w-full rounded-lg border border-slate-500 px-3 py-2.5 text-sm
                   outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-300"
            placeholder="ตั้งชื่อผู้ใช้"
          />
        </div>

        <!-- Password -->
        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700">
            รหัสผ่าน
          </label>
          <div class="relative">
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              class="w-full rounded-lg border border-slate-500 px-3 py-2.5 pr-10 text-sm
                     outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-300"
              placeholder="รหัสผ่าน"
            />
            <button
              type="button"
              class="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600"
              @click="togglePassword"
            >
              <Icon
                v-if="showPassword"
                icon="mdi:eye-off-outline"
                width="24"
                height="24"
              />
              <Icon
                v-else
                icon="mdi:eye-outline"
                width="24"
                height="24"
              />
            </button>
          </div>
        </div>

        <!-- Confirm Password -->
        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700">
            ยืนยันรหัสผ่าน
          </label>
          <div class="relative">
            <input
              v-model="form.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              class="w-full rounded-lg border border-slate-500 px-3 py-2.5 pr-10 text-sm
                     outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-300"
              placeholder="ยืนยันรหัสผ่าน"
            />
            <button
              type="button"
              class="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600"
              @click="toggleConfirmPassword"
            >
              <Icon
                v-if="showConfirmPassword"
                icon="mdi:eye-off-outline"
                width="24"
                height="24"
              />
              <Icon
                v-else
                icon="mdi:eye-outline"
                width="24"
                height="24"
              />
            </button>
          </div>
        </div>

        <!-- error -->
        <p v-if="error" class="text-red-500 text-center text-sm">
          {{ error }}
        </p>

        <!-- ปุ่มลงทะเบียน -->
        <BaseButton type="submit" class="mt-3 w-full py-2.5">
          ลงทะเบียน
        </BaseButton>

        <!-- ลิงก์กลับไปหน้า login -->
        <button
          type="button"
          class="mt-3 w-full rounded-full border border-emerald-400 py-2.5 text-sm
                 font-semibold text-emerald-600 hover:bg-emerald-50"
        >
          <router-link to="/login">กลับไปหน้าเข้าสู่ระบบ</router-link>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Icon } from "@iconify/vue";
import { register } from "../services/auth.service";
import logo from "../assets/picture/logo.png";
import BaseButton from "../components/ฺBaseButton.vue";

const router = useRouter();

const form = ref({
  username: "",
  fullName: "",
  phone: "",
  password: "",
  confirmPassword: "",
  role: "USER" as const,
});

const error = ref("");

// toggle สำหรับ password 
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const toggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};

const handleRegister = async () => {
  error.value = "";

  if (!form.value.username || !form.value.password) {
    error.value = "กรุณากรอกข้อมูลให้ครบถ้วน";
    return;
  }

  if (form.value.password !== form.value.confirmPassword) {
    error.value = "รหัสผ่านไม่ตรงกัน";
    return;
  }

  try {
    await register(form.value);
    alert("สมัครสมาชิกสำเร็จ!");
    router.push("/login");
  } catch (err: any) {
    error.value =
      err?.response?.data || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง";
  }
};
</script>
