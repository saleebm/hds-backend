import Button, { ButtonProps } from '@material-ui/core/Button'
import Link, { LinkProps } from 'next/link'
import { forwardRef } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { grey, deepPurple } from '@material-ui/core/colors'

/**
 * We need to Omit from the MUI Button the {href} prop
 * as we have to handle routing with Next.js Router
 * so we block the possibility to specify an href.
 */
export type ButtonLinkProps = Omit<ButtonProps, 'href' | 'classes'> & {
  nextLinkProps: Omit<LinkProps, 'passHref'>
  active?: boolean
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    activeStyle: {
      backgroundColor: grey['100'],
      color: deepPurple['900'],
    },
  })
)

export default forwardRef<any, ButtonLinkProps>(
  ({ nextLinkProps, active, children, ...props }, ref) => {
    const classes = useStyles()

    return (
      <Link {...nextLinkProps} passHref>
        <Button
          aria-selected={active ?? false}
          aria-current={active ?? false}
          ref={ref}
          className={active ? classes.activeStyle : undefined}
          {...props}
        >
          {children}
        </Button>
      </Link>
    )
  }
)
