<template>
  <main class="mx-auto max-w-7xl py-7 px-6">
    <h1>{{ $t('home.dashboard') }}</h1>

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

    <h2>{{ $t('home.latestLearnings') }}</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 py-4">
      <q-btn
        flat
        v-for="learning in recentLearnings"
        :key="learning.id"
        @click="goToDetail(learning.id)"
        noCaps
        class="min-w-2xl max-w-2xl h-28 m-2 bg-slate-100 hover:bg-blue-100 rounded-md shadow-md"
      >
        <article>
          <p class="font-medium opacity-70 text-slate-900 text-base line-clamp-3">
            {{ learning.title }}
          </p>
          <span class="text-caption text-slate-500">
            {{ $t('solutions.createdAt') }}: {{ learning.createdAt }}
          </span>
        </article>
      </q-btn>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useLearningStore } from '@/stores/learning-store';
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const learningStore = useLearningStore();

async function goToDetail(id: string) {
  await router.push(`/learning/${id}`);
}

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
