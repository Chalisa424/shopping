<template>
  <!-- Logo -->
  <div class="flex justify-center mb-6">
    <img :src="Logo" class="h-30" />
  </div>

  <div class="flex items-center justify-center">
    <div class="w-full max-w-md rounded-2xl bg-white px-8 py-10 shadow-xl">
      <h1 class="mb-6 text-center font-archivo font-bold text-blue-600 text-3xl drop-shadow-md">
        LOGIN SHOPPING
      </h1>

      <form @submit.prevent="handleLogin" class="space-y-5">
        <!-- Username -->
        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700">
            ชื่อผู้ใช้
          </label>
          <input
            v-model="form.username"
            type="text"
            placeholder="Enter your username"
            class="w-full rounded-lg border border-slate-500 px-3 py-2.5 text-sm
                   outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-300"
          />
        </div>

        <!-- Password + eye -->
        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700">
            รหัสผ่าน
          </label>
          <div class="relative">
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Enter your password"
              class="w-full rounded-lg border border-slate-500 px-3 py-2.5 pr-10 text-sm
                     outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-300"
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

        <!-- Error -->
        <p v-if="errorMessage" class="text-xs text-red-500">
          {{ errorMessage }}
        </p>

        <!-- ปุ่มเข้าสู่ระบบ -->
        <BaseButton
          type="submit"
          :disabled="loading"
          class="mt-3 w-full py-2.5"
        >
          {{ loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ' }}
        </BaseButton>

        <!-- ปุ่มลงทะเบียน -->
        <button
          type="button"
          class="mt-3 w-full rounded-full border border-emerald-400 py-2.5 text-sm
                 font-semibold text-emerald-600 hover:bg-emerald-50"
          @click="goRegister"
        >
          ลงทะเบียน
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authStore } from '../../stores/auth.store'
import { Icon } from '@iconify/vue'
import Logo from '../../assets/picture/logo.png'
import BaseButton from '../../components/ฺBaseButton.vue'

const router = useRouter()
const auth = authStore()

const form = ref({
  username: '',
  password: '',
})

const showPassword = ref(false)
const loading = ref(false)
const errorMessage = ref<string | null>(null)

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const handleLogin = async () => {
  errorMessage.value = null

  if (!form.value.username.trim() || !form.value.password.trim()) {
    errorMessage.value = 'กรุณากรอกชื่อผู้ใช้และรหัสผ่านให้ครบถ้วน'
    return
  }

  try {
    loading.value = true
    await auth.adminLogin({
      username: form.value.username.trim(),
      password: form.value.password,
    })

    if (!auth.isAdmin){
        errorMessage.value = "บัญชีนี้ไม่มีสิทธิ์ผู้ดูแลระบบ "
        await auth.logout()
        return
    }

    router.push({name: 'AdminOrderView'})

  } catch (e) {
    errorMessage.value = 'เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบข้อมูลอีกครั้ง'
  } finally {
    loading.value = false
  }
}

const goRegister = () => {
  router.push({ name: 'RegisterView' })
}
</script>
