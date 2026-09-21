<template>
  <q-layout view="lHh Lpr lff">
    <MainHeader @toggle-drawer="toggleDrawer" />

    

    <q-drawer
      style="scrollbar-width: none"
      v-model="leftDrawerOpen"
      :mini="miniState"
      show-if-above
      bordered
    >
      <q-btn v-if="miniState" flat dense round icon="menu" aria-label="Menu" @click="toggleDrawer" />
      <q-btn v-else flat dense round icon="menu" aria-label="Menu" @click="toggleDrawer" />

      <q-list>
        <div class="flex justify-center px-2">
          <q-img
          v-if="!miniState"
            alt="logo-nonay"
            src="@/assets/images/Nonay-logo.svg"
            style="max-width: 200px; min-width: 125px"
          />
           <q-img
           v-else
            alt="logo-nonay"
            src="@/assets/images/Nonay-simbol.svg"
            style="max-width: auto; min-width: auto"
          />
        </div>
        
        <EssentialLink
          class="text-gray-950 dark:text-white"
          v-for="link in linksList"
          :key="link.label"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import EssentialLink, { type EssentialLinkProps } from '@/components/EssentialLink.vue';
import { useQuasar } from 'quasar';
import MainHeader from './components/MainHeader.vue';

const miniState = ref(true);
const leftDrawerOpen = ref(false);
const $q = useQuasar();

function toggleDrawer() {
  if ($q.screen.gt.xs) {
    miniState.value = !miniState.value;
  } else {
    leftDrawerOpen.value = !leftDrawerOpen.value;
  }
}

const linksList: EssentialLinkProps[] = [
  {
    label: 'sidebar.home',
    icon: 'home',
    link: '/',
  },
  {
    label: 'sidebar.mySolutions',
    icon: 'lightbulb',
    link: '/mysolutions',
  },
  {
    label: 'sidebar.learning',
    icon: 'code',
    link: '/learning',
  },
];
</script>
