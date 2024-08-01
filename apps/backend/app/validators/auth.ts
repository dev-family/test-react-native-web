import vine from '@vinejs/vine'
import { ExtractSchemaType } from './types.js'

export const createAccountValidator = vine.compile(
  vine.object({
    username: vine.string().trim().minLength(5).maxLength(32),
    email: vine.string().email(),
    password: vine.string().minLength(8).maxLength(32),
  })
)

export const loginValidator = vine.compile(
  vine.object({
    username: vine.string(),
    password: vine.string(),
  })
)

export type CreateAccountData = ExtractSchemaType<typeof createAccountValidator>
export type LoginData = ExtractSchemaType<typeof loginValidator>
