import Link from 'next/link'
import { RootStateType } from '@Store/modules/types'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import { RootAction } from '@Store/modules/root-action'
import { setErrorAction } from '@Store/modules/global/action'
import { refreshJWTAction } from '@Store/modules/auth/action'
import { useEffect } from 'react'

type HeaderProps = { pathname: string } & ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>

const mapDispatchToProps = (dispatch: Dispatch<RootAction>) =>
  bindActionCreators(
    {
      setErrorDispatch: setErrorAction,
      refreshToken: refreshJWTAction,
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

// todo
export const Header = connect(
  mapStateToProps,
  mapDispatchToProps
)(({ pathname, refreshToken, isAuthenticated }: HeaderProps) => {
  useEffect(() => {
    if (isAuthenticated) {
      refreshToken()
    }
  }, [isAuthenticated, refreshToken])
  return (
    <nav>
      <Link href="/">
        <a className="bold" data-active={pathname === '/' || pathname === ''}>
          Blog
        </a>
      </Link>
      <style jsx>{`
        nav {
          display: flex;
          padding: 2rem;
          align-items: center;
          flex-flow: row nowrap;
        }

        .bold {
          font-weight: bold;
        }

        a {
          text-decoration: none;
          color: #000;
          display: inline-block;
        }

        a[data-active='true'] {
          color: gray;
        }

        a + a {
          margin-left: 1rem;
        }
      `}</style>
    </nav>
  )
})
