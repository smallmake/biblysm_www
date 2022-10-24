import { useState, useEffect, useContext, useCallback } from "react"
import { useRouter } from 'next/router';
import firebase from '../lib/firebase';
import { AuthContext } from "./Auth"
import Loading from './Loading'
import { Row, Col, Container, Image, Button } from 'react-bootstrap';
import 'firebaseui/dist/firebaseui.css' // Bootstrapとコンフリクト
import styles from '../styles/Login.module.css'
//import * as firebaseui from 'firebaseui'

// 良さそうなサンプルがあったのだが https://stackoverflow.com/questions/54196395/requiring-firebaseui-window-is-not-defined
// これだど、なぜかredirectだとAuthからcurrentUserを取得できない。 popupならうまく行く
export default function LoginUiFirebase() {

  useEffect(() => {
    loadFirebaseui();
  }, []);
  
  const loadFirebaseui = useCallback(async () => {
    const firebaseui = await import("firebaseui"); // 冒頭でimportすると windowがないというエラーになる。このやり方なら大丈夫
    // 参考文献： https://stackoverflow.com/questions/54196395/requiring-firebaseui-window-is-not-defined
    const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebase.auth());
    const uiConfig = {
      callbacks: {
        signInSuccessWithAuthResult: (authResult, redirectUrl) => {
          authResult.user.getIdToken(true)
          .then((idToken) => {
            //sessionsLogin(loginType, idToken) 
            console.log(`firebaseLogin success!`)
          })
          .catch((error)  => { console.log(`Firebase getIdToken failed!: ${error.message}`) });
          return true;
        },
        uiShown: () => { document.getElementById('loader').style.display = 'none' }
      },
      signInFlow: 'popup',
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        'apple.com'
      ],
      signInSuccessUrl: "/",
    };
    ui.start('#firebaseui-auth-container', uiConfig);
  }, [firebase])


  return (
    <div className="my-3">
      <div id="firebaseui-auth-container"></div>
      <div id="loader" />
    </div>
  )
}