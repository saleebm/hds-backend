import { Router } from 'next/router'
import { connect } from 'react-redux'
import { useEffect, useRef, useState } from 'react'
import { LinearProgress } from '@material-ui/core'
import Container from '@material-ui/core/Container'
import { NavDrawer } from '@Components/Layout'

import { RootStateType } from '@Store/modules/types'

import styles from './layout.module.scss'

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
      {isAuthenticated && (
        <Container className={styles.header}>
          <NavDrawer />
        </Container>
      )}
    </>
  )
}

export default connect(mapStateToProps)(Header)
