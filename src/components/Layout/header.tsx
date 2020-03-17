import Link from 'next/link'

function isActive(pathname: string): boolean {
  return (
    typeof document !== 'undefined' && document.location.pathname === pathname
  )
}

export const Header = () => (
  <nav>
    <Link href="/">
      <a className="bold" data-active={isActive('/')}>
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
