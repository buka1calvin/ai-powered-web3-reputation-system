import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"; // Add useNavigate
import { useAuth } from "../../context/AuthContext";
import ProfileDropdown from "./profile/n";
import { Search, ChevronDown, X } from "lucide-react";
import { searchUsers } from "../../api/profiles"

// Define filter types
interface SearchFilters {
  role?: string;
  skills?: string;
  experienceMin?: string;
  location?: string;
}

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Add navigation hook
  const { isAuthenticated, user, logout } = useAuth();
  const [activeLink, setActiveLink] = useState("/");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    role: "",
    skills: "",
    experienceMin: "",
    location: ""
  });

  // Filter options
  const levels = ["Junior", "Mid-level", "Senior", "Lead", "Architect"];
  const experienceRanges = ["0-2 years", "2-5 years", "5-10 years", "10+ years"];
  const reputationScores = ["Any", "Above 50", "Above 75", "Above 90"];
  const projectCounts = ["Any", "1-5", "5-10", "10-20", "20+"];

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleFilter = (filter: string) => {
    if (activeFilter === filter) {
      setActiveFilter(null);
    } else {
      setActiveFilter(filter);
    }
  };

  // Handle filter selection
  const selectFilter = (filterType: string, value: string) => {
    let updatedFilters = { ...searchFilters };
    
    switch(filterType) {
      case 'level':
        updatedFilters.role = value;
        break;
      case 'experience':
        // Extract just the number from experience range
        const minExp = value.split('-')[0].trim();
        updatedFilters.experienceMin = minExp === '10+' ? '10' : minExp;
        break;
      // Add other filter types as needed
    }
    
    setSearchFilters(updatedFilters);
    setActiveFilter(null); // Close the filter dropdown
  };

  // Handle search submission
  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault(); // Handle both form submission and direct function call
    
    if (searchQuery.trim() === '' && Object.values(searchFilters).every(v => v === '')) {
      return; // Don't search if query and filters are empty
    }
    
    // Navigate to search results page with query params
    const params = new URLSearchParams();
    if (searchQuery) params.append('q', searchQuery);
    
    // Add filters to params
    Object.entries(searchFilters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    
    navigate(`/search?${params.toString()}`);
  };

  // Handle Enter key press in search input
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section className="w-full mt-6 flex flex-col sticky top-0 z-40 bg-white/50 border-b border-gray-200 shadow-sm">
      <div className="flex justify-between items-center h-16 px-5 md:px-32">
        <Link to="/" className="flex items-center">
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
            ></path>
            <path
              d="M17.4224 27.102L11.4192 36H33.5008L49 13.0271H32.7024L23.2064 27.102H17.4224Z"
              className="ccustom"
              fill="#312ECB"
            ></path>
          </svg>
          <span className="text-xl font-semibold text-[#007AFF] ml-2">ConnectIn</span>
        </Link>

        {/* Search and Filters - Desktop */}
        <div className="hidden md:flex flex-1 items-center ml-6">
          <form onSubmit={handleSearch} className="relative w-64">
            <input
              type="text"
              placeholder="Search developers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full pl-9 pr-2 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
            <button type="submit" className="absolute left-2.5 top-2.5 text-gray-400 focus:outline-none">
              <Search size={18} />
            </button>
          </form>

          {/* Filter Links */}
          <div className="flex ml-6 space-x-1">
            {/* Level Filter */}
            <div className="relative">
              <button 
                onClick={() => toggleFilter('level')}
                className={`px-3 py-2 rounded-md flex items-center text-sm font-medium ${
                  activeFilter === 'level' ? 'bg-blue-50 text-[#007AFF]' : 'text-gray-600 hover:text-[#007AFF]'
                }`}
              >
                Level
                <ChevronDown size={16} className="ml-1" />
              </button>
              {activeFilter === 'level' && (
                <div className="absolute z-10 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200">
                  <div className="p-2">
                    {levels.map((level) => (
                      <div 
                        key={level} 
                        className="px-2 py-1.5 rounded hover:bg-gray-100 cursor-pointer text-sm"
                        onClick={() => selectFilter('level', level)}
                      >
                        {level}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Experience Filter */}
            <div className="relative">
              <button 
                onClick={() => toggleFilter('experience')}
                className={`px-3 py-2 rounded-md flex items-center text-sm font-medium ${
                  activeFilter === 'experience' ? 'bg-blue-50 text-[#007AFF]' : 'text-gray-600 hover:text-[#007AFF]'
                }`}
              >
                Experience
                <ChevronDown size={16} className="ml-1" />
              </button>
              {activeFilter === 'experience' && (
                <div className="absolute z-10 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200">
                  <div className="p-2">
                    {experienceRanges.map((range) => (
                      <div 
                        key={range} 
                        className="px-2 py-1.5 rounded hover:bg-gray-100 cursor-pointer text-sm"
                        onClick={() => selectFilter('experience', range)}
                      >
                        {range}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Reputation Score Filter */}
            <div className="relative">
              <button 
                onClick={() => toggleFilter('reputation')}
                className={`px-3 py-2 rounded-md flex items-center text-sm font-medium ${
                  activeFilter === 'reputation' ? 'bg-blue-50 text-[#007AFF]' : 'text-gray-600 hover:text-[#007AFF]'
                }`}
              >
                Reputation
                <ChevronDown size={16} className="ml-1" />
              </button>
              {activeFilter === 'reputation' && (
                <div className="absolute z-10 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200">
                  <div className="p-2">
                    {reputationScores.map((score) => (
                      <div key={score} className="px-2 py-1.5 rounded hover:bg-gray-100 cursor-pointer text-sm">
                        {score}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Projects Filter */}
            <div className="relative">
              <button 
                onClick={() => toggleFilter('projects')}
                className={`px-3 py-2 rounded-md flex items-center text-sm font-medium ${
                  activeFilter === 'projects' ? 'bg-blue-50 text-[#007AFF]' : 'text-gray-600 hover:text-[#007AFF]'
                }`}
              >
                Projects
                <ChevronDown size={16} className="ml-1" />
              </button>
              {activeFilter === 'projects' && (
                <div className="absolute z-10 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200">
                  <div className="p-2">
                    {projectCounts.map((count) => (
                      <div key={count} className="px-2 py-1.5 rounded hover:bg-gray-100 cursor-pointer text-sm">
                        {count}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMobileMenu}
            className="text-gray-600 focus:outline-none mr-4"
          >
            {mobileMenuOpen ? (
              <X size={24} />
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
          <button onClick={() => handleSearch()} className="text-gray-600">
            <Search size={20} />
          </button>
        </div>

        {/* Auth Buttons - Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className={`text-sm ${
                  activeLink === "/login"
                  ? "text-[#007AFF]"
                  : "text-gray-600 hover:text-[#007AFF]"
                }`}
              >
                Login
              </Link>
              <Link to="/signup">
                <button
                  className="border border-[#007AFF] text-[#007AFF] px-4 py-2 rounded-[100px] hover:bg-[#007AFF] hover:text-white transition-colors duration-300"
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
      </div>

      {/* Mobile Menu & Search - Expandable */}
      {mobileMenuOpen && (
        <div className="md:hidden px-5 py-4 border-t border-gray-100">
          <form onSubmit={handleSearch} className="relative mb-4">
            <input
              type="text"
              placeholder="Search developers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full pl-9 pr-2 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:outline-none"
            />
            <button type="submit" className="absolute left-2.5 top-2.5 text-gray-400 focus:outline-none">
              <Search size={18} />
            </button>
          </form>
          
          <div className="flex overflow-x-auto pb-3 space-x-2 scrollbar-hide">
            {/* Mobile Filters */}
            <button className="whitespace-nowrap px-3 py-1.5 border border-gray-300 rounded-full text-sm text-gray-600">
              Level <ChevronDown size={14} className="inline ml-1" />
            </button>
            <button className="whitespace-nowrap px-3 py-1.5 border border-gray-300 rounded-full text-sm text-gray-600">
              Experience <ChevronDown size={14} className="inline ml-1" />
            </button>
            <button className="whitespace-nowrap px-3 py-1.5 border border-gray-300 rounded-full text-sm text-gray-600">
              Reputation <ChevronDown size={14} className="inline ml-1" />
            </button>
            <button className="whitespace-nowrap px-3 py-1.5 border border-gray-300 rounded-full text-sm text-gray-600">
              Projects <ChevronDown size={14} className="inline ml-1" />
            </button>
          </div>
          
          {/* Mobile Auth Links */}
          {!isAuthenticated ? (
            <div className="mt-4 flex flex-col space-y-3">
              <Link
                to="/login"
                className={`text-sm py-2 ${
                  activeLink === "/login"
                  ? "text-[#007AFF]"
                  : "text-gray-600"
                }`}
                onClick={toggleMobileMenu}
              >
                Login
              </Link>
              <Link 
                to="/signup"
                onClick={toggleMobileMenu}
              >
                <button
                  className="w-full border border-[#007AFF] text-[#007AFF] px-4 py-2 rounded-[100px] hover:bg-[#007AFF] hover:text-white transition-colors duration-300"
                >
                  Register Now
                </button>
              </Link>
            </div>
          ) : (
            <div className="mt-4">
              <div className="border-t border-gray-200 pt-3">
                <ProfileDropdown
                  user={user}
                  logout={logout}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default Navbar;