import { DateTime } from 'luxon'

export interface UserInterface {
  username: string
  firstName?: string
  lastName?: string
  id: number
  email: string
  createdAt: DateTime
  balance?: number
}

export interface UserResultInterface {
  user: UserInterface
  token: string
}
