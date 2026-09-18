<template>
  <q-item
    clickable
    tag="a"
    v-ripple
    :to="link"
    exact
    active-class="text-orange-500 dark:bg-gray-950"
    class="hover:bg-gray-100 dark:hover:bg-gray-800"
  >
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ $t(label) }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
export interface EssentialLinkProps {
  label: string;
  link?: string;
  icon?: string;
}

withDefaults(defineProps<EssentialLinkProps>(), {
  link: '#',
  icon: '',
});
</script>
