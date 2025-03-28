import { CiHome } from "react-icons/ci";
import { TbSettings2 } from "react-icons/tb";
import { VscNotebook } from "react-icons/vsc";
import { IoBookmarksOutline } from "react-icons/io5";
import React from "react"
import clsx from 'clsx';
import { Link } from "react-router-dom";

const links = [
  { name: 'Home', href: '/student-portal', icon: CiHome },
  { name: 'My Courses', href: '/student-portal/courses', icon: VscNotebook },
  { name: 'My Marks', href: '/student-portal/my-marks', icon: IoBookmarksOutline },
  { name: 'Settings', href: '/dashboard/settings', icon: TbSettings2 },
];

export default function PortalNavLinks() {

  return (
    <div className="flex flex-col gap-5">
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            to={link.href}
            className={clsx(
              'flex text-gary-600 items-center justify-start text-sm font-light',
            )}
          >
            <div className="w-fit p-3 rounded-lg glassmorphism2">
              <LinkIcon className='w-4 h-4' />
            </div>
            <p className='hidden md:block'>{link.name}</p>
          </Link>
        );
      })}
    </div>
  );
}
