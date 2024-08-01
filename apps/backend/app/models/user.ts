import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany, scope } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import db from '@adonisjs/lucid/services/db'
import UserCoin from './user_coin.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email', 'username'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @hasMany(() => UserCoin, { foreignKey: 'userId' })
  declare coins: HasMany<typeof UserCoin>

  @column({ isPrimary: true })
  //@required
  declare id: number

  @column()
  declare firstName: string | null

  @column()
  //@required
  declare lastName: string | null

  @column()
  //@required
  declare email: string

  @column()
  //@required
  declare username: string

  @column({ serializeAs: null })
  //@required
  declare password: string

  @column.dateTime({ autoCreate: true })
  //@required
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  //@required
  declare updatedAt: DateTime | null

  static accessTokens = DbAccessTokensProvider.forModel(User)
}
