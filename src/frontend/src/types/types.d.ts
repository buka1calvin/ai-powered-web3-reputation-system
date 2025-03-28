export type NavLinks = {
  link: string;
  label: string;
};

type Universities = {
  name?: string;
  description?: string;
  location?: string;
  ranking?: number;
  establishedYear?: number;
  departments?: {
    name?: string;
    facultyCount?: number;
    coursesOffered?: string[];
  }[];
  studentCount?: number;
  website?: string;
};

type progressProps = {
  progress: number;
  title: string;
  desc: string;
};

type Course = {
  id: number;
  name: string;
  code: string;
  department: string;
  year: string;
  lecturer: string;
  grade: string;
};

type Track = {
  count: number;
  sign: string;
  title: string;
};

type Student = {
  student_id: string;
  full_name: { first: string; middle: string; last: string };
  registration_id: string;
  program: string;
  year_of_study: string;
  email: string;
  phone_number: string;
  enrolled_courses: Course[];
  status: string;
  university: string;
  gpa: string;
  nationality: string;
};

export interface EvaluationResult {
  score: number;
  title: string;
  passed: boolean;
  assignedLevel: string;
  cheatingDetected?: boolean;
  feedback: string;
  strengths: string[];
  weaknesses: string[];
  resources: Resource[];
  timestamp?: string;
}

interface Resource {
  title: string;
  url: string;
}
