export interface SampleResumeItem {
  id: string;
  name: string;
  role: string;
  experienceLevel: string;
  description: string;
  rawText: string;
}

export interface SampleJobItem {
  id: string;
  title: string;
  company: string;
  type: string;
  description: string;
  rawText: string;
}

export const SAMPLE_RESUMES: SampleResumeItem[] = [
  {
    id: 'res-fullstack-sr',
    name: 'Alex Rivera',
    role: 'Senior Full-Stack Engineer',
    experienceLevel: '5+ Years Experience',
    description: 'Strong full-stack profile with React, Node.js, TypeScript, PostgreSQL, AWS, Docker & CI/CD.',
    rawText: `ALEX RIVERA
Email: alex.rivera.dev@gmail.com | Phone: (555) 439-8821 | Location: San Francisco, CA
LinkedIn: linkedin.com/in/alexrivera-tech | GitHub: github.com/alexrivera-fullstack
Portfolio: alexrivera.dev

PROFESSIONAL SUMMARY
Results-driven Senior Full-Stack Engineer with 5+ years of experience architecting high-scale web applications, microservices, and reactive user interfaces. Proven track record of reducing API latency by 45% and leading engineering teams through end-to-end agile product deliveries.

TECHNICAL SKILLS
• Programming Languages: TypeScript, JavaScript (ES6+), Python, SQL, HTML5, CSS3
• Frontend Frameworks: React, Next.js, Redux Toolkit, Tailwind CSS, Vite, Responsive Design
• Backend & APIs: Node.js, Express, REST API, GraphQL, WebSockets, JWT Authentication
• Databases & Storage: PostgreSQL, MongoDB, Redis (caching), Prisma ORM
• Cloud & DevOps: AWS (EC2, S3, Lambda, RDS), Docker, Kubernetes, GitHub Actions, CI/CD, Linux
• Software Engineering: Git, Unit Testing (Jest, PyTest), System Design, Microservices, Agile/Scrum

WORK EXPERIENCE
Senior Full-Stack Engineer | Nexus Cloud Technologies | San Francisco, CA
June 2022 – Present
• Architected and deployed an enterprise analytics dashboard utilizing React, TypeScript, and Tailwind CSS, serving 85,000+ daily active users.
• Engineered scalable microservices backend in Node.js and Express with PostgreSQL, optimizing complex database queries to reduce p99 response times by 42%.
• Implemented distributed caching layer with Redis, reducing database load by 60% during peak traffic spikes.
• Established automated CI/CD deployment pipelines using GitHub Actions and Docker, reducing build-to-production deployment cycle from 45 minutes to 8 minutes.
• Mentored 4 junior and mid-level developers in clean code practices, unit testing, and design patterns.

Full-Stack Developer | Velocity Digital Labs | Austin, TX
August 2019 – May 2022
• Developed modular customer portal using React, Redux, and Node.js REST APIs for a FinTech platform processing $12M in monthly transactions.
• Designed relational database schemas in PostgreSQL with index optimization, ensuring ACID compliance and zero data loss.
• Integrated AWS S3 and Lambda serverless functions for asynchronous PDF report generation and document uploads.
• Authored comprehensive unit and integration test suites using Jest, increasing code coverage from 55% to 88%.

KEY PROJECTS
Real-Time Collaborative Workspace (React, Node.js, WebSockets, Redis)
• Built a real-time collaborative document editing platform with live cursor synchronization and presence indicators.
• Handled 10,000 concurrent socket connections with sub-50ms latency using Node.js clustering and Redis pub/sub.

E-Commerce Microservices Engine (TypeScript, Express, MongoDB, Docker, AWS)
• Engineered microservices-based checkout system with Stripe payment gateway, inventory management, and automated email alerts.
• Containerized all services using Docker and orchestrated deployment via AWS ECS.

EDUCATION
Bachelor of Technology (B.Tech) in Computer Science & Engineering
University of California, Berkeley | 2015 – 2019
CGPA: 3.8 / 4.0

CERTIFICATIONS
• AWS Certified Solutions Architect – Associate (2023)
• Meta Certified Senior React Developer (2022)
`,
  },
  {
    id: 'res-data-ml',
    name: 'Priya Sharma',
    role: 'Machine Learning Engineer / Data Scientist',
    experienceLevel: '3+ Years Experience',
    description: 'Data Science & Machine Learning profile with Python, PyTorch, Scikit-learn, NLP, Pandas, FastAPI.',
    rawText: `PRIYA SHARMA
Email: priyasharma.ai@outlook.com | Phone: (555) 782-9012 | Location: New York, NY
LinkedIn: linkedin.com/in/priyasharma-ml | GitHub: github.com/priyasharma-ai

PROFESSIONAL SUMMARY
Machine Learning Engineer with 3+ years of expertise in NLP, predictive modeling, and deploying production machine learning pipelines. Skilled in PyTorch, TensorFlow, Scikit-learn, and FastAPI microservices. Passionate about LLMs and high-accuracy statistical analytics.

TECHNICAL SKILLS
• Languages: Python, SQL, R, C++
• Machine Learning & AI: PyTorch, TensorFlow, Scikit-learn, Keras, Hugging Face, Transformers, NLP, Computer Vision
• Data Analysis: Pandas, NumPy, Matplotlib, Seaborn, Feature Engineering, EDA, Statistical Modeling
• Backend & Deployment: FastAPI, Flask, REST API, Docker, AWS (SageMaker, S3, EC2), MLflow
• Databases & Big Data: PostgreSQL, MongoDB, Apache Spark (PySpark), Redis
• Tools: Git, GitHub, Jupyter Notebooks, VS Code, Linux, Unit Testing

WORK EXPERIENCE
Machine Learning Engineer | Apex AI Solutions | New York, NY
March 2022 – Present
• Developed and fine-tuned Transformer-based NLP models (BERT & RoBERTa) for multi-class customer intent classification, achieving 94.2% F1-score.
• Built low-latency REST inference APIs using FastAPI and Docker, serving 2.5 million daily predictions with average response latency under 35ms.
• Created automated data ingestion and preprocessing pipelines with Pandas and PySpark, cutting feature extraction runtime by 50%.
• Deployed models to AWS EC2 instances with MLflow tracking, conducting A/B experiments to evaluate model drift.

Data Science Intern | DataSphere Analytics | Boston, MA
June 2021 – February 2022
• Performed exploratory data analysis (EDA) and feature engineering on 1.2M consumer transaction records using Pandas and Scikit-learn.
• Trained gradient boosted tree models (XGBoost, LightGBM) to forecast customer churn, improving retention campaigns by 18%.
• Created interactive data visualization dashboards using Matplotlib and Tableau for executive leadership.

ACADEMIC PROJECTS
Biomedical Text Summarizer & Entity Recognition (PyTorch, Transformers, spaCy, FastAPI)
• Engineered a clinical named entity recognition (NER) pipeline extracting disease-symptom pairs from unstructured medical journals with 91% precision.
• Packaged model into a FastAPI microservice with automated Swagger documentation.

Stock Trend Prediction using LSTM Neural Networks (TensorFlow, Keras, Pandas)
• Built deep learning sequence model analyzing 5 years of historical financial ticker data with time-series feature engineering.

EDUCATION
Master of Science (M.S.) in Data Science & Machine Learning
Columbia University | 2020 – 2022 | GPA: 3.85 / 4.0

Bachelor of Technology (B.Tech) in Computer Science
National Institute of Technology | 2016 – 2020 | CGPA: 8.9 / 10

CERTIFICATIONS
• TensorFlow Developer Certificate – Google (2022)
• Deep Learning Specialization – DeepLearning.AI / Coursera (2021)
`,
  },
  {
    id: 'res-python-backend',
    name: 'Karthik Rao',
    role: 'Python Backend Developer',
    experienceLevel: '2+ Years Experience',
    description: 'Backend specialist with Python, FastAPI, Django, PostgreSQL, Redis, Docker, and REST APIs.',
    rawText: `KARTHIK RAO
Email: karthik.rao.dev@gmail.com | Phone: +91 9876543210 | Location: Bangalore, India
LinkedIn: linkedin.com/in/karthikrao-backend | GitHub: github.com/karthikrao-py

SUMMARY
Dedicated Python Backend Developer with 2+ years of professional experience building high-throughput REST APIs, asynchronous task workers, and relational database systems. Proficient in FastAPI, Django, PostgreSQL, and Docker containerization.

TECHNICAL PROFICIENCIES
• Languages: Python, SQL, JavaScript, HTML, CSS
• Frameworks: FastAPI, Django, Django REST Framework, Flask
• Databases: PostgreSQL, MySQL, Redis, SQLite, SQLAlchemy
• Asynchronous & Queues: Celery, Redis Queue, RabbitMQ, WebSockets
• DevOps & Cloud: Docker, Docker Compose, Git, GitHub Actions, AWS (EC2, S3), Linux, Nginx
• Testing & Practices: PyTest, Unit Testing, REST API Design, Agile, Microservices

EXPERIENCE
Python Backend Developer | CloudScale Solutions | Bangalore, India
July 2023 – Present
• Designed and developed 25+ secure RESTful API endpoints using FastAPI and PostgreSQL, serving mobile and web clients with 99.9% uptime.
• Implemented asynchronous background job execution using Celery and Redis to handle payment webhooks and automated transactional email dispatch.
• Optimized complex SQL joins and database indexing in PostgreSQL, reducing query execution duration by 38%.
• Configured Dockerized microservices and automated CI testing via GitHub Actions.

Junior Software Engineer | InnoTech Systems | Hyderabad, India
August 2022 – June 2023
• Contributed to Django REST framework web application, implementing JWT authentication, role-based access control, and Swagger API docs.
• Wrote comprehensive unit and regression tests in PyTest, achieving 82% code coverage across core business modules.
• Troubleshot and resolved production database lock contention issues in MySQL.

PROJECTS
High-Performance URL Shortener & Analytics API (FastAPI, Redis, PostgreSQL, Docker)
• Created a distributed URL shortening service capable of redirecting 5,000 requests/sec utilizing Redis memory caching.
• Designed analytics engine logging geographical location, user agents, and click throughput.

E-Commerce Inventory Management System (Django, Celery, PostgreSQL)
• Built an inventory tracking system with automated low-stock notifications and asynchronous order processing.

EDUCATION
Bachelor of Technology (B.Tech) in Information Technology
Jawaharlal Nehru Technological University | 2018 – 2022
CGPA: 8.4 / 10
`,
  },
  {
    id: 'res-junior-generic',
    name: 'David Miller',
    role: 'Junior Web Developer / Entry Level',
    experienceLevel: '0-1 Years Experience',
    description: 'Junior candidate with basic HTML, CSS, JavaScript, and minimal project details.',
    rawText: `DAVID MILLER
Email: david.miller.work@email.com | Phone: 555-0199
Location: Chicago, IL

OBJECTIVE
Motivated graduate seeking an entry-level software developer position to utilize my coding skills and learn new technologies in a fast-paced environment.

SKILLS
• HTML, CSS, JavaScript, Basic Python
• Microsoft Word, Excel, PowerPoint
• Git, Visual Studio Code

EDUCATION
Bachelor of Science in General Studies
State University | 2020 – 2024
GPA: 3.1

EXPERIENCE
Student Assistant | University IT Lab
2022 – 2024
• Helped students with computer lab questions and printing tasks.
• Maintained computer equipment and reported network issues to staff.

PROJECTS
Personal Portfolio Website
• Built a personal webpage using HTML and CSS to display course projects.
• Uploaded website to GitHub Pages.

Simple Calculator
• Created a basic calculator web page using JavaScript and HTML.
`,
  },
];

export const SAMPLE_JOBS: SampleJobItem[] = [
  {
    id: 'job-fullstack-sr',
    title: 'Senior Full-Stack Engineer (React & Node.js)',
    company: 'Stripe Horizon Technologies',
    type: 'Full-Time | Remote / San Francisco',
    description: 'Looking for a Senior Full Stack Engineer with strong React, TypeScript, Node.js, PostgreSQL, AWS, and Docker experience.',
    rawText: `Job Title: Senior Full-Stack Engineer
Company: Stripe Horizon Technologies
Location: San Francisco, CA (Remote Eligible)

About the Role:
We are looking for an experienced Senior Full-Stack Engineer to architect, build, and scale our core SaaS platform. You will work across modern reactive frontends, resilient microservices, and distributed cloud infrastructure.

Core Requirements (Must Have):
• 4+ years of professional software engineering experience in modern web development.
• Strong proficiency in React, TypeScript, JavaScript (ES6+), and Tailwind CSS.
• Proven hands-on experience building scalable backend services with Node.js and Express.
• Solid background in relational databases, specifically PostgreSQL, schema design, and query optimization.
• Direct experience with Docker containerization and CI/CD pipelines (GitHub Actions).
• Experience integrating AWS cloud services (EC2, S3, RDS, Lambda).
• Deep understanding of REST APIs, GraphQL, and microservices architecture.
• Strong foundation in Git, Unit Testing (Jest), and Agile engineering practices.

Preferred Qualifications (Nice to Have):
• Experience with Redis caching mechanisms and WebSockets for real-time data streaming.
• Familiarity with Kubernetes orchestration and Terraform infrastructure as code.
• Experience mentoring junior engineers and conducting high-standard code reviews.
• Bachelor's or Master's degree in Computer Science, Engineering, or related technical field.

Responsibilities:
• Design and implement responsive user interfaces with high accessibility standards.
• Develop robust, high-throughput backend APIs with low latency.
• Collaborate with cross-functional product and design teams in sprint cycles.
`,
  },
  {
    id: 'job-ml-engineer',
    title: 'Machine Learning & NLP Engineer',
    company: 'Cognitive Dynamics AI',
    type: 'Full-Time | New York, NY',
    description: 'Seeking an ML Engineer with PyTorch, NLP, Python, Transformers, Scikit-learn, and FastAPI.',
    rawText: `Job Title: Machine Learning & NLP Engineer
Company: Cognitive Dynamics AI
Location: New York, NY (Hybrid)

About the Position:
Cognitive Dynamics AI is seeking a talented Machine Learning Engineer specializing in Natural Language Processing (NLP) and predictive intelligence. You will develop production AI models, fine-tune transformer architectures, and deploy scalable microservice inference engines.

Mandatory Requirements:
• 2+ years of hands-on experience in Machine Learning and Natural Language Processing (NLP).
• Expert proficiency in Python and core data science libraries: Pandas, NumPy, Scikit-learn.
• Deep learning experience with PyTorch or TensorFlow, including training, validation, and hyperparameter tuning.
• Experience fine-tuning Transformers (BERT, RoBERTa, GPT) via Hugging Face.
• Experience deploying machine learning models via REST APIs using FastAPI or Flask.
• Solid understanding of SQL and database systems (PostgreSQL).
• Experience with Docker containerization and Git version control.

Bonus / Preferred Skills:
• Exposure to Large Language Models (LLMs), RAG pipelines, and LangChain.
• Experience with Apache Spark or big data processing.
• Experience with AWS cloud deployment (SageMaker, S3, EC2).
• Master's degree in Computer Science, Data Science, or Machine Learning.
`,
  },
  {
    id: 'job-python-backend',
    title: 'Python Backend Engineer (FastAPI / PostgreSQL)',
    company: 'FinVantage Cloud',
    type: 'Full-Time | Bangalore / Remote',
    description: 'FastAPI, Python, PostgreSQL, Redis, Celery, Docker, and Microservices.',
    rawText: `Job Title: Python Backend Developer
Company: FinVantage Cloud
Location: Bangalore, India (Hybrid)

Requirements:
• 2+ years of professional backend development in Python.
• Strong experience building REST APIs with FastAPI or Django REST Framework.
• Strong knowledge of PostgreSQL database design, transactions, and indexing.
• Experience with asynchronous tasks and message queues: Celery, Redis, or RabbitMQ.
• Proficiency in Docker, Git, and Linux server environments.
• Solid unit testing mindset with PyTest.
• Bachelor of Technology (B.Tech) in Computer Science or related engineering discipline.

Nice to Have:
• Experience with AWS cloud services (EC2, S3).
• Knowledge of microservices and system design patterns.
`,
  },
  {
    id: 'job-graphic-designer',
    title: 'Senior Graphic & Brand Designer (Unrelated Job)',
    company: 'Creative Visions Studio',
    type: 'Full-Time | Los Angeles, CA',
    description: 'Non-technical creative design position to test and verify low matching score behavior.',
    rawText: `Job Title: Senior Graphic & Brand Designer
Company: Creative Visions Studio
Location: Los Angeles, CA

Job Requirements:
• 4+ years of professional experience in graphic design, brand identity, and typography.
• Mastery of Adobe Creative Suite: Adobe Photoshop, Adobe Illustrator, Adobe InDesign, After Effects.
• Expertise in Figma for creating marketing mockups and promotional assets.
• Deep knowledge of print production, color theory, visual hierarchy, and brand guidelines.
• Strong portfolio demonstrating creative advertising campaigns and social media graphics.
• Experience collaborating with art directors and copywriters.
`,
  },
];
