import Link, { LinkProps } from 'next/link'
import React, { forwardRef, Fragment, useState } from 'react'
import { makeStyles, Theme } from '@material-ui/core/styles'
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import { Link as MuiLink, SvgIconTypeMap } from '@material-ui/core'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText, { ListItemTextProps } from '@material-ui/core/ListItemText'
import PersonIcon from '@material-ui/icons/Person'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import { bindActionCreators, Dispatch } from 'redux'

import { MenuToggle } from '@Components/Layout'
import { classNames, isServer } from '@Utils/common'
import ROUTE_PATHS from './routes'

import styles from '@Components/Layout/layout.module.scss'
import { RootAction } from '@Store/modules/root-action'
import { setErrorAction } from '@Store/modules/global/action'
import { logoutUserAction, refreshJWTAction } from '@Store/modules/auth/action'
import { RootStateType } from '@Store/modules/types'
import { useRouter } from 'next/router'
import { connect } from 'react-redux'
import { OverridableComponent } from '@material-ui/core/OverridableComponent'

const iOS = !isServer() && /iPad|iPhone|iPod/.test(navigator.userAgent)

type ButtonLinkProps = ListItemTextProps & {
  nextLinkProps: Omit<LinkProps, 'passHref'>
  activePath: string
  icon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>>
  prettyName: string
  pathname: string
}

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

const NextListItemText = forwardRef<any, ButtonLinkProps>(
  (
    {
      nextLinkProps,
      activePath,
      classes,
      icon,
      prettyName,
      pathname,
      children,
      ...props
    },
    ref
  ) => (
    <Link {...nextLinkProps} passHref>
      <ListItem
        className={
          activePath === pathname
            ? classNames(classes?.root, 'active')
            : classes?.root
        }
        title={prettyName}
        button
        component={MuiLink}
      >
        {icon && <ListItemIcon>{React.createElement(icon)}</ListItemIcon>}
        <ListItemText ref={ref} {...props}>
          {children}
        </ListItemText>
      </ListItem>
    </Link>
  )
)

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    boxShadow: theme.shadows['0'],
    color: theme.palette.text.primary,
    '&:last-child': {
      alignSelf: 'flexEnd',
    },
    '&.active': {
      textDecoration: 'line-through',
      textDecorationColor: theme.palette.background.default,
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.secondary,
    },
  },
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
    display: 'flex',
    flexFlow: 'column nowrap',
    alignItems: 'flex-start',
    justifyContent: 'stretch',
    minHeight: '100vh',
  },
  logoutButton: {
    [`@media (min-height: 1000px)`]: {
      bottom: 0,
      left: 0,
      alignSelf: 'flex-end',
      position: theme.breakpoints.up('md') ? 'absolute' : 'relative',
    },
  },
}))

function SwipeableTemporaryDrawer({
  user,
  logoutDispatch,
}: ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>) {
  const router = useRouter()
  const classes = useStyles()
  const [isOpen, setIsOpen] = useState(false)

  const activePath = router && router.pathname

  const toggleDrawer = (shouldOpen: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent
  ) => {
    if (
      event &&
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return
    }

    setIsOpen(shouldOpen)
  }

  const renderList = () => (
    <div
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <a
        style={{ display: 'none' }}
        className={styles.skipToMenuLink}
        title={'Skip to main content.'}
        href={'#stdemiana-main'}
      >
        Skip to main content
      </a>
      <List className={classes.fullList} role={'navigation'} component={'nav'}>
        <ListItem
          component={'div'}
          autoFocus
          title={`welcome ${user?.first || ''} ${user?.last || ''}! `}
        >
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText>
            Welcome, {user?.first || ''} {user?.last || ''}! <br />
          </ListItemText>
        </ListItem>
        {ROUTE_PATHS.filter(({ includeInNav }) => includeInNav).map(
          ({ pathname, slug, prettyName, icon }) => (
            <Fragment key={slug}>
              <NextListItemText
                prettyName={prettyName}
                nextLinkProps={{ href: pathname }}
                primary={prettyName}
                icon={icon}
                classes={classes}
                activePath={activePath}
                pathname={pathname}
              />
              <Divider />
            </Fragment>
          )
        )}
        <ListItem
          className={classes.logoutButton}
          onClick={logoutDispatch}
          title={'Logout'}
          button
        >
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText>
            Not {user?.first || ''} {user?.last || ''}? Logout.
          </ListItemText>
        </ListItem>
      </List>
    </div>
  )

  return (
    <header>
      <MenuToggle
        isToggled={isOpen}
        onToggleClicked={() => setIsOpen((curr) => !curr)}
      />
      <SwipeableDrawer
        anchor={'left'}
        open={isOpen}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        disableBackdropTransition={!iOS}
        disableDiscovery={iOS}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
      >
        {renderList()}
      </SwipeableDrawer>
    </header>
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SwipeableTemporaryDrawer)
