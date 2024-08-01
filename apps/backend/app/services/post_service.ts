import Post from '#models/post'
import PostOption from '#models/post_option'
import User from '#models/user'
import UserPostLike from '#models/user_post_like'
import UserPostOption from '#models/user_post_option'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import PostTag from '#models/post_tag'
import cache from '@adonisjs/cache/services/main'
import UserCoin from '#models/user_coin'
import type { CreatePostData } from '#validators/post'
import UserService from './user_service.js'

@inject()
export default class PostService {
  constructor(
    protected ctx: HttpContext,
    protected users: UserService
  ) {}

  async get({ tagId, page, perPage = 10 }: { tagId?: string; page: number; perPage?: number }) {
    const user = this.ctx.auth.getUserOrFail()

    const query = Post.query()
      .orderBy('createdAt', 'desc')
      .withCount('userOptions', (q) => q.as('total'))
      .preload('options', (q) => {
        q.withCount('userOptions', (oq) => oq.as('total'))
      })
      .preload('user')
      .preload('likes')
      .preload('dislikes')
      .preload('userOptions', (q) => q.where('userId', user.id))
      .preload('tag')
      .preload('userReactions', (q) => q.where('userId', user.id))

    if (tagId) {
      query.where('tagId', +tagId)
    }

    return await query.paginate(page, perPage)
  }

  async getPostById(id: number) {
    const post = await Post.findBy('id', id)

    if (!post) {
      this.ctx.response.status(404).send({ error: 'No post found' })
      return
    }

    const user = this.ctx.auth.getUserOrFail()

    await post.loadCount('userOptions', (b) => b.as('total'))

    await post.load('options', (q) => {
      q.withCount('userOptions', (oq) => oq.as('total'))
    })
    await post.load('user')
    await post.load('likes')
    await post.load('dislikes')
    await post.load('userOptions', (q) => q.where('userId', user.id))
    await post.load('tag')
    await post.load('userReactions', (q) => q.where('userId', user.id))

    return post
  }

  async create(data: CreatePostData, userId: number) {
    const { title, description } = data

    const user = await this.users.getById(userId)

    if (+user.$extras.balance < 30) {
      this.ctx.response.status(400).send({ error: 'Insufficient founds' })
      return
    }

    const post = await Post.create({
      title,
      description,
      userId,
      tagId: data.tagId ? +data.tagId : undefined,
    })

    await PostOption.createMany(data.options.map((option) => ({ option, post_id: post.id })))

    await UserCoin.create({ amount: -30, userId })

    const result = await this.getPostById(post.id)

    return result!
  }

  async vote(postId: number, user: User, optionId: number) {
    const options = await PostOption.findManyBy('postId', postId)
    const isCorrectOption = !!options.find((i) => i.id === optionId)

    if (!isCorrectOption) {
      this.ctx.response.status(400).send({ error: 'Incorrect poll option' })
      return
    }

    const isUserVotedThisOption = await UserPostOption.findBy({ userId: user.id, postId })

    if (isUserVotedThisOption?.id) {
      this.ctx.response.status(400).send({ error: 'You have already voted' })
      return
    }

    await UserPostOption.create({ postId, userId: user.id, optionId })

    const post = await this.getPostById(postId)

    if (post?.user.id !== user.id) {
      await UserCoin.create({ userId: user.id, amount: 5 })
    }

    return post
  }

  async createTag(value: string) {
    const tag = await PostTag.create({ value })

    const tags = await PostTag.all()
    await cache.setForever('post_tags', tags)

    return tag
  }

  async reactToPost(postId: number, user: User, like: boolean) {
    await UserPostLike.updateOrCreate({ postId, userId: user.id }, { like })
    const post = await this.getPostById(postId)
    return post
  }

  async removeReaction(postId: number, user: User) {
    await UserPostLike.query().where({ postId, userId: user.id }).delete()

    const post = await this.getPostById(postId)
    return post
  }

  async delete(id: number) {
    await Post.query().where('id', id).delete()
  }
}
