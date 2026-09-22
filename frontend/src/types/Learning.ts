interface LearningBase {
  title: string,
  description: string,
  problem: string,
  solution: string,
  category: string[],
  authorId: string | null,
  locale: string
}

export interface Learning extends LearningBase {
  id: string;
  createdAt: string;
}

export type LearningCreate = LearningBase
