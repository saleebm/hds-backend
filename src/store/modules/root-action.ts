import { GlobalActions } from './global/action'
import { AuthActions } from './auth/action'

export type RootAction = GlobalActions | AuthActions
