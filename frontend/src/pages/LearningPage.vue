<template>
  <main class="mx-auto max-w-7xl py-7 px-6">
    <h1>{{ $t('learning.allSolutions') }}</h1>

    <q-tabs v-model="activeTab" dense align="left" class="mb-4">
      <q-tab name="all" :label="$t('learning.all')" />
      <q-tab name="recent" :label="$t('learning.recent')" />
      <q-tab name="old" :label="$t('learning.old')" />
    </q-tabs>

    <q-table
      :rows="filteredLearnigs"
      :columns="columns"
      row-key="id"
      :loading="loading"
      :filter="search"
      grid
      hide-header
    >
      <template #item="props">
        <q-card
          class="w-full mb-4 p-4 cursor-pointer border-y-2 shadow-none"
          @click="goToDetail(props.row.id)"
        >
          <article>
            <div class="flex justify-between items-start">
              <span class="text-blue-500 font-medium text-xl break-all">{{ props.row.title }}</span>
            </div>
            <p class="text-body2">{{ props.row.description }}</p>
            <div class="flex justify-between text-caption text-slate-500 mt-10">
              <span class="bg-blue-500 text-white rounded-md p-1"> #{{ props.row.category }} </span>

              <div class="justify-end text-slate-900">
                <span class="mr-6">{{ getAuthorName(props.row.authorId) }}</span>
                <span>{{ props.row.createdAt }}</span>
              </div>
            </div>
          </article>
        </q-card>
      </template>
    </q-table>
  </main>
</template>

<script setup lang="ts">
import { getUsers } from '@/services/auth/UsersService';
import { useLearningStore } from '@/stores/learning-store';
import type { Learning } from '@/types/Learning';
import type { User } from '@/types/User';
import type { QTableColumn } from 'quasar';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const loading = ref(false);
const learningStore = useLearningStore();
const route = useRoute();
const router = useRouter();
const rows = ref<Learning[]>([]);
const users = ref<User[]>([]);
const activeTab = ref('all');

function parseDate(date: string) {
  const [day, month, year] = date.split('/');
  return new Date(`${year}-${month}-${day}`).getTime();
}

const filteredLearnigs = computed(() => {
  const learnings = rows.value;

  if (activeTab.value === 'recent') {
    return learnings.sort((a, b) => parseDate(b.createdAt) - parseDate(a.createdAt));
  }

  if (activeTab.value === 'old') {
    return learnings.sort((a, b) => parseDate(a.createdAt) - parseDate(b.createdAt));
  }

  return learnings;
});

const search = ref((route.query.q as string) || '');

watch(
  () => route.query.q,
  (newValue) => {
    search.value = (newValue as string) || '';
  },
);

const columns: QTableColumn[] = [{ name: 'title', label: 'Title', field: 'title', align: 'left' }];

async function goToDetail(id: number) {
  await router.push(`/learning/${id}`);
}

function getAuthorName(authorId: string): string {
  return users.value.find((u) => u.id === authorId)?.name ?? 'Unknown';
}

onMounted(async () => {
  try {
    loading.value = true;
    users.value = await getUsers();
    rows.value = (await learningStore.getLearnings()) || [];
  } finally {
    loading.value = false;
  }
});
</script>
