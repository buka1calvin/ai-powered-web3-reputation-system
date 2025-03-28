import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ProfileDropdown from "./profile/n";

const Navbar = () => {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const [activeLink, setActiveLink] = useState("/");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };





  return (
    <section className="w-full mt-6 flex justify-evenly items-center h-20 px-5 md:px-32 sticky top-0 z-40 bg-white">
      <Link to="/">
        <svg
          id="logo-35"
          width="50"
          height="39"
          viewBox="0 0 50 39"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16.4992 2H37.5808L22.0816 24.9729H1L16.4992 2Z"
            className="ccompli1"
            fill="#007AFF"
          ></path>
          <path
            d="M17.4224 27.102L11.4192 36H33.5008L49 13.0271H32.7024L23.2064 27.102H17.4224Z"
            className="ccustom"
            fill="#312ECB"
          ></path>
        </svg>
      </Link>

      <div className="md:hidden w-full flex justify-end">
        <button
          onClick={toggleMobileMenu}
          className="text-white focus:outline-none"
        >
          {mobileMenuOpen ? (
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          )}
        </button>
      </div>
      <div
        className={`hidden md:flex gap-8 items-center w-full justify-end mr-12 z-[1]`}
      >
        {!isAuthenticated ? (
          <>
            <Link
              to="/login"
              className={`group relative text-sm ${activeLink === "/login"
                ? "text-primaryBlueColor"
                : "text-largeTextColor text-sm hover:text-primaryBlueColor"
                }`}
            >
              Login
            </Link>

            <Link to="/signup" className={`group relative text-sm`}>
              <button
                className={`border border-primaryBlueColor text-primaryBlueColor px-4 py-2 rounded-[100px] hover:bg-primaryBlueColor hover:text-white transition-colors duration-300`}
              >
                Register Now
              </button>
            </Link>
          </>
        ) : (
          <ProfileDropdown
            user={user}
            logout={logout}
          />
        )}
      </div>
    </section>
  );
};

export default Navbar;