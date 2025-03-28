import { CiHome } from "react-icons/ci";
import { IoPeopleOutline } from "react-icons/io5";
import { TbSettings2 } from "react-icons/tb";
import { TbReportSearch } from "react-icons/tb";
import { GiFamilyTree } from "react-icons/gi";
import React from "react"
import clsx from 'clsx';
import { Link } from "react-router-dom";

const links = [
  { name: 'Dashboard', href: '/dashboard', icon: CiHome },
  { name: 'Students Management', href: '/dashboard/people', icon: IoPeopleOutline },
  { name: 'Departments', href: '/dashboard/Departments', icon: GiFamilyTree },
  { name: 'Teachers Management', href: '/dashboard/report', icon: TbReportSearch },
  { name: 'Settings', href: '/dashboard/settings', icon: TbSettings2 },
];

export default function NavLinks() {
  // const pathname = usePathname();

  return (
    <div className="flex flex-col gap-5">
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            to={link.href}
            className={clsx(
              'flex  flex-col text-white items-center justify-center text-sm font-light',
              // {
              //   ' text-[#F7B263]': pathname === link.href,
              // }
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
