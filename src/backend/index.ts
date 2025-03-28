import { v4 as uuidv4 } from "uuid";
import { StableBTreeMap, Principal } from "azle";
import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";

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

// Search profiles (public)
app.get("/profiles/search", (req, res) => {
  try {
    const {
      role,
      skills,
      name,
      experienceMin,
      location,
      page = 1,
      limit = 10,
    } = req.query;

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

app.use(express.static("/dist"));
app.listen();
