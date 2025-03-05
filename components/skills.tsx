"use client"

import * as React from "react"
import { useRef, useState, useEffect } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useTheme } from "next-themes"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"
import Typewriter from 'typewriter-effect'
import {
  BrainCircuit,
  Code2,
  Sparkles,
  Database,
  Globe,
  Layout,
  Smartphone,
  Server,
  Cpu,
  Cloud,
  Layers,
  Wand2,
  Terminal,
  Code,
  Github,
  Braces,
  Coffee,
  Laugh,
  CheckCircle2,
  Hash
} from "lucide-react"

// Custom Progress component with color prop
const ColoredProgress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & { color?: string }
>(({ className, value, color, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 transition-all"
      style={{
        transform: `translateX(-${100 - (value || 0)}%)`,
        backgroundColor: color || 'var(--primary)'
      }}
    />
  </ProgressPrimitive.Root>
))
ColoredProgress.displayName = "ColoredProgress"

// Skill data structure
interface Skill {
  name: string;
  category: "frontend" | "backend" | "ai" | "databases" | "cloud" | "devops";
  level: number;
  icon: React.ReactNode;
  color: string;
  description: string;
  snippet?: string;
  funFact?: string;
}

const SKILLS: Skill[] = [
  // Frontend
  {
    name: "React",
    category: "frontend",
    level: 95,
    icon: <Layers className="h-full w-full" />,
    color: "#61DAFB",
    description: "Building performant component-based UIs with React and Next.js",
    snippet: "const [state, setState] = useState('awesome');",
    funFact: "I've written so many React components that I sometimes try to useState in regular JavaScript."
  },
  {
    name: "React Native",
    category: "frontend",
    level: 90,
    icon: <Smartphone className="h-full w-full" />,
    color: "#00D8FF",
    description: "Cross-platform mobile app development with native-quality UIs",
    snippet: "const App = () => <View style={styles.container}><Text>Hello World</Text></View>;",
    funFact: "I've built so many mobile apps I sometimes try to swipe right on desktop websites."
  },
  {
    name: "UI/UX",
    category: "frontend",
    level: 85,
    icon: <Layout className="h-full w-full" />,
    color: "#FF6B6B",
    description: "Creating intuitive and engaging user experiences",
    snippet: "// Always design with the user in mind",
    funFact: "I spend so much time thinking about UX that I've started analyzing the user flow of my coffee maker."
  },
  {
    name: "MUI",
    category: "frontend",
    level: 85,
    icon: <Layout className="h-full w-full" />,
    color: "#007FFF",
    description: "Building professional interfaces with Material UI components",
    snippet: "<Button variant=\"contained\" color=\"primary\">Click Me</Button>",
    funFact: "I've used so many MUI components that I sometimes try to import them in my dreams."
  },
  {
    name: "shadcn",
    category: "frontend",
    level: 80,
    icon: <Layout className="h-full w-full" />,
    color: "#000000",
    description: "Utilizing shadcn's beautifully designed, accessible components",
    snippet: "import { Button } from \"@/components/ui/button\"",
    funFact: "I've become so fond of shadcn that I now judge other component libraries by their shadcn-likeness."
  },
  {
    name: "Responsive Design",
    category: "frontend",
    level: 90,
    icon: <Smartphone className="h-full w-full" />,
    color: "#4A90E2",
    description: "Creating layouts that work seamlessly across all device sizes",
    snippet: "@media (max-width: 768px) { .container { flex-direction: column; } }",
    funFact: "I now instinctively resize my browser window before even writing a single line of CSS."
  },
  {
    name: "HTML",
    category: "frontend",
    level: 95,
    icon: <Code className="h-full w-full" />,
    color: "#E34F26",
    description: "Crafting semantic, accessible markup for modern web applications",
    snippet: "<section aria-label=\"main content\">...</section>",
    funFact: "I sometimes catch myself thinking in HTML tags when taking notes on paper."
  },
  {
    name: "JavaScript",
    category: "frontend",
    level: 95,
    icon: <Braces className="h-full w-full" />,
    color: "#F7DF1E",
    description: "Building dynamic web experiences with modern JavaScript",
    snippet: "const promise = new Promise((resolve) => resolve('Done!'));",
    funFact: "I've written so much JavaScript that I accidentally type semicolons at the end of my text messages."
  },
  {
    name: "CSS",
    category: "frontend",
    level: 90,
    icon: <Layout className="h-full w-full" />,
    color: "#264DE4",
    description: "Styling web applications with modern CSS techniques",
    snippet: ".container { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }",
    funFact: "I dream in flexbox and wake up trying to center things vertically."
  },
  {
    name: "Tailwind CSS",
    category: "frontend",
    level: 90,
    icon: <Layout className="h-full w-full" />,
    color: "#38B2AC",
    description: "Creating responsive, utility-first designs with Tailwind",
    snippet: "className=\"flex items-center justify-between p-4 hover:bg-blue-50\"",
    funFact: "I used to write CSS by hand until I discovered Tailwind. Now my fingers thank me daily."
  },
  {
    name: "TypeScript",
    category: "frontend",
    level: 90,
    icon: <Code2 className="h-full w-full" />,
    color: "#3178C6",
    description: "Type-safe development with advanced TypeScript patterns",
    snippet: "type Success<T> = { data: T, error: null };",
    funFact: "I enjoy TypeScript so much that I sometimes dream in interfaces and generics."
  },
  {
    name: "Three.js",
    category: "frontend",
    level: 80,
    icon: <Globe className="h-full w-full" />,
    color: "#000000",
    description: "3D graphics and animations for interactive web experiences",
    snippet: "const scene = new THREE.Scene(); const camera = new THREE.PerspectiveCamera();",
    funFact: "I once spent 3 hours debugging a 3D model only to find I was inside it the whole time."
  },
  {
    name: "React Three Fiber",
    category: "frontend",
    level: 80,
    icon: <Globe className="h-full w-full" />,
    color: "#5EDCFF",
    description: "Creating 3D experiences with React's declarative syntax",
    snippet: "<Canvas><mesh><boxGeometry /><meshStandardMaterial /></mesh></Canvas>",
    funFact: "After using React Three Fiber, I started trying to apply useEffect to objects in real life."
  },
  {
    name: "Redux",
    category: "frontend",
    level: 85,
    icon: <Layers className="h-full w-full" />,
    color: "#764ABC",
    description: "Managing complex application state with predictable state containers",
    snippet: "const dispatch = useDispatch(); dispatch(actionCreator());",
    funFact: "I've implemented so many reducers that I now try to dispatch actions to manage my daily tasks."
  },
  {
    name: "JEST",
    category: "frontend",
    level: 80,
    icon: <CheckCircle2 className="h-full w-full" />,
    color: "#C21325",
    description: "Testing JavaScript applications with the Jest framework",
    snippet: "test('renders correctly', () => { expect(component).toMatchSnapshot(); });",
    funFact: "I've written so many tests that I now instinctively write expect statements about everyday events."
  },

  // Backend
  {
    name: "Node.js",
    category: "backend",
    level: 85,
    icon: <Server className="h-full w-full" />,
    color: "#339933",
    description: "Scalable server-side applications with Node.js",
    snippet: "app.get('/api/skills', (req, res) => res.json(skills));",
    funFact: "I talk to databases so often, they're starting to finish my queries."
  },
  {
    name: "Next.js",
    category: "backend",
    level: 90,
    icon: <Server className="h-full w-full" />,
    color: "#000000",
    description: "Building full-stack React applications with server-side rendering",
    snippet: "export async function getServerSideProps() { return { props: {} } }",
    funFact: "I've become so used to Next.js that I get confused when I have to set up routing manually."
  },
  {
    name: "Express",
    category: "backend",
    level: 85,
    icon: <Server className="h-full w-full" />,
    color: "#000000",
    description: "Creating robust APIs and middleware with Express.js",
    snippet: "app.use(express.json()); app.use('/api', apiRoutes);",
    funFact: "I've written so many Express routes that I now think of life paths as middleware chains."
  },
  {
    name: "Python",
    category: "backend",
    level: 80,
    icon: <Code2 className="h-full w-full" />,
    color: "#3776AB",
    description: "Backend development and scripting with Python",
    snippet: "def solve_problems(): return 'Solutions'",
    funFact: "I named my snake 'Python' so I can truthfully say I work with Python daily."
  },
  {
    name: "Fast Api",
    category: "backend",
    level: 80,
    icon: <Server className="h-full w-full" />,
    color: "#009688",
    description: "Building high-performance APIs with Python and FastAPI",
    snippet: "@app.get('/items/{item_id}') def read_item(item_id: int): return {'id': item_id}",
    funFact: "After using FastAPI, I'm disappointed when other things in life don't come with automatic documentation."
  },
  {
    name: "REST",
    category: "backend",
    level: 90,
    icon: <Globe className="h-full w-full" />,
    color: "#FF5733",
    description: "Designing and implementing RESTful APIs following best practices",
    snippet: "GET /users/:id - 200 OK { \"id\": 1, \"name\": \"Zach\" }",
    funFact: "I'm so committed to REST principles that I get annoyed when my furniture isn't organized by resource."
  },
  {
    name: "Expo",
    category: "backend",
    level: 85,
    icon: <Smartphone className="h-full w-full" />,
    color: "#000020",
    description: "Developing and deploying cross-platform mobile applications",
    snippet: "import { Camera } from 'expo-camera';",
    funFact: "I've published so many Expo updates that my phone recognizes the QR code pattern in my sleep."
  },
  {
    name: "Flask",
    category: "backend",
    level: 75,
    icon: <Server className="h-full w-full" />,
    color: "#000000",
    description: "Creating web applications and APIs with Python's Flask framework",
    snippet: "@app.route('/') def hello_world(): return 'Hello, World!'",
    funFact: "I like Flask so much that I started naming my water bottles after HTTP status codes."
  },

  // Databases
  {
    name: "Firebase/Firestore",
    category: "databases",
    level: 85,
    icon: <Database className="h-full w-full" />,
    color: "#FFCA28",
    description: "Real-time databases, authentication, and serverless functions",
    snippet: "firebase.firestore().collection('skills').add({name: 'Firebase'});",
    funFact: "I've set up so many Firebase projects that Google sends me holiday cards."
  },
  {
    name: "Supabase",
    category: "databases",
    level: 80,
    icon: <Database className="h-full w-full" />,
    color: "#3ECF8E",
    description: "Open source Firebase alternative with PostgreSQL backend",
    snippet: "const { data, error } = await supabase.from('profiles').select('*');",
    funFact: "I switched so many projects to Supabase that my code now has a slight Australian accent."
  },
  {
    name: "PostgreSQL",
    category: "databases",
    level: 80,
    icon: <Database className="h-full w-full" />,
    color: "#336791",
    description: "Relational database design and optimization",
    snippet: "SELECT skill FROM expertise WHERE level > 70 ORDER BY experience DESC;",
    funFact: "My friends think I'm talking about a mythical elephant when I mention PostgreSQL."
  },
  {
    name: "MySQL",
    category: "databases",
    level: 75,
    icon: <Database className="h-full w-full" />,
    color: "#4479A1",
    description: "Designing and optimizing relational databases with MySQL",
    snippet: "SELECT * FROM skills JOIN categories ON skills.category_id = categories.id;",
    funFact: "I've written so many JOIN statements that I now try to join unrelated conversations at parties."
  },
  {
    name: "SQL",
    category: "databases",
    level: 85,
    icon: <Database className="h-full w-full" />,
    color: "#F29111",
    description: "Writing efficient queries and database design across SQL platforms",
    snippet: "WITH ranked_skills AS (SELECT skill_name, ROW_NUMBER() OVER(PARTITION BY category ORDER BY level DESC))",
    funFact: "I sometimes catch myself trying to GROUP BY when organizing my grocery list."
  },
  {
    name: "NoSQL",
    category: "databases",
    level: 80,
    icon: <Database className="h-full w-full" />,
    color: "#13AA52",
    description: "Working with document-based and other NoSQL database systems",
    snippet: "db.collection.findOne({ skill: 'NoSQL', level: { $gt: 7 } })",
    funFact: "After working with NoSQL, I now organize my bookshelf in a completely non-relational way."
  },

  // AI
  {
    name: "LLMs",
    category: "ai",
    level: 85,
    icon: <BrainCircuit className="h-full w-full" />,
    color: "#FF6B6B",
    description: "Working with and fine-tuning large language models",
    snippet: "const response = await model.generate(prompt, { temperature: 0.7 });",
    funFact: "I've used so many LLMs that I sometimes expect autocomplete in real conversations."
  },
  {
    name: "OpenAI API",
    category: "ai",
    level: 85,
    icon: <BrainCircuit className="h-full w-full" />,
    color: "#10a37f",
    description: "Integrating state-of-the-art language models into applications",
    snippet: "const response = await openai.createCompletion({ model: 'gpt-4', prompt });",
    funFact: "I've spent so much time with AI models that they're starting to recommend therapists."
  },
  {
    name: "Numpy",
    category: "ai",
    level: 75,
    icon: <Cpu className="h-full w-full" />,
    color: "#4DABCF",
    description: "Scientific computing and numerical operations with Python",
    snippet: "result = np.dot(matrix_a, matrix_b.T)",
    funFact: "I've used NumPy arrays so much that I get frustrated when real-world objects aren't zero-indexed."
  },
  {
    name: "Pytorch",
    category: "ai",
    level: 75,
    icon: <Cpu className="h-full w-full" />,
    color: "#EE4C2C",
    description: "Building and training neural networks for AI applications",
    snippet: "model = nn.Sequential(nn.Linear(10, 5), nn.ReLU(), nn.Linear(5, 1))",
    funFact: "After working with PyTorch tensors, I sometimes try to apply .backward() to my mistakes in real life."
  },
  {
    name: "Pandas",
    category: "ai",
    level: 80,
    icon: <Database className="h-full w-full" />,
    color: "#150458",
    description: "Data manipulation and analysis with Python",
    snippet: "df = pd.DataFrame(data).groupby('category').agg({'value': 'mean'})",
    funFact: "I've used pandas DataFrames so much that I try to apply .loc[] selectors to Excel spreadsheets."
  },
  {
    name: "Claude",
    category: "ai",
    level: 80,
    icon: <BrainCircuit className="h-full w-full" />,
    color: "#8C52FF",
    description: "Leveraging Anthropic's Claude for sophisticated AI applications",
    snippet: "const response = await anthropic.messages.create({ model: 'claude-3-opus', content: prompt });",
    funFact: "I've worked with Claude so much that I now write all my emails with perfect paragraph structure."
  },
  {
    name: "LangChain",
    category: "ai",
    level: 80,
    icon: <Sparkles className="h-full w-full" />,
    color: "#EC4899",
    description: "Building complex AI workflows and agent-based systems",
    snippet: "const chain = new LLMChain({ llm, prompt: chatPrompt });",
    funFact: "I once built an AI agent that started optimizing my coffee breaks."
  },
  {
    name: "Vector Search",
    category: "ai",
    level: 75,
    icon: <Wand2 className="h-full w-full" />,
    color: "#8B5CF6",
    description: "Creating semantic search systems with embeddings and vector databases",
    snippet: "const similarDocs = await vectorStore.similaritySearch(query, k);",
    funFact: "I explain vector embeddings at parties. I'm not invited to many parties anymore."
  },
  {
    name: "Ollama",
    category: "ai",
    level: 75,
    icon: <BrainCircuit className="h-full w-full" />,
    color: "#FF4500",
    description: "Running and managing local large language models",
    snippet: "ollama run llama2:13b -m \"Explain quantum computing\"",
    funFact: "My computer fans spin so loudly when running Ollama that my neighbors think I'm mining Bitcoin."
  },
  {
    name: "Agents",
    category: "ai",
    level: 80,
    icon: <Sparkles className="h-full w-full" />,
    color: "#3B82F6",
    description: "Developing autonomous AI agents for complex task solving",
    snippet: "const agent = new Agent({ tools, memory, planner });",
    funFact: "I created an AI agent to help with my work, but now it asks for vacation days."
  },
  {
    name: "Crew AI",
    category: "ai",
    level: 75,
    icon: <BrainCircuit className="h-full w-full" />,
    color: "#6366F1",
    description: "Building coordinated teams of AI agents that work together",
    snippet: "const crew = new Crew({ agents: [researcher, writer, critic] });",
    funFact: "My Crew AI agents communicate better with each other than most human teams I've worked with."
  },
  {
    name: "Prompt Engineering",
    category: "ai",
    level: 90,
    icon: <Cpu className="h-full w-full" />,
    color: "#F59E0B",
    description: "Designing advanced prompts for optimal AI model performance",
    snippet: "const systemPrompt = 'You are a helpful assistant that...'",
    funFact: "I've spent so long crafting prompts that I now structure my dinner requests to my partner."
  },

  // Cloud
  {
    name: "AWS",
    category: "cloud",
    level: 80,
    icon: <Cloud className="h-full w-full" />,
    color: "#FF9900",
    description: "Cloud infrastructure with EC2, S3, Lambda, and more",
    snippet: "new aws.lambda.Function(this, 'MyFunction', { runtime: lambda.Runtime.NODEJS_14_X });",
    funFact: "My AWS bill is higher than my rent, but at least my applications have 99.99% uptime."
  },
  {
    name: "GCP",
    category: "cloud",
    level: 75,
    icon: <Cloud className="h-full w-full" />,
    color: "#4285F4",
    description: "Building and deploying applications on Google Cloud Platform",
    snippet: "gcloud functions deploy function-name --runtime nodejs14 --trigger-http",
    funFact: "I've used so many GCP services that Google's algorithm now shows me ads for server racks."
  },

  // DevOps
  {
    name: "Docker",
    category: "devops",
    level: 85,
    icon: <Cloud className="h-full w-full" />,
    color: "#2496ED",
    description: "Containerization for consistent development and deployment",
    snippet: "FROM node:18-alpine\nWORKDIR /app\nCOPY . .\nRUN npm install",
    funFact: "I've containerized so many apps that I tried to docker-compose up my breakfast routine."
  },
  {
    name: "CI/CD",
    category: "devops",
    level: 85,
    icon: <Cpu className="h-full w-full" />,
    color: "#4285F4",
    description: "Automated testing and deployment pipelines",
    snippet: "on: [push]\njobs:\n  test:\n    runs-on: ubuntu-latest",
    funFact: "I've automated so much of my workflow that I accidentally deployed code while sleeping."
  }
];

// Define category information with type safety
type CategoryKey = "frontend" | "backend" | "ai" | "databases" | "cloud" | "devops";

const CATEGORIES: Record<CategoryKey, {
  name: string;
  color: string;
  icon: React.ReactNode;
  description: string;
  comment: string;
}> = {
  frontend: {
    name: "Frontend",
    color: "from-blue-500 to-cyan-400",
    icon: <Layout className="h-5 w-5" />,
    description: "Creating responsive, interactive user interfaces",
    comment: "// The stuff users actually see and complain about"
  },
  backend: {
    name: "Backend",
    color: "from-green-500 to-emerald-400",
    icon: <Server className="h-5 w-5" />,
    description: "Building robust APIs and server-side applications",
    comment: "// Where the real magic happens, far from user scrutiny"
  },
  ai: {
    name: "AI & ML",
    color: "from-purple-500 to-pink-400",
    icon: <BrainCircuit className="h-5 w-5" />,
    description: "Implementing artificial intelligence solutions",
    comment: "// Teaching computers to think so I don't have to"
  },
  databases: {
    name: "Databases",
    color: "from-indigo-500 to-blue-400",
    icon: <Database className="h-5 w-5" />,
    description: "Storing, retrieving, and managing application data",
    comment: "// Where I keep all the bits that matter"
  },
  cloud: {
    name: "Cloud",
    color: "from-sky-500 to-blue-400",
    icon: <Cloud className="h-5 w-5" />,
    description: "Building and deploying on cloud platforms",
    comment: "// Because everything is better in someone else's computer"
  },
  devops: {
    name: "DevOps",
    color: "from-orange-500 to-amber-400",
    icon: <Cpu className="h-5 w-5" />,
    description: "Deployment, scaling, and operational excellence",
    comment: "// Automating myself out of a job, one script at a time"
  }
};

// Pre-calculate deterministic positions for skills
const SKILL_POSITIONS = SKILLS.map((_, index) => {
  const angle = (index / SKILLS.length) * 2 * Math.PI;
  const radiusVariation = 0.85 + ((index % 3) * 0.1);
  const radius = 42 * radiusVariation;
  const x = 50 + radius * Math.cos(angle);
  const y = 50 + radius * Math.sin(angle);
  return { x, y };
});

// Console messages for programmer humor
const CONSOLE_MESSAGES = [
  "✨ Skills loaded successfully. No bugs found (yet).",
  "🚀 Rendering skills at 60fps... on a good day.",
  "🔍 Looking for missing semicolons... found 0.",
  "☕ Caffeine level: Optimal for coding.",
  "🤖 AI dependencies successfully installed. Robot uprising: 23%.",
  "🧠 Brain.js loaded. Still requires coffee.js to function properly."
];

// For syntax highlighting in code snippets
const CodeSnippet = ({ code, language = "javascript" }: { code: string, language?: string }) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <div className={`font-mono text-sm rounded-md p-3 overflow-x-auto ${isDark ? 'bg-[#1e1e1e]' : 'bg-[#f5f5f5]'}`}>
      <pre className="whitespace-pre-wrap">
        <code>
          {code.split('\n').map((line, i) => (
            <div key={i} className="leading-relaxed">
              {line}
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
};

// Create a simplified wrapper around Typewriter to avoid type issues
const SimpleTypewriter = ({
  text,
  delay = 50,
  loop = false
}: {
  text: string;
  delay?: number;
  loop?: boolean;
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Always render the text content, but only use the Typewriter effect on the client
  if (!mounted) {
    return <span>{text}</span>; // Fallback during server-side rendering
  }

  // Use a try-catch to handle any potential rendering errors with the Typewriter component
  try {
    return (
      <Typewriter
        options={{
          strings: [text],
          autoStart: true,
          loop,
          cursor: '|',
          delay,
        }}
      />
    );
  } catch (error) {
    console.error('Error rendering Typewriter:', error);
    return <span>{text}</span>; // Fallback if Typewriter fails
  }
};

// Skill Command Line component
const SkillTerminal = ({ skill }: { skill: Skill }) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't hide the entire terminal, just use simpler content if not mounted
  return (
    <div className={`font-mono rounded-md overflow-hidden ${isDark ? 'bg-[#1e1e1e]' : 'bg-[#f5f5f5]'} border ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
      <div className={`flex items-center px-4 py-2 ${isDark ? 'bg-[#333333]' : 'bg-[#e0e0e0]'} border-b ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="flex-1 text-center text-sm font-medium">skill-{skill.name.toLowerCase()}.sh</div>
      </div>
      <div className={`p-4 ${isDark ? 'text-gray-200' : 'text-gray-800'} overflow-auto`}>
        <div className="flex">
          <span className={`${isDark ? 'text-green-400' : 'text-green-600'} mr-2`}>$</span>
          {mounted ? (
            <SimpleTypewriter text={`check-skill-level "${skill.name}"`} delay={40} />
          ) : (
            <span>{`check-skill-level "${skill.name}"`}</span>
          )}
        </div>

        <div className="mt-2">
          <div className={`${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
            // Skill proficiency: {skill.level}%
          </div>
          <div className="mt-1 mb-3">
            <CodeSnippet code={skill.snippet || ''} />
          </div>

          <div className="flex">
            <span className={`${isDark ? 'text-green-400' : 'text-green-600'} mr-2`}>$</span>
            {mounted ? (
              <SimpleTypewriter text={`echo "${skill.funFact}"`} delay={40} />
            ) : (
              <span>{`echo "${skill.funFact}"`}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Skills component
export default function Skills() {
  const ref = useRef(null);
  const consoleRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | null>("frontend");
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const [isMounted, setIsMounted] = useState(false);
  const [consoleMessages, setConsoleMessages] = useState<string[]>([]);

  // This ensures hydration completes before showing content with client-side behavior
  useEffect(() => {
    setIsMounted(true);

    // Add console messages gradually for a typing effect
    let messageIndex = 0;
    const intervalId = setInterval(() => {
      if (messageIndex < CONSOLE_MESSAGES.length) {
        setConsoleMessages(prev => [...prev, CONSOLE_MESSAGES[messageIndex]]);
        messageIndex++;
      } else {
        clearInterval(intervalId);
      }
    }, 800);

    return () => clearInterval(intervalId);
  }, []);

  // Auto-scroll console when new messages arrive
  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [consoleMessages]);

  // Filter skills based on selected category
  const filteredSkills = selectedCategory
    ? SKILLS.filter(skill => skill.category === selectedCategory)
    : SKILLS;

  // Set initial skill
  useEffect(() => {
    if (filteredSkills.length > 0 && !selectedSkill) {
      setSelectedSkill(filteredSkills[0]);
    }
  }, [filteredSkills, selectedSkill]);

  // Handle category filter click
  const handleCategoryClick = (category: CategoryKey) => {
    setSelectedCategory(prev => prev === category ? null : category);
    // Select the first skill in the category or null if uncategorized
    const categorySkills = SKILLS.filter(skill => skill.category === category);
    setSelectedSkill(categorySkills.length > 0 ? categorySkills[0] : null);
  };

  // Handle skill selection
  const handleSkillClick = (skill: Skill) => {
    setSelectedSkill(skill);
  };

  return (
    <section
      id="skills"
      className={`py-20 px-4 md:px-6 relative overflow-hidden ${isDark ? 'bg-[#0c0c14]' : 'bg-gray-50'
        }`}
      ref={ref}
    >
      {/* Background gradient elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl opacity-30"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-block">
            <div className={`font-mono text-xl md:text-2xl font-bold mb-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
              {isMounted ? (
                <SimpleTypewriter text="class DeveloperSkills extends Expertise {" />
              ) : (
                <span>class DeveloperSkills extends Expertise {'{'}</span>
              )}
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
            My Tech Stack
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            <span className="font-mono text-primary">/* </span>
            Browse through my expertise across different tech domains.
            I've been coding for so long, my dreams have syntax highlighting.
            <span className="font-mono text-primary"> */</span>
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Console */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <Card className="shadow-md h-full">
              <CardHeader className="pb-2 border-b flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Terminal className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Console Output</CardTitle>
                </div>
                <Badge variant="outline" className="font-mono">v1.0.0</Badge>
              </CardHeader>
              <CardContent className="pt-4 pb-0 px-0">
                <div
                  ref={consoleRef}
                  className="font-mono text-sm h-[300px] overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-background"
                >
                  {consoleMessages.map((message, i) => (
                    <div key={i} className="mb-2 leading-relaxed">
                      <span className="text-gray-400">[{new Date().toLocaleTimeString()}]</span> {message}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content - Skills and Visualization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-9"
          >
            {/* Category tabs */}
            <div className="mb-6 flex flex-wrap gap-3 justify-center lg:justify-start">
              {Object.entries(CATEGORIES).map(([key, category]) => (
                <Button
                  key={key}
                  onClick={() => handleCategoryClick(key as CategoryKey)}
                  variant={selectedCategory === key ? "default" : "outline"}
                  className={`font-mono text-sm gap-2 ${selectedCategory === key
                    ? `bg-gradient-to-r ${category.color} border-0`
                    : ""
                    }`}
                >
                  {category.icon}
                  <span>{category.name}</span>
                </Button>
              ))}
            </div>

            {/* Category header and comment */}
            {selectedCategory && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className={`text-xl font-bold bg-gradient-to-r ${CATEGORIES[selectedCategory].color} bg-clip-text text-transparent`}>
                    {CATEGORIES[selectedCategory].name}
                  </h3>
                  <Badge variant="outline" className="font-mono">
                    {filteredSkills.length} skills
                  </Badge>
                </div>
                <p className="text-muted-foreground font-mono text-sm">
                  {CATEGORIES[selectedCategory].comment}
                </p>
              </div>
            )}

            {/* Skill selector and terminal display */}
            <div className="grid grid-cols-1 md:grid-cols-7 gap-6 mb-8">
              {/* Skill badges */}
              <div className="md:col-span-2">
                <div className="bg-card border rounded-md p-4 h-full overflow-y-auto max-h-[350px]">
                  <div className="font-mono text-sm text-muted-foreground mb-2">
                    <Hash className="inline h-4 w-4 mr-1" />import from '{selectedCategory || "skills"}';
                  </div>
                  <div className="flex flex-col gap-2">
                    {filteredSkills.map(skill => (
                      <Button
                        key={skill.name}
                        variant="ghost"
                        className={`justify-start gap-2 h-auto py-2 font-mono text-sm ${selectedSkill?.name === skill.name
                          ? 'bg-muted border-l-2 border-primary'
                          : ''
                          }`}
                        onClick={() => handleSkillClick(skill)}
                      >
                        <div className="w-5 h-5" style={{ color: skill.color }}>
                          {skill.icon}
                        </div>
                        <span>
                          {skill.name}
                        </span>
                        <div className="ml-auto flex gap-1 items-center">
                          <Badge variant="outline" className="text-xs">{skill.level}%</Badge>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Skill terminal */}
              <div className="md:col-span-5">
                <AnimatePresence mode="wait">
                  {selectedSkill && (
                    <motion.div
                      key={selectedSkill.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <SkillTerminal skill={selectedSkill} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Code footer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="pt-6 border-t border-border mt-8"
            >
              <div className="font-mono text-muted-foreground flex justify-between items-center">
                <div className="text-sm">
                  <CheckCircle2 className="inline h-4 w-4 mr-1 text-green-500" />
                  All tests passing
                </div>
                <div className="flex items-center gap-2">
                  <Coffee className="h-4 w-4" />
                  <span>Powered by coffee & coding passion</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Closing code bracket */}
        <div className="text-center mt-12">
          <div className={`font-mono text-xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
            {isMounted ? (
              <SimpleTypewriter text="} // End of DeveloperSkills class" />
            ) : (
              <span>{'}'} // End of DeveloperSkills class</span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

