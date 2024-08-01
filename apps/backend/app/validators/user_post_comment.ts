import vine from '@vinejs/vine'
import { ExtractSchemaType } from './types.js'

export const createPostCommentValidator = vine.compile(
  vine.object({
    comment: vine.string().maxLength(300),
  })
)

export type CreateCommentData = ExtractSchemaType<typeof createPostCommentValidator>
