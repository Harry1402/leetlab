import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../component/Navbar.jsx'

const Layout = () => {
  return (
    <div>
        <Navbar/>
        <Outlet/>
    </div>
  )
}

export default Layout