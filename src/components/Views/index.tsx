import Typography from '@material-ui/core/Typography'

import { LoginForm } from '@Components/Forms'
import styles from './views.module.scss'

export const IndexView = () => (
  <div className={styles.indexWrap}>
    <h1>Home Design Solutions: Admin Portal</h1>
    <main className={styles.loginWrap}>
      <Typography variant={'h4'}>Login</Typography>
      <LoginForm />
    </main>
  </div>
)
