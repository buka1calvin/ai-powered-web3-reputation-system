import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { searchUsers } from "../../api/profiles";
import { UserProfile } from "../../types/profile";
import { Filter, Search, X, ChevronDown, ChevronUp } from "lucide-react";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";


// Define user types based on your API response
interface DeveloperInfo {
  skills?: string[];
  experience?: string;
  level?: string;
  reputationScore?: number;
  completedProjects?: number;
  githubProfile?: string;
  workExperience?: any[];
  portfolioUrl?: string;
  bio?: string;
  education?: any[];
}

interface RecruiterInfo {
  company?: string;
  position?: string;
  industry?: string;
  reputationScore?: number;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  title?: string;
  profilePic?: string;
  role: "DEVELOPER" | "RECRUITER";
  developerInfo?: DeveloperInfo;
  recruiterInfo?: RecruiterInfo;
}

interface SearchResponse {
  success: boolean;
  profiles?: UserProfile[];
  message?: string;
  page?: number;
  totalProfiles?: number;
  totalPages?: number;
}

interface SearchFilters {
  role?: string;
  skills?: string;
  experienceMin?: string;
  location?: string;
}

const SearchResults: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalProfiles, setTotalProfiles] = useState<number>(0);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Search states
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filters, setFilters] = useState<SearchFilters>({});

  // Available filter options
  const roleOptions = ["DEVELOPER"];
  const skillOptions = [
    "JavaScript",
    "TypeScript",
    "React",
    "Angular",
    "Vue",
    "Node.js",
    "Python",
    "Java",
    "C#",
    ".NET",
    "PHP",
    "Ruby",
    "Go",
    "Rust",
    "Swift",
    "Kotlin",
    "AWS",
  ];
  const experienceLevels = [
    { value: "1", label: "1+ years" },
    { value: "3", label: "3+ years" },
    { value: "5", label: "5+ years" },
    { value: "7", label: "7+ years" },
    { value: "10", label: "10+ years" },
  ];

  // Parse URL parameters on initial load
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);

    // Get search query from URL
    const nameParam = queryParams.get("name") || "";
    setSearchQuery(nameParam);

    // Get filters from URL
    const urlFilters: SearchFilters = {};
    if (queryParams.get("role"))
      urlFilters.role = queryParams.get("role") || undefined;
    if (queryParams.get("skills"))
      urlFilters.skills = queryParams.get("skills") || undefined;
    if (queryParams.get("experienceMin"))
      urlFilters.experienceMin = queryParams.get("experienceMin") || undefined;
    if (queryParams.get("location"))
      urlFilters.location = queryParams.get("location") || undefined;

    setFilters(urlFilters);

    // Get page from URL or default to 1
    const pageParam = queryParams.get("page");
    if (pageParam) {
      setCurrentPage(parseInt(pageParam));
    }
  }, [location.search]);

  // Fetch search results based on filters and query
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        // Call the search API with query and filters
        const response: SearchResponse = await searchUsers(
          searchQuery,
          filters
        );

        if (response.success) {
          setResults(response.profiles || []);
          if (response.totalPages) {
            setTotalPages(response.totalPages);
          }
          if (response.page) {
            setCurrentPage(response.page);
          }
          if (response.totalProfiles) {
            setTotalProfiles(response.totalProfiles);
          }
        } else {
          setError(response.message || "Failed to search");
        }
      } catch (err) {
        setError("An error occurred while searching");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchQuery, filters, currentPage]);

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  // Apply filters and navigate
  const applyFilters = () => {
    const params = new URLSearchParams();

    // Add search query if present
    if (searchQuery) {
      params.append("name", searchQuery);
    }

    // Add filters if present
    if (filters.role) params.append("role", filters.role);
    if (filters.skills) params.append("skills", filters.skills);
    if (filters.experienceMin)
      params.append("experienceMin", filters.experienceMin);
    if (filters.location) params.append("location", filters.location);

    // Add page number
    params.append("page", currentPage.toString());

    // Navigate with search parameters
    navigate({
      pathname: "/search",
      search: params.toString(),
    });
  };

  // Handle filter changes
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => {
      if (value === "") {
        const newFilters = { ...prev };
        delete newFilters[key as keyof SearchFilters];
        return newFilters;
      }
      return { ...prev, [key]: value };
    });
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({});
    setSearchQuery("");
    navigate("/search");
  };

  // Toggle filter visibility
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <h1 className="text-2xl font-bold">Search Results</h1>

          <button
            onClick={toggleFilters}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            <HiOutlineAdjustmentsHorizontal size={16} className="mr-1" />
            {showFilters ? "Hide Filters" : "Show Filters"}
            {showFilters ? (
              <ChevronUp size={16} className="ml-1" />
            ) : (
              <ChevronDown size={16} className="ml-1" />
            )}
          </button>
        </div>

        {showFilters && (
          <div className="shadow-sm border p-4 mb-6 animate-slideDown">
            <form onSubmit={handleSearch}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search Query */}
                <div>
                  <label
                    htmlFor="searchQuery"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="searchQuery"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by name..."
                      className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <Search
                      size={16}
                      className="absolute left-3 top-2.5 text-gray-400"
                    />
                  </div>
                </div>

                {/* Role Filter */}
                <div>
                  <label
                    htmlFor="roleFilter"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Role
                  </label>
                  <select
                  disabled
                    id="roleFilter"
                    value={filters.role || ""}
                    onChange={(e) => handleFilterChange("role", e.target.value)}
                    className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Roles</option>
                    {roleOptions.map((role) => (
                      <option key={role} value={role} className="text-sm">
                        {role}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Experience Filter */}
                <div>
                  <label
                    htmlFor="experienceFilter"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Experience
                  </label>
                  <select
                    id="experienceFilter"
                    value={filters.experienceMin || ""}
                    onChange={(e) =>
                      handleFilterChange("experienceMin", e.target.value)
                    }
                    disabled={filters.role !== "DEVELOPER"}
                    className={`w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                      filters.role !== "DEVELOPER"
                        ? "bg-gray-100 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    <option value="">Any Experience</option>
                    {experienceLevels.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location Filter */}
                <div>
                  <label
                    htmlFor="locationFilter"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Location
                  </label>
                  <input
                    type="text"
                    id="locationFilter"
                    value={filters.location || ""}
                    onChange={(e) =>
                      handleFilterChange("location", e.target.value)
                    }
                    placeholder="City or Country"
                    className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Skills Filter - Only shown for Developer role */}
              {filters.role === "DEVELOPER" && (
                <div className="mt-4">
                  <label
                    htmlFor="skillsFilter"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Skills (comma separated)
                  </label>
                  <input
                    type="text"
                    id="skillsFilter"
                    value={filters.skills || ""}
                    onChange={(e) =>
                      handleFilterChange("skills", e.target.value)
                    }
                    placeholder="e.g. React, JavaScript, Python"
                    className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="mt-2 flex flex-wrap gap-2">
                    {skillOptions.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => {
                          const currentSkills = filters.skills
                            ? filters.skills.split(",").map((s) => s.trim())
                            : [];
                          if (!currentSkills.includes(skill)) {
                            const newSkills = [...currentSkills, skill].join(
                              ", "
                            );
                            handleFilterChange("skills", newSkills);
                          }
                        }}
                        className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs"
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-between">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-gray-500 hover:text-gray-700 font-medium text-sm flex items-center"
                >
                  <X size={16} className="mr-1" /> Reset Filters
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium"
                >
                  Apply Filters
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Search Results */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No results found</p>
          <button
            onClick={resetFilters}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear filters and try again
          </button>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <p className="text-gray-600 text-sm">
              Showing {results.length} of {totalProfiles} results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((user) => (
              <div
                key={user.id}
                className="border overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-2">
                  <div className="flex items-center space-x-4">
                    {user.profilePic ? (
                      <img
                        src={user.profilePic}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 font-semibold">
                        {user.firstName[0]}
                        {user.lastName[0]}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-semibold text-lg">
                          <Link
                            to={`/profile/${user.firstName}-${user.lastName}`.toLowerCase()}
                            className="hover:text-blue-600"
                          >
                            {user.firstName} {user.lastName}
                          </Link>
                        </h3>

                        {/* Reputation Badge */}
                        {user.role === "DEVELOPER" &&
                          user.developerInfo &&
                          user.developerInfo.reputationScore && (
                            <div className="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700 flex items-center">
                              <span className="mr-1">★</span>{" "}
                              {user.developerInfo.reputationScore}
                            </div>
                          )}
                      </div>
                      <p className="text-gray-600">
                        {user.title ||
                          (user.role === "DEVELOPER"
                            ? "Developer"
                            : "Recruiter")}
                      </p>
                      {user.country && user.city && (
                        <p className="text-gray-500 text-sm mt-1">
                          {user.city}, {user.country}
                        </p>
                      )}
                    </div>
                  </div>

                  {user.role === "DEVELOPER" && user.developerInfo && (
                    <div className="mt-4">
                      {/* Experience and Level */}
                      <div className="flex flex-wrap gap-2 mb-2">
                        {user.developerInfo.experience && (
                          <p className="text-sm text-gray-600">
                            {user.developerInfo.experience} years of experience
                          </p>
                        )}
                        {user.developerInfo.level && (
                          <p className="text-sm text-gray-600">
                            •{" "}
                            <span className="font-medium">
                              {user.developerInfo.level}
                            </span>{" "}
                            level
                          </p>
                        )}
                      </div>

                      {/* Description */}
                      {user.developerInfo.descriptions && (
                        <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                          {user.developerInfo.descriptions}
                        </p>
                      )}

                      {/* Skills */}
                      <div className="flex flex-wrap gap-1 mt-3">
                        {user.developerInfo.skills
                          ?.slice(0, 4)
                          .map((skill: string) => (
                            <span
                              key={skill}
                              className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs"
                            >
                              {skill}
                            </span>
                          ))}
                        {user.developerInfo.skills &&
                          user.developerInfo.skills.length > 4 && (
                            <span className="px-2 py-1 bg-gray-50 text-gray-700 rounded text-xs">
                              +{user.developerInfo.skills.length - 4} more
                            </span>
                          )}
                      </div>
                    </div>
                  )}

                  {user.role === "RECRUITER" && user.recruiterInfo && (
                    <div className="mt-4">
                      {user.recruiterInfo.company && (
                        <p className="text-sm text-gray-600">
                          {user.recruiterInfo.position} at{" "}
                          {user.recruiterInfo.company}
                        </p>
                      )}
                      {user.recruiterInfo.industry && (
                        <p className="text-sm text-gray-500 mt-1">
                          Industry: {user.recruiterInfo.industry}
                        </p>
                      )}
                    </div>
                  )}

                  {/* View Profile Button */}
                  <div className="mt-4 flex justify-end">
                    <Link
                      to={`/profile/${user.firstName}-${user.lastName}`.toLowerCase()}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      View Profile
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <nav className="inline-flex rounded-md shadow-sm">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-l-md border text-sm font-medium ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  Previous
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1 border-t border-b text-sm font-medium ${
                        currentPage === pageNum
                          ? "bg-blue-50 text-blue-600 border-blue-200"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() =>
                    handlePageChange(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-r-md border text-sm font-medium ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchResults;
