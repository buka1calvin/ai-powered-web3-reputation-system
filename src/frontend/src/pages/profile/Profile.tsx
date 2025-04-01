import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  FaEdit,
  FaCamera,
  FaMapMarkerAlt,
  FaCertificate,
  FaGithub,
  FaMedal,
  FaTrophy,
  FaGlobe,
  FaStar,
  FaLinkedin,
} from "react-icons/fa";
import { ProfileImpactCard } from "../../appUi/components/profileCard";
import { UserProfile } from "../../types/profile";
import { getProfile, getProfileByName } from "../../api/profiles";
import { Badge } from "../../appUi/components/ui/badge";
import { MoonLoader } from "react-spinners";

const RankBadge = ({ level }: { level: string }) => {
  const getRankColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-green-100 text-green-700";
      case "Intermediate":
        return "bg-blue-100 text-blue-700";
      case "Advanced":
        return "bg-purple-100 text-purple-700";
      case "Expert":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };
  return (
    <div
      className={`${getRankColor(
        level
      )} px-3 py-1 rounded-full text-sm font-semibold mt-2`}
    >
      {level} Level
    </div>
  );
};

const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username?: string }>();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        // If username is provided in URL params, fetch that user's profile
        if (username) {
          const response = await getProfileByName(username);
          console.log("response==++",response)
          if (response.success) {
            setProfile(response.profile);
            setIsOwnProfile(false);
          } else {
            setError(response.message || "Failed to load profile");
          }
        } else {
          // Otherwise fetch the current user's profile
          const response = await getProfile();
          if (response.success) {
            setProfile(response.profile);
            setIsOwnProfile(true);
          } else {
            setError("Failed to load your profile");
          }
        }
      } catch (err) {
        setError("An error occurred while fetching the profile");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [username]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <MoonLoader color="#1a56db" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-700 mb-2">Profile Not Found</h2>
          <p className="text-gray-600">The requested profile could not be found.</p>
        </div>
      </div>
    );
  }

  // Render developer-specific information
  const renderDeveloperInfo = () => {
    if (profile.role === "developer" && profile.developerInfo) {
      const devInfo = profile.developerInfo;
      return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Developer Profile
          </h2>

          <div className="flex items-center mb-4">
            <RankBadge level={devInfo.level} />
            <div className="ml-4 flex items-center">
              <FaTrophy className="mr-2 text-yellow-500" />
              <span className="text-gray-600">
                Reputation Score: {devInfo.reputationScore}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Skills</h3>
              <div className="flex flex-wrap">
                {devInfo.skills.map((skill, index) => (
                  <Badge key={index} icon={FaStar} color="blue" text={skill} />
                ))}
              </div>
            </div>

            <div className="">
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                GitHub Profile
              </h3>
              <div className="flex flex-wrap">
                <Badge
                  icon={FaMedal}
                  color="green"
                  text={`Projects: ${
                    devInfo.githubProfile?.repositories?.total || 0
                  }`}
                />
                <Badge
                  icon={FaMedal}
                  color="green"
                  text={`Total Repositories: ${
                    devInfo.githubProfile?.repositories?.total || 0
                  }`}
                />
                <Badge
                  icon={FaMedal}
                  color="green"
                  text={`Public Repositories: ${
                    devInfo.githubProfile?.repositories?.publicRepos || 0
                  }`}
                />
                <Badge
                  icon={FaMedal}
                  color="green"
                  text={`Total Commits: ${
                    devInfo.githubProfile?.contributions?.totalCommits || 0
                  }`}
                />
                <Badge
                  icon={FaMedal}
                  color="green"
                  text={`Merged Pull Requests: ${
                    devInfo.githubProfile?.contributions?.pullRequests
                      ?.merged || 0
                  }`}
                />
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  Work Experience
                </h3>
                <div className="flex flex-wrap">
                  <Badge
                    icon={FaStar}
                    color="purple"
                    text={`Current Role: ${
                      devInfo.workExperience?.currentRole?.title || "N/A"
                    }`}
                  />
                  <Badge
                    icon={FaStar}
                    color="purple"
                    text={`Company: ${devInfo.workExperience?.currentRole?.company || "N/A"}`}
                  />
                  <Badge
                    icon={FaTrophy}
                    color="purple"
                    text={`Total Experience: ${
                      devInfo.workExperience?.totalYearsOfExperience || 0
                    } years`}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex space-x-6 items-center justify-center">
            <div className="">
              <a
                href={devInfo.githubProfile?.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-600 hover:text-gray-800"
              >
                <FaGithub className="mr-1" /> GitHub Profile
              </a>
            </div>
            <div className="">
              <a
                href={devInfo.workExperience?.linkedin_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-600 hover:text-gray-800"
              >
                <FaLinkedin className="mr-1" /> Linkedin Profile
              </a>
            </div>
            <a
              href={devInfo.portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-gray-600 hover:text-gray-800"
            >
              <FaGlobe className="mr-1" /> Portfolio
            </a>
          </div>

          {devInfo.bio && (
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                Professional Bio
              </h3>
              <p className="text-gray-600">{devInfo.bio}</p>
            </div>
          )}

          {devInfo.education && (
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                Education
              </h3>
              <p className="text-gray-600">{devInfo.education}</p>
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-gray-50">
      <div className="flex gap-6">
        {/* Impact Card - Left Sidebar */}
        <ProfileImpactCard />

        {/* Main Content */}
        <div className="w-2/3 space-y-6">
          {/* Profile Header Card - LinkedIn Style */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Cover Photo */}
            <div className="relative h-48 bg-gradient-to-r from-blue-500 to-blue-700">
              {profile.coverPic ? (
                <img
                  src={profile.coverPic}
                  alt="Cover"
                  className="w-full h-full object-cover opacity-80"
                />
              ) : null}
              {isOwnProfile && (
                <button className="absolute top-4 right-4 bg-black/20 hover:bg-black/30 p-2 rounded-full transition">
                  <FaCamera className="text-white" size={18} />
                </button>
              )}
            </div>

            {/* Profile Content */}
            <div className="px-6 pb-6 relative">
              {/* Profile Picture */}
              <div className="absolute -top-16 left-6 rounded-full border-4 border-white">
                <img
                  src={profile.profilePic}
                  alt={`${profile.firstName} ${profile.lastName}`}
                  className="w-32 h-32 rounded-full object-cover"
                />
                {isOwnProfile && (
                  <button className="absolute bottom-0 right-0 bg-gray-200 p-1.5 rounded-full hover:bg-gray-300">
                    <FaCamera size={16} className="text-gray-600" />
                  </button>
                )}
              </div>
              
              {/* Profile Header */}
              <div className="pt-16">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-2xl mt-4 font-semibold text-gray-800 flex items-center">
                      {`${profile.firstName} ${profile.lastName}`}
                    </h1>

                    <div className="mt-1 flex items-center space-x-2">
                      <span className="text-base text-gray-600 font-medium">
                        {profile.title}
                      </span>
                      <div className="h-4 border-l border-gray-300 mx-2"></div>
                      <div className="flex items-center text-gray-500 space-x-1">
                        <FaMapMarkerAlt />
                        <span className="text-sm">{`${profile.district}, ${profile.country}`}</span>
                      </div>
                    </div>
                  </div>

                  {isOwnProfile && (
                    <div className="mt-6">
                      <FaEdit
                        className="mr-2 cursor-pointer text-primaryBlueColor"
                        size={18}
                      />
                    </div>
                  )}
                </div>
              </div>
              
              {renderDeveloperInfo()}
            </div>
          </div>

          {/* Personal Information Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Personal Information
            </h2>
            <div className="grid grid-cols-2 gap-4 text-gray-600">
              {[
                { label: "Email", value: profile.email },
                { label: "Phone", value: profile.phone },
                { label: "Role", value: profile.role },
                { label: "Gender", value: profile.gender },
                { label: "Date of Birth", value: profile.dateOfBirth },
                { label: "Province", value: profile.province },
              ].map((item, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                  <p className="font-medium">{item.value || "Not Provided"}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;