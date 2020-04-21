import dynamic from 'next/dynamic'
import { Router } from 'next/router'
import { connect } from 'react-redux'
import { useEffect, useRef, useState } from 'react'
import { LinearProgress } from '@material-ui/core'
import Container from '@material-ui/core/Container'
import { RootStateType } from '@Store/modules/types'

import styles from './layout.module.scss'

const NavDrawer = dynamic(() => import('./nav-drawer'))

type HeaderProps = ReturnType<typeof mapStateToProps>

const mapStateToProps: (
  state: RootStateType
) => {
  isAuthenticated: boolean
} = (state: RootStateType) => {
  return {
    isAuthenticated: state.authReducer.isAuthenticated,
  }
}

const Header = ({ isAuthenticated }: HeaderProps) => {
  const [isPathChanging, setIsPathChanging] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()
  useEffect(() => {
    const enableLoader = (url: string) => {
      console.log('App is changing to: ', url)
      // enable loading animation through state
      setIsPathChanging(true)
    }
    const disableLoader = (url: string) => {
      console.log('App has changed to: ', url)
      // set timeout to disable loader after 300ms since it will be awkward with blazing fast next js loading speeds to just see a twinkle
      timeoutRef.current = setTimeout(() => setIsPathChanging(false), 300)
    }

    try {
      Router.events.on('routeChangeStart', enableLoader)
      Router.events.on('routeChangeComplete', disableLoader)
      Router.events.on('routeChangeError', disableLoader)
    } catch (e) {
      console.error(e)
    }
    return () => {
      try {
        Router.events.off('routeChangeStart', enableLoader)
        Router.events.off('routeChangeComplete', disableLoader)
        Router.events.off('routeChangeError', disableLoader)
      } catch (e) {
        console.error(e)
      }
      timeoutRef?.current && clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <>
      {isPathChanging && (
        <LinearProgress
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 3140000,
            width: '100vw',
            overflow: 'hidden',
            height: '7px',
          }}
          variant={'indeterminate'}
        />
      )}
      <Container className={styles.header}>
        {isAuthenticated ? (
          <NavDrawer />
        ) : (
          <span
            style={{
              clip: 'rect(1px, 1px, 1px, 1px) !important',
              visibility: 'hidden',
              position: 'absolute',
              insetBlockStart: 0,
              overflow: 'hidden !important',
              height: '1px',
              width: '1px',
              padding: 0,
              margin: 0,
            }}
            dangerouslySetInnerHTML={{
              __html:
                'super dangerously set inner html you might be asking why but i have no answer muahahahahahahahaha jk the container props say children are required so boom. children.... if only it was so easy in real life to make children, i can barely talk to a female without gasping for air because of my lack of self-esteem and imposter syndrome. i am working on it though, at least i am aware. thanks',
            }}
          />
        )}
      </Container>
    </>
  )
}

export default connect(mapStateToProps)(Header)
