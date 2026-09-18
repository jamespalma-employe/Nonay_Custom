<template>
  <q-layout view="lHh Lpr lff" >
    <MainHeader @toggle-drawer="toggleDrawer" />
    
    <q-drawer
      class="bg-slate-100 dark:bg-gray-950 px-5 py-5 pr-5 pl-5 max-w-2xl"
      style="scrollbar-width: none;"
      v-model="leftDrawerOpen"
      :mini="miniState"
      show-if-above
      bordered
    >

     <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleDrawer" />
    
      <q-list>
        <div class="flex items-center justify-between px-2">
          <q-img
            alt="logo-nonay"
            src="@/assets/images/Nonay-logo.svg"
            style="max-width: 200px;"
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
