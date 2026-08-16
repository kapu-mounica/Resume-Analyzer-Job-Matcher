import { Skill, SkillCategory } from '../../src/types/index.js';

export const SKILL_DATABASE: Skill[] = [
  // Programming Languages
  { name: 'Python', category: 'Programming Languages', aliases: ['py', 'python3', 'python2'], demandLevel: 'Very High' },
  { name: 'Java', category: 'Programming Languages', aliases: ['core java', 'j2se', 'java 8', 'java 11', 'java 17', 'java 21'], demandLevel: 'Very High' },
  { name: 'JavaScript', category: 'Programming Languages', aliases: ['js', 'es6', 'es2015', 'ecmascript', 'vanilla js'], demandLevel: 'Very High' },
  { name: 'TypeScript', category: 'Programming Languages', aliases: ['ts', 'typescript 4', 'typescript 5'], demandLevel: 'Very High' },
  { name: 'C', category: 'Programming Languages', aliases: ['c lang', 'c language', 'ansi c'], demandLevel: 'High' },
  { name: 'C++', category: 'Programming Languages', aliases: ['cpp', 'c plus plus', 'c/c++'], demandLevel: 'High' },
  { name: 'C#', category: 'Programming Languages', aliases: ['csharp', 'c sharp', '.net c#'], demandLevel: 'Very High' },
  { name: 'Go', category: 'Programming Languages', aliases: ['golang', 'go lang'], demandLevel: 'High' },
  { name: 'Rust', category: 'Programming Languages', aliases: ['rustlang', 'rust-lang'], demandLevel: 'High' },
  { name: 'PHP', category: 'Programming Languages', aliases: ['php7', 'php8', 'php 8'], demandLevel: 'Moderate' },
  { name: 'Ruby', category: 'Programming Languages', aliases: ['ruby lang'], demandLevel: 'Moderate' },
  { name: 'Swift', category: 'Programming Languages', aliases: ['swiftui', 'swift 5'], demandLevel: 'High' },
  { name: 'Kotlin', category: 'Programming Languages', aliases: ['kotlin multiplatform'], demandLevel: 'High' },
  { name: 'R', category: 'Programming Languages', aliases: ['r lang', 'r-project', 'r programming'], demandLevel: 'Moderate' },
  { name: 'MATLAB', category: 'Programming Languages', aliases: ['simulink'], demandLevel: 'Moderate' },
  { name: 'Scala', category: 'Programming Languages', aliases: ['scala 3'], demandLevel: 'Moderate' },
  { name: 'Dart', category: 'Programming Languages', aliases: ['dart lang'], demandLevel: 'Moderate' },
  { name: 'Shell Scripting', category: 'Programming Languages', aliases: ['bash', 'sh', 'zsh', 'powershell', 'shell script'], demandLevel: 'High' },
  { name: 'SQL', category: 'Programming Languages', aliases: ['structured query language', 't-sql', 'pl/sql', 'ansi sql'], demandLevel: 'Very High' },
  { name: 'Solidity', category: 'Programming Languages', aliases: ['smart contracts', 'ethereum solidity'], demandLevel: 'Moderate' },

  // Web & Frontend
  { name: 'React', category: 'Web & Frontend', aliases: ['react.js', 'reactjs', 'react 18', 'react 19'], demandLevel: 'Very High' },
  { name: 'Next.js', category: 'Web & Frontend', aliases: ['nextjs', 'next js', 'next 14', 'next 15'], demandLevel: 'Very High' },
  { name: 'Vue.js', category: 'Web & Frontend', aliases: ['vue', 'vuejs', 'vue 3', 'vue 2'], demandLevel: 'High' },
  { name: 'Angular', category: 'Web & Frontend', aliases: ['angularjs', 'angular 2+', 'angular 17'], demandLevel: 'High' },
  { name: 'Svelte', category: 'Web & Frontend', aliases: ['sveltekit', 'svelte js'], demandLevel: 'Moderate' },
  { name: 'HTML', category: 'Web & Frontend', aliases: ['html5', 'semantic html', 'xhtml'], demandLevel: 'Very High' },
  { name: 'CSS', category: 'Web & Frontend', aliases: ['css3', 'cascading style sheets'], demandLevel: 'Very High' },
  { name: 'Tailwind CSS', category: 'Web & Frontend', aliases: ['tailwind', 'tailwindcss'], demandLevel: 'Very High' },
  { name: 'Bootstrap', category: 'Web & Frontend', aliases: ['bootstrap 5', 'bootstrap 4'], demandLevel: 'Moderate' },
  { name: 'Sass', category: 'Web & Frontend', aliases: ['scss', 'syntactically awesome stylesheets'], demandLevel: 'High' },
  { name: 'Redux', category: 'Web & Frontend', aliases: ['redux toolkit', 'rtk', 'redux-saga', 'redux thunk'], demandLevel: 'High' },
  { name: 'Zustand', category: 'Web & Frontend', aliases: ['zustand state management'], demandLevel: 'Moderate' },
  { name: 'GraphQL', category: 'Web & Frontend', aliases: ['apollo client', 'relay', 'graphql api'], demandLevel: 'High' },
  { name: 'Webpack', category: 'Web & Frontend', aliases: ['webpack 5'], demandLevel: 'Moderate' },
  { name: 'Vite', category: 'Web & Frontend', aliases: ['vitejs'], demandLevel: 'High' },
  { name: 'jQuery', category: 'Web & Frontend', aliases: ['jquery 3'], demandLevel: 'Moderate' },
  { name: 'Responsive Design', category: 'Web & Frontend', aliases: ['mobile first', 'adaptive design', 'flexbox', 'css grid'], demandLevel: 'Very High' },
  { name: 'Web Accessibility', category: 'Web & Frontend', aliases: ['a11y', 'wcag', 'aria'], demandLevel: 'High' },

  // Backend & Frameworks
  { name: 'Node.js', category: 'Backend & Frameworks', aliases: ['nodejs', 'node', 'node js'], demandLevel: 'Very High' },
  { name: 'Express', category: 'Backend & Frameworks', aliases: ['express.js', 'expressjs'], demandLevel: 'Very High' },
  { name: 'FastAPI', category: 'Backend & Frameworks', aliases: ['fast api', 'fastapi framework'], demandLevel: 'Very High' },
  { name: 'Flask', category: 'Backend & Frameworks', aliases: ['flask framework', 'pocoo flask'], demandLevel: 'High' },
  { name: 'Django', category: 'Backend & Frameworks', aliases: ['django rest framework', 'drf'], demandLevel: 'Very High' },
  { name: 'Spring Boot', category: 'Backend & Frameworks', aliases: ['spring framework', 'spring-boot', 'spring mvc', 'spring cloud'], demandLevel: 'Very High' },
  { name: 'ASP.NET Core', category: 'Backend & Frameworks', aliases: ['.net core', 'asp.net', 'dotnet core', 'entity framework'], demandLevel: 'Very High' },
  { name: 'NestJS', category: 'Backend & Frameworks', aliases: ['nest.js', 'nest js'], demandLevel: 'High' },
  { name: 'Ruby on Rails', category: 'Backend & Frameworks', aliases: ['rails', 'ror'], demandLevel: 'Moderate' },
  { name: 'Laravel', category: 'Backend & Frameworks', aliases: ['laravel framework', 'eloquent orm'], demandLevel: 'Moderate' },
  { name: 'REST API', category: 'Backend & Frameworks', aliases: ['restful apis', 'rest services', 'restful web services', 'rest endpoint'], demandLevel: 'Very High' },
  { name: 'gRPC', category: 'Backend & Frameworks', aliases: ['protobuf', 'protocol buffers'], demandLevel: 'High' },
  { name: 'Microservices', category: 'Backend & Frameworks', aliases: ['microservice architecture', 'distributed systems', 'service oriented architecture', 'soa'], demandLevel: 'Very High' },
  { name: 'WebSockets', category: 'Backend & Frameworks', aliases: ['socket.io', 'real-time communication', 'ws protocol'], demandLevel: 'High' },
  { name: 'Kafka', category: 'Backend & Frameworks', aliases: ['apache kafka', 'kafka streams'], demandLevel: 'Very High' },
  { name: 'RabbitMQ', category: 'Backend & Frameworks', aliases: ['amqp', 'message broker', 'message queue'], demandLevel: 'High' },
  { name: 'Celery', category: 'Backend & Frameworks', aliases: ['celery worker', 'background tasks'], demandLevel: 'High' },
  { name: 'JWT', category: 'Backend & Frameworks', aliases: ['json web token', 'oauth2', 'oauth 2.0', 'openid connect', 'sso'], demandLevel: 'Very High' },

  // Data Science & Machine Learning
  { name: 'Pandas', category: 'Data Science & Machine Learning', aliases: ['dataframes', 'python pandas'], demandLevel: 'Very High' },
  { name: 'NumPy', category: 'Data Science & Machine Learning', aliases: ['numpy arrays', 'numerical python'], demandLevel: 'Very High' },
  { name: 'Scikit-learn', category: 'Data Science & Machine Learning', aliases: ['sklearn', 'scikit learn'], demandLevel: 'Very High' },
  { name: 'TensorFlow', category: 'Data Science & Machine Learning', aliases: ['tf', 'tensorflow 2'], demandLevel: 'Very High' },
  { name: 'PyTorch', category: 'Data Science & Machine Learning', aliases: ['torch', 'pytorch lightning'], demandLevel: 'Very High' },
  { name: 'Keras', category: 'Data Science & Machine Learning', aliases: ['keras neural networks'], demandLevel: 'High' },
  { name: 'Machine Learning', category: 'Data Science & Machine Learning', aliases: ['ml', 'supervised learning', 'unsupervised learning', 'reinforcement learning', 'statistical learning'], demandLevel: 'Very High' },
  { name: 'Deep Learning', category: 'Data Science & Machine Learning', aliases: ['dl', 'artificial neural networks', 'ann', 'cnn', 'rnn', 'lstm'], demandLevel: 'Very High' },
  { name: 'NLP', category: 'Data Science & Machine Learning', aliases: ['natural language processing', 'text analytics', 'sentiment analysis', 'tokenization', 'named entity recognition', 'ner'], demandLevel: 'Very High' },
  { name: 'spaCy', category: 'Data Science & Machine Learning', aliases: ['spacy nlp', 'spacy model'], demandLevel: 'High' },
  { name: 'NLTK', category: 'Data Science & Machine Learning', aliases: ['natural language toolkit'], demandLevel: 'High' },
  { name: 'Computer Vision', category: 'Data Science & Machine Learning', aliases: ['cv', 'image processing', 'object detection', 'yolo', 'opencv'], demandLevel: 'High' },
  { name: 'OpenCV', category: 'Data Science & Machine Learning', aliases: ['cv2', 'open computer vision'], demandLevel: 'High' },
  { name: 'Large Language Models', category: 'Data Science & Machine Learning', aliases: ['llm', 'llms', 'generative ai', 'genai', 'prompt engineering', 'rag', 'retrieval augmented generation'], demandLevel: 'Very High' },
  { name: 'Transformers', category: 'Data Science & Machine Learning', aliases: ['hugging face', 'huggingface', 'bert', 'gpt', 'roberta', 't5'], demandLevel: 'Very High' },
  { name: 'LangChain', category: 'Data Science & Machine Learning', aliases: ['langgraph', 'llamaindex', 'llama index'], demandLevel: 'High' },
  { name: 'Data Analysis', category: 'Data Science & Machine Learning', aliases: ['exploratory data analysis', 'eda', 'data visualization', 'statistical analysis'], demandLevel: 'Very High' },
  { name: 'Matplotlib', category: 'Data Science & Machine Learning', aliases: ['pyplot'], demandLevel: 'High' },
  { name: 'Seaborn', category: 'Data Science & Machine Learning', aliases: ['sns data viz'], demandLevel: 'High' },
  { name: 'Tableau', category: 'Data Science & Machine Learning', aliases: ['tableau dashboard'], demandLevel: 'High' },
  { name: 'Power BI', category: 'Data Science & Machine Learning', aliases: ['powerbi', 'dax'], demandLevel: 'High' },
  { name: 'Apache Spark', category: 'Data Science & Machine Learning', aliases: ['pyspark', 'spark sql', 'spark streaming'], demandLevel: 'Very High' },
  { name: 'Hadoop', category: 'Data Science & Machine Learning', aliases: ['hdfs', 'mapreduce', 'hive'], demandLevel: 'Moderate' },
  { name: 'Feature Engineering', category: 'Data Science & Machine Learning', aliases: ['data preprocessing', 'model evaluation', 'cross validation', 'hyperparameter tuning'], demandLevel: 'High' },

  // Databases & Storage
  { name: 'MySQL', category: 'Databases & Storage', aliases: ['mysql 8', 'mariadb'], demandLevel: 'Very High' },
  { name: 'PostgreSQL', category: 'Databases & Storage', aliases: ['postgres', 'psql', 'postgresql 15'], demandLevel: 'Very High' },
  { name: 'MongoDB', category: 'Databases & Storage', aliases: ['mongo', 'nosql mongodb', 'mongoose'], demandLevel: 'Very High' },
  { name: 'Redis', category: 'Databases & Storage', aliases: ['redis cache', 'in-memory db'], demandLevel: 'Very High' },
  { name: 'SQLite', category: 'Databases & Storage', aliases: ['sqlite3'], demandLevel: 'High' },
  { name: 'Oracle Database', category: 'Databases & Storage', aliases: ['oracle db', 'oracle sql', 'plsql'], demandLevel: 'High' },
  { name: 'Microsoft SQL Server', category: 'Databases & Storage', aliases: ['ms sql', 'mssql', 'ssms', 'tsql'], demandLevel: 'High' },
  { name: 'Elasticsearch', category: 'Databases & Storage', aliases: ['elk stack', 'elastic search', 'opensearch', 'kibana', 'logstash'], demandLevel: 'High' },
  { name: 'Cassandra', category: 'Databases & Storage', aliases: ['apache cassandra', 'cql'], demandLevel: 'Moderate' },
  { name: 'DynamoDB', category: 'Databases & Storage', aliases: ['aws dynamodb', 'amazon dynamodb'], demandLevel: 'High' },
  { name: 'Firebase', category: 'Databases & Storage', aliases: ['firestore', 'firebase realtime database', 'firebase auth'], demandLevel: 'High' },
  { name: 'Supabase', category: 'Databases & Storage', aliases: ['supabase db'], demandLevel: 'High' },
  { name: 'Snowflake', category: 'Databases & Storage', aliases: ['snowflake data warehouse'], demandLevel: 'High' },
  { name: 'BigQuery', category: 'Databases & Storage', aliases: ['google bigquery', 'gcp bigquery'], demandLevel: 'High' },
  { name: 'Prisma ORM', category: 'Databases & Storage', aliases: ['prisma', 'drizzle orm', 'typeorm', 'sequelize'], demandLevel: 'High' },
  { name: 'Database Indexing', category: 'Databases & Storage', aliases: ['query optimization', 'database tuning', 'acid transactions', 'database schema design', 'normalization'], demandLevel: 'Very High' },

  // Cloud & DevOps
  { name: 'AWS', category: 'Cloud & DevOps', aliases: ['amazon web services', 'ec2', 's3', 'lambda', 'rds', 'cloudformation', 'iam', 'ecs', 'eks', 'sqs', 'sns'], demandLevel: 'Very High' },
  { name: 'Google Cloud', category: 'Cloud & DevOps', aliases: ['gcp', 'google cloud platform', 'cloud run', 'gke', 'cloud functions', 'compute engine'], demandLevel: 'Very High' },
  { name: 'Microsoft Azure', category: 'Cloud & DevOps', aliases: ['azure', 'azure devops', 'azure app service', 'azure functions', 'blob storage'], demandLevel: 'Very High' },
  { name: 'Docker', category: 'Cloud & DevOps', aliases: ['containerization', 'dockerfile', 'docker compose', 'docker-compose', 'containers'], demandLevel: 'Very High' },
  { name: 'Kubernetes', category: 'Cloud & DevOps', aliases: ['k8s', 'helm', 'kubectl', 'container orchestration'], demandLevel: 'Very High' },
  { name: 'CI/CD', category: 'Cloud & DevOps', aliases: ['continuous integration', 'continuous deployment', 'ci cd pipelines', 'automated build'], demandLevel: 'Very High' },
  { name: 'Jenkins', category: 'Cloud & DevOps', aliases: ['jenkins pipeline'], demandLevel: 'High' },
  { name: 'GitHub Actions', category: 'Cloud & DevOps', aliases: ['github workflows', 'gh actions'], demandLevel: 'Very High' },
  { name: 'GitLab CI', category: 'Cloud & DevOps', aliases: ['gitlab ci/cd'], demandLevel: 'High' },
  { name: 'Terraform', category: 'Cloud & DevOps', aliases: ['iac', 'infrastructure as code', 'terraform hcl'], demandLevel: 'Very High' },
  { name: 'Ansible', category: 'Cloud & DevOps', aliases: ['ansible playbooks', 'configuration management'], demandLevel: 'High' },
  { name: 'Linux', category: 'Cloud & DevOps', aliases: ['ubuntu', 'debian', 'centos', 'redhat', 'linux administration', 'unix'], demandLevel: 'Very High' },
  { name: 'Nginx', category: 'Cloud & DevOps', aliases: ['reverse proxy', 'load balancer', 'apache http server'], demandLevel: 'High' },
  { name: 'Prometheus', category: 'Cloud & DevOps', aliases: ['grafana', 'datadog', 'new relic', 'monitoring', 'observability'], demandLevel: 'High' },
  { name: 'Serverless', category: 'Cloud & DevOps', aliases: ['serverless architecture', 'faas'], demandLevel: 'High' },

  // Software Engineering & Tools
  { name: 'Git', category: 'Software Engineering & Tools', aliases: ['version control', 'git branching', 'git rebase', 'git flow'], demandLevel: 'Very High' },
  { name: 'GitHub', category: 'Software Engineering & Tools', aliases: ['pull requests', 'code reviews', 'github repo'], demandLevel: 'Very High' },
  { name: 'GitLab', category: 'Software Engineering & Tools', aliases: ['gitlab repository'], demandLevel: 'High' },
  { name: 'VS Code', category: 'Software Engineering & Tools', aliases: ['visual studio code', 'intellij idea', 'pycharm'], demandLevel: 'High' },
  { name: 'Postman', category: 'Software Engineering & Tools', aliases: ['api testing', 'swagger', 'openapi'], demandLevel: 'Very High' },
  { name: 'Jira', category: 'Software Engineering & Tools', aliases: ['confluence', 'trello', 'asana'], demandLevel: 'High' },
  { name: 'Agile', category: 'Software Engineering & Tools', aliases: ['scrum', 'kanban', 'sprint planning', 'standups'], demandLevel: 'Very High' },
  { name: 'Data Structures & Algorithms', category: 'Software Engineering & Tools', aliases: ['dsa', 'algorithms', 'trees', 'graphs', 'dynamic programming', 'computational complexity', 'time complexity'], demandLevel: 'Very High' },
  { name: 'Object-Oriented Programming', category: 'Software Engineering & Tools', aliases: ['oop', 'oops', 'inheritance', 'polymorphism', 'encapsulation', 'abstraction'], demandLevel: 'Very High' },
  { name: 'System Design', category: 'Software Engineering & Tools', aliases: ['scalability', 'high availability', 'fault tolerance', 'load balancing', 'caching strategies', 'software architecture'], demandLevel: 'Very High' },
  { name: 'Design Patterns', category: 'Software Engineering & Tools', aliases: ['factory pattern', 'singleton', 'observer pattern', 'solid principles'], demandLevel: 'High' },
  { name: 'Unit Testing', category: 'Software Engineering & Tools', aliases: ['pytest', 'jest', 'junit', 'mocha', 'chai', 'tdd', 'test driven development'], demandLevel: 'Very High' },
  { name: 'Integration Testing', category: 'Software Engineering & Tools', aliases: ['e2e testing', 'cypress', 'selenium', 'playwright'], demandLevel: 'High' },
  { name: 'Code Quality', category: 'Software Engineering & Tools', aliases: ['clean code', 'refactoring', 'eslint', 'prettier', 'sonarqube'], demandLevel: 'High' },

  // Soft Skills & Methodologies
  { name: 'Problem Solving', category: 'Soft Skills & Methodologies', aliases: ['analytical thinking', 'troubleshooting', 'debugging', 'root cause analysis'], demandLevel: 'Very High' },
  { name: 'Team Leadership', category: 'Soft Skills & Methodologies', aliases: ['mentorship', 'team lead', 'technical leadership', 'cross-functional leadership'], demandLevel: 'High' },
  { name: 'Communication', category: 'Soft Skills & Methodologies', aliases: ['technical writing', 'documentation', 'stakeholder management', 'presentation skills'], demandLevel: 'Very High' },
  { name: 'Project Management', category: 'Soft Skills & Methodologies', aliases: ['deliverables', 'milestones', 'risk management', 'scope management'], demandLevel: 'High' },
  { name: 'Critical Thinking', category: 'Soft Skills & Methodologies', aliases: ['decision making', 'strategic thinking'], demandLevel: 'High' },
  { name: 'Time Management', category: 'Soft Skills & Methodologies', aliases: ['prioritization', 'multitasking', 'deadline management'], demandLevel: 'High' },
  { name: 'Adaptability', category: 'Soft Skills & Methodologies', aliases: ['fast learner', 'growth mindset', 'quick learner'], demandLevel: 'High' },
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  'Programming Languages',
  'Web & Frontend',
  'Backend & Frameworks',
  'Data Science & Machine Learning',
  'Databases & Storage',
  'Cloud & DevOps',
  'Software Engineering & Tools',
  'Soft Skills & Methodologies',
];

// Helper to look up or infer category for dynamic skills
export function getSkillCategory(skillName: string): SkillCategory {
  const normalized = skillName.toLowerCase().trim();
  const match = SKILL_DATABASE.find(
    s => s.name.toLowerCase() === normalized || s.aliases?.some(a => a.toLowerCase() === normalized)
  );
  if (match) return match.category;

  if (/(python|java|javascript|typescript|c\+\+|golang|ruby|php|swift|kotlin|rust|sql)/i.test(normalized)) {
    return 'Programming Languages';
  }
  if (/(react|vue|angular|svelte|html|css|tailwind|bootstrap|frontend|ui|ux)/i.test(normalized)) {
    return 'Web & Frontend';
  }
  if (/(node|express|django|flask|spring|fastapi|asp\.net|api|backend|microservice|grpc)/i.test(normalized)) {
    return 'Backend & Frameworks';
  }
  if (/(ml|machine learning|deep learning|ai|nlp|pandas|numpy|pytorch|tensorflow|scikit|computer vision|llm)/i.test(normalized)) {
    return 'Data Science & Machine Learning';
  }
  if (/(sql|mongo|postgres|mysql|redis|dynamodb|database|nosql|cassandra|sqlite|storage)/i.test(normalized)) {
    return 'Databases & Storage';
  }
  if (/(aws|azure|gcp|cloud|docker|kubernetes|ci\/cd|devops|jenkins|terraform|linux|nginx)/i.test(normalized)) {
    return 'Cloud & DevOps';
  }
  if (/(git|testing|jest|pytest|agile|scrum|jira|design pattern|system design|dsa|algorithms)/i.test(normalized)) {
    return 'Software Engineering & Tools';
  }
  return 'Soft Skills & Methodologies';
}
