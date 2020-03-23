import { ReactNode } from 'react'
import { Header } from './header'

type Props = {
  children: ReactNode
  pathname: string
}

export const Layout = (props: Props) => (
  <div>
    <Header pathname={props.pathname} />
    <div className={'page'}>{props.children}</div>
    <style jsx>{`
      .page {
        min-height: 100vh;
        height: 100%;
        width: 100%;
      }
    `}</style>
  </div>
)
