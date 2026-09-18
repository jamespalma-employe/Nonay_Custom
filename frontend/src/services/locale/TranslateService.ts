import type { Translation, TranslationCreate } from '@/types/Translation';
import Api from '../interceptors/Api';

export async function getAllTranslations(): Promise<Translation[]> {
  const res = await Api.get('/translations');

  return res.data;
}

export async function getTranslation(id: string): Promise<Translation> {
  const res = await Api.get(`/translations/${id}`);

  if (!res.data) {
    throw new Error('Translation not found');
  }

  return res.data;
}

export async function getTranslationByLearning(learningId: string): Promise<Translation[]> {
  const res = await Api.get(`/translations?learningId=${learningId}`);

  return res.data;
}

export async function getTranslationByLocale(
  learningId: string,
  locale: string,
): Promise<Translation | null> {
  const res = await Api.get(`/translations?learningId=${learningId}&locale=${locale}`);

  return res.data[0] ?? null;
}

export async function createTranslation(translation: TranslationCreate): Promise<Translation> {
  const res = await Api.post('/translations', translation);

  return res.data;
}

export async function updateTranslation(
  id: string,
  translation: Partial<Translation>,
): Promise<Translation> {
  const res = await Api.patch(`/translations/${id}`, translation);

  return res.data;
}

export async function deleteTranslation(id: string): Promise<void> {
  await Api.delete(`/translations/${id}`);
}
