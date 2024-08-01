import vine from '@vinejs/vine'
import { ExtractSchemaType } from './types.js'

export const updateUserValidator = vine.compile(
  vine.object({
    firstName: vine.string().maxLength(32).optional(),
    lastName: vine.string().maxLength(32).optional(),
    email: vine.string().email().optional(),
    username: vine.string().trim().minLength(5).maxLength(32).optional(),
  })
)

export type UpdateUserData = ExtractSchemaType<typeof updateUserValidator>
