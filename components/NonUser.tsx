import { useRouter } from 'next/router';
import firebase from '../lib/firebase';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { createMarkup } from '../lib/utility'

export default function NonUser(props) {
  const router = useRouter()

  const onLogoutAndTo = (path) => {
    firebase.auth().signOut()
      .then(() => {
        router.push(path)
      });
  }

  const Message = () => {
    if (props.message) {
      return  <div dangerouslySetInnerHTML={ createMarkup(props.message) } />
    } else {
      return <p>利用中の方は、ご利用のアカウントでログインしてください。<br />はじめての方はお持ちのGoogleまたはAppleIDでログインできます。</p>
    }
  }

  return (
    <Row>
      <Col md={4} xs={0}></Col>
      <Col md={4} xs={12}>
        <Card>
          <Card.Body className="text-center py-5">
            <Message />
            <div className="my-1"><Button onClick={ () => onLogoutAndTo('/') } >トップ</Button></div>
            <div><Button onClick={ () => onLogoutAndTo('/login') } >ログインへ</Button></div>
          </Card.Body>
        </Card>
      </Col>
      <Col md={4} xs={0}></Col>
    </Row>
  )

}