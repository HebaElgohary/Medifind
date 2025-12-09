import { Footer } from '../components/sharedComponents/MyFooter'
import { NavBar } from '../components/sharedComponents/MyNavbar'
import { Outlet } from 'react-router-dom'
export default function SharedLayout() {
  return (
    <>
      <NavBar />
      <div className="container mt-5 " style={{ minHeight: '70vh'}} >

        <Outlet />



      </div>

      <Footer />

    </>
  )
}