export type MarksCategory = {
  category: string;
  marks: number;
};

export type Course = {
  courseName: string;
  marks: MarksCategory[];
  createdAt: Date;
  updatedAt: Date;
};

export type StudentMarksRecord = {
  id: string;
  studentRegNumber: string;
  name: string;
  email: string;
  department?: string;
  university?: string;
  year: number;
  program: string;
  courses?: Course[] | any;
  createdAt: Date;
  updatedAt: Date;
};
