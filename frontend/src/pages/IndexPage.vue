<template>
  <main class="mx-auto max-w-7xl py-7 px-6">
    <h1 class="text-xl m-2">{{ $t('home.dashboard') }}</h1>

    <article class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <q-card
        v-for="stat in stats"
        :key="stat.label"
        class="p-5 card-dashboard text-center shadow-md"
      >
        <q-icon :name="stat.icon" :color="stat.color" size="40px" class="mb-2" />
        <p class="text-caption text-slate-700 dark:text-white">{{ $t(stat.label) }}</p>
        <span class="text-h3 font-semibold dark:text-white">{{ stat.value }}</span>
      </q-card>
    </article>

    <h2 class="text-lg m-2">{{ $t('home.latestLearnings') }}</h2>
    <article class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
      <card
        flat
        v-for="learning in recentLearnings"
        :key="learning.id"
        noCaps
        class="btn-dashboard rounded-md shadow-md"
      >
        <router-link :to="`/learning/${learning.id}`" class="flex justify-between items-start">
          <span class="post-title-link line-clamp-3">{{ learning.title }}</span>
        </router-link>
        <span class="text-caption opacity-65">
          {{ $t('solutions.createdAt') }}: {{ learning.createdAt }}
        </span>
      </card>
    </article>
  </main>
</template>

<script setup lang="ts">
import { useLearningStore } from '@/stores/learning-store';
import { computed, onMounted } from 'vue';


const learningStore = useLearningStore();


const stats = computed(() => [
  {
    label: 'home.totalLearningsOnThePlataform',
    icon: 'checklist',
    color: 'positive',
    value: learningStore.learnings.length,
  },
  {
    label: 'home.yourLearnings',
    icon: 'list_alt',
    color: 'primary',
    value: learningStore.myLearnings.length,
  },
  {
    label: 'home.authors',
    icon: 'person_pin',
    color: 'secondary',
    value: new Set(learningStore.learnings.map((l) => l.authorId)).size,
  },
  {
    label: 'home.solutions',
    icon: 'emoji_objects',
    color: 'warning',
    value: learningStore.learnings.filter((l) => l.solution).length,
  },
]);

const recentLearnings = computed(() =>
  [...learningStore.myLearnings]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5),
);

onMounted(async () => {
  if (learningStore.learnings.length === 0) await learningStore.getLearnings();
});
</script>
