import { NextPage } from "next"
import { useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/router';
import { AuthContext } from "../components/Auth"
import Layout from '../components/Layout'
import Loading from '../components/Loading'
import Bibliotecas from '../components/Bibliotecas'
//import { useUserServiceStatus } from "../lib/useUserServiceStatus"

const IndexPage: NextPage = () => {
  const { currentUser, token, isAuthFinished } = useContext(AuthContext)
  const [ currentPortalID, setCurrentPortalID ] = useState(null)

  //const { userServiceStatus } = useUserServiceStatus('biblysm')

  const router = useRouter()

  // useEffect(() => {
  //   let unmounted = false;
  //   if (!unmounted && defaultPortalID) {
  //     setCurrentPortalID(defaultPortalID)
  //   }
  //   const cleanup = () => {
  //     unmounted = true
  //     setCurrentPortalID(null)
  //   };
  //   return cleanup;
  // }, [defaultPortalID])

 
  const TopPage = () => {
    //console.log(`TopPage:${JSON.stringify(currentUser)}`)
    if(currentUser) {
      // if (userServiceStatus) { // userServiceStatusは、ここでチェックすればsettingではチェック必要ないだろう、多分
      //   if (userServiceStatus.state != 'OK') { //userServiceStatus.state == 'NG' or 'NOP'
      //     router.push('/account')
      //   } else {
          //if (currentPortalID && currentPortalID > 0) {
            return (
              <Bibliotecas />
            )
        //   } // 取得まで放っておく
        // } // 取得まで放っておく
      //} // 取得まで放っておく
    } else {
      return (
        <div>トップページ</div>
      )
    }
    return <Loading />
  }

  return (
    <Layout>
      { !isAuthFinished ? <Loading /> : <TopPage /> }
    </Layout>
  )
}


// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   const cookies = parseCookies(ctx);
//   const session = cookies.session || "";

//   console.log(`---session=${session}`)
//   // const { currentUser, token, isAuthFinished } = useContext(AuthContext)

//   // if (!currentUser) {
//   //   return {
//   //     redirect: {
//   //       destination: "/login",
//   //       permanent: false,
//   //     },
//   //   };
//   // }

//   return {
//     props: {
//       email: "xxxx",
//     },
//   };
// };

export default IndexPage;
