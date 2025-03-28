import { CiHome } from "react-icons/ci";
import { TbSettings2 } from "react-icons/tb";
import { VscNotebook } from "react-icons/vsc";
import { IoBookmarksOutline } from "react-icons/io5";
import { GoPeople } from "react-icons/go";
import { TbReportAnalytics } from "react-icons/tb";
import React from "react"
import clsx from 'clsx';
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const links = [
  { name: 'Home', href: '/teacher-portal', icon: CiHome },
  { name: 'Students', href: '/teacher-portal/students', icon: GoPeople },
  { name: 'Students Marks', href: '/teacher-portal/students-marks', icon: IoBookmarksOutline },
  { name: 'Courses', href: '/teacher-portal/teachers-courses', icon: VscNotebook },
  { name: 'Students Reports', href: '/teacher-portal/students-report', icon: TbReportAnalytics },
  { name: 'Settings', href: '/dashboard/settings', icon: TbSettings2 },
];

export const TeacherPortalSidebar = ({ isMobile }:any) => {
  const { user } = useAuth();

  return (
    <div className={`
      ${isMobile ? 'w-full' : 'w-64'} 
      bg-white border-r 
      flex flex-col 
      h-full 
      py-6 
      px-4
    `}>
      <Link to="/" className="flex items-center justify-center mb-8">
        <svg 
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
          />
          <path 
            d="M17.4224 27.102L11.4192 36H33.5008L49 13.0271H32.7024L23.2064 27.102H17.4224Z" 
            className="ccustom" 
            fill="#312ECB"
          />
        </svg>
      </Link>

      <nav className="flex-1 space-y-2">
        {links.map((link) => (
          <Link 
            key={link.name} 
            to={link.href} 
            className="flex items-center p-2 hover:bg-gray-100 rounded-md transition-colors group"
          >
            <link.icon 
              className="mr-3 text-gray-500 group-hover:text-blue-600" 
              size={20} 
            />
            {!isMobile && <span>{link.name}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
};
