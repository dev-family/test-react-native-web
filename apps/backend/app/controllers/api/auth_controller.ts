import AuthorizationService from '#services/auth/authorization_service'
import { createAccountValidator, loginValidator } from '#validators/auth'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class AuthController {
  constructor(protected authService: AuthorizationService) {}

  /*
   * @login
   * @requestBody - <loginValidator>
   * @responseBody 200 - <UserResultInterface>
   */
  async login({ request }: HttpContext) {
    const payload = await request.validateUsing(loginValidator)
    const result = await this.authService.login(payload)

    return result
  }

  /*
   * @register
   * @requestBody - <createAccountValidator>
   * @responseBody 200 - <UserResultInterface>
   */
  async register({ request }: HttpContext) {
    const payload = await request.validateUsing(createAccountValidator)
    const result = await this.authService.createAccount(payload)

    return result
  }

  /*
   * @logout
   */
  async logout({ auth }: HttpContext) {
    const user = auth.getUserOrFail()

    await this.authService.logout(user, user.currentAccessToken.identifier)
  }

  async social({}: HttpContext) {}
}
