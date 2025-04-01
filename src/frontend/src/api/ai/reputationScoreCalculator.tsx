import { GoogleGenerativeAI } from "@google/generative-ai";

// Reuse the existing genAI instance from your application
const API_KEY = (import.meta as any).env.VITE_GEMINI_API_KEY;
export const genAI = new GoogleGenerativeAI(API_KEY);

export const calculateReputationScoreWithAI = async (
  assessmentResults: any,
  githubData: any,
  linkedinData: any = null
): Promise<{ score: number; explanation: string; suggestions: string[] }> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Check if linkedinData has the expected structure, if not, process it
    let processedLinkedinData = linkedinData;
    if (linkedinData && typeof linkedinData === 'object') {
      // If it seems to be raw LinkedIn data without processing
      if (!linkedinData.basicProfile && (linkedinData.given_name || linkedinData.firstName)) {
        processedLinkedinData = processLinkedinData(linkedinData);
      }
    }

    // Create a structured prompt that includes all relevant information
    const prompt = `
    You are a developer reputation scoring system. Analyze the provided data and calculate a reputation score (0-100) for this developer.

    ASSESSMENT RESULTS:
    ${JSON.stringify(assessmentResults, null, 2)}

    GITHUB PROFILE:
    ${JSON.stringify(githubData, null, 2)}
    
    ${processedLinkedinData ? `LINKEDIN PROFILE:
    ${JSON.stringify(processedLinkedinData, null, 2)}` : 'NO LINKEDIN DATA AVAILABLE'}

    Consider the following factors:
    1. Assessment performance (level assigned, strengths, weaknesses)
    2. GitHub presence (repos, followers, account age, activity)
    3. Portfolio completeness (bio, blog/website)
    4. Skills demonstrated
    ${processedLinkedinData ? `5. LinkedIn profile (may be limited to basic information)
    6. Professional title and headline
    7. Any available career information
    8. Available skills` : ''}

    If LinkedIn or GitHub data is limited or missing, focus more on assessment results and available data.

    Return a JSON response with:
    1. A score between 0 and 100
    2. A brief explanation of how the score was determined
    3. Suggestions for improvement

    Format as:
    {
      "reputationScore": 75,
      "explanation": "Score based on combination of assessment results, GitHub profile${processedLinkedinData ? ', and LinkedIn profile' : ''}...",
      "improvementSuggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3"]
    }
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Extract JSON response
    const jsonMatch = 
      text.match(/```json\n([\s\S]*?)\n```/) || 
      text.match(/```\n([\s\S]*?)\n```/) || 
      text.match(/{[\s\S]*}/);

    if (jsonMatch) {
      try {
        const aiResponse = JSON.parse(jsonMatch[1] || jsonMatch[0]);
        
        return {
          score: aiResponse.reputationScore,
          explanation: aiResponse.explanation,
          suggestions: aiResponse.improvementSuggestions
        };
      } catch (e) {
        console.error("Failed to parse AI response:", e);
        
        // Fallback to a default score if parsing fails
        return createFallbackReputationScore(assessmentResults, githubData, processedLinkedinData);
      }
    } else {
      console.error("No valid JSON in AI response");
      
      // Fallback to a default score if no JSON is found
      return createFallbackReputationScore(assessmentResults, githubData, processedLinkedinData);
    }
  } catch (error) {
    console.error("Error calculating reputation score with AI:", error);
    
    // Provide a fallback score in case of API error
    return createFallbackReputationScore(assessmentResults, githubData, linkedinData);
  }
};


const createFallbackReputationScore = (
  assessmentResults: any,
  githubData: any,
  linkedinData: any
): { score: number; explanation: string; suggestions: string[] } => {
  let score = 50; // Start with a base score of 50
  const factors = [];
  const suggestions = [];
  
  // Adjust score based on assessment results
  if (assessmentResults) {
    if (assessmentResults.passed) {
      score += 10;
      factors.push("successful programming assessment");
    }
    
    if (assessmentResults.strengths && assessmentResults.strengths.length > 0) {
      score += Math.min(assessmentResults.strengths.length * 2, 10); // Max +10 points for strengths
      factors.push(`demonstrated strengths in ${assessmentResults.strengths.length} areas`);
    } else {
      suggestions.push("Complete more skill assessments to showcase your strengths");
    }
    
    if (assessmentResults.assignedLevel) {
      if (assessmentResults.assignedLevel.toLowerCase() === "expert") {
        score += 15;
        factors.push("expert level assessment");
      } else if (assessmentResults.assignedLevel.toLowerCase() === "intermediate") {
        score += 10;
        factors.push("intermediate level assessment");
      } else {
        score += 5;
        factors.push("beginner level assessment");
      }
    }
  } else {
    suggestions.push("Complete the programming assessment to improve your score");
  }
  
  // Adjust score based on GitHub data
  if (githubData) {
    score += 5; // Base points for having GitHub
    factors.push("GitHub profile");
    
    if (githubData.public_repos > 0) {
      const repoPoints = Math.min(githubData.public_repos, 10); // Max +10 for repos
      score += repoPoints;
      factors.push(`${githubData.public_repos} public repositories`);
    } else {
      suggestions.push("Create and publish more GitHub repositories");
    }
    
    if (githubData.followers > 0) {
      const followerPoints = Math.min(githubData.followers, 5); // Max +5 for followers
      score += followerPoints;
      factors.push(`${githubData.followers} GitHub followers`);
    }
    
    if (githubData.bio) {
      score += 2;
      factors.push("complete GitHub bio");
    } else {
      suggestions.push("Add a bio to your GitHub profile");
    }
  } else {
    suggestions.push("Connect your GitHub profile to improve your score");
  }
  
  // Adjust score based on LinkedIn data
  if (linkedinData) {
    score += 5; // Base points for having LinkedIn
    factors.push("LinkedIn profile");
    
    if (linkedinData.skills && linkedinData.skills.length > 0) {
      const skillPoints = Math.min(linkedinData.skills.length, 10); // Max +10 for skills
      score += skillPoints;
      factors.push(`${linkedinData.skills.length} listed skills`);
    } else {
      suggestions.push("Add more skills to your LinkedIn profile");
    }
    
    if (linkedinData.experience && linkedinData.experience.length > 0) {
      const experiencePoints = Math.min(linkedinData.experience.length * 2, 10); // Max +10 for experience
      score += experiencePoints;
      factors.push(`professional experience (${linkedinData.experience.length} positions)`);
    } else {
      suggestions.push("Add your work experience to your LinkedIn profile");
    }
    
    if (linkedinData.education && linkedinData.education.length > 0) {
      score += 3;
      factors.push("educational background");
    }
  } else {
    suggestions.push("Connect your LinkedIn profile to improve your score");
  }

  score = Math.max(0, Math.min(100, score));
  if (suggestions.length < 3) {
    const genericSuggestions = [
      "Regularly contribute to open-source projects on GitHub",
      "Create a personal portfolio website showcasing your projects",
      "Obtain relevant certifications in your technology stack",
      "Participate in coding challenges and competitions",
      "Write technical blog posts or articles to demonstrate expertise",
      "Join and contribute to developer communities",
      "Complete your developer profile with a professional photo",
      "Focus on projects that demonstrate your expertise in specific areas"
    ];
    
    for (const suggestion of genericSuggestions) {
      if (!suggestions.includes(suggestion) && suggestions.length < 3) {
        suggestions.push(suggestion);
      }
    }
  }
  
  return {
    score,
    explanation: `Reputation score of ${score} calculated based on ${factors.join(", ")}.`,
    suggestions
  };
};

export const processLinkedinData = (rawLinkedinData: any) => {
  if (!rawLinkedinData) return null;
  
  try {
    if (rawLinkedinData.basicProfile) {
      return rawLinkedinData;
    }

    return {
      basicProfile: {
        firstName: rawLinkedinData.given_name || rawLinkedinData.firstName || "",
        lastName: rawLinkedinData.family_name || rawLinkedinData.lastName || "",
        email: rawLinkedinData.email || "",
        headline: rawLinkedinData.headline || "",
        location: rawLinkedinData.location || "",
        industry: rawLinkedinData.industry || "",
        connectionCount: rawLinkedinData.connectionCount || 0,
        profileUrl: rawLinkedinData.sub ? 
          `https://www.linkedin.com/in/${rawLinkedinData.sub.split(':').pop()}` : 
          rawLinkedinData.profileUrl || "",
        pictureUrl: rawLinkedinData.picture || rawLinkedinData.profilePicture || ""
      },
      experience: rawLinkedinData.positions?.elements?.map((position: any) => ({
        companyName: position.company?.name || "",
        title: position.title || "",
        startDate: position.startDate ? `${position.startDate.year}-${position.startDate.month || '01'}` : "",
        endDate: position.endDate ? `${position.endDate.year}-${position.endDate.month || '01'}` : "Present",
        description: position.description || ""
      })) || [],
      education: rawLinkedinData.education?.elements?.map((education: any) => ({
        schoolName: education.schoolName || "",
        degree: education.degree || "",
        fieldOfStudy: education.fieldOfStudy || "",
        startDate: education.startDate ? `${education.startDate.year}` : "",
        endDate: education.endDate ? `${education.endDate.year}` : "Present"
      })) || [],
      skills: rawLinkedinData.skills?.elements?.map((skill: any) => ({
        name: skill.name || "",
        level: skill.level || "Intermediate"
      })) || [],
      certifications: rawLinkedinData.certifications?.values?.map((cert: any) => ({
        name: cert.name || "",
        authority: cert.authority?.name || "",
        startDate: cert.startDate ? `${cert.startDate.year}` : "",
        endDate: cert.endDate ? `${cert.endDate.year}` : ""
      })) || []
    };
  } catch (error) {
    console.error("Error processing LinkedIn data:", error);
    
    // Return a minimal structure instead of null
    return {
      basicProfile: {
        firstName: "LinkedIn",
        lastName: "User",
        headline: "Professional",
        profileUrl: "https://www.linkedin.com"
      },
      experience: [],
      education: [],
      skills: [],
      certifications: []
    };
  }
};