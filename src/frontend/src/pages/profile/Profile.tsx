import React, { useState, useEffect } from "react";
import {
  FaEdit,
  FaCamera,
  FaMapMarkerAlt,
  FaCertificate,
  FaGithub,
  FaMedal,
  FaTrophy,
  FaStar,
} from "react-icons/fa";
import { ProfileImpactCard } from "../../appUi/components/profileCard";
import { UserProfile } from "../../types/profile";
import { getProfile } from "../../api/profiles";
import { Badge } from "../../appUi/components/ui/badge";
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
      )} px-3 py-1 rounded-full text-sm font-semibold`}
    >
      {level} Level
    </div>
  );
};

const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await getProfile();
      if (response.success) {
        setProfile(response.profile);
      }
    };
    fetchProfile();
  }, []);

  if (!profile)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  console.log(profile);
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Skills</h3>
              <div className="flex flex-wrap">
                {devInfo.skills.map((skill, index) => (
                  <Badge key={index} icon={FaStar} color="blue" text={skill} />
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                Achievements
              </h3>
              <div className="flex flex-wrap">
                <Badge
                  icon={FaMedal}
                  color="green"
                  text={`Projects: ${devInfo.completedProjects}`}
                />
                <Badge
                  icon={FaMedal}
                  color="purple"
                  text={`Experience: ${devInfo.experience} years`}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex space-x-4">
            {devInfo.githubProfile && (
              <a
                href={devInfo.githubProfile}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-600 hover:text-gray-800"
              >
                <FaGithub className="mr-2" /> GitHub Profile
              </a>
            )}
            {devInfo.portfolioUrl && (
              <a
                href={devInfo.portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-600 hover:text-gray-800"
              >
                Portfolio
              </a>
            )}
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
              <button className="absolute top-4 right-4 bg-black/20 hover:bg-black/30 p-2 rounded-full transition">
                <FaCamera className="text-white" size={18} />
              </button>
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
                <button className="absolute bottom-0 right-0 bg-gray-200 p-1.5 rounded-full hover:bg-gray-300">
                  <FaCamera size={16} className="text-gray-600" />
                </button>
              </div>
              {renderDeveloperInfo()}
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

                  <div className="mt-6">
                    <FaEdit
                      className="mr-2 cursor-pointer text-primaryBlueColor"
                      size={18}
                    />
                  </div>
                </div>
              </div>
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

          {/* Developer-specific Information */}

          {/* Sections with "Add" functionality */}
          {[
            {
              title: "Experience",
              icon: null,
              emptyText: "No experience added yet",
            },
            {
              title: "Education",
              icon: null,
              emptyText: "No education history added yet",
            },
            {
              title: "Certifications",
              icon: <FaCertificate className="mr-2 text-primaryBlueColor" />,
              emptyText: "No certifications added yet",
            },
            { title: "Skills", icon: null, emptyText: "No skills added yet" },
          ].map((section, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 p-6"
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                {section.icon}
                {section.title}
                <button className="ml-auto text-primaryBlueColor hover:bg-blue-50 px-3 py-1 rounded-full">
                  + Add
                </button>
              </h2>
              <div className="text-gray-500 text-center py-8">
                {section.emptyText}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
