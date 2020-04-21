import Link, { LinkProps } from 'next/link'
import React, { forwardRef, Fragment, useCallback, useState } from 'react'
import { bindActionCreators, Dispatch } from 'redux'
import { useRouter } from 'next/router'
import { connect } from 'react-redux'
import clsx from 'clsx'
import debounce from 'lodash.debounce'

import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import { makeStyles, Theme } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import { Link as MuiLink, SvgIconTypeMap } from '@material-ui/core'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText, { ListItemTextProps } from '@material-ui/core/ListItemText'
import PersonIcon from '@material-ui/icons/Person'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import { OverridableComponent } from '@material-ui/core/OverridableComponent'
import IconButton from '@material-ui/core/IconButton'

import { useHoverIntent } from '@Utils/hooks'
import { MenuToggle } from '@Components/Layout/menu-toggle'
import { classNames } from '@Utils/common'
import ROUTE_PATHS from './routes'

import { RootAction } from '@Store/modules/root-action'
import { setErrorAction } from '@Store/modules/global/action'
import { logoutUserAction, refreshJWTAction } from '@Store/modules/auth/action'
import { RootStateType } from '@Store/modules/types'

import styles from '@Components/Layout/layout.module.scss'

type ButtonLinkProps = ListItemTextProps & {
  nextLinkProps: Omit<LinkProps, 'passHref'>
  activePath: string
  icon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>>
  prettyName: string
  pathname: string
  textClass: string
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
  user: { last?: string; first?: string }
} = (state: RootStateType) => {
  const { authReducer } = state
  return {
    isAuthenticated: authReducer.isAuthenticated,
    user: {
      first: authReducer.currentUser?.firstName,
      last: authReducer.currentUser?.lastName,
    },
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
      textClass,
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
        <ListItemText
          primaryTypographyProps={{
            variant: 'body1',
            className: textClass,
          }}
          ref={ref}
          {...props}
        >
          {children}
        </ListItemText>
      </ListItem>
    </Link>
  )
)

const drawerWidth = 300

const useStyles = makeStyles((theme: Theme) => ({
  // the menu items get the root here
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
    whiteSpace: 'nowrap',
    fontVariant: 'small-caps',
  },
  fullList: {
    width: 'auto',
    display: 'flex',
    flexFlow: 'column nowrap',
    alignItems: 'flex-start',
    justifyContent: 'stretch',
    minHeight: '100%',
    overflow: 'hidden',
  },
  logoutButton: {
    marginTop: '2rem',
  },
  appBar: {
    backgroundColor: theme.palette.background.default,
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    willChange: 'width',
    borderRight: `1px solid ${theme.palette.primary.main}`,
  },
  drawerOpen: {
    width: drawerWidth,
    overflow: 'overlay',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  listItemText: {
    fontSize: '1.3rem',
  },
}))

function NavDrawer({
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

  const handleClickAway = useCallback(() => {
    setIsOpen(false)
  }, [setIsOpen])

  const openOnMouseEnter = useCallback(
    (e: React.MouseEvent) =>
      debounce(() => {
        setIsOpen(true)
        e.persist()
      }, 500)(),
    [setIsOpen]
  )

  const closeOnMouseLeave = useCallback(
    (e: React.MouseEvent) => setIsOpen(false),
    [setIsOpen]
  )

  const intentions = useHoverIntent(
    openOnMouseEnter,
    closeOnMouseLeave,
    !isOpen
  )

  const renderList = () => (
    <div
      role="presentation"
      className={styles.navWrap}
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
          style={{ marginBottom: '1rem' }}
          title={`welcome ${user?.first || ''} ${user?.last || ''}! `}
        >
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ variant: 'subtitle1' }}>
            Welcome, {user?.first || ''} {user?.last || ''}! &nbsp;
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
                textClass={classes.listItemText}
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
    <ClickAwayListener onClickAway={handleClickAway}>
      <header>
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: isOpen,
          })}
        >
          <Toolbar>
            <MenuToggle
              isToggled={isOpen}
              onToggleClicked={() => setIsOpen((curr) => !curr)}
            />
          </Toolbar>
        </AppBar>
        <Drawer
          onMouseEnter={intentions.onMouseEnter}
          onMouseLeave={intentions.onMouseLeave}
          variant={'permanent'}
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: isOpen,
            [classes.drawerClose]: !isOpen,
          })}
          classes={{
            paper: clsx({
              [classes.drawerOpen]: isOpen,
              [classes.drawerClose]: !isOpen,
            }),
          }}
          anchor={'left'}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          <div className={classes.toolbar}>
            <IconButton onClick={toggleDrawer(false)}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          {renderList()}
        </Drawer>
      </header>
    </ClickAwayListener>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(NavDrawer)
