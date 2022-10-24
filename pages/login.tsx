import { NextPage } from 'next'
import Layout from "../components/Layout"
import Login from '../components/Login'

const LoginPage: NextPage  = () => {
  return (
    <Layout>
      <Login />
    </Layout>
  )
}

export default LoginPage;
