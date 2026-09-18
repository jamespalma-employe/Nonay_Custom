interface CommentBase {
    id: string,
    learningId: string
    text: string,
    authorId: string,
    createdAt: string
}

export interface Comment extends CommentBase {
    id: string,
    learningId: string,
    authorId: string,
    createdAt: string
}

export type CommentCreate = CommentBase 