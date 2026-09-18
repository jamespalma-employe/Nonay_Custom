<template>
  <main class="flex min-h-dvh items-center justify-center">
    <q-card style="width: 380px">
      <q-card-section
        class="bg-gradient-to-t border-l-white rounded-md from-cyan-800 via-cyan-900 via-50% to-cyan-950"
      >
        <q-img
          alt="nonay-logo-branca"
          src="@/assets/images/Nonay-logo-branca.svg"
          style="max-width: 150px; min-width: none"
          class="m-3 ml-5"
        />
        <q-form class="p-3" @submit="handleLogin">
          <q-input color="white" v-model="email" label="Email" type="email" dark />
          <q-input color="white" v-model="password" label="Password" type="password" dark />

          <q-btn class="bg-slate-50 mt-5" type="submit">Sign in</q-btn>
        </q-form>
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
