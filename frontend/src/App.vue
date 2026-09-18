<template>
  <router-view />
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { onBeforeMount } from 'vue';

const $q = useQuasar();

onBeforeMount(() => {
  const theme = localStorage.getItem('theme');

  if (theme === 'dark') {
    $q.dark.set(true);
  } else {
    $q.dark.set(false);
  }
});
</script>
