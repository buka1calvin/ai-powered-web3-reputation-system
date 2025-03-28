export const NavLinks = [
  // {
  //   link: "/Home",
  //   label: "Universities",
  // },
  {
    link: "/login",
    label: "Login",
  },
  {
    link: "/signup",
    label: "Signup",
  },
  // {
  //   link: "/events",
  //   label: "Events",
  // },
  // {
  //   link: "/about",
  //   label: "About Us",
  // },
  // {
  //   link: "/student-portal",
  //   label: "Student Portal",
  // },
  // {
  //   link: "portal",
  //   label: "Lecturer Portal",
  // },
  // {
  //   link: "/dashboard",
  //   label: "Dashboard",
  // },
];

export const universities = [
  {
    name: "Harvard University",
    description:
      "An Ivy League research university in Cambridge, Massachusetts.",
    location: "Cambridge, Massachusetts, USA",
    ranking: 1,
    establishedYear: 1636,
    departments: [
      {
        name: "Engineering",
        facultyCount: 150,
        coursesOffered: ["Computer Science", "Mechanical Engineering"],
      },
      {
        name: "Business",
        facultyCount: 100,
        coursesOffered: ["MBA", "Finance"],
      },
    ],
    studentCount: 21000,
    website: "https://www.harvard.edu",
  },
  {
    name: "Stanford University",
    description: "A prestigious private research university in California.",
    location: "Stanford, California, USA",
    ranking: 2,
    establishedYear: 1885,
    departments: [
      {
        name: "Medicine",
        facultyCount: 200,
        coursesOffered: ["Neuroscience", "Cardiology"],
      },
      {
        name: "Law",
        facultyCount: 80,
        coursesOffered: ["Corporate Law", "International Law"],
      },
    ],
    studentCount: 16000,
    website: "https://www.stanford.edu",
  },
  {
    name: "University of Oxford",
    description:
      "One of the oldest and most prestigious universities in the world.",
    location: "Oxford, England, UK",
    ranking: 3,
    establishedYear: 1096,
    departments: [
      {
        name: "Humanities",
        facultyCount: 120,
        coursesOffered: ["Philosophy", "History"],
      },
      {
        name: "Sciences",
        facultyCount: 150,
        coursesOffered: ["Physics", "Biology"],
      },
    ],
    studentCount: 24000,
    website: "https://www.ox.ac.uk",
  },
  {
    name: "California Institute of Technology (Caltech)",
    description: "A world-renowned science and engineering institute.",
    location: "Pasadena, California, USA",
    ranking: 4,
    establishedYear: 1891,
    departments: [
      {
        name: "Physics",
        facultyCount: 90,
        coursesOffered: ["Astrophysics", "Quantum Physics"],
      },
      {
        name: "Chemistry",
        facultyCount: 60,
        coursesOffered: ["Organic Chemistry", "Inorganic Chemistry"],
      },
    ],
    studentCount: 2200,
    website: "https://www.caltech.edu",
  },
  {
    name: "University of Cambridge",
    description:
      "A leading academic institution in the UK known for its history and prestige.",
    location: "Cambridge, England, UK",
    ranking: 5,
    establishedYear: 1209,
    departments: [
      {
        name: "Mathematics",
        facultyCount: 110,
        coursesOffered: ["Pure Mathematics", "Applied Mathematics"],
      },
      {
        name: "Literature",
        facultyCount: 90,
        coursesOffered: ["English Literature", "Comparative Literature"],
      },
    ],
    studentCount: 21000,
    website: "https://www.cam.ac.uk",
  },
  {
    name: "Massachusetts Institute of Technology (MIT)",
    description:
      "A leading institution for science, technology, and innovation.",
    location: "Cambridge, Massachusetts, USA",
    ranking: 6,
    establishedYear: 1861,
    departments: [
      {
        name: "Computer Science",
        facultyCount: 180,
        coursesOffered: ["Artificial Intelligence", "Data Science"],
      },
      {
        name: "Engineering",
        facultyCount: 160,
        coursesOffered: ["Civil Engineering", "Electrical Engineering"],
      },
    ],
    studentCount: 11400,
    website: "https://www.mit.edu",
  },
  {
    name: "Princeton University",
    description:
      "An Ivy League research university known for its excellent liberal arts programs.",
    location: "Princeton, New Jersey, USA",
    ranking: 7,
    establishedYear: 1746,
    departments: [
      {
        name: "Economics",
        facultyCount: 80,
        coursesOffered: ["Macroeconomics", "Microeconomics"],
      },
      {
        name: "Political Science",
        facultyCount: 60,
        coursesOffered: ["International Relations", "Public Policy"],
      },
    ],
    studentCount: 8200,
    website: "https://www.princeton.edu",
  },
  {
    name: "University of Chicago",
    description:
      "A private university known for its research, economics, and law programs.",
    location: "Chicago, Illinois, USA",
    ranking: 8,
    establishedYear: 1890,
    departments: [
      {
        name: "Economics",
        facultyCount: 100,
        coursesOffered: ["Behavioral Economics", "Game Theory"],
      },
      {
        name: "Law",
        facultyCount: 85,
        coursesOffered: ["Constitutional Law", "Criminal Law"],
      },
    ],
    studentCount: 17000,
    website: "https://www.uchicago.edu",
  },
  {
    name: "ETH Zurich",
    description:
      "A world-class university known for its cutting-edge research in technology and engineering.",
    location: "Zurich, Switzerland",
    ranking: 9,
    establishedYear: 1855,
    departments: [
      {
        name: "Mechanical Engineering",
        facultyCount: 150,
        coursesOffered: ["Robotics", "Energy Systems"],
      },
      {
        name: "Architecture",
        facultyCount: 60,
        coursesOffered: ["Urban Design", "Sustainable Architecture"],
      },
    ],
    studentCount: 22000,
    website: "https://www.ethz.ch",
  },
  {
    name: "University of Tokyo",
    description:
      "A top university in Japan, known for its research in sciences and technology.",
    location: "Tokyo, Japan",
    ranking: 10,
    establishedYear: 1877,
    departments: [
      {
        name: "Physics",
        facultyCount: 90,
        coursesOffered: ["Nuclear Physics", "Theoretical Physics"],
      },
      {
        name: "Engineering",
        facultyCount: 100,
        coursesOffered: ["Civil Engineering", "Electrical Engineering"],
      },
    ],
    studentCount: 28000,
    website: "https://www.u-tokyo.ac.jp",
  },
];

export const courses = [
  {
    course_id: "bc451688-9a22-4878-8619-dbc587325535",
    course_name: "Plant Biotechnology",
    duration_in_hours: "48",
    credits: "4",
    lecturer: "Dr. Charles Darwin",
    year: "4",
    department: "Agriculture",
    status: "Completed",
  },
  {
    course_id: "6325665e-7ee0-4ba8-adff-31b3f443c548",
    course_name: "Thermodynamics",
    duration_in_hours: "161",
    credits: "5",
    lecturer: "Dr. Isaac Newton",
    year: "4",
    department: "Physics",
    status: "Ongoing",
  },
  {
    course_id: "8c5cee39-23c8-4fd7-84dc-0c41aa6dfdd5",
    course_name: "Soil Science",
    duration_in_hours: "50",
    credits: "5",
    lecturer: "Dr. George Washington Carver",
    year: "2",
    department: "Agriculture",
    status: "Completed",
  },
  {
    course_id: "17bb0983-a42e-4351-ae52-c209a8b0aa79",
    course_name: "Health Informatics",
    duration_in_hours: "64",
    credits: "6",
    lecturer: "Dr. Florence Nightingale",
    year: "3",
    department: "Health Science",
    status: "Ongoing",
  },
  {
    course_id: "c1843bde-e537-42f2-9e21-214f3447313d",
    course_name: "Environmental Impact Assessment",
    duration_in_hours: "80",
    credits: "6",
    lecturer: "Prof. Rachel Carson",
    year: "4",
    department: "Environmental Science",
    status: "Pending",
  },
  {
    course_id: "c1843bde-e537-42f2-9e21-214f3447314d",
    course_name: "English For Science",
    duration_in_hours: "80",
    credits: "6",
    lecturer: "Prof. Rachel Carson",
    year: "4",
    department: "Environmental Science",
    status: "Pending",
  },
];

export const marks = [
  {
    student_id: "571f13ff-faa6-4954-9cf0-4e23e4ffaa2c",
    course_id: "bc451688-9a22-4878-8619-dbc587325535", // Plant Biotechnology
    mark: 92,
    grade: "A",
  },
  {
    student_id: "571f13ff-faa6-4954-9cf0-4e23e4ffaa2c",
    course_id: "6325665e-7ee0-4ba8-adff-31b3f443c548", // Thermodynamics
    mark: 82,
    grade: "B+",
  },
  {
    student_id: "571f13ff-faa6-4954-9cf0-4e23e4ffaa2c",
    course_id: "8c5cee39-23c8-4fd7-84dc-0c41aa6dfdd5", // Soil Science
    mark: 88,
    grade: "A-",
  },
  {
    student_id: "571f13ff-faa6-4954-9cf0-4e23e4ffaa2c",
    course_id: "17bb0983-a42e-4351-ae52-c209a8b0aa79", // Health Informatics
    mark: 95,
    grade: "A",
  },
  {
    student_id: "2b3c4d5e-6789-0abc-def1-23456789abcd",
    course_id: "c1843bde-e537-42f2-9e21-214f3447313d", // Environmental Impact Assessment
    mark: 87,
    grade: "A-",
  },
  {
    student_id: "2b3c4d5e-6789-0abc-def1-23456789abcd",
    course_id: "c1843bde-e537-42f2-9e21-214f3447314d", // English For Science
    mark: 78,
    grade: "B",
  },
];

export const programYears = ["1", "2", "3", "4"];

export const teacherTracks = [
  {
    count: 150,
    sign: "👨‍🎓",
    title: "Students",
  },
  {
    count: 5,
    sign: "🏫",
    title: "Universities",
  },
  {
    count: 20,
    sign: "📚",
    title: "Classes",
  },
  {
    count: 40,
    sign: "📖",
    title: "Courses",
  },
];

export const studentsData = [
  { name: "Alice", grade: 85 },
  { name: "Bob", grade: 92 },
  { name: "Charlie", grade: 78 },
  { name: "David", grade: 88 },
  { name: "Eva", grade: 95 },
  { name: "Frank", grade: 70 },
  { name: "Grace", grade: 90 },
  { name: "Hannah", grade: 80 },
];

export const programs = ["Agriculture", "Engineering", "Health Sciences"];

export const studentsMarks = [
  {
    student_id: "001",
    full_name: { first: "John", last: "Doe" },
    email: "johndoe@example.com",
    university: "University of Nairobi",
    department: "Computer Science",
    course: "Algorithms",
    marks: { midterm: 35, final: 40 },
    year_of_study: 3,
  },
  {
    student_id: "002",
    full_name: { first: "Jane", last: "Smith" },
    email: "janesmith@example.com",
    university: "Harvard University",
    department: "Mechanical Engineering",
    course: "Thermodynamics",
    marks: { midterm: 38, final: 42 },
    year_of_study: 2,
  },
  // Add more students here...
];
