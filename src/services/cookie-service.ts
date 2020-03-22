import cookie from 'cookie'
import { default as Cookie } from 'nookies'
import { ServerCtx } from '@Types'
import { isServer } from '@Utils/common'
import { NextPageContext } from 'next'

export class CookieService {
  cookieMan: typeof Cookie
  constructor() {
    this.cookieMan = Cookie
  }
  getItem = (name: string, ctx?: ServerCtx | NextPageContext) =>
    isServer()
      ? cookie.parse(ctx?.req?.headers?.cookie || '', {})[name]
      : this.cookieMan?.get()[name]
  setItem = (
    name: string,
    value: string,
    options?: cookie.CookieSerializeOptions,
    ctx?: ServerCtx | NextPageContext
  ) =>
    isServer()
      ? this.cookieMan?.set(ctx as any, name, value, options || { path: '/' })
      : {}

  removeItem = (
    name: string,
    ctx?: ServerCtx | NextPageContext,
    options?: cookie.CookieSerializeOptions
  ) => this.cookieMan?.destroy(ctx as any, name, options)
}

export const cookieService = new CookieService()
