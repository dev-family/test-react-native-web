import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import Post from './post.js'
import UserPostOption from './user_post_option.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

export default class PostOption extends BaseModel {
  @column({ isPrimary: true })
  //@required
  declare id: number

  @column()
  //@required
  declare option: string

  @column()
  declare postId: number

  @hasMany(() => UserPostOption, { foreignKey: 'optionId' })
  declare userOptions: HasMany<typeof UserPostOption>

  @belongsTo(() => Post, { localKey: 'postId' })
  declare post: BelongsTo<typeof Post>

  @column.dateTime({ autoCreate: true })
  //@required
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  //@required
  declare updatedAt: DateTime
}
