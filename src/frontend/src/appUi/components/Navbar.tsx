import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ProfileDropdown from "./profile/n";
import { 
  Search, 
  Home, 
  Users, 
  MessageSquare, 
  Bell, 
  X, 
  Menu,
  ChevronDown,
  Filter
} from "lucide-react";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";


// Define filter types
interface SearchFilters {
  role?: string;
  skills?: string;
  experienceMin?: string;
  location?: string;
}

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [activeLink, setActiveLink] = useState("/");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [quickSearchResults, setQuickSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});

  // Role options
  const roleOptions = ["DEVELOPER", "RECRUITER"];
  
  // Experience level options
  const experienceLevels = [
    { value: '1', label: '1+ years' },
    { value: '3', label: '3+ years' },
    { value: '5', label: '5+ years' },
    { value: '7', label: '7+ years' },
    { value: '10', label: '10+ years' }
  ];

  useEffect(() => {
    setActiveLink(location.pathname);
    
    // Clear search when navigating away from search page
    if (!location.pathname.includes('/search')) {
      setSearchQuery("");
      setFilters({});
      setShowAdvancedSearch(false);
    }
  }, [location]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Handle quick search as user types
  const handleSearchInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.length >= 2) {
      setIsLoading(true);
      try {
        // Call your search API with a limit for quick search
        const response = await fetch(`${(import.meta as any).env.VITE_CANISTER_ORIGIN}/profiles/search`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            name: query,
            limit: 5 
          })
        });
        
        const data = await response.json();
        
        if (data.success) {
          setQuickSearchResults(data.profiles || []);
        }
      } catch (error) {
        console.error('Quick search error:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setQuickSearchResults([]);
    }
  };

  // Handle filter changes for advanced search
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Handle search submission
  const handleSearch = (e?: React.FormEvent): void => {
    e?.preventDefault();
    
    // Build search params
    const params = new URLSearchParams();
    
    // Add search query if present
    if (searchQuery.trim() !== '') {
      params.append('name', searchQuery);
    }
    
    // Add filters if any
    if (filters.role) params.append('role', filters.role);
    if (filters.skills) params.append('skills', filters.skills);
    if (filters.experienceMin) params.append('experienceMin', filters.experienceMin);
    if (filters.location) params.append('location', filters.location);
    
    // Navigate to search page with params
    navigate({
      pathname: '/search',
      search: params.toString()
    });
    
    // Reset states
    setSearchFocused(false);
    setShowAdvancedSearch(false);
    setMobileMenuOpen(false);
  };

  // Handle Enter key press in search input
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({});
  };

  return (
    <header className="w-full sticky top-0 z-40 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <svg
            width="35"
            height="35"
            viewBox="0 0 50 39"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16.4992 2H37.5808L22.0816 24.9729H1L16.4992 2Z"
              fill="#007AFF"
            ></path>
            <path
              d="M17.4224 27.102L11.4192 36H33.5008L49 13.0271H32.7024L23.2064 27.102H17.4224Z"
              fill="#312ECB"
            ></path>
          </svg>
          <span className="text-xl font-semibold text-[#007AFF] ml-2">ConnectIn</span>
        </Link>

        {/* Search - Desktop */}
        <div className="hidden md:block relative w-80">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={handleSearchInput}
                onKeyPress={handleKeyPress}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                className="w-full pl-10 pr-12 py-2 bg-gray-100 rounded-full border border-transparent focus:border-gray-300 focus:ring-0 focus:bg-white transition-colors"
              />
              <Search size={18} className="absolute left-3.5 top-2.5 text-gray-500" />
              
              {/* Advanced search toggle button */}
              <button
                type="button"
                onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                className="absolute right-3.5 top-1 text-gray-500 hover:text-gray-600"
              >
                <HiOutlineAdjustmentsHorizontal size={32} />
              </button>
            </div>
            
            {/* Advanced Search Dropdown */}
            {showAdvancedSearch && (
              <div className="absolute top-full mt-1 w-80 right-0 bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden z-50">
                <div className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium text-gray-700">Advanced Filters</h3>
                    <button 
                      type="button" 
                      onClick={() => setShowAdvancedSearch(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {/* Role Filter */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Role
                      </label>
                      <select
                        value={filters.role || ""}
                        onChange={(e) => handleFilterChange('role', e.target.value)}
                        className="w-full py-1.5 px-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">All Roles</option>
                        {roleOptions.map(role => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Skills Filter - Only show for developer role */}
                    {filters.role === "DEVELOPER" && (
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Skills (comma separated)
                        </label>
                        <input
                          type="text"
                          value={filters.skills || ""}
                          onChange={(e) => handleFilterChange('skills', e.target.value)}
                          placeholder="e.g. React, JavaScript"
                          className="w-full py-1.5 px-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    )}
                    
                    {/* Experience Filter - Only show for developer role */}
                    {filters.role === "DEVELOPER" && (
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Experience
                        </label>
                        <select
                          value={filters.experienceMin || ""}
                          onChange={(e) => handleFilterChange('experienceMin', e.target.value)}
                          className="w-full py-1.5 px-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="">Any Experience</option>
                          {experienceLevels.map(level => (
                            <option key={level.value} value={level.value}>
                              {level.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    
                    {/* Location Filter */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={filters.location || ""}
                        onChange={(e) => handleFilterChange('location', e.target.value)}
                        placeholder="City or Country"
                        className="w-full py-1.5 px-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      Reset
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded font-medium"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Quick search dropdown */}
            {searchFocused && searchQuery.length >= 2 && !showAdvancedSearch && (
              <div className="absolute top-full mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden z-50">
                {isLoading ? (
                  <div className="p-4 text-center text-sm text-gray-500">
                    Searching...
                  </div>
                ) : quickSearchResults.length > 0 ? (
                  <div className="max-h-64 overflow-y-auto">
                    {quickSearchResults.map((profile: any) => (
                      <Link
                        key={profile.id}
                        to={`/profile/${profile.firstName}-${profile.lastName}`.toLowerCase()}
                        className="flex items-center p-3 hover:bg-gray-50 border-b border-gray-100 last:border-0"
                      >
                        {profile.profilePic ? (
                          <img
                            src={profile.profilePic}
                            alt={`${profile.firstName} ${profile.lastName}`}
                            className="w-10 h-10 rounded-full mr-3 object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-3">
                            {profile.firstName[0]}{profile.lastName[0]}
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{profile.firstName} {profile.lastName}</div>
                          <div className="text-sm text-gray-500">{profile.title || profile.role}</div>
                        </div>
                      </Link>
                    ))}
                    
                    <div className="p-2 bg-gray-50 border-t border-gray-200">
                      <button
                        onClick={handleSearch}
                        className="w-full py-2 text-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View all results
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-gray-500">
                    No matches found
                  </div>
                )}
              </div>
            )}
          </form>
        </div>

        {/* Nav Links - Desktop */}
        <nav className="hidden md:flex items-center space-x-1">
          <Link
            to="/"
            className={`flex flex-col items-center p-2 rounded-md ${
              activeLink === "/" ? "text-blue-600" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            <Home size={20} />
            <span className="text-xs mt-1">Home</span>
          </Link>
          
          <Link
            to="/search"
            className={`flex flex-col items-center p-2 rounded-md ${
              activeLink === "/search" ? "text-blue-600" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            <Users size={20} />
            <span className="text-xs mt-1">Profiles</span>
          </Link>
          
          <Link
            to="#"
            className={`flex flex-col items-center p-2 rounded-md ${
              activeLink === "#" ? "text-blue-600" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            <MessageSquare size={20} />
            <span className="text-xs mt-1">Messages</span>
          </Link>
          
          <Link
            to="#"
            className={`flex flex-col items-center p-2 rounded-md ${
              activeLink === "#" ? "text-blue-600" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            <Bell size={20} />
            <span className="text-xs mt-1">Notifications</span>
          </Link>
        </nav>

        {/* Auth Section - Desktop */}
        <div className="hidden md:block">
          {!isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-sm text-gray-700 hover:text-blue-600 font-medium"
              >
                Sign In
              </Link>
              <Link to="/signup">
                <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm font-medium transition-colors">
                  Join Now
                </button>
              </Link>
            </div>
          ) : (
            <ProfileDropdown user={user} logout={logout} />
          )}
        </div>

        {/* Mobile Nav Controls */}
        <div className="flex md:hidden items-center space-x-3">
          <button 
            onClick={() => {
              setMobileMenuOpen(true);
              setTimeout(() => {
                const searchInput = document.getElementById('mobileSearchInput');
                if (searchInput) searchInput.focus();
              }, 100);
            }} 
            className="text-gray-500 p-2"
          >
            <Search size={22} />
          </button>
          
          <button
            onClick={toggleMobileMenu}
            className="text-gray-500 p-2 focus:outline-none"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full z-40 shadow-lg">
          <div className="p-4 space-y-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative mb-4">
              <input
                id="mobileSearchInput"
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={handleSearchInput}
                onKeyPress={handleKeyPress}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full border border-transparent focus:border-gray-300 focus:ring-0 focus:bg-white transition-colors"
              />
              <Search size={18} className="absolute left-3.5 top-2.5 text-gray-500" />
              
              {/* Advanced search toggle for mobile */}
              <button
                type="button"
                onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                className="mt-2 flex items-center text-sm text-blue-600"
              >
                <Filter size={16} className="mr-1" />
                {showAdvancedSearch ? 'Hide filters' : 'Advanced filters'}
              </button>
              
              {/* Mobile Advanced Search */}
              {showAdvancedSearch && (
                <div className="mt-3 p-3 bg-gray-50 rounded-md border border-gray-200">
                  <div className="space-y-3">
                    {/* Role Filter */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Role
                      </label>
                      <select
                        value={filters.role || ""}
                        onChange={(e) => handleFilterChange('role', e.target.value)}
                        className="w-full py-1.5 px-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">All Roles</option>
                        {roleOptions.map(role => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Skills Filter - Only for developer role */}
                    {filters.role === "DEVELOPER" && (
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Skills (comma separated)
                        </label>
                        <input
                          type="text"
                          value={filters.skills || ""}
                          onChange={(e) => handleFilterChange('skills', e.target.value)}
                          placeholder="e.g. React, JavaScript"
                          className="w-full py-1.5 px-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    )}
                    
                    {/* Experience Filter - Only for developer role */}
                    {filters.role === "DEVELOPER" && (
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Experience
                        </label>
                        <select
                          value={filters.experienceMin || ""}
                          onChange={(e) => handleFilterChange('experienceMin', e.target.value)}
                          className="w-full py-1.5 px-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="">Any Experience</option>
                          {experienceLevels.map(level => (
                            <option key={level.value} value={level.value}>
                              {level.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    
                    {/* Location Filter */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={filters.location || ""}
                        onChange={(e) => handleFilterChange('location', e.target.value)}
                        placeholder="City or Country"
                        className="w-full py-1.5 px-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div className="flex justify-between pt-2">
                      <button
                        type="button"
                        onClick={resetFilters}
                        className="text-xs text-gray-500 hover:text-gray-700"
                      >
                        Reset Filters
                      </button>
                      <button 
                        type="submit"
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded font-medium"
                      >
                        Apply Filters
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </form>
            
            {/* Mobile Nav Links */}
            <nav className="grid grid-cols-4 gap-2">
              <Link
                to="/"
                className={`flex flex-col items-center p-3 rounded-md ${
                  activeLink === "/" ? "text-blue-600" : "text-gray-500"
                }`}
                onClick={toggleMobileMenu}
              >
                <Home size={20} />
                <span className="text-xs mt-1">Home</span>
              </Link>
              
              <Link
                to="/search"
                className={`flex flex-col items-center p-3 rounded-md ${
                  activeLink === "/search" ? "text-blue-600" : "text-gray-500"
                }`}
                onClick={toggleMobileMenu}
              >
                <Users size={20} />
                <span className="text-xs mt-1">Profiles</span>
              </Link>
              
              <Link
                to="/messages"
                className={`flex flex-col items-center p-3 rounded-md ${
                  activeLink === "/messages" ? "text-blue-600" : "text-gray-500"
                }`}
                onClick={toggleMobileMenu}
              >
                <MessageSquare size={20} />
                <span className="text-xs mt-1">Messages</span>
              </Link>
              
              <Link
                to="/notifications"
                className={`flex flex-col items-center p-3 rounded-md ${
                  activeLink === "/notifications" ? "text-blue-600" : "text-gray-500"
                }`}
                onClick={toggleMobileMenu}
              >
                <Bell size={20} />
                <span className="text-xs mt-1">Notifications</span>
              </Link>
            </nav>
            
            {/* Mobile Auth */}
            <div className="pt-4 border-t border-gray-100">
              {!isAuthenticated ? (
                <div className="flex flex-col space-y-3">
                  <Link
                    to="/login"
                    className="w-full py-2 text-center text-gray-700 hover:text-blue-600 font-medium"
                    onClick={toggleMobileMenu}
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/signup"
                    onClick={toggleMobileMenu}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-center font-medium transition-colors"
                  >
                    Join Now
                  </Link>
                </div>
              ) : (
                <div onClick={toggleMobileMenu}>
                  <ProfileDropdown user={user} logout={logout} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;