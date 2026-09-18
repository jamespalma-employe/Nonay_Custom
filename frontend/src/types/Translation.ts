interface TranslationBase {
    id: string,
    learningId: string,
    locale: string,
    text: string,
    authorId: string,
}

export interface Translation extends TranslationBase {
    id: string,
    learningId: string,
    authorId: string
}

export type TranslationCreate = TranslationBase