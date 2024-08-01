import User from '#models/user'
import UserCoin from '#models/user_coin'
import { CreateAccountData, LoginData } from '#validators/auth'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'

@inject()
export default class AuthorizationService {
  constructor(protected context: HttpContext) {}

  async createAccount(data: CreateAccountData) {
    const { username, email } = data

    const isExistEmail = await User.findBy({ email })

    if (isExistEmail) {
      this.context.response.status(409).send({
        errors: [{ field: 'email', message: 'User with such email is already exists' }],
      })
      return
    }

    const isExistUsername = await User.findBy({ username })

    if (isExistUsername) {
      this.context.response.status(409).send({
        errors: [{ field: 'username', message: 'User with such username is already exists' }],
      })
      return
    }

    const user = await User.create(data)
    await UserCoin.create({ userId: user.id, amount: 100 })

    const token = await User.accessTokens.create(user)

    return {
      user,
      token: token.value!.release(),
    }
  }

  async login(data: LoginData) {
    const user = await User.findBy('username', data.username)

    if (!user) {
      this.context.response.status(400).send({ error: 'Wrong email or password ' })
      return
    }

    await hash.verify(user.password, data.password)

    const token = await User.accessTokens.create(user)

    return { user, token: token.value!.release() }
  }

  async logout(user: User, token: string | number | BigInt) {
    try {
      await User.accessTokens.delete(user, token)
    } catch (error) {
      this.context.response.status(400).send({ error: 'Cannot delete user access token' })
    }
  }
}
