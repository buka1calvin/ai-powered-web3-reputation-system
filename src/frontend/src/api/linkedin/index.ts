import axios from "axios";

// LinkedIn Authentication Function
export const connectWithLinkedIn = () => {
  const LINKEDIN_CLIENT_ID = "779arcfohtj76f"; // Your LinkedIn Client ID
  const REDIRECT_URI = encodeURIComponent("http://localhost:5173/auth/linkedin/callback");
  const STATE = "linkedin_" + Date.now(); // Generate unique state
  
  // Store state in localStorage to verify when callback returns
  localStorage.setItem("linkedInAuthState", STATE);
  
  // Redirect to LinkedIn authorization page
  window.location.href = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${LINKEDIN_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&state=${STATE}&scope=openid%20profile%20email`;
};

// Fetch LinkedIn access token
export const fetchLinkedInAccessToken = async (code: string) => {
  try {
    const response = await axios.post(
      `${(import.meta as any).env.VITE_CANISTER_ORIGIN}/getLinkedInAccessToken`, 
      { code }
    );
    
    if (response.data.access_token) {
      // Store token in localStorage for future use
      localStorage.setItem("linkedInAccessToken", response.data.access_token);
      return response.data.access_token;
    }
    
    throw new Error("No LinkedIn access token received");
  } catch (error) {
    console.error("Error fetching LinkedIn access token:", error);
    throw error;
  }
};

// Fetch LinkedIn user data
export const fetchLinkedInUserData = async (accessToken: string) => {
  try {
    const response = await axios.post(
      `${(import.meta as any).env.VITE_CANISTER_ORIGIN}/getLinkedInUserData`, 
      { accessToken }
    );
    
    return response.data;
  } catch (error) {
    console.error("Error fetching LinkedIn user data:", error);
    throw error;
  }
};

// Fetch LinkedIn profile details - This will be used as a fallback but we want to avoid relying on it
export const fetchLinkedInProfileDetails = async (accessToken: string) => {
  try {
    const response = await axios.post(
      `${(import.meta as any).env.VITE_CANISTER_ORIGIN}/getLinkedInProfileDetails`, 
      { accessToken }
    );
    
    return response.data;
  } catch (error) {
    console.error("Error fetching LinkedIn profile details:", error);
    // Return empty object instead of throwing - we'll handle with just user data
    return {};
  }
};

// Process LinkedIn data for profile creation - Enhanced to handle limited data
export const processLinkedInDataForProfile = (linkedInData: any) => {
  // Basic profile information
  const basicProfile = {
    firstName: linkedInData.given_name || linkedInData.firstName || "",
    lastName: linkedInData.family_name || linkedInData.lastName || "",
    email: linkedInData.email || "",
    profileUrl: linkedInData.sub ? 
      `https://www.linkedin.com/in/${linkedInData.sub.split(':').pop()}` : 
      linkedInData.profileUrl || "",
    headline: linkedInData.headline || "",
    pictureUrl: linkedInData.picture || linkedInData.profilePicture || ""
  };
  
  // Experience (if available)
  const experience = linkedInData.positions?.elements?.map((position: any) => ({
    title: position.title || "",
    companyName: position.company?.name || "",
    startDate: position.startDate ? `${position.startDate.year}-${position.startDate.month || '01'}` : "",
    endDate: position.endDate ? `${position.endDate.year}-${position.endDate.month || '01'}` : "Present",
    description: position.description || ""
  })) || [];
  
  // Skills (if available)
  const skills = linkedInData.skills?.elements?.map((skill: any) => ({
    name: skill.name || "",
    level: skill.level || "Intermediate"
  })) || [];
  
  // Education (if available)
  const education = linkedInData.education?.elements?.map((edu: any) => ({
    schoolName: edu.schoolName || "",
    degree: edu.degree || "",
    fieldOfStudy: edu.fieldOfStudy || "",
    startDate: edu.startDate ? `${edu.startDate.year}` : "",
    endDate: edu.endDate ? `${edu.endDate.year}` : "Present"
  })) || [];
  
  return {
    basicProfile,
    experience,
    skills,
    education
  };
};

// Enhancement: Generate synthetic data when profile details are missing
export const enhanceLinkedInData = (basicData: any): any => {
  if (!basicData) return null;
  
  // Clone the data to avoid modifying the original
  const enhancedData = JSON.parse(JSON.stringify(basicData));
  
  // If we already have experience and skills, no need to enhance
  if ((enhancedData.experience && enhancedData.experience.length > 0) && 
      (enhancedData.skills && enhancedData.skills.length > 0)) {
    return enhancedData;
  }
  
  // Generate skills based on headline if none exist
  if (!enhancedData.skills || enhancedData.skills.length === 0) {
    enhancedData.skills = [];
    
    if (enhancedData.basicProfile?.headline) {
      // Extract potential skills from headline
      const headline = enhancedData.basicProfile.headline.toLowerCase();
      const potentialSkills = [
        'javascript', 'react', 'node', 'python', 'java', 'c#', 'php', 'ruby', 
        'go', 'rust', 'swift', 'kotlin', 'html', 'css', 'sql', 'nosql', 
        'frontend', 'backend', 'fullstack', 'devops', 'cloud', 'aws', 'azure', 
        'gcp', 'docker', 'kubernetes', 'machine learning', 'ai', 'data science'
      ];
      
      potentialSkills.forEach(skill => {
        if (headline.includes(skill)) {
          enhancedData.skills.push({ name: skill, level: "Intermediate" });
        }
      });
      
      // Add at least one generic skill if none were found
      if (enhancedData.skills.length === 0) {
        if (headline.includes('developer') || headline.includes('engineer')) {
          enhancedData.skills.push({ name: 'Programming', level: "Intermediate" });
          enhancedData.skills.push({ name: 'Software Development', level: "Intermediate" });
        } else {
          enhancedData.skills.push({ name: 'Professional Skills', level: "Intermediate" });
          enhancedData.skills.push({ name: 'Communication', level: "Intermediate" });
        }
      }
    } else {
      // Add generic skills if no headline
      enhancedData.skills.push({ name: 'Professional Skills', level: "Intermediate" });
      enhancedData.skills.push({ name: 'Communication', level: "Intermediate" });
    }
  }
  
  // Generate a synthetic experience entry if none exists
  if (!enhancedData.experience || enhancedData.experience.length === 0) {
    enhancedData.experience = [];
    
    if (enhancedData.basicProfile?.headline) {
      // Create an experience entry based on headline
      const title = enhancedData.basicProfile.headline.split(' at ')[0] || enhancedData.basicProfile.headline;
      const company = enhancedData.basicProfile.headline.includes(' at ') 
        ? enhancedData.basicProfile.headline.split(' at ')[1]
        : 'Current Company';
      
      enhancedData.experience.push({
        title: title,
        companyName: company,
        startDate: `${new Date().getFullYear() - 1}-01`,
        endDate: "Present",
        description: enhancedData.basicProfile.headline
      });
    } else {
      // Add a generic experience if no headline
      enhancedData.experience.push({
        title: "Professional",
        companyName: "Current Company",
        startDate: `${new Date().getFullYear() - 1}-01`,
        endDate: "Present",
        description: "Current position"
      });
    }
  }
  
  return enhancedData;
};

// Modified version of handleLinkedInCallback that avoids relying on profile details
export const handleLinkedInCallback = async () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const code = urlParams.get("code");
  const state = urlParams.get("state");
  
  // Verify state to prevent CSRF attacks
  const storedState = localStorage.getItem("linkedInAuthState");
  
  if (!code || !state || state !== storedState) {
    throw new Error("Invalid LinkedIn callback parameters");
  }
  
  try {
    // Clean up state after verification
    localStorage.removeItem("linkedInAuthState");
    
    // Exchange code for access token
    const accessToken = await fetchLinkedInAccessToken(code);
    
    // Fetch user data - this is our primary data source
    const userData = await fetchLinkedInUserData(accessToken);
    
    // Try to fetch profile details but don't depend on it
    let profileDetails = {};
    try {
      profileDetails = await fetchLinkedInProfileDetails(accessToken);
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
    
    // Store the processed data in localStorage for the profile page to use
    localStorage.setItem("linkedInProfileData", JSON.stringify(processedData));
    
    // Redirect back to profile creation page
    window.location.href = "/profile/create";
    
    return processedData;
  } catch (error) {
    console.error("Error during LinkedIn authentication:", error);
    // Even on error, redirect back to profile creation but with an error parameter
    window.location.href = "/profile/create?linkedin_error=true";
    throw error;
  }
};