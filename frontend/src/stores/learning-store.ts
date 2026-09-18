import { currentUserId } from '@/services/auth/AuthService';
import {
  createLearning,
  deleteLearning,
  getAllLearnings,
  updateLearning,
} from '@/services/LearningService';
import type { Learning, LearningCreate } from '@/types/Learning';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useLearningStore = defineStore('learning', () => {
  const learnings = ref<Learning[]>([]);

  const loading = ref(false);

  const fetchLearnings = async () => {
    try {
      loading.value = true
      learnings.value = await getAllLearnings();

      return learnings.value || []
    } catch {
      console.log('Erro')
    } finally {
      loading.value = false
    }

  };

  const getLearnings = async () => {
    if (learnings.value.length > 0) {
      return learnings.value;
    }

    console.log('Erro')
    return await fetchLearnings();
  };

  const myLearnings = computed(() => learnings.value.filter((l) => l.authorId === currentUserId.value))

  const addLearning = async (learning: LearningCreate): Promise<void> => {
    const newLearning = await createLearning(learning);
    learnings.value.push(newLearning);
  };

  const editLearning = async (id: string, learning: Partial<Learning>): Promise<void> => {
    const updated = await updateLearning(id, learning);
    const index = learnings.value.findIndex((l) => l.id === id);
    if (index !== -1) learnings.value[index] = updated;
  };

  const removeLearning = async (id: string): Promise<void> => {
    await deleteLearning(id);
    learnings.value = learnings.value.filter((l) => l.id !== id);
  };

  return { learnings, myLearnings, loading, fetchLearnings, getLearnings, addLearning, editLearning, removeLearning };
});
