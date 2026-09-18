<template>
  <main class="mx-auto max-w-7xl py-20 px-20">
    <h1>Solution Details</h1>

    <q-card class="p-6 dark:bg-gray-800 border-y-2 shadow-none q-mt-md" v-if="learning">
      <div class="flex flex-nowrap justify-end">
      <q-btn flat rounded icon="arrow_back" @click="router.back()" class="mb-2 pr-2 pl-2" />
      </div>

      <h2 class="text-2xl text-teal-900 dark:text-blue-500 font-semibold mb-2">
        {{ learning.title }}
      </h2>

      <p class="text-sm mb-4">
        {{ displayedDescription }}
      </p>

      <span class="font-semibold text-md mt-5">{{ $t('solutions.exampleCodeError') }}</span>
      <article class="bg-slate-900 text-white p-4 rounded font-mono text-sm overflow-x-auto flex">
        <pre style="word-break: break-word; white-space: pre-wrap">
        <code v-html="highlightedCodeSol"></code></pre>
      </article>
      <br />
      <span class="font-semibold text-md">{{ $t('solutions.exampleCodeCorrect') }}</span>
      <article class="bg-slate-900 text-white p-4 rounded font-mono text-sm overflow-x-auto flex">
        <pre style="word-break: break-word; white-space: pre-wrap">
        <code v-html="highlightedCode"></code>
      </pre>
      </article>
      <span class="text-caption text-grey mt-4 mb-1">{{ learning.category }}:</span>
      <div v-if="needsTranslation" class="flex justify-between mb-10">
        <div v-if="needsTranslation"></div>
        <q-btn
          flat
          class="btn"
          :label="$t('translate.communityTranslations')"
          @click="openTranslates"
        />
      </div>
    </q-card>

    <q-separator class="my-4" />

    <h3 class="text-base font-bold mb-2">{{ $t('solutions.comments') }}</h3>

    <q-form @submit="submitComment" class="flex flex-nowrap gap-1 mt-2">
      <q-input
        v-model="text"
        type="textarea"
        :placeholder="$t('solutions.whriteComment')"
        autogrow
        outlined
        class="flex-grow"
      >
        <div class="content-end mb-2">
          <q-btn type="submit" :label="$t('solutions.send')" color="primary" class="h-5" />
        </div>
      </q-input>
    </q-form>

    <section
      v-for="comment in comments"
      :key="comment.id"
      class="mt-5 p-3 border-y-2 dark:bg-gray-800 rounded-md"
    >
    <span class="text-caption text-grey">
      <span class="text-sm font-bold text-slate-900">{{ getAuthorName(comment.authorId) }} </span> {{ comment.createdAt }}
    </span>
      <p class="text-body2">{{ comment.text }}</p>
    </section>

    <q-dialog v-model="dialogOpen">
      <q-card style="width: 800px">
        <q-card-section class="bg-cyan-900 text-white">
          <div class="font-bold text-xl">{{ $t('translate.communityTranslations') }}</div>

          <div class="text-caption">{{ $t('translate.chooseTranslation') }}</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-card v-for="item in translations" :key="item.id" bordered class="shadow-none">
            <section class="flex flex-nowrap justify-end">
              <q-btn
                v-if="item.authorId === currentUserId"
                flat
                round
                icon="edit"
                @click="editTranslation(item)"
              />
              <q-btn
                v-if="item.authorId === currentUserId"
                flat
                round
                dense
                icon="delete"
                class="text-red-500"
                @click="deleteTranslations(item)"
              />
            </section>

            <q-card-section>
              <span class="text-caption text-primary mb-2">
                {{ $t('translate.language') }}: ({{ item.locale }})
              </span>

              <span class="text-lg line-clamp-3">
                {{ item.text }}
              </span>

              <p class="text-caption text-grey">
                {{ $t('translate.translationBy') }}: {{ getAuthorName(item.authorId) }}
              </p>
            </q-card-section>

            <q-card-actions>
              <q-btn
                flat
                :label="$t('translate.useThisTranslation')"
                class="bg-orange-500 hover:bg-orange-700 text-white w-full"
                @click="selectTranslation(item)"
              />
            </q-card-actions>
          </q-card>

          <div v-if="translations.length === 0" class="text-grey text-center">
            {{ $t('translate.noTranslation') }}
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            outline
            class="hover:text-orange-500 dark:hover:text-orange-500 dark:text-white text-gray-950 font-normal"
            :label="$t('translate.contributeTranslation')"
            @click="goToTranslation"
          />
          <q-btn flat :label="$t('translate.close')" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </main>
</template>

<script setup lang="ts">
import { currentUserId } from '@/services/auth/AuthService';
import { getUser } from '@/services/auth/AuthService';
import { createComment, getAllComments, gettCommentByLearning } from '@/services/CommentService';
import { getLearning } from '@/services/LearningService';
import {
  deleteTranslation,
  getTranslationByLearning,
  getTranslationByLocale,
} from '@/services/locale/TranslateService';
import { getUsers } from '@/services/auth/UsersService';
import type { Comment } from '@/types/Comment';
import type { Learning } from '@/types/Learning';
import type { Translation } from '@/types/Translation';
import type { User } from '@/types/User';
import hljs from 'highlight.js';
import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

const highlightedCodeSol = computed(() => hljs.highlightAuto(learning.value?.solution ?? '').value);
const highlightedCode = computed(() => hljs.highlightAuto(learning.value?.problem ?? '').value);

const learning = ref<Learning | null>(null);
const router = useRouter();
const route = useRoute();
const { locale } = useI18n();
const translation = ref<Translation | null>(null);
const translations = ref<Translation[]>([]);
const users = ref<User[]>([]);
const comments = ref<Comment[]>([]);
const text = ref('');
const dialogOpen = ref(false);

async function submitComment() {
  if (!text.value.trim()) return;

  const learningId = String(route.params.id);

  await createComment({
    id: crypto.randomUUID(),
    learningId,
    text: text.value,
    authorId: getUser()!.id,
    createdAt: new Date().toLocaleDateString(),
  });

  comments.value = await getAllComments();

  text.value = '';
}

const displayedDescription = computed(() => {
  if (translation.value) {
    return translation.value.text;
  }

  return learning.value?.description ?? '';
});

const needsTranslation = computed(() => {
  if (!learning.value) {
    return false;
  }

  return learning.value.locale !== locale.value;
});

async function loadTranslation() {
  if (!learning.value) {
    return;
  }

  translation.value = null;

  if (needsTranslation.value) {
    translation.value = await getTranslationByLocale(learning.value.id, locale.value);
  }
}

async function goToTranslation() {
  const id = learning.value!.id;

  await router.push(`/translation/${id}`);
}

async function openTranslates() {
  const learningId = learning.value!.id;

  const allTranslations = await getTranslationByLearning(learningId);

  translations.value = allTranslations.filter((translation) => translation.locale === locale.value);

  dialogOpen.value = true;
}

function selectTranslation(selected: Translation) {
  translation.value = selected;
  dialogOpen.value = false;
}

async function editTranslation(item: Translation) {
  const learningId = learning.value!.id;

  await router.push(`/translation/${learningId}/edit/${item.id}`);
}

async function deleteTranslations(item: Translation) {
  await deleteTranslation(item.id);

  translations.value = translations.value.filter((translation) => translation.id !== item.id);

  if (translation.value?.id === item.id) {
    translation.value = null;
  }
}

function getAuthorName(authorId: string): string {
  return users.value.find((u) => u.id === authorId)?.name ?? 'Unknown';
}

watch(locale, async () => {
  await loadTranslation();
});

onMounted(async () => {
  const id = String(route.params.id);
  learning.value = await getLearning(id);

  if (needsTranslation.value) {
    translation.value = await getTranslationByLocale(id, locale.value);
  }

  await loadTranslation();
  await gettCommentByLearning(id);
  users.value = await getUsers();
  comments.value = await getAllComments();
});
</script>
