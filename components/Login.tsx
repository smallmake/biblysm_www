import { useState, useEffect, useContext, useCallback } from "react"
import Link from 'next/link'
import { useRouter } from 'next/router';
import firebase from '../lib/firebase';
import { AuthContext } from "./Auth"
import Loading from './Loading'
import { Row, Col, Container, Image, Button } from 'react-bootstrap';
import 'firebaseui/dist/firebaseui.css' // Bootstrapとコンフリクト
import LoginUiFirebase from './LoginUiFirebase'
//import * as firebaseui from 'firebaseui'

export default function Login(props) {
  const { currentUser } = useContext(AuthContext);
  const router = useRouter()

  useEffect(() => {
    if (currentUser) {
      router.push("/");
    }
  }, [currentUser])

  return (
    <Container>
      <Row className="text-center mt-5">
        <Col xs={0} md={4} />
        <Col xs={12} md={4} >
          <h3 className="mb-4">ログイン</h3>
          <LoginUiFirebase />
          <Row className="m-4 text-start small text-muted">
            お持ちのGoogleアカウントまたはAppleIDアカウントでログインしてください。
          </Row>
          <Row className="mt-5">
            <Col>
              <Link href={ `${process.env.NEXT_PUBLIC_SMALLMAKE_WWW_URL}/products/portalysm/terms_suggestions`} target="_blank">
                <a className="me-3 text-decoration-underline">利用規約</a>
              </Link>
              <Link href={ `${process.env.NEXT_PUBLIC_SMALLMAKE_WWW_URL}/about/smallmake/policy`} target="_blank">
                <a className="me-3 text-decoration-underline">プライバシーポリシー</a>
              </Link>
            </Col>
          </Row>
        </Col>
        <Col xs={0} md={4} />
      </Row>
    </Container>
  )
}