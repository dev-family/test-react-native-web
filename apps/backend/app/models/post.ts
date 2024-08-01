import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany, hasManyThrough, hasOne } from '@adonisjs/lucid/orm'
import PostOption from './post_option.js'
import User from './user.js'
import UserPostLike from './user_post_like.js'
import UserPostComment from './user_post_comment.js'
import UserPostOption from './user_post_option.js'
import type { BelongsTo, HasMany, HasManyThrough, HasOne } from '@adonisjs/lucid/types/relations'
import PostTag from './post_tag.js'

export default class Post extends BaseModel {
  @column({ isPrimary: true })
  //@required
  declare id: number

  @column()
  //@required
  declare title: string

  @column()
  //@required
  declare tagId: number

  @column()
  //@required
  declare description: string

  @column()
  //@required
  declare userId: number

  @hasMany(() => PostOption, { foreignKey: 'postId' })
  //@required
  declare options: HasMany<typeof PostOption>

  @belongsTo(() => PostTag, { foreignKey: 'tagId' })
  declare tag: BelongsTo<typeof PostTag>

  @hasMany(() => UserPostLike, { onQuery: (q) => q.where('like', true) })
  declare likes: HasMany<typeof UserPostLike>

  @hasMany(() => UserPostOption, { foreignKey: 'postId' })
  declare userOptions: HasMany<typeof UserPostOption>

  @hasMany(() => UserPostLike, { onQuery: (q) => q.where('like', false) })
  declare dislikes: HasMany<typeof UserPostLike>

  @hasMany(() => UserPostLike, { foreignKey: 'postId' })
  declare userReactions: HasMany<typeof UserPostLike>

  @belongsTo(() => User, { foreignKey: 'userId' })
  //@required
  declare user: BelongsTo<typeof User>

  @hasManyThrough([() => UserPostComment, () => User])
  declare comments: HasManyThrough<typeof UserPostComment>

  @column.dateTime({ autoCreate: true })
  //@required
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  //@required
  declare updatedAt: DateTime
}
