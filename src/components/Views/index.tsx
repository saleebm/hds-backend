import { LoginForm } from '@Components/Forms'

import styles from './views.module.scss'

export function IndexView() {
  return (
    <div className={styles.indexWrap}>
      <h1>Home Design Solutions: Admin Portal</h1>
      <main className={styles.loginWrap}>
        <LoginForm />
      </main>
    </div>
  )
}
