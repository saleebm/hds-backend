import cookie from 'cookie'
import { default as Cookie } from 'nookies'
import { ServerCtx, ServerSideProps } from '@Types'
import { isServer } from '@Utils/common'
import { NextPageContext } from 'next'
import { AppPropsWithStore } from '@Types/_app'

export class CookieService {
  cookieMan: typeof Cookie
  constructor() {
    this.cookieMan = Cookie
  }
  getItem = (
    name: string,
    ctx?: ServerCtx | NextPageContext | AppPropsWithStore | ServerSideProps
  ) =>
    isServer()
      ? this.cookieMan.get(
          ctx && 'ctx' in ctx ? ctx.ctx || undefined : ctx || undefined,
          {}
        )[name]
      : this.cookieMan?.get()[name]
  setItem = (
    name: string,
    value: string,
    options?: cookie.CookieSerializeOptions,
    ctx?: ServerCtx | NextPageContext | AppPropsWithStore | ServerSideProps
  ) =>
    isServer()
      ? this.cookieMan.set(
          ctx && 'ctx' in ctx ? ctx.ctx : ctx,
          name,
          value,
          options || { path: '/' }
        )
      : this.cookieMan.set(null, name, value, options || { path: '/' })

  removeItem = (
    name: string,
    ctx?: ServerCtx | NextPageContext | AppPropsWithStore | ServerSideProps,
    options?: cookie.CookieSerializeOptions
  ) =>
    this.cookieMan.destroy(
      // all it needs is res. the types are too broadly set as NextPageContext in cookieMan's type declaration.
      ctx && 'ctx' in ctx ? ctx.ctx : (ctx as any),
      name,
      options
    )
}

export const cookieService = new CookieService()
