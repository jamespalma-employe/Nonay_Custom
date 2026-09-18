import Api from "./interceptors/Api";
import type { Comment, CommentCreate } from "@/types/Comment";

export async function getAllComments(): Promise<Comment[]> {
    const res = await Api.get('/comments')

    return res.data
}

export async function getComment(id: string): Promise<Comment> {
    const res = await Api.get(`/comments/${id}`)

    if(!res.data) {
        throw new Error('Comment not found')
    }

    return res.data
}

export async function gettCommentByLearning(learningId: string): Promise<Comment[]> {
     const res = await Api.get(`/comments?learningId:eq=${learningId}`)

     return res.data
}

export async function createComment(comments: CommentCreate): Promise<Comment> {
    const res = await Api.post(`/comments`, comments)

    return res.data
}

