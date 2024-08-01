import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Post from './post.js'
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import PostOption from './post_option.js'

export default class UserPostOption extends BaseModel {
  @column({ isPrimary: true })
  //@required
  declare id: number

  @column()
  declare userId: number

  @column()
  declare postId: number

  @column()
  //@required
  declare optionId: number

  @belongsTo(() => PostOption, { foreignKey: 'optionId' })
  declare postOption: BelongsTo<typeof PostOption>

  @belongsTo(() => Post, { foreignKey: 'postId' })
  declare post: BelongsTo<typeof Post>

  @belongsTo(() => User, { foreignKey: 'userId' })
  declare user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  //@required
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  //@required
  declare updatedAt: DateTime
}
