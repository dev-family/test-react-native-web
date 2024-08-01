import UserPostLike from '#models/user_post_like'
import { PostOptionInterface } from './post_option.js'
import { PostTagInterface } from './post_tag.js'
import { UserInterface } from './user.js'

export interface PostInterface {
  id: number
  title: string
  description: string
  options: PostOptionInterface[]
  user: UserInterface
  total: number
  dislikes: UserPostLike[]
  likes: UserPostLike[]
  createdAt: string
  answer?: number
  tag: PostTagInterface
  isLiked?: boolean
}

export interface PostsPaginatedInterface {
  // meta: {
  //   total: number
  //   perPage: number
  //   currentPage: number
  //   lastPage: number
  //   firstPage: number
  //   firstPageUrl: string
  //   lastPageUrl: string
  //   nextPageUrl: string
  //   previousPageUrl: string
  // }
  data: PostInterface[]
}
