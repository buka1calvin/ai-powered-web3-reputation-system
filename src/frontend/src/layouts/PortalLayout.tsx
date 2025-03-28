import React from 'react'
import PortalSideNav from '../appUi/components/PortalSideNav'
import { Outlet } from 'react-router-dom'
import { TopBar } from '../appUi/components/PortalNav'

const PortalLayout = () => {
  return (
    <main className='flex bg-slate-100'>
      <div className="w-full flex flex-col md:w-44 shadow h-screen items-center justify-center mr-5">
        <PortalSideNav/>
      </div>
      <div className="min-h-screen w-full flex flex-col">
        <TopBar/>
        <Outlet />
      </div>
    </main>
  )
}

export default PortalLayout
