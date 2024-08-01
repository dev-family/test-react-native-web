import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Post from './post.js'
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class UserPostLike extends BaseModel {
  @column({ isPrimary: true })
  //@required
  declare id: number

  @column()
  //@required
  declare like: boolean

  @column()
  //@required
  declare postId: number

  @column()
  //@required
  declare userId: number

  @belongsTo(() => Post, { foreignKey: 'postId' })
  declare post: BelongsTo<typeof Post>

  @belongsTo(() => User, { foreignKey: 'userId' })
  //@required
  declare user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  //@required
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  //@required
  declare updatedAt: DateTime
}
