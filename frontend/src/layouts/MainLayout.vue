<template>
  <q-layout view="lHh Lpr lff">
    <MainHeader @toggle-drawer="toggleDrawer" />

    

    <q-drawer
      style="scrollbar-width: none"
      v-model="leftDrawerOpen"
      :mini="miniState"
      bordered
    >
    <div v-if="$q.screen.gt.sm" :class="miniState ? 'flex justify-center p-1' : 'flex justify-end p-1'">
        <q-btn flat dense :icon="miniState ? 'menu' : 'chevron_left'" @click="toggleMini"/>
    </div>



      <q-list>
        <div class="px-2">
          <q-img
          v-if="!miniState"
            alt="logo-nonay"
            src="@/assets/images/Nonay-logo.svg"
            style="max-width: 200px; min-width: 125px"
          />
           <q-img
           v-else
            alt="logo-nonay-simbol"
            src="@/assets/images/Nonay-simbol.svg"
            style="max-width: 100px; min-width: auto"
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

const $q = useQuasar();
const miniState = ref(true);
const leftDrawerOpen = ref($q.screen.gt.xs);

function toggleMini() {
    miniState.value = !miniState.value;
}

function toggleDrawer() {
    leftDrawerOpen.value = !leftDrawerOpen.value;
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
