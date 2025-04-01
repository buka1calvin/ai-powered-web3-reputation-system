import { v4 as uuidv4 } from "uuid";
import { StableBTreeMap, Principal } from "azle";
import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
// import "dotenv/config"

import { User, UserProfile, UserRole } from "./types/types";
import { validateDeveloperInfo, validateRecruiterInfo } from "./utility";

const users = StableBTreeMap<string, User>(0);
const userProfiles = StableBTreeMap<string, UserProfile>(1);

const app = express();
app.use(cors());
app.use(express.json());

//Register an account
app.post("/auth/signup", async (req, res) => {
  const {
    email,
    password,
    role = "developer",
    firstName,
    lastName,
    phone,
  } = req.body;

  if (!email || !password || !firstName || !lastName || !role) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  if (role !== UserRole.DEVELOPER && role !== UserRole.RECRUITER) {
    return res.status(400).json({
      success: false,
      message: "Invalid role. Must be developer or recruiter",
    });
  }

  const existingUser = users.values().find((user) => user.email === email);
  if (existingUser) {
    return res
      .status(400)
      .json({ success: false, message: "Email already exists" });
  }

  const sessionId = uuidv4();
  const hashedPassword = await bcrypt.hash(password, 8);
  const userId = uuidv4();

  const newUser: User = {
    id: userId,
    firstName,
    lastName,
    phone,
    email,
    password: hashedPassword,
    role,
    sessionId,
  };
  users.insert(userId, newUser);
  return res.status(200).json({
    success: true,
    message: "Signup successful",
    sessionId,
    userId,
    role,
  });
});

// Login endpoint
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const user = Array.from(users.values()).find((user) => user.email === email);

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const sessionId = uuidv4();
  user.sessionId = sessionId;
  users.insert(user.id, user);

  return res.status(200).json({
    success: true,
    message: "Login successful",
    sessionId,
    userId: user.id,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
  });
});

//middleware

const verifySession = (req: any, res: any, next: any) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const user = Array.from(users.values()).find(
    (u: any) => u.sessionId === token
  );

  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  req.user = user;
  next();
};

app.post("/auth/logout", verifySession, (req: any, res: any) => {
  const user = (req as any).user;
  try {
    console.log("user", user);
    user.sessionId = "";
    users.insert(user.id, user);

    return res.json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during logout",
      error,
      user,
    });
  }
});

//create Profile

app.post("/profile/create", verifySession, async (req: any, res: any) => {
  const userId = (req as any).user.id;
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      gender,
      country,
      district,
      profilePic,
      coverPic,
      title,
      province,
      developerInfo,
      recruiterInfo,
    } = req.body;

    const { role } = (req as any).user;
    if (!firstName || !lastName || !email || !role) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const existingProfile = Array.from(userProfiles.values()).find(
      (profile) => profile.email === email
    );

    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: "Profile already exists",
      });
    }

    if (
      role === "DEVELOPER" &&
      (!developerInfo || !validateDeveloperInfo(developerInfo))
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing developer information",
      });
    }

    if (
      role === "RECRUITER" &&
      (!recruiterInfo || !validateRecruiterInfo(recruiterInfo))
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing recruiter information",
      });
    }

    const newProfile: UserProfile = {
      id: uuidv4(),
      userId,
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      gender,
      country,
      district,
      profilePic,
      coverPic,
      title,
      province,
      role,
      joinedDate: new Date(),
      lastActive: new Date(),
      developerInfo,
    };
    userProfiles.insert(newProfile.id, newProfile);

    return res.status(201).json({
      success: true,
      message: "Profile created successfully",
      profile: newProfile,
    });
  } catch (error) {
    console.error("Profile creation error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get current user profile
app.get("/profile/me", verifySession, (req: any, res: any) => {
  try {
    const user = (req as any).user;
    const userProfile = Array.from(userProfiles.values()).find(
      (profile) => profile.userId === user.id
    );

    if (!userProfile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    return res.json({
      success: true,
      profile: userProfile,
    });
  } catch (error) {
    console.error("Error fetching own profile:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Update profile
app.put("/profile/update", verifySession, async (req: any, res: any) => {
  try {
    const user = (req as any).user;
    const updateData = req.body;

    const userProfile = Array.from(userProfiles.values()).find(
      (profile) => profile.userId === user.id
    );

    if (!userProfile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    const updatedProfile = {
      ...userProfile,
      ...updateData,
      lastActive: new Date(),
    };

    if (user.role === UserRole.DEVELOPER && updateData.developerInfo) {
      updatedProfile.developerInfo = {
        ...userProfile.developerInfo,
        ...updateData.developerInfo,
      };
    } else if (user.role === UserRole.RECRUITER && updateData.recruiterInfo) {
      updatedProfile.recruiterInfo = {
        ...userProfile.recruiterInfo,
        ...updateData.recruiterInfo,
      };
    }

    userProfiles.insert(userProfile.id, updatedProfile);
    return res.json({
      success: true,
      message: "Profile updated successfully",
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

app.post("/getAccessToken", async (req: any, res: any) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: "Authorization code is required" });
    }
    
    const response = await fetch(`https://github.com/login/oauth/access_token`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        client_id: "Ov23liUnpwgIXQJ3TCkg",
        client_secret: "4240e1296dd67a298e51e7fa15a6685dac3a4233",
        code: code
      })
    });
    
    if (!response.ok) {
      throw new Error(`GitHub API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error: any) {
    console.error("Error obtaining GitHub access token:", error);
    return res.status(500).json({
      error: "Failed to obtain access token",
      message: error.message
    });
  }
});
app.post("/getUserData", async (req: any, res: any) => {
  try {
    const { accessToken } = req.body;
    
    if (!accessToken) {
      return res.status(401).json({ error: "Access token is required" });
    }
    
    const response = await fetch("https://api.github.com/user", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json"
      },
    });
    
    if (!response.ok) {
      throw new Error(`GitHub API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error: any) {
    console.error("Error fetching GitHub user data:", error);
    return res.status(500).json({
      error: "Failed to fetch user data",
      message: error.message
    });
  }
});

app.post("/getLinkedInAccessToken", async (req:any, res:any) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: "Authorization code is required" });
    }
    
    // Prepare request body as string - avoid using URLSearchParams
    const requestBody = 
      `grant_type=authorization_code&` +
      `code=${encodeURIComponent(code)}&` +
      `client_id=779arcfohtj76f&` +
      `client_secret=${encodeURIComponent("WPL_AP1.Rz5Flw6Piv9Bw7UF.R38r7g==")}&` +
      `redirect_uri=${encodeURIComponent("http://localhost:5173/auth/linkedin/callback")}`;
    
    // Log for debugging
    console.log("LinkedIn request body:", requestBody);
    
    // Make request to LinkedIn
    const response = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: requestBody
    });
    
    // Handle response
    if (!response.ok) {
      const errorText = await response.text();
      console.error("LinkedIn API error response:", errorText);
      throw new Error(`LinkedIn API responded with status: ${response.status}, ${errorText}`);
    }
    
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error:any) {
    console.error("Error obtaining LinkedIn access token:", error);
    return res.status(500).json({
      error: "Failed to obtain LinkedIn access token",
      message: error.message
    });
  }
});

app.post("/getLinkedInUserData", async (req: any, res: any) => {
  try {
    const { accessToken } = req.body;
    
    if (!accessToken) {
      return res.status(401).json({ error: "Access token is required" });
    }
    
    const response = await fetch("https://api.linkedin.com/v2/userinfo", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json"
      },
    });
    
    if (!response.ok) {
      throw new Error(`LinkedIn API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error: any) {
    console.error("Error fetching LinkedIn user data:", error);
    return res.status(500).json({
      error: "Failed to fetch LinkedIn user data",
      message: error.message
    });
  }
});


app.post("/getLinkedInProfileDetails", async (req: any, res: any) => {
  try {
    const { accessToken } = req.body;
    
    if (!accessToken) {
      return res.status(401).json({ error: "Access token is required" });
    }
    
    // Fetch basic profile data
    const profileResponse = await fetch(
      "https://api.linkedin.com/v2/me?projection=(id,firstName,lastName,profilePicture(displayImage~:playableStreams))", 
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json"
        }
      }
    );
    
    if (!profileResponse.ok) {
      throw new Error(`LinkedIn API responded with status: ${profileResponse.status}`);
    }
    
    const profileData = await profileResponse.json();
    
    // Fetch position/experience data
    const positionsResponse = await fetch(
      "https://api.linkedin.com/v2/positions?q=memberPositions&memberIdentity=(id:" + profileData.id + ")", 
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json"
        }
      }
    );
    
    let positions = [];
    if (positionsResponse.ok) {
      const positionsData = await positionsResponse.json();
      positions = positionsData.elements || [];
    }
    
    return res.status(200).json({
      profile: profileData,
      positions: positions
    });
    
  } catch (error: any) {
    console.error("Error fetching LinkedIn profile details:", error);
    return res.status(500).json({
      error: "Failed to fetch LinkedIn profile details",
      message: error.message
    });
  }
});
// Search profiles (public)
app.post("/profiles/search", (req, res) => {
  try {
    const {
      role,
      skills,
      name,
      experienceMin,
      location,
      page = 1,
      limit = 10,
    } = req.body; // Changed from req.query to req.body
    
    // Filter profiles based on search criteria
    let filteredProfiles = Array.from(userProfiles.values());
    
    if (role) {
      filteredProfiles = filteredProfiles.filter(
        (profile) => profile.role === role
      );
    }
    
    if (location) {
      filteredProfiles = filteredProfiles.filter(
        (profile) =>
          profile.country
            ?.toLowerCase()
            .includes(location.toString().toLowerCase()) ||
          profile.city
            ?.toLowerCase()
            .includes(location.toString().toLowerCase())
      );
    }
    
    if (skills && role === UserRole.DEVELOPER) {
      const skillsArray = skills.toString().toLowerCase().split(",");
      filteredProfiles = filteredProfiles.filter((profile) =>
        profile.developerInfo?.skills.some((skill) =>
          skillsArray.includes(skill.toLowerCase())
        )
      );
    }
    
    if (experienceMin && role === UserRole.DEVELOPER) {
      filteredProfiles = filteredProfiles.filter(
        (profile) =>
          profile.developerInfo &&
          profile.developerInfo.experience >= Number(experienceMin)
      );
    }
    
    // Name search functionality
    if (name) {
      filteredProfiles = filteredProfiles.filter(
        (profile) =>
          profile.firstName.toLowerCase().includes(name.toString().toLowerCase()) ||
          profile.lastName.toLowerCase().includes(name.toString().toLowerCase())
      );
    }
    
    // Apply pagination
    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = Number(page) * Number(limit);
    
    // Create safe public profiles (omitting sensitive info)
    const paginatedProfiles = filteredProfiles
      .slice(startIndex, endIndex)
      .map((profile) => ({
        id: profile.id,
        firstName: profile.firstName,
        lastName: profile.lastName,
        role: profile.role,
        profilePic: profile.profilePic,
        country: profile.country,
        city: profile.city,
        title: profile.title, // Added title for display in search results
        // Include role-specific public info
        ...(profile.role === UserRole.DEVELOPER && {
          developerInfo: {
            skills: profile.developerInfo?.skills,
            experience: profile.developerInfo?.experience,
            reputationScore: profile.developerInfo?.reputationScore,
            completedProjects: profile.developerInfo?.completedProjects,
            githubProfile: profile.developerInfo?.githubProfile,
          },
        }),
        ...(profile.role === UserRole.RECRUITER && {
          recruiterInfo: {
            company: profile.recruiterInfo?.company,
            position: profile.recruiterInfo?.position,
            industry: profile.recruiterInfo?.industry,
            reputationScore: profile.recruiterInfo?.reputationScore,
          },
        }),
      }));
    
    return res.json({
      success: true,
      page: Number(page),
      totalProfiles: filteredProfiles.length,
      totalPages: Math.ceil(filteredProfiles.length / Number(limit)),
      profiles: paginatedProfiles,
    });
  } catch (error) {
    console.error("Error searching profiles:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Public profile route - can be accessed using firstName and lastName
app.post("/profiles/public", async (req, res) => {
  try {
    const { name } = req.body;
    console.log("Looking for profile with name:", name);
    
    let matchingProfiles;
    
    matchingProfiles = Array.from(userProfiles.values()).filter(profile => {
      const fullName = `${profile.firstName} ${profile.lastName}`.toLowerCase();
      const hyphenName = `${profile.firstName}-${profile.lastName}`.toLowerCase();
      
      return fullName === name.toLowerCase() || 
             hyphenName === name.toLowerCase();
    });
    if (matchingProfiles.length === 0) {
      let firstName: any, lastName: any;
      
      if (name.includes("-")) {
        [firstName, lastName] = name.split("-").map((part:any) =>
           part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
        );
      } else {
        firstName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
      }
      
      matchingProfiles = Array.from(userProfiles.values()).filter(profile => {
        if (lastName) {
          return profile.firstName.toLowerCase() === firstName.toLowerCase() &&
                 profile.lastName.toLowerCase() === lastName.toLowerCase();
        } else {
          return profile.firstName.toLowerCase() === firstName.toLowerCase();
        }
      });
    }
    
    console.log(`Found ${matchingProfiles.length} matching profiles`);
    
    if (matchingProfiles.length === 0) {
      console.log("Available profiles:", 
        Array.from(userProfiles.values()).map(p => 
          `${p.firstName} ${p.lastName}`
        )
      );
      
      return res.status(404).json({
        success: false,
        message: "Profile not found"
      });
    }
    
    const publicProfile: any = matchingProfiles[0];
    
    return res.json({
      success: true,
      profile: publicProfile
    });
  } catch (error) {
    console.error("Error fetching public profile:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

app.use(express.static("/dist"));
app.listen();
