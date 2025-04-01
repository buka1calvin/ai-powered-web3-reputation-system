import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { ICreateProfile } from "../../schemas/profiles";
import Heading from "../../appUi/components/ui/Heading";
import SelectWithErrorCustomSelect from "../../appUi/components/forms/Select";
import Input from "../../appUi/components/forms/Input";
import Button from "../../appUi/components/forms/Button";
import { ImageDropzone } from "../../appUi/components/dropzone/dropzone";
import { createProfile } from "../../api/profiles";
import { getStoredUserData } from "../../api/signin";
import { ProgrammingAssessment } from "../../appUi/components/ai/Ai";
import { EvaluationResult } from "../../types/types";
import {
  fetchGitHubAccessToken,
  fetchGitHubUserData,
} from "../../api/github";
import {
  connectWithLinkedIn,
  fetchLinkedInAccessToken,
  fetchLinkedInUserData,
  fetchLinkedInProfileDetails,
  processLinkedInDataForProfile,
  enhanceLinkedInData
} from "../../api/linkedin";
import {
  calculateReputationScoreWithAI,
} from "../../api/ai/reputationScoreCalculator";

// Add a function to store and retrieve assessment results from localStorage
const storeAssessmentResults = (results: EvaluationResult) => {
  localStorage.setItem("assessmentResults", JSON.stringify(results));
};

const getStoredAssessmentResults = (): EvaluationResult | null => {
  const stored = localStorage.getItem("assessmentResults");
  return stored ? JSON.parse(stored) : null;
};

// Add functions to store and retrieve GitHub and LinkedIn data
const storeGitHubData = (data: any) => {
  localStorage.setItem("githubData", JSON.stringify(data));
};

const getStoredGitHubData = (): any | null => {
  const stored = localStorage.getItem("githubData");
  return stored ? JSON.parse(stored) : null;
};

const storeLinkedInData = (data: any) => {
  localStorage.setItem("linkedInData", JSON.stringify(data));
};

const getStoredLinkedInData = (): any | null => {
  const stored = localStorage.getItem("linkedInData");
  return stored ? JSON.parse(stored) : null;
};

// Helper function to fetch image and convert to file
const fetchImageAsFile = async (
  url: string,
  filename: string
): Promise<File | null> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
  } catch (error) {
    console.error("Error fetching image:", error);
    return null;
  }
};

const ProfileCreation: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(
    null
  );
  const [coverPicPreview, setCoverPicPreview] = useState<string | null>(null);
  const [profile, setProfile] = useState<boolean>(false);
  const [results, setResults] = useState<EvaluationResult | null>(
    getStoredAssessmentResults()
  );
  const [githubData, setGithubData] = useState<any>(getStoredGitHubData());
  const [linkedInData, setLinkedInData] = useState<any>(getStoredLinkedInData());
  const [isConnectingGithub, setIsConnectingGithub] = useState(false);
  const [isConnectingLinkedIn, setIsConnectingLinkedIn] = useState(false);

  const user = getStoredUserData();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ICreateProfile>({
    defaultValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      phone: user?.phone,
      title: results?.title,
    },
  });

  // Set profile to true if we have stored assessment results or social data
  useEffect(() => {
    if (results || githubData || linkedInData) {
      setProfile(true);
    }
  }, [results, githubData, linkedInData]);

  // Custom setState function that also persists to localStorage
  const setResultsWithStorage = (newResults: EvaluationResult) => {
    setResults(newResults);
    storeAssessmentResults(newResults);
  };

  // Custom setState function for GitHub data that also persists to localStorage
  const setGithubDataWithStorage = (data: any) => {
    setGithubData(data);
    storeGitHubData(data);
  };

  // Custom setState function for LinkedIn data that also persists to localStorage
  const setLinkedInDataWithStorage = (data: any) => {
    setLinkedInData(data);
    storeLinkedInData(data);
  };

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const codeParam = urlParams.get("code");
    const stateParam = urlParams.get("state");

    if (codeParam) {
      // Check if this is a LinkedIn callback (state starts with 'linkedin_')
      if (stateParam && stateParam.startsWith("linkedin_")) {
        setIsConnectingLinkedIn(true);
        handleLinkedInAuth(codeParam)
          .then(() => {
            setProfile(true);
            // Clear the URL parameters after processing
            navigate(window.location.pathname, { replace: true });
          })
          .catch((error) => {
            console.error("LinkedIn connection error:", error);
            setIsConnectingLinkedIn(false);
          });
      }
      // If not LinkedIn, assume it's GitHub
      else {
        setIsConnectingGithub(true);
        handleGitHubAuth(codeParam).then(() => {
          setProfile(true);
          if (stateParam) {
            navigate(stateParam, { replace: true });
          } else {
            navigate(window.location.pathname, { replace: true });
          }
        });
      }
    }
    
    // Check for LinkedIn data in localStorage that might have been set by handleLinkedInCallback
    const linkedInProfileData = localStorage.getItem("linkedInProfileData");
    if (linkedInProfileData) {
      try {
        const parsedData = JSON.parse(linkedInProfileData);
        setLinkedInDataWithStorage(parsedData);
        
        // Update form with LinkedIn data
        if (parsedData.basicProfile) {
          if (!user?.firstName && parsedData.basicProfile.firstName) {
            setValue("firstName", parsedData.basicProfile.firstName);
          }
          if (!user?.lastName && parsedData.basicProfile.lastName) {
            setValue("lastName", parsedData.basicProfile.lastName);
          }
          if (!user?.email && parsedData.basicProfile.email) {
            setValue("email", parsedData.basicProfile.email);
          }
          if (parsedData.basicProfile.headline) {
            setValue("title", parsedData.basicProfile.headline);
          }
          
          // Set profile picture if available
          if (parsedData.basicProfile.pictureUrl) {
            setProfilePicPreview(parsedData.basicProfile.pictureUrl);
            
            // Fetch image as file for upload
            fetchImageAsFile(
              parsedData.basicProfile.pictureUrl,
              "profile-pic.jpg"
            )
              .then((file) => {
                if (file) handleSetValue("profilePic", file);
              })
              .catch((error) => {
                console.error("Error fetching LinkedIn profile picture:", error);
              });
          }
        }
        
        // Remove from localStorage after using it
        localStorage.removeItem("linkedInProfileData");
      } catch (error) {
        console.error("Error parsing LinkedIn profile data from localStorage:", error);
      }
    }
    
    // Set profile picture from GitHub data if available
    if (githubData?.avatar_url && !profilePicPreview) {
      setProfilePicPreview(githubData.avatar_url);
      
      // Fetch image as file for upload
      fetchImageAsFile(
        githubData.avatar_url,
        "github-profile-pic.jpg"
      )
        .then((file) => {
          if (file) handleSetValue("profilePic", file);
        })
        .catch((error) => {
          console.error("Error fetching GitHub profile picture:", error);
        });
    }
    
    // Set profile picture from LinkedIn data if available
    if (linkedInData?.basicProfile?.pictureUrl && !profilePicPreview) {
      setProfilePicPreview(linkedInData.basicProfile.pictureUrl);
      
      // Fetch image as file for upload
      fetchImageAsFile(
        linkedInData.basicProfile.pictureUrl,
        "linkedin-profile-pic.jpg"
      )
        .then((file) => {
          if (file) handleSetValue("profilePic", file);
        })
        .catch((error) => {
          console.error("Error fetching LinkedIn profile picture:", error);
        });
    }
  }, [navigate, setValue, user, githubData, linkedInData, profilePicPreview]);

  const handleGitHubAuth = async (code: string) => {
    try {
      const accessToken = await fetchGitHubAccessToken(code);
      const userData = await fetchGitHubUserData(accessToken);
      setGithubDataWithStorage(userData);

      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (error) {
      console.error("Error in GitHub authentication process:", error);
    } finally {
      setIsConnectingGithub(false);
    }
  };

  // Updated handleLinkedInAuth function to use the enhanced version
  const handleLinkedInAuth = async (code: string) => {
    try {
      // Get the access token
      const accessToken = await fetchLinkedInAccessToken(code);
      
      // Fetch basic user data
      const userData = await fetchLinkedInUserData(accessToken);
      
      // Try to fetch profile details, but don't rely on it
      let profileDetails = {};
      try {
        const response = await fetchLinkedInProfileDetails(accessToken);
        profileDetails = response;
      } catch (detailsError) {
        console.log("LinkedIn profile details not available, continuing with basic data");
      }
      
      // Combine the data
      const combinedData = {
        ...userData,
        ...profileDetails
      };
      
      // Process the data
      let processedData = processLinkedInDataForProfile(combinedData);
      
      // Enhance the data with synthetic content where needed
      processedData = enhanceLinkedInData(processedData);
      
      // Set the data in state with storage
      setLinkedInDataWithStorage(processedData);
      
      // Update form fields with LinkedIn data
      if (processedData.basicProfile) {
        if (!user?.firstName && processedData.basicProfile.firstName) {
          setValue("firstName", processedData.basicProfile.firstName);
        }
        if (!user?.lastName && processedData.basicProfile.lastName) {
          setValue("lastName", processedData.basicProfile.lastName);
        }
        if (!user?.email && processedData.basicProfile.email) {
          setValue("email", processedData.basicProfile.email);
        }
        if (processedData.basicProfile.headline) {
          setValue("title", processedData.basicProfile.headline);
        }
        
        // If there's a LinkedIn profile picture, set it as profile pic preview
        if (processedData.basicProfile.pictureUrl) {
          setProfilePicPreview(processedData.basicProfile.pictureUrl);
          
          // Fetch the image and convert to File for actual upload
          fetchImageAsFile(
            processedData.basicProfile.pictureUrl,
            "profile-pic.jpg"
          )
            .then((file) => {
              if (file) handleSetValue("profilePic", file);
            })
            .catch((error) => {
              console.error("Error fetching LinkedIn profile picture:", error);
            });
        }
      }
      
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      return processedData;
    } catch (error) {
      console.error("Error in LinkedIn authentication process:", error);
      throw error;
    } finally {
      setIsConnectingLinkedIn(false);
    }
  };

  useEffect(() => {
    if (results?.title) {
      setValue("title", results.title);
    }
  }, [results, setValue]);

  const handleSetValue = (name: string, value: File) => {
    setValue(name as keyof ICreateProfile, value as any);
  };

  const onSubmit = async (data: any) => {
    console.log("Submitting profile data:", data);
    setIsLoading(true);
    try {
      // Create GitHub profile object from githubData
      const githubProfile = githubData
        ? {
            username: githubData.login,
            html_url: githubData.html_url,
            portfolioUrl: githubData.blog,
            repositories: {
              total: githubData.public_repos,
              publicRepos: githubData.public_repos,
            },
            languages: githubData.languages_url
              ? await fetchLanguages(githubData.languages_url)
              : undefined,
          }
        : undefined;

      // Create LinkedIn profile object with better error handling
      const linkedinProfile = linkedInData
        ? {
            profileUrl: linkedInData.basicProfile?.profileUrl || "",
            headline: linkedInData.basicProfile?.headline || "",
            experience: linkedInData.experience || [],
            education: linkedInData.education || [],
            skills: (linkedInData.skills || []).map((s: any) => s.name || "")
          }
        : undefined;

      // Calculate reputation score using AI
      let reputationScore = 50; // Default score
      let reputationExplanation = "";
      let improvementSuggestions: any[] = [];

      try {
        // Enhance LinkedIn data before passing to reputation calculator if needed
        const enhancedLinkedInData = linkedInData 
          ? (linkedInData.skills && linkedInData.skills.length > 0 
              ? linkedInData 
              : enhanceLinkedInData(linkedInData))
          : null;
        
        const aiReputationResult = await calculateReputationScoreWithAI(
          results,
          githubData,
          enhancedLinkedInData
        );

        reputationScore = aiReputationResult.score;
        reputationExplanation = aiReputationResult.explanation;
        improvementSuggestions = aiReputationResult.suggestions || [];
      } catch (aiError) {
        console.error("Error getting AI reputation score:", aiError);
      }

      // Create workExperience object with combined skills
      const workExperience = {
        linkedin_link: linkedInData?.basicProfile?.profileUrl || "",
        skills: [
          ...(results?.strengths || []),
          ...((linkedInData?.skills || []).map((s: any) => s.name || "")),
        ],
        experience: linkedInData?.experience || [],
      };

      // Structure the data for profile creation
      const profileData = {
        ...data,
        developerInfo: {
          skills: [
            ...(results?.strengths || []),
            ...((linkedInData?.skills || []).map((s: any) => s.name || "")),
          ],
          reputationScore: reputationScore,
          level: results?.assignedLevel || "Beginner",
          education: linkedInData?.education || [],

          githubProfile: githubProfile,
          linkedinProfile: linkedinProfile,
          workExperience: workExperience,
          portfolioUrl:
            githubData?.blog ||
            linkedInData?.basicProfile?.profileUrl ||
            undefined,
          descriptions:
            githubData?.bio ||
            undefined,

          reputationDetails: {
            explanation: reputationExplanation,
            improvementSuggestions: improvementSuggestions,
            lastUpdated: new Date().toISOString(),
          },
        },
      };

      console.log("Submitting profile data:", profileData);
      await createProfile(profileData);

      // Clear stored data after successful profile creation
      localStorage.removeItem("assessmentResults");
      localStorage.removeItem("githubData");
      localStorage.removeItem("linkedInData");

      const userData = getStoredUserData();
      if (userData) {
        const profileUrl =
          `/profile/${userData.lastName}-${userData.firstName}`.toLowerCase();
        navigate(profileUrl);
      }
    } catch (error) {
      console.error("Error creating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLanguages = async (languagesUrl: string): Promise<string[]> => {
    try {
      const response = await fetch(languagesUrl);
      const languages = await response.json();
      return Object.keys(languages);
    } catch (error) {
      console.error("Error fetching languages:", error);
      return [];
    }
  };

  const gender = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
  ];

  const country = [{ value: "rwanda", label: "Rwanda" }];

  // Update the LinkedIn connect button click handler
  const handleLinkedInConnect = () => {
    connectWithLinkedIn();
  };

  return (
    <div
      className={`${
        !profile ? "max-w-[1340px]" : "max-w-[650px] border"
      }   bg-white p-4 rounded-md mx-auto`}
    >
      {!profile ? (
        <>
          <ProgrammingAssessment
            setEvaluationResult={(newResults) => {
              if (newResults) {
                setResultsWithStorage(newResults as EvaluationResult);
              }
              setProfile(true);
            }}
            setProfile={setProfile}
          />
        </>
      ) : (
        <>
          <Heading
            subTitle="Create your profile to be seen by recruiters"
            className="md:text-md"
            subTitleClassName="text-base text-[16px] mt-0 mb-10"
          >
            Create your profile
          </Heading>

          {/* Social Integration Section */}
          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* GitHub Connection */}
            <div className="p-4 border border-gray-200 rounded-lg">
              {!githubData ? (
                <div className="flex flex-col items-center justify-center gap-4">
                  <h2 className="text-lg font-medium">Connect with GitHub</h2>
                  <p className="text-sm text-gray-600 text-center">
                    Import your GitHub profile data
                  </p>
                  <Button
                    className="bg-black text-white hover:bg-gray-800"
                    isLoading={isConnectingGithub}
                    loadingText="Connecting..."
                    onClick={() => {
                      const state = window.location.pathname;
                      window.location.href = `https://github.com/login/oauth/authorize?client_id=${
                        (import.meta as any).env.VITE_CLIENT_ID
                      }&state=${state}`;
                    }}
                  >
                    <span className="flex items-center gap-2">
                      <svg
                        viewBox="0 0 24 24"
                        width="16"
                        height="16"
                        fill="white"
                      >
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      Connect GitHub
                    </span>
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <img
                    src={githubData.avatar_url}
                    alt="GitHub Avatar"
                    className="w-16 h-16 rounded-full border-2 border-gray-300"
                  />
                  <div>
                    <h3 className="font-medium">
                      {githubData.name || githubData.login}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {githubData.bio || "GitHub connected"}
                    </p>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                        {githubData.public_repos} Repos
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* LinkedIn Connection */}
            <div className="p-4 border border-gray-200 rounded-lg">
              {!linkedInData ? (
                <div className="flex flex-col items-center justify-center gap-4">
                  <h2 className="text-lg font-medium">Connect with LinkedIn</h2>
                  <p className="text-sm text-gray-600 text-center">
                    Import your LinkedIn profile data
                  </p>
                  <Button
                    className="bg-blue-600 text-white hover:bg-blue-700"
                    isLoading={isConnectingLinkedIn}
                    loadingText="Connecting..."
                    onClick={handleLinkedInConnect}
                  >
                    <span className="flex items-center gap-2">
                      <svg
                        viewBox="0 0 24 24"
                        width="16"
                        height="16"
                        fill="white"
                      >
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                      Connect LinkedIn
                    </span>
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  {linkedInData.basicProfile.pictureUrl && (
                    <img
                      src={linkedInData.basicProfile.pictureUrl}
                      alt="LinkedIn Profile"
                      className="w-16 h-16 rounded-full border-2 border-gray-300"
                    />
                  )}
                  <div>
                    <h3 className="font-medium">
                      {linkedInData.basicProfile.firstName}{" "}
                      {linkedInData.basicProfile.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {linkedInData.basicProfile.headline ||
                        "LinkedIn connected"}
                    </p>
                    {linkedInData.skills && linkedInData.skills.length > 0 && (
                      <div className="flex gap-2 mt-1">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {linkedInData.skills.length} Skills
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Display assessment results */}
          {results && (
            <div className="mb-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h3 className="font-medium mb-2">Assessment Results</h3>
              <p>
                <strong>Title:</strong> {results.title}
              </p>
              <p>
                <strong>Level:</strong> {results.assignedLevel}
              </p>
              {results.strengths && results.strengths.length > 0 && (
                <div>
                  <p className="font-medium mt-2">Skills:</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {results.strengths.map((skill, index) => (
                      <span
                        key={index}
                        className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="relative mb-20">
              <div>
                <ImageDropzone
                  name="profilePic"
                  label="Profile Picture"
                  preview={profilePicPreview}
                  onPreviewChange={setProfilePicPreview}
                  setValue={handleSetValue}
                />
              </div>
              <ImageDropzone
                name="coverPic"
                label="Cover Picture"
                preview={coverPicPreview}
                onPreviewChange={setCoverPicPreview}
                setValue={handleSetValue}
              />
            </div>

            <Input
              error={errors.firstName?.message}
              {...register("firstName")}
              label="First Name"
              placeholder="Enter your first name"
            />

            <Input
              error={errors.lastName?.message}
              {...register("lastName")}
              label="Last Name"
              placeholder="Enter your last name"
            />

            <Input
              type="date"
              error={errors.dateOfBirth?.message}
              {...register("dateOfBirth")}
              label="Date of Birth"
            />

            <SelectWithErrorCustomSelect
              name="gender"
              onChange={(selectedOption) => {
                if (selectedOption?.value) {
                  setValue("gender", selectedOption.value as any);
                }
              }}
              label="Gender"
              options={gender}
              error={errors.gender?.message}
            />

            <Input
              type="email"
              error={errors.email?.message}
              {...register("email")}
              label="Email"
              placeholder="Enter your email"
            />

            <Input
              error={errors.phone?.message}
              {...register("phone")}
              label="Phone Number"
              placeholder="Enter your phone number"
            />

            <SelectWithErrorCustomSelect
              name="country"
              onChange={(selectedOption) => {
                setValue("country", selectedOption?.value as any);
              }}
              label="Country"
              options={country}
              error={errors.country?.message}
            />

            <Input
              error={errors.district?.message}
              {...register("district")}
              label="District"
              placeholder="Enter your district"
            />

            <Input
              error={errors.province?.message}
              {...register("province")}
              label="Province"
              placeholder="Enter your province"
            />

            <Input
              error={errors.title?.message}
              {...register("title")}
              label="Title"
              placeholder="Enter your title"
            />

            <div>
              <label
                htmlFor="descriptions"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="descriptions"
                {...register("descriptions")}
                rows={4}
                placeholder="Enter your description"
                className={`mt-1 block w-full border p-2 border-gray-300 rounded-md shadow-sm focus:ring-largeTextColor focus:border-largeTextColor sm:text-md ${
                  errors.descriptions ? "border-red-500" : ""
                }`}
              ></textarea>
              {errors.descriptions && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.descriptions.message}
                </p>
              )}
            </div>

            <Button
              loadingText="Creating Profile..."
              isLoading={isLoading}
              className={`${
                isLoading ? "bg-white" : "bg-largeTextColor"
              } text-white`}
              type="submit"
            >
              Create Profile
            </Button>
          </form>
        </>
      )}
    </div>
  );
};

export default ProfileCreation;