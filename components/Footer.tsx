
import Link from 'next/link'
import { BsTwitter, BsFacebook, BsGoogle, BsInstagram } from "react-icons/bs";

export default function Footer() {

  return (
    <footer className="text-center text-white" style={{backgroundColor: "#333" }}>
      <div className="container pt-2">
        <section className="mb-2">
          <Link 
            role="button"
            href={ `${process.env.NEXT_PUBLIC_SMALLMAKE_WWW_URL}` }>
            <a className="btn btn-link btn-floating btn-sm text-light m-1 text-decoration-none">SMALL MAKE</a>
          </Link>

          <Link
            role="button"
            href={ `${process.env.NEXT_PUBLIC_SMALLMAKE_WWW_URL}/products/portalysm/terms_suggestions` }>
            <a className="btn btn-link btn-floating btn-sm text-light m-1 text-decoration-none">利用規約</a>
          </Link>

          <Link
            role="button"
            href={ `${process.env.NEXT_PUBLIC_SMALLMAKE_WWW_URL}/about/smallmake/policy`}>
            <a className="btn btn-link btn-floating btn-sm text-light m-1 text-decoration-none">プライバシーポリシー</a>
          </Link>

          <span className="border-start ps-3 small">Follow us: </span>

          <Link
            href="https://www.facebook.com/SMALL-MAKE-100659223381669/"
            role="button"
            data-mdb-ripple-color="light"
            ><a className="btn btn-link btn-floating btn-sm text-light m-1"><BsFacebook /></a></Link>

          <Link
            href="https://twitter.com/smallmake"
            role="button"
            data-mdb-ripple-color="light"
            ><a className="btn btn-link btn-floating btn-sm text-light m-1"><BsTwitter /></a></Link>

        </section>
      </div>

      <div className="text-center text-light p-3 small" style={{backgroundColor: "#222"}}>
        © 2022 Copyright:&nbsp;&nbsp;
        <Link href={ `${process.env.NEXT_PUBLIC_SMALLMAKE_WWW_URL}` }>
          <a className="text-light text-decoration-none">smallmake.com</a>
        </Link>
      </div>
    </footer>
  )

}