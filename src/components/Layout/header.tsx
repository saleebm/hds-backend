import Button from '@material-ui/core/Button'
import {
  createStyles,
  makeStyles,
  Theme,
  ThemeProvider,
} from '@material-ui/core/styles'
import { Router } from 'next/router'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { AccountCircle } from '@material-ui/icons'

import { RootStateType } from '@Store/modules/types'
import { RootAction } from '@Store/modules/root-action'
import { setErrorAction } from '@Store/modules/global/action'
import { logoutUserAction, refreshJWTAction } from '@Store/modules/auth/action'

import styles from './layout.module.scss'
import { MaterialNextBtn } from '@Components/Elements/Button'
import { lightTheme } from '@Config'
import { useEffect, useRef, useState } from 'react'
import { LinearProgress } from '@material-ui/core'

type HeaderProps = { pathname: string } & ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      margin: theme.spacing(1),
    },
  })
)

const mapDispatchToProps = (dispatch: Dispatch<RootAction>) =>
  bindActionCreators(
    {
      setErrorDispatch: setErrorAction,
      refreshToken: refreshJWTAction,
      logoutDispatch: logoutUserAction,
    },
    dispatch
  )

const mapStateToProps: (
  state: RootStateType
) => {
  isAuthenticated: boolean
  user: { last: string; first: string } | null
} = (state: RootStateType) => {
  const { authReducer } = state
  return authReducer?.isAuthenticated
    ? {
        isAuthenticated: authReducer.isAuthenticated,
        user: {
          first: authReducer.currentUser!.firstName!,
          last: authReducer.currentUser!.lastName!,
        },
      }
    : {
        isAuthenticated: false,
        user: null,
      }
}

const Header = ({ pathname, user, logoutDispatch }: HeaderProps) => {
  const classes = useStyles()
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
    <ThemeProvider theme={lightTheme}>
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
      <header className={styles.header}>
        <div className={styles.accountInfo}>
          <h3>
            Welcome, {user?.first || ''} {user?.last || ''}!
          </h3>
          <Button variant={'text'} onClick={logoutDispatch} title={'Logout'}>
            Not {user?.first || ''} {user?.last || ''}? Logout.
          </Button>
        </div>
        <nav className={styles.nav}>
          <MaterialNextBtn
            nextLinkProps={{ href: '/dashboard' }}
            variant={'outlined'}
            title={'go to dashboard'}
            startIcon={<AccountCircle />}
            active={pathname === '/dashboard'}
            className={classes.button}
          >
            Dashboard
          </MaterialNextBtn>
        </nav>
      </header>
    </ThemeProvider>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)
