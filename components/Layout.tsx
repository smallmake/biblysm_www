import Header from './Header'
import Footer from './Footer'

// export default function Layout(props) {
//   return (
//     <div>
//       <Header portalID={ props.portalID } />
//       <div className="min-hight-640px" >
//         { props.children }
//       </div>
//       <Footer />
//     </div>
//   )
//}

export default function Layout({ children }: any) {
  return (
    <div>
      <Header />
      <div className="min-hight-640px" >
        { children }
      </div>
      <Footer />
    </div>
  )
}