import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { createPostCommentValidator } from '#validators/user_post_comment'
import PostCommentService from '#services/post_comment_service'
import { PostCommentTransformer } from '#transformers/post_comment'

@inject()
export default class PostCommentsController {
  constructor(
    protected service: PostCommentService,
    protected transformer: PostCommentTransformer
  ) {}

  /**
   *
   * @leaveComment
   * @requestBody - <createPostCommentValidator>
   * @paramPath postId - Post to leave a comment - @type(string) @required
   * @responseBody 200 - <CommentInterface>
   *
   */
  async leaveComment({ params, auth, request }: HttpContext) {
    const postId = +params.postId
    const user = auth.getUserOrFail()

    const { comment } = await request.validateUsing(createPostCommentValidator)

    const result = await this.service.create(postId, user, comment)

    return this.transformer.transform(result)
  }

  /**
   *
   * @getCommentsByPostId
   * @paramPath postId - Post to leave a comment - @type(string) @required
   * @responseBody 200 - <CommentPaginatedInterface>
   * @paramQuery page - Pagination - @type(string)
   */
  async getCommentsByPostId({ params, request }: HttpContext) {
    const postId = +params.postId

    const page = request.input('page', 1)
    const data = await this.service.getByPost({ postId, page })

    return this.transformer.transformPaginate(data)
  }

  /**
   * @removeComment
   * @paramPath postId - Post to leave a comment - @type(string) @required
   * @paramPath commentId - Comment to delete - @type(string) @required
   * @responseBody 200 - <CommentInterface>
   */
  async removeComment({ request, response, auth }: HttpContext) {
    const postId = request.params()?.postId

    if (!postId) {
      return response.status(400).send({ error: 'Post ID is not provided' })
    }

    const commentId = request.params()?.commentId

    if (!commentId) {
      return response.status(400).send({ error: 'Comment ID is not provided' })
    }

    const user = auth.getUserOrFail()
    const result = await this.service.destroy(+postId, +commentId, user)

    if (!result) {
      return response.status(400).send({ error: 'Cannot delete comment' })
    }

    return this.transformer.transform(result)
  }

  reportComment({}: HttpContext) {}

  /**
   * @replyComment
   * @requestBody - <createPostCommentValidator>
   * @paramPath postId - Post to leave a comment - @type(string) @required
   * @paramPath commentId - Comment to delete - @type(string) @required
   * @responseBody 200 - <CommentInterface>
   */
  async replyComment({ request, response, auth }: HttpContext) {
    const postId = request.params()?.postId

    if (!postId) {
      return response.status(400).send({ error: 'Post ID is not provided' })
    }

    const commentId = request.params()?.commentId
    if (!commentId) {
      return response.status(400).send({ error: 'Comment ID is not provided' })
    }

    const user = auth.getUserOrFail()
    const { comment } = await request.validateUsing(createPostCommentValidator)
    const result = await this.service.reply(+postId, +commentId, user, comment)

    if (!result) {
      return response.status(400).send({ error: 'Cannot delete another user comment' })
    }

    return this.transformer.transform(result)
  }

  /**
   * @getCommentReplies
   * @requestBody - <createPostCommentValidator>
   * @paramPath postId - Post to leave a comment - @type(string) @required
   * @paramPath commentId - Comment to delete - @type(string) @required
   * @responseBody 200 - <CommentInterface[]>
   */
  async getCommentReplies({ request, response }: HttpContext) {
    const postId = request.params()?.postId

    if (!postId) {
      return response.status(400).send({ error: 'Post ID is not provided' })
    }

    const commentId = request.params()?.commentId
    if (!commentId) {
      return response.status(400).send({ error: 'Comment ID is not provided' })
    }

    const data = await this.service.getRepliesByComment(+postId, +commentId)

    return this.transformer.transformArray(data)
  }
}
