import { LoginForm } from '@Components/Forms'

export default () => {
  return (
    <>
      <div className="page">
        <h1>Home Design Solutions: Admin Portal</h1>
        <main>
          <LoginForm />
        </main>
      </div>
      <style jsx>{`
        .page {
          min-height: 100vh;
          height: 100%;
          width: 100%;
        }
      `}</style>
    </>
  )
}
