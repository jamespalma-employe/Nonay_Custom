<template>
  <q-header flat class="bg-cyan-900 dark:bg-cyan-800 py-1">
    <q-toolbar class="max-w-full">
      <div v-if="$q.screen.lt.md">
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="emit('toggle-drawer')" />
      </div>
    
      <section class="flex flex-auto justify-center">
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

        <q-menu class="flex flex-nowrap justify-between max-w-2xl px-2 py-3">
          <q-list class="flex flex-col">
            <q-item>
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
            </q-item>

            <q-btn
              no-caps
              dense
              class="bg-red-500 text-white rounded-md font-bold px-2"
              @click="handleLogout"
            >
              Sign out
            </q-btn>
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

const emit = defineEmits<{ (e: 'toggle-drawer'): void }>();

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
