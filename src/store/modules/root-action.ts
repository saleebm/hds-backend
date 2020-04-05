import { GlobalActions } from './global/action'
import { AuthActions } from './auth/action'
import { CustomerOrderActions } from '@Store/modules/customer-order/types'

export type RootAction = GlobalActions | AuthActions | CustomerOrderActions
