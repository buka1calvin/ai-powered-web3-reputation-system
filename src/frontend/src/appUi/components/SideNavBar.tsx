import { Link } from "react-router-dom";
import NavLinks from "../../constants/NavLinks";
import { GoSignOut } from "react-icons/go";
import React from "react";

const SideNavbar = () => {
  return (
    <div className="flex flex-col gap-9 py-4 md:px-2 h-full fixed text-white xs:bg-slate-200 xs:h-fit bg-cyan-700 items-center justify-center rounded-3xl">
      <Link
        className="mb-2 flex justify-center rounded-md  w-full items-center h-[80px]"
        to="/"
      >
        <svg id="logo-35" width="50" height="39" viewBox="0 0 50 39" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M16.4992 2H37.5808L22.0816 24.9729H1L16.4992 2Z" className="ccompli1" fill="#007AFF"></path> <path d="M17.4224 27.102L11.4192 36H33.5008L49 13.0271H32.7024L23.2064 27.102H17.4224Z" className="ccustom" fill="#312ECB"></path> </svg>
      </Link>
      <div className="flex h-full grow flex-row lg:justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md md:block"></div>
        <form>
          <button className="flex h-[48px] bg-cyan-950 w-full grow items-center justify-center gap-2 rounded-md text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
            <div className="glassmorphism2 rounded-lg flex items-center justify-between gap-2 w-full">
              <GoSignOut className="w-4 h-4" />
              Sign Out
            </div>
          </button>
        </form>
      </div>
    </div>
  );
};

export default SideNavbar;
