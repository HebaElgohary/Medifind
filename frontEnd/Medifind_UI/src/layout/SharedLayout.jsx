import { Footer } from '../components/sharedComponents/MyFooter'
import { NavBar } from '../components/sharedComponents/MyNavbar'
import { Outlet } from 'react-router-dom'
export default function SharedLayout() {
  return (
    <>
      <NavBar />
      <div className="px-5 py-5 " style={{ minHeight: '80vh',    backgroundColor: "#f6f6f6",
}} >

        <Outlet />



      </div>

      <Footer />

    </>
  )
}