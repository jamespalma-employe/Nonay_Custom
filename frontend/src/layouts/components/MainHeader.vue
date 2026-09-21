<template>
  <q-header flat class="bg-cyan-900 dark:bg-cyan-800 py-1" >
    <q-toolbar class="max-w-full">

  
      <section class="flex flex-grow justify-center">
        <q-input
          v-model="searchProb"
          dense
          outlined
          class="min-w-96 rounded-md max-w-3xl card dark:border-none"
          placeholder="Search..."
          @keyup.enter="handleSearch"
        >
          <template #prepend>
            <q-icon aria-label="search" name="search" />
          </template>
        </q-input>
      </section>

      <q-btn rounded flat noCaps class="pl-1 pr-3 py-0.5">
        <q-avatar class="text-white" aria-label="account" icon="account_circle" />
        <span class="ml-2">{{ user?.name }}</span>

        <q-menu class="flex flex-nowrap justify-center max-w-2xl px-4 py-3">
          <q-list>
            <q-btn
              flat
              round
              aria-label="theme"
              :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'"
              @click="toggleDarkMode"
            />
            <q-btn-dropdown flat :label="locale.toUpperCase()">
              <q-list>
                <q-item clickable v-close-popup @click="locale = 'en-US'">
                  <q-img
                    alt="bandeira-usa"
                    src="@/assets/languages/bandeira-usa.svg"
                    style="max-width: 20px; min-width: none"
                    class="m-3"
                  />
                  <q-item-section>English</q-item-section></q-item
                >
                <q-item clickable v-close-popup @click="locale = 'pt-BR'">
                  <q-img
                    alt="bandeira-brasil"
                    src="@/assets/languages/bandeira-pt-br.svg"
                    style="max-width: 20px; min-width: none"
                    class="m-3"
                  />
                  <q-item-section>Português (Brasil)</q-item-section></q-item
                >
                <q-item clickable v-close-popup @click="locale = 'es-ES'"
                  ><q-img
                    alt="bandeira-espanha"
                    src="@/assets/languages/bandeira-es.svg"
                    style="max-width: 20px; min-width: none"
                    class="m-3"
                  />
                  <q-item-section>Español</q-item-section></q-item
                >
              </q-list>
            </q-btn-dropdown>
            <q-item clickable v-close-popup @click="handleLogout">
              <q-item-section class="text-red-600">Sign Out</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
import { getUser, logout } from '@/services/auth/AuthService';
import { useQuasar } from 'quasar';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const user = getUser();
const router = useRouter();
const searchProb = ref('');
const $q = useQuasar();
const { locale } = useI18n();


function toggleDarkMode() {
  $q.dark.toggle();
  localStorage.setItem('theme', $q.dark.isActive ? 'dark' : 'light');
}

async function handleSearch() {
  await router.push({ path: '/learning', query: { q: searchProb.value } });
}

async function handleLogout() {
  logout();
  await router.push('/login');
}
</script>
