import { ReactNode } from 'react'
import { Header } from './header'

type Props = {
  children: ReactNode
  pathname: string
}

export const Layout = (props: Props) => (
  <div>
    <Header pathname={props.pathname} />
    <div className="layout">{props.children}</div>
    <style jsx>{`
      .layout {
        padding: 0 2rem;
      }
    `}</style>
  </div>
)
