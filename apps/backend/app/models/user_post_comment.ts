import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import User from './user.js'
import Post from './post.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

export default class UserPostComment extends BaseModel {
  @column({ isPrimary: true })
  //@required
  declare id: number

  @column()
  //@required
  declare userId: number

  @column()
  declare replyId: number

  @column()
  declare comment: string

  @column()
  //@required
  declare postId: number

  @hasMany(() => UserPostComment, { foreignKey: 'replyId' })
  declare replies: HasMany<typeof UserPostComment>

  @belongsTo(() => User, { foreignKey: 'userId' })
  //@required
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Post, { foreignKey: 'postId' })
  declare post: BelongsTo<typeof Post>

  @column.dateTime({ autoCreate: true })
  //@required
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  //@required
  declare updatedAt: DateTime

  @column.dateTime()
  declare deletedAt: DateTime | null
}
