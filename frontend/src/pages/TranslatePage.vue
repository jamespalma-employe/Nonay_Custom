<template>
  <main class="mx-auto max-w-7xl py-7 px-6">
    <div class="max-w-2xl mx-auto">
      <q-card class="shadow-2">
        <q-card-section class="bg-cyan-900 text-white">
          <h1 class="text-slate-50">{{isEditing ? $t('translate.editTranslation') : $t('translate.contributeTranslation')}}</h1>
        </q-card-section>

        <q-card-section class="p-6">
          <span class="text-captuib text-grey mb-2">{{$t('translate.originalDescription')}}</span>

          <p class="text-body1 q-mb-lg">
            {{ learning?.description }}
          </p>

          <q-separator class="q-mb-lg" />

          <span class="text-caption text-grey mb-2">{{$t('translate.translation')}} - ( {{ locale }} )</span>

          <q-input
            v-model="text"
            type="textarea"
            outlined
            autogrow
            :label="$t('translate.translation')"
            :rules="[(val) => !!val || 'Translation is required']"
          />

          <section class="flex gap-2 q-mt-lg">
            <q-btn flat :label="$t('translate.cancel')" class="col" @click="router.back()" />
            <q-btn
              :label="isEditing ? 'Save changes' : $t('translate.submitTranslation')"
              color="primary"
              class="col btn"
              :loading="isSubmitting"
              :disable="isSubmitting"
              @click="submitTranslation"
            />
          </section>
        </q-card-section>
      </q-card>
    </div>
  </main>
</template>

<script setup lang="ts">
import { getUser } from '@/services/auth/AuthService';
import { getLearning } from '@/services/LearningService';
import { createTranslation, getTranslation, updateTranslation } from '@/services/locale/TranslateService';
import type { Learning } from '@/types/Learning';
import { triggerNegative, triggerSuccess } from '@/utils/Notify';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const learning = ref<Learning | null>(null);
const { locale } = useI18n();
const text = ref('');
const isSubmitting = ref(false);
const isEditing = ref(false)

async function submitTranslation() {

  if (!text.value.trim()) {
    triggerNegative('Translation is required');
    return;
  }

  isSubmitting.value = true;

  try {
    const learningId = String(route.params.learningId)
    const translationId = route.params.translationId

    if(isEditing.value && translationId) {
      await updateTranslation(String(translationId), { text: text.value})
    } else {
      await createTranslation({
        id: crypto.randomUUID(),
        learningId,
        locale: locale.value,
        text: text.value,
        authorId: getUser()!.id
      })
    }

    triggerSuccess( isEditing.value ? 'Translation updated' : 'Translation submitted')
    await router.push(`/learning/${learningId}`)
  } catch {
    triggerNegative('Could not submit translation')
  }
}

onMounted(async () => {
  const learningId = String(route.params.learningId);
  const translationId = route.params.translationId

  learning.value = await getLearning(learningId);

  if(translationId) {
    isEditing.value = true

    const translation = await getTranslation(String(translationId))

    text.value = translation.text
  }
});
</script>
