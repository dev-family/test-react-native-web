import type { HttpContext } from '@adonisjs/core/http'
import PostService from '#services/post_service'
import { inject } from '@adonisjs/core'
import { createPostReactionValidator } from '#validators/post'
import { PostParams } from '#types/posts'
import { PostTransformer } from '#transformers/post'

@inject()
export default class PostLikesController {
  constructor(
    protected postService: PostService,
    protected transformer: PostTransformer
  ) {}

  /*
   * @addReaction
   * @requestBody - <createPostReactionValidator>
   * @paramPath postId - Post to set reaction - @type(string) @required
   * @responseBody 200 - <PostInterface>
   */
  async addReaction({ auth, request, params }: HttpContext) {
    const user = auth.getUserOrFail()
    const { like } = await request.validateUsing(createPostReactionValidator)
    const { postId } = params as PostParams

    const post = await this.postService.reactToPost(+postId, user, like)

    if (!post) {
      return
    }
    return this.transformer.transform(post)
  }

  /*
   * @removeReaction
   * @paramPath postId - Post to remove reaction
   * @responseBody 200 - <PostInterface>
   */
  async removeReaction({ params, auth }: HttpContext) {
    const user = auth.getUserOrFail()
    const { postId } = params as PostParams

    const post = await this.postService.removeReaction(+postId, user)

    if (!post) {
      return
    }
    return this.transformer.transform(post)
  }
}
