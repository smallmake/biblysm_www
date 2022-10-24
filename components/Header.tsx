import { useRouter } from 'next/router'
import { useContext, useState, useEffect } from 'react'
import Link from 'next/link'
import { AuthContext } from "./Auth"
import firebase from '../lib/firebase';
import { Container, Image } from 'react-bootstrap';
import { BsBoxArrowInRight, BsGearFill, BsBoxArrowRight, BsArrowReturnLeft, BsPersonCircle } from "react-icons/bs";


export default function Header() {
  const { currentUser, isAuthFinished } = useContext(AuthContext)
  const router = useRouter()


  const onLogout = () => {
    firebase.auth().signOut()
      .then(() => {
        window.location.reload();
      });
  }

  const topButton = () => {
    if (!isAuthFinished) return <span></span>
    if (router.pathname !== "/" && router.pathname !== '/settings') {
      return <li><a href="/" className="nav-link px-2"><BsArrowReturnLeft size={22} className="me-1" />戻る</a></li>
    }
  }
  const loginButton = () => {
    if (!isAuthFinished) return <span></span>
    if (router.pathname !== "/login" && !currentUser) {
      return <li><a href="/login" className="nav-link px-2"><BsBoxArrowInRight size={28} className="me-1 pb-1" />ログイン</a></li>
    }
  }
  
  // const settingsButton = () => {
  //   if (!isAuthFinished || currentPortalID == -1) return <span></span>
  //   if (router.pathname !== "/settings" && router.pathname !== "/account" && currentUser) {
  //     return <li><a href="/settings" className="nav-link px-2"><BsGearFill size={22} className="pb-1" />設定</a></li>
  //   }
  // }
  const logoutButton = () => {
    if (!isAuthFinished) return <span></span>
    if (currentUser) {
      return <li><a href="#" className="nav-link px-2" onClick={ () => onLogout() }><BsBoxArrowRight  size={22} className="pb-1" />ログアウト</a></li>
    }
  }

  const myaccountButton = () => {
    if (!isAuthFinished || !currentUser) return <span></span>
    if (router.pathname !== "/account" && currentUser) {
      return <li><a href="/account" className="nav-link px-2"><BsPersonCircle  size={22} className="pb-1" />マイアカウント</a></li>
    }
  }

  const Title = () => (
    <span>Biblysm</span>
  )


  return (
    <Container fluid className="mb-1">
      <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between">
        
        <h1 className="d-flex align-items-center col-md-3 mb-2 mb-md-0 fs-5">
          <Link href="/" className="text-decoration-none"><a>
            <Image src='images/biblysm-logo.svg' width={140} />
          </a></Link>
        </h1>
        
        <div className="col-12 col-md-auto justify-content-center mb-md-0 text-center">
          <h2 style={{fontFamily: 'serif'}}><Title /></h2>
        </div>

        <ul className="nav col-md-3 mx-autor">
          { topButton() }
          {/* settingsButton() */}
          { myaccountButton() }
          { loginButton() }
          { logoutButton() }
        </ul>

      </header>
    </Container>
  )
}
