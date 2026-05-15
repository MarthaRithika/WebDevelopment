const CATEGORIES = [
  { name: "Technology", icon: "💻", count: 1240 },
  { name: "Design", icon: "🎨", count: 430 },
  { name: "Marketing", icon: "📣", count: 320 },
  { name: "Finance", icon: "💰", count: 510 },
  { name: "Healthcare", icon: "🏥", count: 670 },
  { name: "Education", icon: "📚", count: 290 },
  { name: "Sales", icon: "🤝", count: 380 },
  { name: "Engineering", icon: "⚙️", count: 760 },
  { name: "Data Science", icon: "📊", count: 540 },
  { name: "Operations", icon: "🏭", count: 210 },
];

const SEED_JOBS = [
  {
    id: "j1",
    title: "Senior Frontend Developer",
    company: "TechNova",
    location: "Bangalore, India",
    type: "Full-time",
    category: "Technology",
    experience: "Senior",
    salary: "₹18L – ₹28L/yr",
    salaryNum: 2300000,
    description: "We are looking for an experienced Frontend Developer to join our product team. You will build beautiful, performant web interfaces using React and modern tooling.",
    requirements: ["5+ years of frontend experience", "Proficiency in React.js & TypeScript", "Experience with REST APIs and GraphQL", "Strong eye for UI/UX"],
    skills: ["React", "TypeScript", "GraphQL", "CSS", "Figma"],
    posted: "2026-05-10",
    deadline: "2026-06-10",
    featured: true,
  },
  {
    id: "j2",
    title: "UI/UX Designer",
    company: "PixelWorks",
    location: "Remote",
    type: "Remote",
    category: "Design",
    experience: "Mid",
    salary: "₹10L – ₹16L/yr",
    salaryNum: 1300000,
    description: "Join our creative team to design world-class digital experiences. You will work closely with product and engineering to bring designs from concept to reality.",
    requirements: ["3+ years of UX/UI design", "Mastery of Figma", "Strong portfolio", "Understanding of accessibility standards"],
    skills: ["Figma", "Sketch", "Prototyping", "User Research", "Illustration"],
    posted: "2026-05-09",
    deadline: "2026-06-05",
    featured: true,
  },
  {
    id: "j3",
    title: "Data Scientist",
    company: "DataMind",
    location: "Hyderabad, India",
    type: "Full-time",
    category: "Data Science",
    experience: "Mid",
    salary: "₹15L – ₹22L/yr",
    salaryNum: 1850000,
    description: "Help us turn data into insights. You will design and implement machine learning models, run experiments, and communicate findings across the organization.",
    requirements: ["Degree in Statistics, CS, or related field", "2+ years ML experience", "Proficiency in Python & SQL", "Experience with TensorFlow or PyTorch"],
    skills: ["Python", "TensorFlow", "SQL", "Pandas", "Tableau"],
    posted: "2026-05-08",
    deadline: "2026-06-08",
    featured: true,
  },
  {
    id: "j4",
    title: "Backend Node.js Developer",
    company: "CloudBase",
    location: "Pune, India",
    type: "Full-time",
    category: "Technology",
    experience: "Mid",
    salary: "₹12L – ₹18L/yr",
    salaryNum: 1500000,
    description: "Build scalable, high-performance APIs and microservices. You will architect backend systems and collaborate with frontend teams to deliver seamless products.",
    requirements: ["3+ years Node.js", "Experience with MongoDB & PostgreSQL", "Knowledge of Docker & Kubernetes", "REST & GraphQL API design"],
    skills: ["Node.js", "Express", "MongoDB", "Docker", "AWS"],
    posted: "2026-05-07",
    deadline: "2026-06-01",
    featured: true,
  },
  {
    id: "j5",
    title: "Digital Marketing Manager",
    company: "GrowthLabs",
    location: "Mumbai, India",
    type: "Full-time",
    category: "Marketing",
    experience: "Senior",
    salary: "₹10L – ₹15L/yr",
    salaryNum: 1250000,
    description: "Lead our digital marketing strategy across SEO, SEM, email and social media. Drive acquisition and retention for our B2C platform.",
    requirements: ["5+ years in digital marketing", "Proven track record of growth campaigns", "Experience with Google Ads, Meta Ads", "Strong analytical mindset"],
    skills: ["SEO", "Google Ads", "Meta Ads", "HubSpot", "Analytics"],
    posted: "2026-05-06",
    deadline: "2026-05-31",
    featured: false,
  },
  {
    id: "j6",
    title: "Financial Analyst",
    company: "FinEdge",
    location: "Delhi, India",
    type: "Full-time",
    category: "Finance",
    experience: "Entry",
    salary: "₹6L – ₹9L/yr",
    salaryNum: 750000,
    description: "Analyze financial data, prepare reports and help with strategic decisions. Great opportunity for a fresh graduate to grow in a fast-paced environment.",
    requirements: ["Bachelor's in Finance or Accounting", "Proficiency in Excel", "Basic knowledge of financial modeling", "Good communication skills"],
    skills: ["Excel", "Financial Modeling", "PowerBI", "Tally", "SAP"],
    posted: "2026-05-05",
    deadline: "2026-05-28",
    featured: false,
  },
  {
    id: "j7",
    title: "React Native Developer",
    company: "AppCraft",
    location: "Remote",
    type: "Remote",
    category: "Technology",
    experience: "Mid",
    salary: "₹14L – ₹20L/yr",
    salaryNum: 1700000,
    description: "Build cross-platform mobile applications for iOS and Android. You will work in an agile team shipping new features every two weeks.",
    requirements: ["3+ years React Native", "Experience publishing apps to App Store & Play Store", "Familiarity with Redux", "REST API integration"],
    skills: ["React Native", "Redux", "TypeScript", "Firebase", "Expo"],
    posted: "2026-05-04",
    deadline: "2026-06-04",
    featured: false,
  },
  {
    id: "j8",
    title: "HR Generalist",
    company: "PeopleFirst",
    location: "Chennai, India",
    type: "Full-time",
    category: "Operations",
    experience: "Entry",
    salary: "₹4L – ₹7L/yr",
    salaryNum: 550000,
    description: "Handle end-to-end HR operations including recruitment, onboarding, payroll support and employee engagement initiatives.",
    requirements: ["Degree in HR or Business", "Good interpersonal skills", "Knowledge of labor laws", "Proficiency in MS Office"],
    skills: ["Recruitment", "Payroll", "HRMS", "Employee Engagement"],
    posted: "2026-05-03",
    deadline: "2026-05-25",
    featured: false,
  },
  {
    id: "j9",
    title: "DevOps Engineer",
    company: "InfraCore",
    location: "Bangalore, India",
    type: "Full-time",
    category: "Engineering",
    experience: "Senior",
    salary: "₹20L – ₹32L/yr",
    salaryNum: 2600000,
    description: "Design and maintain CI/CD pipelines, manage cloud infrastructure, and improve deployment reliability across dozens of microservices.",
    requirements: ["5+ years DevOps experience", "Deep knowledge of AWS/GCP", "Terraform & Ansible experience", "Kubernetes cluster management"],
    skills: ["AWS", "Kubernetes", "Terraform", "Jenkins", "Linux"],
    posted: "2026-05-02",
    deadline: "2026-06-02",
    featured: false,
  },
  {
    id: "j10",
    title: "Content Writer Intern",
    company: "MediaHive",
    location: "Remote",
    type: "Internship",
    category: "Marketing",
    experience: "Entry",
    salary: "₹8K – ₹15K/month",
    salaryNum: 120000,
    description: "Write engaging blog posts, social media content and product copy. Great stipend and opportunity to build a strong writing portfolio.",
    requirements: ["Excellent written English", "Creative mindset", "Knowledge of SEO basics", "Available for 3–6 months"],
    skills: ["Content Writing", "SEO", "WordPress", "Canva"],
    posted: "2026-05-01",
    deadline: "2026-05-20",
    featured: false,
  },
  {
    id: "j11",
    title: "Mechanical Engineer",
    company: "AutoTech",
    location: "Pune, India",
    type: "Full-time",
    category: "Engineering",
    experience: "Mid",
    salary: "₹8L – ₹13L/yr",
    salaryNum: 1050000,
    description: "Design and test mechanical components for automotive systems. Work with CAD tools and cross-functional teams to bring products to market.",
    requirements: ["B.E./B.Tech in Mechanical Engineering", "2+ years of experience", "Proficiency in AutoCAD/SolidWorks", "Knowledge of GD&T"],
    skills: ["AutoCAD", "SolidWorks", "ANSYS", "CATIA", "GD&T"],
    posted: "2026-04-30",
    deadline: "2026-05-30",
    featured: false,
  },
  {
    id: "j12",
    title: "School Teacher – Mathematics",
    company: "BrightMind Academy",
    location: "Delhi, India",
    type: "Part-time",
    category: "Education",
    experience: "Entry",
    salary: "₹3L – ₹5L/yr",
    salaryNum: 400000,
    description: "Teach mathematics to classes 9–12. Prepare lesson plans, conduct assessments and support student academic growth.",
    requirements: ["B.Ed or equivalent", "Strong command of Mathematics", "Good communication skills", "Prior teaching experience preferred"],
    skills: ["Mathematics", "Lesson Planning", "Student Counseling"],
    posted: "2026-04-28",
    deadline: "2026-05-15",
    featured: false,
  },
];


function initData() {
  if (!localStorage.getItem("js_jobs")) {
    localStorage.setItem("js_jobs", JSON.stringify(SEED_JOBS));
  }
  if (!localStorage.getItem("js_users")) {
    const adminUser = {
      id: "admin",
      name: "Admin",
      email: "admin@jobsphere.com",
      password: "admin123",
      role: "admin",
      phone: "",
      location: "",
      skills: "",
      bio: "",
    };
    localStorage.setItem("js_users", JSON.stringify([adminUser]));
  }
  if (!localStorage.getItem("js_applications")) {
    localStorage.setItem("js_applications", JSON.stringify([]));
  }
  if (!localStorage.getItem("js_saved")) {
    localStorage.setItem("js_saved", JSON.stringify([]));
  }
}


function getJobs() { return JSON.parse(localStorage.getItem("js_jobs") || "[]"); }
function saveJobs(jobs) { localStorage.setItem("js_jobs", JSON.stringify(jobs)); }
function getUsers() { return JSON.parse(localStorage.getItem("js_users") || "[]"); }
function saveUsers(u) { localStorage.setItem("js_users", JSON.stringify(u)); }
function getApplications() { return JSON.parse(localStorage.getItem("js_applications") || "[]"); }
function saveApplications(a) { localStorage.setItem("js_applications", JSON.stringify(a)); }
function getSaved() { return JSON.parse(localStorage.getItem("js_saved") || "[]"); }
function saveSaved(s) { localStorage.setItem("js_saved", JSON.stringify(s)); }
function getCurrentUser() {
  const id = localStorage.getItem("js_current_user");
  if (!id) return null;
  return getUsers().find(u => u.id === id) || null;
}
function setCurrentUser(id) { localStorage.setItem("js_current_user", id); }
function logoutUser() { localStorage.removeItem("js_current_user"); }
function generateId() { return "j" + Date.now() + Math.random().toString(36).slice(2, 7); }
function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  return `${Math.floor(days / 30)} month(s) ago`;
}

initData();
