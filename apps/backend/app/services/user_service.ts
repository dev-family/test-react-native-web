import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { UpdateUserData } from '#validators/user'

@inject()
export default class UserService {
  constructor(protected ctx: HttpContext) {}

  async getById(id: number) {
    const user = await User.query()
      .where('id', id)
      .withAggregate('coins', (q) => {
        q.sum('amount').as('balance')
      })
      .firstOrFail()

    return user
  }

  async update(id: number, data: UpdateUserData) {
    const user = await this.getById(id)
    if (data.lastName) {
      user.lastName = data.lastName
    }
    if (data.firstName) {
      user.firstName = data.firstName
    }

    await user.save()

    return user
  }
}
