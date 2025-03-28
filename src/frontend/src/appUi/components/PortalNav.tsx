import React from 'react'
import { useState } from "react";
import { formatDate } from '../../utils/formatedDate';
import { FiSearch } from "react-icons/fi";
import { CiCirclePlus } from "react-icons/ci";
import { RiNotification2Line } from "react-icons/ri";
import { useAuth } from '../../context/AuthContext';
import ProfileDropdown from './profile/n';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Bell, Search } from 'lucide-react';
import { Badge } from '../../components/ui/badge';

export const TopBar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const currentDate = new Date();

  return (
    <div className="bg-white border-b shadow-sm sticky top-0 z-40">
      <div className="container mx-auto flex items-center justify-between p-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Hello, {user?.firstName}
          </h1>
          <p className="text-sm text-gray-500">
            {formatDate(currentDate)}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative flex-grow max-w-md">
            <Input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e:React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>

          <Button variant="ghost" size="icon">
            <Bell size={20} />
          </Button>
          <div className="relative ml-4">
          <ProfileDropdown
            user={user}
            logout={logout}
          />
        </div>
        </div>
      </div>
    </div>
  );
};


