import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import { getProfile } from "../../../api/profiles";

interface ProfileDropdownProps {
  user: {
    firstName: string;
    lastName: string;
    role: string;
  };
  logout: () => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ user, logout }) => {
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [profilePic, setProfilePic] = useState<string | null>(null);

  const toggleDropdownMenu = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    const fetchProfilePic = async () => {
      try {
        const response = await getProfile();
        const image = response.profile.profilePic;
        if (response.success) {
          setProfilePic(image);
        }
      } catch (error) {
        console.error("Error fetching profile picture:", error);
      }
    };
    fetchProfilePic();
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const getDropdownOptions = () => {
    const currentPath = location.pathname;
    const baseOptions = [
      {
        label: "View Profile",
        path: `/profile`,
        show: true,
      },
    ];

    switch (user.role.toLowerCase()) {
      case "student":
        baseOptions.push({
          label: currentPath.includes("/student-portal")
            ? "Home"
            : "Student Dashboard",
          path: currentPath.includes("/student-portal")
            ? "/"
            : "/student-portal",
          show: true,
        });
        break;

      case "teacher":
        baseOptions.push({
          label: currentPath.includes("/teacher-portal")
            ? "Home"
            : "Teacher Dashboard",
          path: currentPath.includes("/teacher-portal")
            ? "/"
            : "/teacher-portal",
          show: true,
        });
        break;

      case "admin":
        baseOptions.push({
          label: currentPath.includes("/admin-portal")
            ? "Home"
            : "Admin Dashboard",
          path: currentPath.includes("/admin-portal") ? "/" : "/admin-portal",
          show: true,
        });
        break;
    }
    baseOptions.push({
      label: "Logout",
      path: "logout",
      show: true,
    });

    return baseOptions;
  };

  const handleOptionClick = (option: { path: string }) => {
    setDropdownOpen(false);
    if (option.path === "logout") {
      logout();
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdownMenu}
        className="flex items-center gap-2 focus:outline-none group hover:bg-gray-100 p-2 rounded-md transition-colors duration-200"
      >
        {profilePic ? (
          <img
            src={profilePic}
            alt="Profile"
            className="w-10 h-10 rounded-full border-2 border-gray-200 object-cover"
          />
        ) : (
          <img
            src={`https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}`}
            alt="Profile"
            className="w-10 h-10 rounded-full border-2 border-gray-200"
          />
        )}
        <div className="flex flex-col items-start space-y-1">
          <span className="text-sm font-semibold text-gray-800">
            {user.firstName} {user.lastName}
          </span>
          <div className="flex items-center space-x-1">
            <span className="text-xs text-gray-500 capitalize">
              {user.role}
            </span>{" "}
            {user.role === "student" && (
              <span className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse"></span>
            )}
            {user.role === "teacher" && (
              <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse"></span>
            )}
            {user.role === "admin" && (
              <span className="h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse"></span>
            )}
          </div>
        </div>
        <FaChevronDown
          className={`w-3 h-3 text-gray-500 group-hover:text-gray-700 transition-transform duration-200 ${
            dropdownOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 py-2">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-800">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {user.role} Account
            </p>
          </div>
          {getDropdownOptions().map((option) =>
            option.path === "logout" ? (
              <button
                key={option.label}
                onClick={() => handleOptionClick(option)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {option.label}
              </button>
            ) : (
              <Link
                key={option.label}
                to={option.path}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => handleOptionClick(option)}
              >
                {option.label}
              </Link>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
