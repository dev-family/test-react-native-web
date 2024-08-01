import User from '#models/user'
import { UserInterface } from '#interfaces/user'

export class UserTransformer {
  transform(user: User): UserInterface {
    return {
      email: user.email,
      firstName: user.firstName as string,
      lastName: user.lastName as string,
      username: user.username,
      createdAt: user.createdAt,
      id: user.id,
      balance: user.$extras.balance,
    }
  }
}
