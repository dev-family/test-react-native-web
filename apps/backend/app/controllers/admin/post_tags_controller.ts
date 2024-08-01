import PostTag from '#models/post_tag'
import PostService from '#services/post_service'
import { createPostTagValidator } from '#validators/post'
import cache from '@adonisjs/cache/services/main'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class PostTagsController {
  constructor(protected postService: PostService) {}

  async create({ request }: HttpContext) {
    const body = await request.validateUsing(createPostTagValidator)
    const tag = await this.postService.createTag(body.tag)

    return tag
  }

  /*
   * @getAll
   * @responseBody 200 - <PostTagInterface[]>
   */
  async getAll() {
    const tags = await cache.getOrSetForever('post_tags', async () => await PostTag.all())
    return tags
  }
}
