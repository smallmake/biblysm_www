import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps, locale: ctx?.locale || 'ja' } 
  }

  render() {
    const { locale } = this.props
    return (
      <Html lang={locale} dir="ltr">
        <Head>
          <title>Biblysm</title>
          <link rel="icon" href="images/biblysm-icon.svg" type="image/svg+xml"></link>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument