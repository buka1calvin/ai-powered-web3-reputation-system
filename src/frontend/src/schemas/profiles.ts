import * as z from "zod";

export enum Gender {
  Female = "female",
  Male = "male",
}

export enum Country {
  Rwanda = "rwanda",
}

export type GitHubProfile = {
  username?: string;
  html_url: string;
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
  linkedin_link: string;
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
  education: string[];
};

const githubProfileSchema = z.object({
  username: z.string().optional(),
  html_url: z.string(),
  repositories: z
    .object({
      total: z.number().optional(),
      publicRepos: z.number().optional(),
    })
    .optional(),
  contributions: z
    .object({
      totalCommits: z.number().optional(),
      pullRequests: z
        .object({
          merged: z.number().optional(),
        })
        .optional(),
    })
    .optional(),
  languages: z.array(z.string()).optional(),
});

const workExperienceSchema = z.object({
  currentRole: z
    .object({
      title: z.string().optional(),
      company: z.string().optional(),
    })
    .optional(),
  linkedin_link: z.string(),
  totalYearsOfExperience: z.number().optional(),
  skills: z.array(z.string()).optional(),
});

const developerInfoSchema = z.object({
  skills: z.array(z.string()),
  githubProfile: githubProfileSchema.optional(),
  workExperience: workExperienceSchema.optional(),
  portfolioUrl: z.string().optional(),
  bio: z.string().optional(),
  reputationScore: z.number(),
  level: z.string(),
  education: z.array(z.string()).optional(),
});

export const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().nonempty("Date of birth is required"),
  gender: z.nativeEnum(Gender, {
    required_error: "Gender is required",
    invalid_type_error: "Please select a valid gender",
  }),
  email: z.string().email("Invalid email address"),
  phone: z.string().nonempty("Phone number is required"),
  country: z.nativeEnum(Country, { required_error: "Country is required" }),
  province: z.string().nonempty("Province is required"),
  district: z.string().nonempty("District is required"),
  profilePic: z.instanceof(File).optional(),
  coverPic: z.instanceof(File).optional(),
  title: z.string().min(3, "Title must be at least 3 characters"),
  descriptions: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must not exceed 500 characters"),
  developerInfo: developerInfoSchema,
});

export type ICreateProfile = z.infer<typeof profileSchema>;
