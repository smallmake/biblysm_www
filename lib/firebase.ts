import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSEGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

firebase.initializeApp(firebaseConfig);

// if (!firebase.apps.length) {
//   firebase.initializeApp(firebaseConfig);
//   /* 当初サンプルにあった下のsetPersistence をしていするとNONEにしないとbuildが通らないので、
//   セッション管理を自分でやたらなければならないと思って調査をしていた。
//   ところが実際は、setPersistence自体を何もしなければbuildも通るし、セッションも自動で管理されるということが判明し
//   以下はコメントアウト */
//   // firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
//   //     console.log('Initialized!') // 確認用のメッセージ
//   // })
// }

export default firebase

// firebaseui を導入したので不要となった
// export const login = (providerName) => {
//   let provider = null 
//   if (providerName === "google") {
//     provider = new firebase.auth.GoogleAuthProvider()
//   } else if (providerName === "apple") {
//     provider = new firebase.auth.OAuthProvider('apple.com');
//     provider.addScope('email');
//     provider.addScope('name');
//   }
//   firebase.auth().signInWithRedirect(provider);
//   // .then((result) => {
//   //   var credential = result.credential;
//   //   var token = credential.accessToken;
//   //   //var user = result.user;
//   //   return token;
//   // }).catch((error) => {
//   //   console.log(error);
//   //   const errorCode = error.code;
//   //   console.log(errorCode);
//   //   const errorMessage = error.message;
//   //   console.log(errorMessage);
//   // });
// }

// export const logout = () => {
//   firebase
//     .auth()
//     .signOut()
//     .then(() => {
//       window.location.reload();
//     });
// }

