import PostService from '#services/post_service'
import { PostTransformer } from '#transformers/post'
import { PostParams } from '#types/posts'
import { createPostValidator, createPostVoteValidator } from '#validators/post'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
@inject()
export default class PostsController {
  constructor(
    protected postService: PostService,
    protected transformer: PostTransformer
  ) {}

  /*
   * @index
   * @responseBody 200 - <PostsPaginatedInterface>
   * @paramQuery tagId - Tag to filter by - @type(string)
   * @paramQuery page - Pagination - @type(string)
   */
  async index({ request }: HttpContext) {
    const tagId = request.qs().tagId
    const page = request.input('page', 1)

    const data = await this.postService.get({ tagId, page })

    return this.transformer.transformPaginate(data)
  }

  /*
   * @store
   * @requestBody - <createPostValidator>
   * @responseBody 200 - <PostInterface>
   */
  async store({ auth, request }: HttpContext) {
    const user = auth.getUserOrFail()
    const data = await request.validateUsing(createPostValidator)
    const post = await this.postService.create(data, user.id)

    if (!post) {
      return
    }

    return this.transformer.transform(post)
  }

  /*
   * @show
   * @responseBody 200 - <PostInterface>
   */
  async show({ params, response }: HttpContext) {
    const post = await this.postService.getPostById(+params.id)

    if (!post) {
      response.status(404).send({ error: 'No post found' })
      return
    }

    return this.transformer.transform(post)
  }

  /**
   * Edit individual record
   */
  async edit({}: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({}: HttpContext) {}

  /*
   * @destroy
   * @paramPath id - Post to delete - @type(string) @required
   * @responseBody 200 - {result: string}
   */
  async destroy({ params }: HttpContext) {
    const id = params.id
    await this.postService.delete(+id)

    return { result: 'success' }
  }

  /*
   * @vote
   * @requestBody - <createPostVoteValidator>
   * @paramPath postId - Post to vote - @type(string) @required
   * @responseBody 200 - <PostInterface>
   */
  async vote({ auth, request, params, response }: HttpContext) {
    const { postId } = params as PostParams
    const { optionId } = await request.validateUsing(createPostVoteValidator)

    const user = auth.getUserOrFail()

    const post = await this.postService.vote(+postId, user, +optionId)

    if (!post) {
      response.status(404).send({ error: 'No post found' })
      return
    }

    return this.transformer.transform(post)
  }
}
