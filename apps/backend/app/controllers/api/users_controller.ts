import type { HttpContext } from '@adonisjs/core/http'
import UserService from '#services/user_service'
import { inject } from '@adonisjs/core'
import { updateUserValidator } from '#validators/user'
import { UserTransformer } from '#transformers/user'

@inject()
export default class UsersController {
  constructor(
    protected userService: UserService,
    protected transformer: UserTransformer
  ) {}

  async getAll({}: HttpContext) {}

  /*
   * @get
   * @responseBody 200 - <UserInterface>
   */
  async get({ auth }: HttpContext) {
    const id = auth.getUserOrFail().id
    const user = await this.userService.getById(id)
    return this.transformer.transform(user)
  }

  /*
   * @edit
   * @requestBody - <updateUserValidator>
   * @responseBody 200 - <UserInterface>
   */
  async edit({ auth, request }: HttpContext) {
    const id = auth.getUserOrFail().id
    const data = await request.validateUsing(updateUserValidator)

    const user = await this.userService.update(id, data)

    return this.transformer.transform(user)
  }

  /*
   * @delete
   */
  async delete({}: HttpContext) {}
}
