import Api from "./interceptors/Api";
import type { Learning, LearningCreate } from "@/types/Learning";

export async function getAllLearnings(): Promise<Learning[]> {
    const res = await Api.get('/learning')
    return res.data
}

export async function getLearning(id: string): Promise<Learning> {
  const res = await Api.get(`/learning/${id}`);

  if (!res.data) {
    throw new Error('Learning not found');
  }

  return res.data;
}

export async function createLearning(learning: LearningCreate): Promise<Learning> {
    const newLearning = {
        ...learning,
        createdAt: new Date().toLocaleDateString()
    }

    const res = await Api.post('/learning', newLearning)
    
    return res.data
}

export async function updateLearning(id: string, learning: Partial<LearningCreate>): Promise<Learning> {
    const res = await Api.patch(`/learning/${id}`, learning)
    return res.data
}

export async function deleteLearning(id: string): Promise<void> {
    await Api.delete(`/learning/${id}`)
}