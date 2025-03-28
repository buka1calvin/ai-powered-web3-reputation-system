export type MarksCategory = {
  category: string;
  marks: number;
};

export type CourseMarks = {
  id?: string;
  studentRegNumber: string;
  name: string;
  email: string;
  department?: string;
  university?: string;
  year: number;
  course: string;
  marks: MarksCategory[];
  createdAt?: Date;
  updatedAt?: Date;
};
