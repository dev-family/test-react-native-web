import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import Post from './post.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class PostTag extends BaseModel {
  @column({ isPrimary: true })
  //@required
  declare id: number

  @column()
  //@required
  declare value: string

  @hasMany(() => Post, { foreignKey: 'tagId' })
  declare posts: HasMany<typeof Post>

  @column.dateTime({ autoCreate: true })
  // @required
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
