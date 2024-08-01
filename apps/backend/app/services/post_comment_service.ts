import User from '#models/user'
import UserPostComment from '#models/user_post_comment'
import { inject } from '@adonisjs/core'
import ws from './ws.js'
import UserCoin from '#models/user_coin'
import Post from '#models/post'
import { DateTime } from 'luxon'
@inject()
export default class PostCommentService {
  async create(postId: number, user: User, comment: string) {
    const data = await UserPostComment.create({ comment, postId, userId: user.id })
    await data.load('user')
    await data.load('replies')

    await UserCoin.create({ userId: user.id, amount: 1 })

    const post = await Post.findBy({ id: postId })

    if (post?.userId !== user.id) {
      await UserCoin.create({ userId: post?.userId, amount: 1 })
    }

    ws.io?.to(`post-${postId}`).emit('message:sent', data)

    return data
  }

  async getByPost({
    postId,
    page,
    perPage = 20,
  }: {
    postId: number
    page: number
    perPage?: number
  }) {
    const data = UserPostComment.query()
      .orderBy('createdAt', 'asc')
      .whereNull('replyId')
      .preload('user')
      .preload('replies')
      .where('postId', postId)
      .where((q) => q.whereNull('deletedAt').orHas('replies', '>', 0))

    return await data.paginate(page, perPage)
  }

  async destroy(postId: number, id: number, user: User) {
    const comment = await UserPostComment.findBy({ id, postId })

    if (comment?.userId !== user.id) {
      return false
    }

    await UserPostComment.query()
      .where({ postId, id })
      .update({ deletedAt: DateTime.now() })
      .firstOrFail()

    const result = await UserPostComment.findBy({ id })

    if (!result) return undefined

    await result.load('replies')
    await result.load('user')

    return result
  }

  async reply(postId: number, replyId: number, user: User, comment: string) {
    const reply = await UserPostComment.create({ postId, userId: user.id, replyId, comment })
    await reply.load('user')
    await reply.load('replies')

    await UserCoin.create({ userId: user.id, amount: 1 })

    const commentData = await Post.findBy({ id: replyId })

    if (commentData?.userId && commentData.userId !== user.id) {
      await UserCoin.create({ userId: commentData.userId, amount: 1 })
    }

    ws.io?.to(`post-${postId}`).emit('message:reply', reply)

    return reply
  }

  async getRepliesByComment(postId: number, commentId: number) {
    const replies = await UserPostComment.query()
      .where({ replyId: commentId, postId })
      .whereNull('deletedAt')
      .orderBy('createdAt', 'asc')
      .preload('user')

    return replies
  }
}
