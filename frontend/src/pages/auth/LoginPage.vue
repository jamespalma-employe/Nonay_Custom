<template>
  <main class="flex min-h-dvh bg-orange-400 items-center justify-center">
    <q-card style="width: 400px">
      <q-card-section class="card rounded-lg shadow h-auto p-6 bg-white relative overflow-hidden">
        <section class="justify-center">
          <q-img
          alt="nonay-logo-branca"
          src="@/assets/images/Nonay-secondary.svg"
          style="max-width: 150px; min-width: none"
          class="m-3 ml-5"
        />
        </section>
        <section class="flex items-center">
          <q-form class="w-full mt-4 space-y-3" @submit="handleLogin">
          <q-input dense borderless stack-label   class="outline-none border-2 rounded-md px-2 py-1 text-slate-500 w-full focus:border-blue-300" v-model="email" label="Email" type="email" />
          <q-input dense borderless stack-label  class="outline-none border-2 rounded-md px-2 py-1 text-slate-500 w-full focus:border-blue-300" v-model="password" label="Password" type="password"/>

          <q-btn class="btn w-full mt-5" type="submit">Sign in</q-btn>
        </q-form>
        </section>
        
      </q-card-section>
    </q-card>
  </main>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { login } from '@/services/auth/AuthService';
import { triggerNegative, triggerSuccess } from '@/utils/Notify';
import { ref } from 'vue';

const router = useRouter();

const email = ref('');
const password = ref('');

async function handleLogin() {
  try {
    await login(email.value, password.value);
    triggerSuccess('Login Succesful');
    await router.push('/Learning');
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid credentials';
    triggerNegative(message);
  }
}
</script>
