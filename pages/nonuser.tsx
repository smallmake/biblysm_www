import { NextPage } from 'next'
import Layout from "../components/Layout"
import NonUser from "../components/NonUser"

const NonUserPage: NextPage  = () => {
  return (
    <Layout>
      <NonUser />
    </Layout>
  )
}

export default NonUserPage;
