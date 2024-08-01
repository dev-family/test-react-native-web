import Post from '#models/post'
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model'
import { PostInterface, PostsPaginatedInterface } from '../interfaces/posts.js'

export class PostTransformer {
  transform(post: Post): PostInterface {
    return {
      title: post.title,
      description: post.description,
      options: post.options.map((i) => ({
        total: +i.$extras.total,
        option: i.option,
        id: i.id,
        postId: i.post,
      })),
      user: {
        email: post.user.email,
        username: post.user.username,
        createdAt: post.user.createdAt,
        id: post.user.id,
        firstName: post.user.firstName!,
        lastName: post.user.lastName!,
      },
      id: post.id,
      total: +post.$extras.total,
      likes: post.likes,
      dislikes: post.dislikes,
      createdAt: post.createdAt.toISO()!,
      tag: post.tag,
      answer: post?.userOptions?.[0]?.optionId || undefined,
      isLiked: post?.userReactions?.[0]?.like,
    }
  }

  transformPaginate(paginated: ModelPaginatorContract<Post>): PostsPaginatedInterface {
    const data = paginated.all()
    const meta = paginated.getMeta()

    //@ts-ignore
    return { meta, data: this.transformArray(data as Post[]) }
  }

  transformArray(posts: Post[]): PostInterface[] {
    return posts.map((post) => {
      return {
        title: post.title,
        description: post.description,
        options: post.options.map((i) => ({
          total: +i.$extras.total,
          option: i.option,
          id: i.id,
          postId: i.post,
        })),
        user: {
          email: post.user.email,
          username: post.user.username,
          createdAt: post.user.createdAt,
          id: post.user.id,
          firstName: post.user.firstName!,
          lastName: post.user.lastName!,
        },
        id: post.id,
        total: +post.$extras.total,
        likes: post.likes,
        dislikes: post.dislikes,
        createdAt: post.createdAt.toISO()!,
        answer: post.userOptions?.[0]?.optionId,
        tag: post.tag,
        isLiked: post.userReactions?.[0]?.like,
      }
    })
  }
}
