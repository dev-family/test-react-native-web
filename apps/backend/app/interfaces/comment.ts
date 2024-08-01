import { UserInterface } from './user.js'

export interface CommentInterface {
  id: number
  postId: number
  user: UserInterface
  comment: string
  createdAt: string
  deletedAt: string
  replyId?: number
  repliesAmount?: number
}

export interface CommentPaginatedInterface {
  data: CommentInterface[]
}
