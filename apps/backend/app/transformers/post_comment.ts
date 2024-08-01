import { CommentInterface } from '#interfaces/comment'
import UserPostComment from '#models/user_post_comment'
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model'

export class PostCommentTransformer {
  transform(comment: UserPostComment): CommentInterface {
    return {
      id: comment.id,
      deletedAt: comment.deletedAt?.toISO() || '',
      user: {
        id: comment.user.id,
        email: comment.user.email,
        username: comment.user.username,
        createdAt: comment.user.createdAt,
        firstName: comment.user.firstName!,
        lastName: comment.user.lastName!,
      },
      postId: comment.postId,
      repliesAmount: comment.replies?.length,
      replyId: comment?.replyId,
      comment: comment.comment,
      createdAt: comment.createdAt.toISO()!,
    }
  }

  transformArray(comments: UserPostComment[]): CommentInterface[] {
    return comments.map((comment) => ({
      id: comment.id,
      postId: comment.postId,
      comment: comment.comment,
      deletedAt: comment.deletedAt?.toISO?.() || '',
      user: {
        id: comment.user.id,
        email: comment.user.email,
        username: comment.user.username,
        createdAt: comment.user.createdAt,
        firstName: comment.user.firstName!,
        lastName: comment.user.lastName!,
      },
      repliesAmount: comment.replies?.length || 0,
      replyId: comment.replyId,
      createdAt: comment.createdAt.toISO?.()!,
    }))
  }

  transformPaginate(paginated: ModelPaginatorContract<UserPostComment>) {
    const data = paginated.all()
    const meta = paginated.getMeta()

    return { meta, data: this.transformArray(data as UserPostComment[]) }
  }
}
