import { AppProps } from "next/app";
import Script from 'next/script'
import { RecoilRoot } from "recoil";
import { AuthProvider } from '../components/Auth'
import 'bootstrap/dist/css/bootstrap.min.css';
import "../styles/globals.css";
import '../styles/style.bootstrap.scss'

function MyApp({ Component, pageProps }) {

  const setDarkMode = (darkMode: Boolean) => {
    if (darkMode) {
      return { __html: `document.body.classList.add('dark'); if (document.getElementById('darkTheme')) {document.getElementById('darkTheme').innerText = document.body.classList;}`}
    } else {
      return { __html: `if (document.body.classList.contains('dark')) { document.body.classList.remove('dark') }` }
    }
  }

  return (
    <AuthProvider>
      <RecoilRoot>
        <Component {...pageProps} />
        <Script id="darkmode-script" dangerouslySetInnerHTML={ setDarkMode(false) } />
      </RecoilRoot>
    </AuthProvider>
  );
}

export default MyApp;
