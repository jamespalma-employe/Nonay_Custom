<template>
  <main class="mx-auto max-w-7xl py-7 px-6">
    <div class="flex justify-between items-center mb-3">
      <h1 class="text-xl m-2">{{ $t('sidebar.mySolutions') }}</h1>
      <q-btn
        flat
        noCaps
        :label="$t('solutions.post')"
        @click="openCreate"
        class="rounded-lg btn shadow-none p-2"
      />
    </div>

    <q-table
      :rows="learningStore.myLearnings"
      :columns="columns"
      row-key="id"
      :loading="learningStore.loading"
      grid
      hide-header
    >
      <template #item="props">
        <q-card flat class="w-full card mb-4 p-4 border-y-2 shadow-none">
          <section class="flex flex-nowrap justify-between items-start">
            <router-link
              :to="`/learning/${props.row.id}`"
              style="max-width: 990px"
              class="post-title-link"
            >
              {{ props.row.title }}
            </router-link>
            <q-separator />
            <article @click.stop>
              <q-btn
                flat
                round
                dense
                icon="edit"
                class="text-slate-900 dark:text-slate-50"
                @click="openEdit(props.row)"
              />
              <q-btn
                flat
                round
                dense
                icon="delete"
                class="text-red-500"
                @click="askDelete(props.row.id)"
              />
            </article>
          </section>
          <p>{{ props.row.description }}</p>
          <article class="flex justify-between text-caption mt-10">
            <article class="opacity-75 flex flex-wrap gap-1 mt-2">
              <q-chip v-for="category in props.row.category" :key="category" dense class="tag">
                {{ category }}
              </q-chip>
            </article>

            <article
              class="opacity-35 text-slate-950 dark:text-slate-300 flex flex-nowrap justify-end"
            >
              <span class="mr-6">{{ getAuthorName(props.row.authorId) }}</span>
              <span>{{ props.row.createdAt }}</span>
            </article>
          </article>
        </q-card>
      </template>
    </q-table>

    <q-dialog v-model="dialogOpen">
      <q-card style="width: 800px">
        <q-card-section class="font-medium text-white bg-cyan-900">
          <div class="text-xl font-bold flex items-center gap-2">
            <q-icon :name="isEditing ? 'edit' : 'add'" />
            {{ isEditing ? $t('solutions.editSolution') : $t('solutions.createSolution') }}
          </div>
        </q-card-section>
        <q-form @submit="handleSubmit">
          <q-card-section class="max-h-[50vh] scroll p-6">
            <fieldset class="q-gutter-md">
              <h2 class="text-lg">Title</h2>
              <q-input
                v-model="form.title"
                outlined
                autogrow
                dense
                :rules="[(val) => !!val || $t('post.TitleRequired')]"
                :label="$t('solutions.createSolution')"
                type="textarea"
              />
              <h2 class="text-lg">Description</h2>
              <q-input
                v-model="form.description"
                outlined
                autogrow
                dense
                :rules="[(val) => !!val || $t('post.DescriptionRequired')]"
                :label="$t('solutions.descriptionYourProblem')"
                type="textarea"
              />
              <q-separator />
              <textarea
                v-model="form.problem"
                rows="8"
                :placeholder="$t('solutions.pasteYourCodeIncorrect')"
                class="w-full bg-gray-900 text-white font-mono text-sm p-4 rounded outline-none"
              ></textarea>
              <textarea
                v-model="form.solution"
                rows="8"
                :placeholder="$t('solutions.pasteYourCodeCorrect')"
                class="w-full bg-gray-900 text-white font-mono text-sm p-4 rounded outline-none"
              ></textarea>

              <h2 class="text-lg">Categorys</h2>

              <q-input
                v-model="newCategory"
                :label="$t('solutions.addCategory')"
                dense
                outlined
                @keydown.enter.prevent="addTag"
              />

              <q-chip
                v-for="(category, index) in form.category"
                :key="category"
                removable
                color="primary"
                text-color="white"
                @remove="form.category.splice(index, 1)"
              >
                {{ category }}
              </q-chip>
            </fieldset>
          </q-card-section>

          <q-separator />

          <q-card-actions class="flex justify-end gap-2">
            <q-btn flat no-caps :label="$t('solutions.cancel')" @click="handleCancel" />
            <q-btn
              type="submit"
              :label="$t('solutions.save')"
              class="px-8 w-32 bg-orange-500 hover:bg-orange-700 text-white"
              no-caps
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    <q-dialog v-model="confirmDeleteOpen">
      <q-card class="p-4">
        <div class="text-lg font-bold mb-4">{{ $t('solutions.deleteThisLearning') }}</div>
        <div class="flex justify-end gap-2">
          <q-btn flat :label="$t('solutions.cancel')" v-close-popup />
          <q-btn
            color="negative"
            :label="$t('solutions.delete')"
            @click="confirmDelete"
            v-close-popup
          />
        </div>
      </q-card>
    </q-dialog>
  </main>
</template>

<script setup lang="ts">
import type { Learning, LearningCreate } from '@/types/Learning';
import type { User } from '@/types/User';
import type { QTableColumn } from 'quasar';
import { onMounted, reactive, ref } from 'vue';
import { getUser } from '@/services/auth/AuthService';
import { getUsers } from '@/services/auth/UsersService';
import { useLearningStore } from '@/stores/learning-store';
import { triggerNegative, triggerSuccess } from '@/utils/Notify';
import { useI18n } from 'vue-i18n';
import { getLearning } from '@/services/LearningService';

const dialogOpen = ref(false);
const learningStore = useLearningStore();
const users = ref<User[]>([]);
const newCategory = ref('');

const isEditing = ref(false);
const confirmDeleteOpen = ref(false);
const deletingId = ref<string | null>(null);

const editingId = ref<string | null>();
const { locale } = useI18n();

const form = reactive<LearningCreate>({
  title: '',
  description: '',
  problem: '',
  solution: '',
  category: [] as string[],
  authorId: null,
  locale: '',
});

// export interface Learning {
//     id: string,
//     title: string,
//     problem: string,
//     solution: string,
//     category: string,
//     authorId: number,
//     createdAt: string
// }

const columns: QTableColumn[] = [
  { name: 'title', label: 'Title', field: 'title', align: 'left', sortable: true },
  { name: 'problem', label: 'Problem', field: 'problem', align: 'left' },
  { name: 'solution', label: 'Solution', field: 'solution', align: 'left' },
  { name: 'category', label: 'Category', field: 'category', align: 'left' },
  { name: 'createdAt', label: 'Created At', field: 'createdAt', align: 'left', sortable: true },
];

function openCreate() {
  isEditing.value = false;
  editingId.value = '';
  form.title = '';
  form.description = '';
  form.problem = '';
  form.solution = '';
  form.category = [] as string[];
  dialogOpen.value = true;
}

function openEdit(learning: Learning) {
  isEditing.value = true;
  editingId.value = learning.id;
  form.title = learning.title;
  form.description = learning.description;
  form.problem = learning.problem;
  form.solution = learning.solution;
  form.category = learning.category;
  form.authorId = learning.authorId;
  dialogOpen.value = true;
}

function addTag() {
  const value = newCategory.value.trim();
  if (!value) return;

  const category = value.startsWith('#') ? value : `#${value}`;

  if (!form.category.includes(category)) {
    form.category.push(category);
  }

  newCategory.value = '';
}

function handleCancel() {
  dialogOpen.value = false;
}

async function handleSubmit() {
  try {
    if (isEditing.value && editingId.value != null) {
      await learningStore.editLearning(editingId.value, {
        ...form,
        description: form.description,
      });
      triggerSuccess('Learning updated');
      dialogOpen.value = false;

      return;
    }

    const userId = getUser()?.id;

    if (userId == null) {
      return;
    }

    await learningStore.addLearning({
      ...form,
      locale: locale.value,
      authorId: userId,
    });
    triggerSuccess('Learning created');
    dialogOpen.value = false;
  } catch {
    triggerNegative('Somenthing went wrong');
  }
}

function askDelete(id: string) {
  deletingId.value = id;
  confirmDeleteOpen.value = true;
}

async function confirmDelete() {
  if (!deletingId.value) return;
  try {
    await learningStore.removeLearning(deletingId.value);
    triggerSuccess('Learning deleted');
  } catch {
    triggerNegative('Somenthing went wrong');
  }
}

function getAuthorName(authorId: string): string {
  return users.value.find((u) => u.id === authorId)?.name ?? 'Unknown';
}

onMounted(async () => {
  try {
    console.log('erro');
    users.value = await getUsers();
    // Promise.all
    await learningStore.getLearnings();

    if (isEditing.value) {
      const existing = await getLearning(editingId.value as string);
      form.title = existing.title;
      form.description = existing.description;
      form.problem = existing.problem;
      form.solution = existing.solution;
      form.category = existing.category;
      form.locale = existing.locale;
    }
  } catch (err) {
    console.error(err);
  }
});
</script>
