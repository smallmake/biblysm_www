import firebase from '../lib/firebase';
import { createContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import { fetcher } from '../lib/fetcher'

type AuthContextProps = {
  currentUser: firebase.User | null | undefined;
  token: string | null;
  isAuthFinished: Boolean;
}

const AuthContext = createContext<AuthContextProps>({
  currentUser: undefined,
  token: null,
  isAuthFinished: false
});

const AuthProvider = ({ children }: any) => {
  const [currentUser, setCurrentUser] = useState<firebase.User | null | undefined>(undefined);
  const [token, setToken] = useState<string|null>(null)
  const [isAuthFinished, setIsAuthFinished] = useState<Boolean>(false);

  const router = useRouter()

  // firebase.auth().onAuthStateChangedでしばしばログイン中にnullになることがある。
  // それを回避するための処理→参考： https://zenn.dev/phi/articles/firebase-auth-wait-for-initialization
  const initFirebaseAuth = () => {
    return new Promise((resolve) => {
      var unsubscribe = firebase.auth().onAuthStateChanged((user) => {
        resolve(user);
        unsubscribe();
      });
    });
  };

  useEffect(() => {
    let unmounted = false;
    const startupAuth = async () => {
      if (!unmounted) {
        const user = await initFirebaseAuth();
        authUser(user) // user == null の場合の処理も含む
      }
    }
    startupAuth()
    return () => {
      unmounted = true;
    }
  }, []);

  // 60分毎にuser authチェック
  useEffect(() => {
    let unmounted = false;
    const handle = setInterval(async () => {
      if (!unmounted) {
        const user = await initFirebaseAuth();
        authUser(user)  // user == null の場合の処理も含む
      }
    }, 60 * 60 * 1000);
    // clean up setInterval
    return () => {
      unmounted = true;
      clearInterval(handle);
    }
  }, []);

  // useEffect(() => {
  //   let unmounted = false;
  //   const startupAuth = () => {
  //     firebase.auth().onAuthStateChanged(async (user) => {
  //       await authUser(user)
  //     })
  //   }
  //   startupAuth()
  //   return () => {
  //     unmounted = true;
  //   }
  // }, []);

  // useEffect(() => {
  //   let unmounted = false;
  //   const handle = setInterval(async () => {
  //     if (!unmounted) {
  //       firebase.auth().onAuthStateChanged(async(user) => {
  //         await authUser(user)
  //       })
  //     }
  //   }, 10 * 60 * 1000);
  //   // clean up setInterval
  //   return () => {
  //     unmounted = true;
  //     clearInterval(handle);
  //   }
  // }, []);

  const authUser = async (user) => {
    if (user) {
      user.getIdToken(true).then(async (idToken: string) => {
        if (idToken) {
          const verifyUser = await fetcher('post', 'auth/registrations/verify', idToken, null)  // 生成されるときはACCOUNTSにも
          if ( verifyUser !== null ) {
            setCurrentUser(user)
            setToken(idToken)
            setIsAuthFinished(true)
            return user
          } else {
            console.log('verifyUser is null in biblysm_api auth/registrations/verify')
            await firebase.auth().signOut()
            router.push("/nonuser")
          }
        }
      });
    } else { 
      // ログアウトしている場合は setIsAuthFinished(true)した上で currentUser=null にする必要があるので、これは必要な処理
      console.log('firebase.auth().onAuthStateChanged returns null')
      setCurrentUser(null)
      setToken(null)
      setIsAuthFinished(true)
    }
  }

  
  return (
    <AuthContext.Provider value={{ currentUser: currentUser, token: token, isAuthFinished: isAuthFinished }}>
        { children }
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider }
