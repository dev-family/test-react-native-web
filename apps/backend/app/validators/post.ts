import vine from '@vinejs/vine'
import { ExtractSchemaType } from './types.js'

export const createPostValidator = vine.compile(
  vine.object({
    title: vine.string().minLength(1),
    description: vine.string(),
    options: vine.array(vine.string()),
    tagId: vine.number().optional(),
  })
)

export const createPostReactionValidator = vine.compile(
  vine.object({
    like: vine.boolean(),
  })
)

export const createPostVoteValidator = vine.compile(
  vine.object({
    optionId: vine.string(),
  })
)

export const createPostTagValidator = vine.compile(
  vine.object({
    tag: vine.string().minLength(2),
  })
)
export type CreatePostData = ExtractSchemaType<typeof createPostValidator>
export type SetPostReactionData = ExtractSchemaType<typeof createPostReactionValidator>
export type PostVoteData = ExtractSchemaType<typeof createPostVoteValidator>
