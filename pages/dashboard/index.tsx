import { GetServerSideProps } from 'next'

function Dashboard() {
  return (
    <>
      <h1>dashboard</h1>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  //todo
  // check if user is authenticated first,
  // if so, make sure data is in store
  // else, redirect to /
  return {
    props: {},
  }
}
export default Dashboard
