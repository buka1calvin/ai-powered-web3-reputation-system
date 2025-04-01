export type NavLinks = {
  link: string;
  label: string;
};

type progressProps = {
  progress: number;
  title: string;
  desc: string;
};


type Track = {
  count: number;
  sign: string;
  title: string;
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
