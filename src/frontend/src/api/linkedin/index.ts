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
      `https://www.linkedin.com/in/calvin-bukarani-19852219a` : 
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
  
  // Initialize skills array if it doesn't exist
  if (!enhancedData.skills) {
    enhancedData.skills = [];
  }
  
  // Initialize programmingLanguages array if it doesn't exist
  if (!enhancedData.programmingLanguages) {
    enhancedData.programmingLanguages = [];
  }
  
  // Define common programming languages
  const programmingLanguages = [
    { name: 'JavaScript', level: "Intermediate" },
    { name: 'TypeScript', level: "Intermediate" },
    { name: 'Python', level: "Intermediate" },
    { name: 'Java', level: "Intermediate" },
    { name: 'C#', level: "Intermediate" },
    { name: 'PHP', level: "Intermediate" },
    { name: 'Ruby', level: "Intermediate" },
    { name: 'Go', level: "Intermediate" },
    { name: 'Rust', level: "Intermediate" },
    { name: 'Swift', level: "Intermediate" },
    { name: 'Kotlin', level: "Intermediate" },
    { name: 'C++', level: "Intermediate" },
    { name: 'C', level: "Intermediate" }
  ];
  
  // Define common frameworks and technologies
  const technologies = [
    { name: 'React', level: "Intermediate" },
    { name: 'Angular', level: "Intermediate" },
    { name: 'Vue.js', level: "Intermediate" },
    { name: 'Node.js', level: "Intermediate" },
    { name: 'Express', level: "Intermediate" },
    { name: 'Django', level: "Intermediate" },
    { name: 'Flask', level: "Intermediate" },
    { name: 'Spring Boot', level: "Intermediate" },
    { name: 'ASP.NET', level: "Intermediate" },
    { name: 'Laravel', level: "Intermediate" },
    { name: 'Ruby on Rails', level: "Intermediate" }
  ];
  
  const otherTechSkills = [
    { name: 'HTML', level: "Intermediate" },
    { name: 'CSS', level: "Intermediate" },
    { name: 'SQL', level: "Intermediate" },
    { name: 'NoSQL', level: "Intermediate" },
    { name: 'MongoDB', level: "Intermediate" },
    { name: 'PostgreSQL', level: "Intermediate" },
    { name: 'MySQL', level: "Intermediate" },
    { name: 'AWS', level: "Intermediate" },
    { name: 'Azure', level: "Intermediate" },
    { name: 'GCP', level: "Intermediate" },
    { name: 'Docker', level: "Intermediate" },
    { name: 'Kubernetes', level: "Intermediate" },
    { name: 'Git', level: "Intermediate" },
    { name: 'CI/CD', level: "Intermediate" },
    { name: 'DevOps', level: "Intermediate" },
    { name: 'RESTful APIs', level: "Intermediate" },
    { name: 'GraphQL', level: "Intermediate" },
    { name: 'Machine Learning', level: "Intermediate" },
    { name: 'Data Science', level: "Intermediate" },
    { name: 'Agile Methodologies', level: "Intermediate" }
  ];
  
  const existingSkillNames = new Set(
    enhancedData.skills.map((skill: any) => skill.name?.toLowerCase() || '')
  );
  
  const existingProgrammingLanguageNames = new Set(
    enhancedData.programmingLanguages.map((lang: any) => 
      typeof lang === 'string' ? lang.toLowerCase() : lang.name?.toLowerCase() || ''
    )
  );
  
  const isProgrammingLanguage = (skillName: string): boolean => {
    return programmingLanguages.some(lang => 
      lang.name.toLowerCase() === skillName.toLowerCase()
    );
  };
  
  if (enhancedData.basicProfile?.headline) {
    const headline = enhancedData.basicProfile.headline.toLowerCase();
    
    programmingLanguages.forEach(lang => {
      if (headline.includes(lang.name.toLowerCase()) && 
          !existingProgrammingLanguageNames.has(lang.name.toLowerCase())) {
        enhancedData.programmingLanguages.push(lang);
        existingProgrammingLanguageNames.add(lang.name.toLowerCase());
      }
    });
    
    [...technologies, ...otherTechSkills].forEach(skill => {
      if (headline.includes(skill.name.toLowerCase()) && 
          !existingSkillNames.has(skill.name.toLowerCase())) {
        enhancedData.skills.push(skill);
        existingSkillNames.add(skill.name.toLowerCase());
      }
    });
  }
  

  const filteredSkills = enhancedData.skills.filter((skill: any) => {
    const skillName = skill.name?.toLowerCase() || '';
    if (isProgrammingLanguage(skillName) && !existingProgrammingLanguageNames.has(skillName)) {

      enhancedData.programmingLanguages.push(skill);
      existingProgrammingLanguageNames.add(skillName);
      return false;
    }
    return true;
  });
  enhancedData.skills = filteredSkills;
  
  let progLangCount = enhancedData.programmingLanguages.length;
  
  let langIndex = 0;
  while (progLangCount < 3 && langIndex < programmingLanguages.length) {
    const lang = programmingLanguages[langIndex];
    if (!existingProgrammingLanguageNames.has(lang.name.toLowerCase())) {
      enhancedData.programmingLanguages.push(lang);
      existingProgrammingLanguageNames.add(lang.name.toLowerCase());
      progLangCount++;
    }
    langIndex++;
  }
  
  const hasTechnology = enhancedData.skills.some((skill: any) => 
    technologies.some(tech => tech.name.toLowerCase() === (skill.name?.toLowerCase() || ''))
  );
  
  if (!hasTechnology) {
    const techToAdd = technologies.find(tech => 
      !existingSkillNames.has(tech.name.toLowerCase())
    );
    
    if (techToAdd) {
      enhancedData.skills.push(techToAdd);
      existingSkillNames.add(techToAdd.name.toLowerCase());
    }
  }
  
  if (!enhancedData.experience || enhancedData.experience.length === 0) {
    enhancedData.experience = [];
    
    if (enhancedData.basicProfile?.headline) {
      const title = enhancedData.basicProfile.headline.split(' at ')[0] || enhancedData.basicProfile.headline;
      const company = enhancedData.basicProfile.headline.includes(' at ') 
        ? enhancedData.basicProfile.headline.split(' at ')[1]
        : '';
      
      const topSkills = [
        ...enhancedData.programmingLanguages.slice(0, 2).map((lang: any) => 
          typeof lang === 'string' ? lang : lang.name
        ),
        ...enhancedData.skills.slice(0, 1).map((skill: any) => skill.name)
      ].filter(Boolean);
      
      enhancedData.experience.push({
        title: title,
        companyName: company || "Current Company",
        startDate: `${new Date().getFullYear() - 1}-01`,
        endDate: "Present",
        description: `Working with ${topSkills.join(', ')} to develop and maintain applications.`
      });
    } else {
      const topSkills = [
        ...enhancedData.programmingLanguages.slice(0, 2).map((lang: any) => 
          typeof lang === 'string' ? lang : lang.name
        ),
        ...enhancedData.skills.slice(0, 1).map((skill: any) => skill.name)
      ].filter(Boolean);
      
      enhancedData.experience.push({
        title: "Software Developer",
        companyName: "Current Company",
        startDate: `${new Date().getFullYear() - 1}-01`,
        endDate: "Present",
        description: `Working with ${topSkills.join(', ')} to develop and maintain applications.`
      });
    }
  }
  
  enhancedData.programmingLanguages = enhancedData.programmingLanguages.map((lang: any) => {
    return typeof lang === 'string' ? { name: lang, level: "Intermediate" } : lang;
  });
  
  return enhancedData;
};

export const handleLinkedInCallback = async () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const code = urlParams.get("code");
  const state = urlParams.get("state");
  
  const storedState = localStorage.getItem("linkedInAuthState");
  
  if (!code || !state || state !== storedState) {
    throw new Error("Invalid LinkedIn callback parameters");
  }
  
  try {
    localStorage.removeItem("linkedInAuthState");
    
    const accessToken = await fetchLinkedInAccessToken(code);
    
    const userData = await fetchLinkedInUserData(accessToken);

    let profileDetails = {};
    try {
      profileDetails = await fetchLinkedInProfileDetails(accessToken);
    } catch (detailsError) {
      console.log("LinkedIn profile details not available, continuing with basic data");
    }
    
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