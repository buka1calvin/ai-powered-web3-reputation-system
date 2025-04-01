import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { searchUsers } from '../../api/profiles';

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
  role: string;
  developerInfo?: DeveloperInfo;
  recruiterInfo?: RecruiterInfo;
}

interface SearchResponse {
  success: boolean;
  profiles?: User[];
  message?: string;
}

const SearchResults: React.FC = () => {
  const location = useLocation();
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        // Get search parameters from URL
        const queryParams = new URLSearchParams(location.search);
        const query = queryParams.get('q') || '';
        
        // Create filters object from query params
        const filters: Record<string, string> = {};
        for (const [key, value] of queryParams.entries()) {
          if (key !== 'q' && value) {
            filters[key] = value;
          }
        }
        
        // Call the search API
        const response: SearchResponse = await searchUsers(query, filters);
        console.log("response===",response)
        
        if (response.success) {
          setResults(response.profiles || []);
        } else {
          setError(response.message || 'Failed to search');
        }
      } catch (err) {
        setError('An error occurred while searching');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [location.search]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Search Results</h1>
      
      {loading ? (
        <div className="flex justify-center">
          <p>Loading...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No results found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map(user => (
            <div 
              key={user.id} 
              className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-4">
                <div className="flex items-center space-x-4">
                  {user.profilePic ? (
                    <img 
                      src={user.profilePic} 
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                      {user.firstName[0]}{user.lastName[0]}
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-lg">
                      <Link to={`/profile/${user.firstName.toLowerCase()}-${user.lastName.toLowerCase()}`}>
                        {user.firstName} {user.lastName}
                      </Link>
                    </h3>
                    <p className="text-gray-600">{user.title}</p>
                  </div>
                </div>
                
                {user.role === "DEVELOPER" && user.developerInfo && (
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-1 mt-2">
                      {user.developerInfo.skills?.slice(0, 3).map(skill => (
                        <span key={skill} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                          {skill}
                        </span>
                      ))}
                      {user.developerInfo.skills && user.developerInfo.skills.length > 3 && (
                        <span className="px-2 py-1 bg-gray-50 text-gray-700 rounded text-xs">
                          +{user.developerInfo.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;