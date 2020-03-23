import Link from 'next/link'

//todo
// show a nav for authenticated users / unauthenticated users
export const Header = ({ pathname }: { pathname: string }) => (
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
