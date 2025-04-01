export enum UserRole {
  DEVELOPER = "developer",
  RECRUITER = "recruiter",
}

export type User = {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  sessionId: string;
  firstName: string;
  lastName: string;
  phone: string;
};

// Developer specific information

export type GitHubProfile = {
  username?: string;
  html_url:string
  repositories?: {
    total?: number;
    publicRepos?: number;
  };
  contributions?: {
    totalCommits?: number;
    pullRequests?: {
      merged?: number;
    };
  };
  languages?: string[];
};

export type WorkExperience = {
  currentRole?: {
    title?: string;
    company?: string;
  };
  linkedin_link:string;
  totalYearsOfExperience?: number;
  skills?: string[];
};

export type DeveloperInfo = {
  skills: string[];
  githubProfile?: GitHubProfile;
  workExperience?: WorkExperience;
  portfolioUrl?: string;
  bio?: string;
  reputationScore: number;
  level: string;
  education:string[]
};

// Recruiter specific information
export type RecruiterInfo = {
  company: string;
  position: string;
  companyWebsite?: string;
  industry?: string;
  companySize?: string;
  reputationScore: number;
  totalHires: number;
  activeJobPostings: number;
};

export type UserProfile = {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender?: "male" | "female" | "other";
  coverPic: string;
  district?: string;
  title: string;
  province: string;
  email: string;
  phone: string;
  role: UserRole;
  profilePic?: string;
  country?: string;
  city?: string;
  developerInfo?: DeveloperInfo;
  recruiterInfo?: RecruiterInfo;
  joinedDate: Date;
  lastActive: Date;
};
