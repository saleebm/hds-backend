import { Resource } from 'rest-hooks'

export class EmployeeResource extends Resource {
  static urlRoot = 'http://localhost:3000/api/v1/account/'

  readonly id: number | undefined = undefined
  readonly username: string = ''
  readonly email: string = ''
  readonly isAdmin: boolean = false

  pk() {
    return this.id?.toString()
  }
}
