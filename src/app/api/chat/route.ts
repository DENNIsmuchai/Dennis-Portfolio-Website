import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Timeout for external calls
const TIMEOUT_MS = 30000

// Portfolio data types
interface PortfolioData {
  personalInfo: any
  projects: any[]
  experience: any[]
  education: any[]
  skills: any[]
  certifications: any[]
  socialLinks: any[]
  resume: any
  customQAs: any[]
}

// Comprehensive knowledge base
const KNOWLEDGE_BASE = {
  // Programming & Development
  'what is programming': `Programming is the process of creating instructions for computers to execute. It involves writing code in languages like Python, JavaScript, Java, C++, and many others.\n\nKey concepts:\n• Variables - storing data\n• Functions - reusable code blocks\n• Loops - repeating actions\n• Conditionals - making decisions\n• Classes/Objects - organizing code\n\nWould you like me to explain any specific programming concept in detail?`,
  
  'what is python': `Python is a high-level, interpreted programming language known for its simplicity and readability.\n\n**Why Python is Popular:**\n• Easy to learn and read\n• Versatile - web dev, data science, AI, automation\n• Huge community and libraries\n• Great for beginners and pros\n\n**Popular Uses:**\n• Web Development (Django, Flask)\n• Data Science & AI (Pandas, TensorFlow, PyTorch)\n• Automation & Scripting\n• API Development`,
  
  'what is javascript': `JavaScript is the language of the web! It's the only programming language that runs natively in all web browsers.\n\n**What it does:**\n• Makes websites interactive\n• Animations and dynamic content\n• Server-side development (Node.js)\n• Mobile apps (React Native)\n• Desktop apps (Electron)\n\n**Popular Frameworks:**\n• React, Vue, Angular for frontend\n• Node.js for backend\n• Express.js for APIs`,
  
  'what is react': `React is a JavaScript library for building user interfaces, developed and maintained by Facebook.\n\n**Key Features:**\n• Component-based architecture\n• Virtual DOM for performance\n• One-way data flow\n• Rich ecosystem\n\n**Why use React?**\n• Reusable components\n• Great developer experience\n• Huge community\n• Job market demand\n• Works with Next.js for full-stack`,
  
  'what is nextjs': `Next.js is a React framework for production. It makes building web apps easier and more powerful.\n\n**Features:**\n• Server-Side Rendering (SSR)\n• Static Site Generation (SSG)\n• API Routes (full-stack)\n• Image optimization\n• File-based routing\n• SEO friendly\n\nIt's used by major companies like Netflix, Uber, and Twitch!`,
  
  'what is typescript': `TypeScript is JavaScript with superpowers! It adds optional static typing to JavaScript.\n\n**Benefits:**\n• Catches errors early\n• Better code completion\n• Easier maintenance\n• Self-documenting code\n• Industry standard\n\nAny JavaScript code is valid TypeScript!`,
  
  'what is nodejs': `Node.js is JavaScript that runs on the server! Built on Chrome's V8 engine.\n\n**Why Node.js?**\n• Same language for front and back end\n• Non-blocking I/O (fast!)\n• Huge npm package ecosystem\n• Great for real-time apps\n• Microservices friendly\n\n**Popular Uses:**\n• REST APIs\n• Real-time chat apps\n• Streaming services\n• Microservices`,
  
  'what is database': `A database is an organized collection of data stored electronically.\n\n**Types:**\n• **Relational (SQL):** MySQL, PostgreSQL, SQLite\n  - Data in tables with relationships\n  - Great for structured data\n\n• **NoSQL:** MongoDB, Redis, Cassandra\n  - Flexible, document-based\n  - Great for rapid scaling\n\n**Key Concepts:**\n• Tables/Collections\n• Queries\n• Indexing\n• Transactions`,
  
  'what is api': `API stands for Application Programming Interface. It's how software talks to each other!\n\n**Think of it like:**\nA waiter in a restaurant - you (app) tell the waiter what you want, they tell the kitchen (server), and bring back your food (data).\n\n**Types:**\n• REST - most common\n• GraphQL - flexible queries\n• WebSocket - real-time\n• gRPC - high performance`,
  
  'what is git': `Git is a version control system - like a time machine for your code!\n\n**Why Git?**\n• Track changes\n• Collaborate with others\n• Branch and merge\n• Revert mistakes\n• Backup your code\n\n**Key Commands:**\n• git init - start tracking\n• git add - stage changes\n• git commit - save changes\n• git push - upload to remote\n• git pull - download changes`,
  
  'what is github': `GitHub is a cloud platform for hosting Git repositories. It's like social media for developers!\n\n**Features:**\n• Free Git hosting\n• Collaboration tools\n• Code review\n• Project management\n• CI/CD pipelines\n• Millions of open-source projects\n\n**Alternatives:** GitLab, Bitbucket`,
  
  'what is docker': `Docker is a platform for building and running applications in containers.\n\n**What are containers?**\n• Lightweight VMs\n• Package everything needed\n• Run anywhere\n• Fast startup\n\n**Benefits:**\n• Consistent environments\n• Easy deployment\n• Resource efficient\n• Microservices friendly`,
  
  'what is kubernetes': `Kubernetes (K8s) is an orchestrator for containerized applications.\n\n**What it does:**\n• Manages containers at scale\n• Auto-healing\n• Load balancing\n• Auto-scaling\n• Rolling updates\n\n**Why use it?**\n• Production deployments\n• Cloud-native apps\n• Microservices`,
  
  // AI & Machine Learning
  'what is ai': `Artificial Intelligence (AI) is the simulation of human intelligence by machines!\n\n**Types of AI:**\n• **Narrow AI** - Specific tasks (current)\n• **General AI** - Human-like (future)\n• **Superintelligent** - Smarter than humans (future)\n\n**Applications:**\n• Chatbots and assistants\n• Image recognition\n• Autonomous vehicles\n• Recommendation systems\n• Medical diagnosis`,
  
  'what is machine learning': `Machine Learning (ML) is a type of AI where computers learn from data!\n\n**Types:**\n• **Supervised Learning** - Learn from labeled data\n• **Unsupervised Learning** - Find patterns in raw data\n• **Reinforcement Learning** - Learn through trial and error\n\n**Popular Algorithms:**\n• Linear/Logistic Regression\n• Decision Trees & Random Forests\n• Neural Networks\n• Support Vector Machines`,
  
  'what is deep learning': `Deep Learning is a subset of ML using neural networks with many layers!\n\n**Why it works:**\n• Learns features automatically\n• Handles complex patterns\n• State-of-the-art accuracy\n\n**Applications:**\n• Image recognition\n• Natural Language Processing\n• Speech recognition\n• Generative AI\n\n**Tools:** TensorFlow, PyTorch, Keras`,
  
  'what is neural network': `Neural Networks are computer systems inspired by the human brain!\n\n**Structure:**\n• **Input Layer** - receives data\n• **Hidden Layers** - process information\n• **Output Layer** - gives results\n\n**Each "neuron":**\n• Receives inputs\n• Applies weights\n• Applies activation function\n• Passes to next layer\n\n**Deep Learning:** Many hidden layers!`,
  
  'what is nlp': `Natural Language Processing (NLP) helps computers understand human language!\n\n**What it does:**\n• Text classification\n• Sentiment analysis\n• Language translation\n• Chatbots\n• Text summarization\n\n**Tools:**\n• NLTK, spaCy\n• Hugging Face\n• OpenAI GPT\n• Google BERT`,
  
  'what is computer vision': `Computer Vision enables computers to see and understand images!\n\n**Applications:**\n• Face recognition\n• Object detection\n• Medical imaging\n• Autonomous driving\n• Augmented reality\n\n**Techniques:**\n• Image classification\n• Object detection\n• Semantic segmentation\n• Face recognition`,
  
  // Finance & Investing
  'what is stock market': `The stock market is where shares of companies are bought and sold!\n\n**Key Concepts:**\n• **Stocks** - Ownership in a company\n• **Shares** - Individual pieces of stock\n• **Bull Market** - Rising prices\n• **Bear Market** - Falling prices\n• **Liquidity** - How easy to buy/sell\n\n**Major Exchanges:**\n• NYSE (New York)\n• NASDAQ (Tech stocks)\n• LSE (London)\n• TSE (Tokyo)`,
  
  'what is stock': `A stock (share) represents ownership in a company!\n\n**Why companies issue stock:**\n• Raise capital\n• Grow business\n• Reward employees\n\n**Why investors buy:**\n• Price appreciation\n• Dividends (some stocks)\n• Ownership benefits\n\n**Types:**\n• Common Stock - voting rights\n• Preferred Stock - fixed dividends`,
  
  'what is dividend': `A dividend is a portion of company profits paid to shareholders!\n\n**Key Points:**\n• Not all companies pay dividends\n• Usually quarterly\n• Can be cash or stock\n• Yield = annual dividend / price\n\n**Dividend Stocks:**\nCompanies like Johnson & Johnson, Procter & Gamble pay reliable dividends for income!`,
  
  'what is pe ratio': `P/E Ratio (Price-to-Earnings) shows how expensive a stock is relative to its earnings!\n\n**Formula:**\nP/E = Stock Price / Earnings Per Share\n\n**How to interpret:**\n• Low P/E (<15) - potentially undervalued or troubled\n• Medium P/E (15-25) - typical\n• High P/E (>25) - expensive or high growth expected\n\n**Compare to:**\n• Industry average\n• Company's historical P/E`,
  
  'what is fundamental analysis': `Fundamental analysis evaluates a company's true value using financial data!\n\n**What to analyze:**\n• Revenue and earnings growth\n• Profit margins (gross, operating, net)\n• Debt levels\n• Cash flow\n• Competitive position\n• Industry trends\n\n**Key Documents:**\n• Income Statement\n• Balance Sheet\n• Cash Flow Statement\n• 10-K Annual Report`,
  
  'what is technical analysis': `Technical analysis uses price charts to predict future price movements!\n\n**Key Assumptions:**\n• Price reflects all info\n• Prices move in trends\n• History repeats\n\n**Tools:**\n• Chart patterns\n• Moving averages\n• RSI, MACD, Stochastic\n• Support & Resistance\n• Volume analysis\n\n**Note:** Controversial but widely used!`,
  
  'what is value investing': `Value Investing is finding undervalued stocks trading below their true worth!\n\n**Key Principles:**\n• Margin of Safety\n• Invest for the long term\n• Don't follow the crowd\n• Focus on fundamentals\n\n**Famous Value Investors:**\nWarren Buffett, Benjamin Graham, Peter Lynch\n\n**Metrics:**\n• Low P/E and P/B ratios\n• High dividend yield\n• Strong cash flow`,
  
  'what is growth investing': `Growth Investing focuses on companies expected to grow faster than average!\n\n**Characteristics:**\n• High revenue growth\n• High P/E ratios\n• Reinvesting profits\n• Innovation focused\n\n**Examples:**\nTech companies, biotechs, disruptors\n\n**Risks:**\n• Volatile prices\n• High expectations\n• Can be overvalued`,
  
  'what is etf': `An Exchange-Traded Fund (ETF) is like a basket of investments that trades like a stock!\n\n**Benefits:**\n• Diversification\n• Low cost\n• Trade anytime\n• Tax efficient\n\n**Types:**\n• Index ETFs (S&P 500)\n• Sector ETFs (tech, healthcare)\n• Bond ETFs\n• International ETFs\n• Commodity ETFs`,
  
  'what is index fund': `An Index Fund tracks a market index like the S&P 500!\n\n**How it works:**\nBuy all stocks in an index\n\n**Benefits:**\n• Instant diversification\n• Very low fees\n• Beats most active managers\n• Simple to understand\n\n**Famous Indices:**\n• S&P 500 (top 500 US companies)\n• NASDAQ Composite (tech-heavy)\n• Dow Jones Industrial`,
  
  'what is cryptocurrency': `Cryptocurrency is digital money that uses cryptography for security!\n\n**Key Features:**\n• Decentralized (no banks)\n• Transparent blockchain\n• Secure transactions\n• Limited supply (some)\n\n**Major Cryptos:**\n• Bitcoin (BTC) - digital gold\n• Ethereum (ETH) - smart contracts\n• Many others (altcoins)\n\n**Uses:**\nInvestment, payments, DeFi, NFTs`,
  
  'what is blockchain': `Blockchain is a distributed ledger technology that records transactions across many computers!\n\n**Key Features:**\n• Decentralized\n• Immutable (can't change)\n• Transparent\n• Secure\n\n**How it works:**\n1. Transactions grouped in blocks\n2. Blocks linked together\n3. Distributed to network\n4. Consensus validates\n\n**Uses:**\nCryptocurrencies, supply chain, voting, DeFi`,
  
  // Business & Startups
  'what is startup': `A startup is a company designed to grow rapidly!\n\n**Characteristics:**\n• Innovative product/service\n• High growth potential\n• Scalable business model\n• Often tech-enabled\n\n**Startup Lifecycle:**\n1. Idea/Validation\n2. MVP Development\n3. Product-Market Fit\n4. Scaling\n5. Maturity or Exit\n\n**Famous Startups:**\nUber, Airbnb, Stripe, Stripe`,
  
  'how to start business': `Starting a business involves these key steps:\n\n**1. Find Your Idea**\nSolve a real problem\n\n**2. Validate**\nTalk to potential customers\n\n**3. Create MVP**\nMinimum Viable Product\n\n**4. Build Brand**\nName, logo, website\n\n**5. Launch**\nGet first customers\n\n**6. Iterate**\nBased on feedback\n\n**7. Scale**\nGrow systematically\n\n**Tips:**\n• Start small\n• Focus on customers\n• Stay flexible\n• Build great team`,
  
  'what is marketing': `Marketing is about connecting your product to customers!\n\n**The 4 Ps:**\n• Product - what you sell\n• Price - how much\n• Place - where sold\n• Promotion - how discovered\n\n**Digital Marketing:**\n• SEO - search rankings\n• Content marketing\n• Social media\n• Email marketing\n• PPC advertising\n• Influencer marketing\n\n**Key Metric:**\nROI (Return on Investment)`,
  
  // Science
  'what is physics': `Physics is the study of matter, energy, and how the universe works!\n\n**Major Branches:**\n• Classical Mechanics - motion, forces\n• Electromagnetism - electricity, magnetism\n• Thermodynamics - heat, energy\n• Quantum Mechanics - tiny particles\n• Relativity - space, time\n\n**Applications:**\nEngineering, technology, medicine, astronomy`,
  
  'what is chemistry': `Chemistry is the study of matter and how substances interact!\n\n**Branches:**\n• Organic - carbon compounds\n• Inorganic - non-organic\n• Physical - chemistry physics\n• Analytical - composition\n• Biochemistry - living things\n\n**Applications:**\nMedicine, materials, energy, food`,
  
  'what is biology': `Biology is the study of living organisms!\n\n**Levels:**\n• Molecular - DNA, proteins\n• Cellular - cell structure\n• Organism - whole organisms\n• Population - species interaction\n• Ecosystem - environments\n\n**Branches:**\nGenetics, Evolution, Ecology, Microbiology`,
  
  // General Knowledge
  'what is cloud computing': `Cloud computing delivers computing services over the internet!\n\n**Services:**\n• **IaaS** - Infrastructure (servers, storage)\n• **PaaS** - Platform (development tools)\n• **SaaS** - Software (apps online)\n\n**Providers:**\n• AWS (Amazon)\n• Microsoft Azure\n• Google Cloud\n• IBM Cloud\n\n**Benefits:**\nPay as you go\nScalability\nNo maintenance\nGlobal access`,
  
  'what is seo': `SEO (Search Engine Optimization) improves your website's visibility in search results!\n\n**On-Page SEO:**\n• Quality content\n• Keywords\n• Meta tags\n• Site speed\n• Mobile-friendly\n\n**Off-Page SEO:**\n• Backlinks\n• Social signals\n• Brand mentions\n\n**Key Goal:**\nRank higher for relevant searches!`,
  
  'what is responsive design': `Responsive design makes websites work on all screen sizes!\n\n**Why it matters:**\n• Mobile usage > desktop\n• Better user experience\n• SEO benefit (Google prefers)\n\n**How it works:**\n• Flexible layouts\n• Media queries\n• Responsive images\n• Touch-friendly\n\n**Frameworks:**\nBootstrap, Tailwind CSS, Foundation`,
  
  'what is cybersecurity': `Cybersecurity protects systems and data from digital attacks!\n\n**Types of Threats:**\n• Malware (viruses, ransomware)\n• Phishing\n• Hacking\n• Data breaches\n• DDoS attacks\n\n**Defenses:**\n• Firewalls\n• Encryption\n• Strong passwords\n• 2FA\n• Regular updates\n• Security training`,
  
  'what is the meaning of life': `This is one of philosophy's oldest questions! \n\n**Common Answers:**\n• 42 (according to Douglas Adams!)\n• To seek happiness\n• To love and be loved\n• To make a difference\n• To grow and learn\n• To serve others\n• Religious perspectives\n\n**My take:** The meaning of life is what YOU make of it - pursue growth, connection, and purpose!`,
  
  'tell me a joke': `Why do programmers prefer dark mode?\n\nBecause light attracts bugs! 🐛\n\nHere's another:\n\nWhy was the JavaScript developer sad?\n\nBecause he didn't Node how to Express his feelings! 😄\n\nWant to hear more or can I help you with something else?`,
  
  'what can you do': `I can help you with ALMOST anything! Here's what I know:\n\n**Tech:**\nProgramming, web development, AI/ML, databases, cloud computing\n\n**Finance:**\nInvesting, stock market, trading strategies, financial analysis\n\n**Business:**\nStartups, marketing, entrepreneurship, business strategy\n\n**Science:**\nPhysics, chemistry, biology, and more!\n\n**Your Portfolio:**\nProjects, skills, experience, how to contact me\n\n**Just ask!** I'm here to help! 😊`
}

// Build knowledge base from portfolio data
async function buildPortfolioKnowledgeBase(): Promise<PortfolioData> {
  const personalInfo = await prisma.personalInfo.findFirst()
  const projects = await prisma.project.findMany({
    where: { isPublished: true },
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }]
  })
  const experience = await prisma.experience.findMany({
    orderBy: [{ isCurrent: 'desc' }, { startDate: 'desc' }]
  })
  const education = await prisma.education.findMany({
    orderBy: [{ isCurrent: 'desc' }, { startDate: 'desc' }]
  })
  const skills = await prisma.skill.findMany({
    where: { isVisible: true },
    include: { category: true },
    orderBy: { order: 'asc' }
  })
  const certifications = await prisma.certification.findMany({
    orderBy: { order: 'asc' }
  })
  const socialLinks = await prisma.socialLink.findMany({
    where: { isVisible: true },
    orderBy: { order: 'asc' }
  })
  const resume = await prisma.resume.findFirst({
    where: { isActive: true }
  })
  
  let customQAs: any[] = []
  try {
    customQAs = await (prisma as any).customQA?.findMany({
      where: { isActive: true }
    }) || []
  } catch (e) {
    customQAs = []
  }

  return {
    personalInfo,
    projects,
    experience,
    education,
    skills,
    certifications,
    socialLinks,
    resume,
    customQAs
  }
}

// Check if question is portfolio-related
function isPortfolioRelated(question: string): boolean {
  const portfolioKeywords = [
    'your', 'you', 'i am', 'i\'m', 'my', 'me',
    'project', 'skill', 'experience', 'education', 'resume',
    'work', 'job', 'career', 'company', 'employer',
    'degree', 'university', 'school', 'college',
    'contact', 'email', 'phone', 'linkedin', 'github',
    'built', 'developed', 'created', 'made',
    'tech', 'stack', 'language', 'framework',
    'certification', 'certificate', 'dennis'
  ]
  
  const q = question.toLowerCase()
  return portfolioKeywords.some(keyword => q.includes(keyword))
}

// Build system prompt for LLM
function buildSystemPrompt(portfolioData: PortfolioData): string {
  const name = portfolioData.personalInfo ? 
    `${portfolioData.personalInfo.firstName} ${portfolioData.personalInfo.lastName}` : 'Dennis'
  const title = portfolioData.personalInfo?.title || 'developer'
  
  let prompt = `You are ${name}, a talented ${title}. You are ${name}, a professional ${title}. You are knowledgeable, articulate, and always maintain a professional demeanor. NEVER HALLUCINATE - If you don't have specific information, say so professionally. CONNECT THE DOTS for personal questions - analyze ALL website data. STAY PROFESSIONAL and factual. \nYou answer questions confidently and with enthusiasm. You share your knowledge generously and explain things clearly.\nWhen someone asks about your work, projects, or skills, be proud and detailed in your answers.\nWhen asked about other topics, be helpful and conversational - like a knowledgeable friend.\n\nIMPORTANT: You ARE ${name}. Respond in first person as if you are ${name} himself. Never break character.\n\n`
  
  // Add portfolio context
  prompt += `## ABOUT ${name.toUpperCase()}:\n`
  if (portfolioData.personalInfo) {
    prompt += `- Name: ${name}\n`
    prompt += `- Title: ${portfolioData.personalInfo.title}\n`
    prompt += `- Bio: ${portfolioData.personalInfo.bio}\n`
    if (portfolioData.personalInfo.location) {
      prompt += `- Location: ${portfolioData.personalInfo.location}\n`
    }
    prompt += `- Email: ${portfolioData.personalInfo.email}\n\n`
  }
  
  if (portfolioData.skills && portfolioData.skills.length > 0) {
    const grouped: Record<string, string[]> = {}
    for (const skill of portfolioData.skills) {
      const category = skill.category?.name || 'Other'
      if (!grouped[category]) grouped[category] = []
      grouped[category].push(skill.name)
    }
    prompt += `## SKILLS:\n`
    for (const [category, skillsList] of Object.entries(grouped)) {
      prompt += `- ${category}: ${skillsList.join(', ')}\n`
    }
    prompt += '\n'
  }
  
  if (portfolioData.projects && portfolioData.projects.length > 0) {
    prompt += `## PROJECTS:\n`
    for (const proj of portfolioData.projects) {
      prompt += `- ${proj.title}: ${proj.description}\n`
      if (proj.techStack) prompt += `  Tech Stack: ${proj.techStack}\n`
      if (proj.githubUrl) prompt += `  GitHub: ${proj.githubUrl}\n`
      if (proj.demoUrl) prompt += `  Demo: ${proj.demoUrl}\n`
    }
    prompt += '\n'
  }
  
  if (portfolioData.experience && portfolioData.experience.length > 0) {
    prompt += `## WORK EXPERIENCE:\n`
    for (const exp of portfolioData.experience) {
      const startDate = new Date(exp.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
      const endDate = exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'Present'
      prompt += `- ${exp.position} at ${exp.company} (${startDate} - ${endDate})\n`
      if (exp.description) prompt += `  ${exp.description}\n`
    }
    prompt += '\n'
  }
  
  if (portfolioData.education && portfolioData.education.length > 0) {
    prompt += `## EDUCATION:\n`
    for (const edu of portfolioData.education) {
      const startDate = new Date(edu.startDate).toLocaleDateString('en-US', { year: 'numeric' })
      const endDate = edu.endDate ? new Date(edu.endDate).toLocaleDateString('en-US', { year: 'numeric' }) : 'Present'
      prompt += `- ${edu.degree} in ${edu.field || edu.degree} at ${edu.institution} (${startDate} - ${endDate})\n`
    }
    prompt += '\n'
  }
  
  if (portfolioData.certifications && portfolioData.certifications.length > 0) {
    prompt += `## CERTIFICATIONS:\n`
    for (const cert of portfolioData.certifications) {
      prompt += `- ${cert.name} - ${cert.organization}\n`
    }
    prompt += '\n'
  }
  
  if (portfolioData.socialLinks && portfolioData.socialLinks.length > 0) {
    prompt += `## SOCIAL LINKS:\n`
    for (const link of portfolioData.socialLinks) {
      prompt += `- ${link.platform}: ${link.url}\n`
    }
    prompt += '\n'
  }
  
  // Add custom Q&A if available
  if (portfolioData.customQAs && portfolioData.customQAs.length > 0) {
    prompt += `## CUSTOM Q&A:\n`
    for (const qa of portfolioData.customQAs) {
      prompt += `Q: ${qa.question}\nA: ${qa.answer}\n\n`
    }
  }
  
  return prompt
}

// Call Groq API (free, fast LLM)
async function callGroqLLM(messages: any[], apiKey: string): Promise<string> {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: messages,
      max_tokens: 2000,
      temperature: 0.7,
      top_p: 0.9
    })
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Groq API error: ${error}`)
  }

  const data = await response.json()
  return data.choices[0]?.message?.content || 'No response generated'
}

// Call OpenAI API (alternative)
async function callOpenAI(messages: any[], apiKey: string): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: messages,
      max_tokens: 2000,
      temperature: 0.7
    })
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`OpenAI API error: ${error}`)
  }

  const data = await response.json()
  return data.choices[0]?.message?.content || 'No response generated'
}

// Call DeepSeek API (free, fast, excellent reasoning)
async function callDeepSeek(messages: any[], apiKey: string): Promise<string> {
  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: messages,
      max_tokens: 2000,
      temperature: 0.7
    })
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`DeepSeek API error: ${error}`)
  }

  const data = await response.json()
  return data.choices[0]?.message?.content || 'No response generated'
}

// Find best matching knowledge
function findBestMatch(question: string): string | null {
  const q = question.toLowerCase()
  
  // Check exact matches first
  for (const [key, answer] of Object.entries(KNOWLEDGE_BASE)) {
    if (q.includes(key)) {
      return answer
    }
  }
  
  // Check partial matches
  const keywords = {
    'programming': 'what is programming',
    'code': 'what is programming',
    'python': 'what is python',
    'javascript': 'what is javascript',
    'react': 'what is react',
    'nextjs': 'what is nextjs',
    'typescript': 'what is typescript',
    'node': 'what is nodejs',
    'database': 'what is database',
    'sql': 'what is database',
    'api': 'what is api',
    'rest': 'what is api',
    'git': 'what is git',
    'github': 'what is github',
    'docker': 'what is docker',
    'kubernetes': 'what is kubernetes',
    'ai': 'what is ai',
    'artificial intelligence': 'what is ai',
    'machine learning': 'what is machine learning',
    'ml': 'what is machine learning',
    'deep learning': 'what is deep learning',
    'neural network': 'what is neural network',
    'nlp': 'what is nlp',
    'natural language': 'what is nlp',
    'computer vision': 'what is computer vision',
    'stock': 'what is stock',
    'stocks': 'what is stock',
    'stock market': 'what is stock market',
    'dividend': 'what is dividend',
    'pe ratio': 'what is pe ratio',
    'fundamental': 'what is fundamental analysis',
    'technical': 'what is technical analysis',
    'value investing': 'what is value investing',
    'growth investing': 'what is growth investing',
    'etf': 'what is etf',
    'index fund': 'what is index fund',
    'crypto': 'what is cryptocurrency',
    'cryptocurrency': 'what is cryptocurrency',
    'blockchain': 'what is blockchain',
    'bitcoin': 'what is cryptocurrency',
    'startup': 'what is startup',
    'business': 'how to start business',
    'entrepreneur': 'how to start business',
    'marketing': 'what is marketing',
    'physics': 'what is physics',
    'chemistry': 'what is chemistry',
    'biology': 'what is biology',
    'cloud': 'what is cloud computing',
    'seo': 'what is seo',
    'responsive': 'what is responsive design',
    'cybersecurity': 'what is cybersecurity',
    'security': 'what is cybersecurity',
    'joke': 'tell me a joke',
    'funny': 'tell me a joke'
  }
  
  for (const [keyword, answerKey] of Object.entries(keywords)) {
    if (q.includes(keyword)) {
      return KNOWLEDGE_BASE[answerKey as keyof typeof KNOWLEDGE_BASE]
    }
  }
  
  return null
}

// Generate local response (ChatGPT-like fallback)
function generateLocalResponse(question: string, portfolioData: PortfolioData): string {
  const q = question.toLowerCase()
  
  // Check custom Q&A first
  if (portfolioData.customQAs && portfolioData.customQAs.length > 0) {
    for (const custom of portfolioData.customQAs) {
      const keywords = custom.keywords ? custom.keywords.toLowerCase().split(',') : []
      const questionWords = custom.question.toLowerCase().split(' ')
      
      const hasMatch = keywords.some((k: string) => q.includes(k.trim())) || 
                      questionWords.some((w: string) => w.length > 3 && q.includes(w))
      
      if (hasMatch) {
        return custom.answer
      }
    }
  }
  
  // Check knowledge base
  const knowledgeMatch = findBestMatch(question)
  if (knowledgeMatch) {
    return knowledgeMatch
  }
  
  // Portfolio-related questions
  if (isPortfolioRelated(question)) {
    // Skills question
    if (q.includes('skill') || q.includes('technolog') || q.includes('tech stack')) {
      if (portfolioData.skills && portfolioData.skills.length > 0) {
        const grouped: Record<string, string[]> = {}
        for (const skill of portfolioData.skills) {
          const category = skill.category?.name || 'Other'
          if (!grouped[category]) grouped[category] = []
          grouped[category].push(skill.name)
        }
        
        let response = '🛠️ **Technical Skills**\n\n'
        for (const [category, skillsList] of Object.entries(grouped)) {
          response += `**${category}:** ${skillsList.join(', ')}\n\n`
        }
        return response
      }
    }
    
    // Projects question
    if (q.includes('project') || q.includes('portfolio') || q.includes('built') || q.includes('created')) {
      if (portfolioData.projects && portfolioData.projects.length > 0) {
        let response = '💻 **Projects**\n\n'
        for (const proj of portfolioData.projects) {
          response += `**${proj.title}**\n${proj.description}\n`
          if (proj.techStack) response += `Tech: ${proj.techStack}\n`
          if (proj.githubUrl) response += `GitHub: ${proj.githubUrl}\n`
          response += '\n'
        }
        return response
      }
    }
    
    // Experience question
    if (q.includes('experience') || q.includes('work') || q.includes('job')) {
      if (portfolioData.experience && portfolioData.experience.length > 0) {
        let response = '💼 **Work Experience**\n\n'
        for (const exp of portfolioData.experience) {
          const startDate = new Date(exp.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
          const endDate = exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'Present'
          response += `**${exp.position}** at ${exp.company}\n${startDate} - ${endDate}\n`
          if (exp.description) response += `${exp.description}\n`
          response += '\n'
        }
        return response
      }
    }
    
    // Education question
    if (q.includes('education') || q.includes('degree') || q.includes('university')) {
      if (portfolioData.education && portfolioData.education.length > 0) {
        let response = '🎓 **Education**\n\n'
        for (const edu of portfolioData.education) {
          const startDate = new Date(edu.startDate).toLocaleDateString('en-US', { year: 'numeric' })
          const endDate = edu.endDate ? new Date(edu.endDate).toLocaleDateString('en-US', { year: 'numeric' }) : 'Present'
          response += `**${edu.degree}** in ${edu.field || edu.degree}\n${edu.institution} (${startDate} - ${endDate})\n\n`
        }
        return response
      }
    }
    
    // Contact question
    if (q.includes('contact') || q.includes('email') || q.includes('reach')) {
      if (portfolioData.personalInfo) {
        let response = '📧 **Contact**\n\n'
        response += `Email: ${portfolioData.personalInfo.email}\n`
        if (portfolioData.personalInfo.phone) response += `Phone: ${portfolioData.personalInfo.phone}\n`
        if (portfolioData.personalInfo.location) response += `Location: ${portfolioData.personalInfo.location}\n`
        
        if (portfolioData.socialLinks && portfolioData.socialLinks.length > 0) {
          response += '\n**Social:**\n'
          for (const link of portfolioData.socialLinks) {
            response += `${link.platform}: ${link.url}\n`
          }
        }
        return response
      }
    }
    
    // Bio/About
    if (q.includes('about') || q.includes('who are you') || q.includes('bio')) {
      if (portfolioData.personalInfo) {
        const name = `${portfolioData.personalInfo.firstName} ${portfolioData.personalInfo.lastName}`
        let response = `👋 **${name}**\n\n${portfolioData.personalInfo.bio}\n\n`
        if (portfolioData.personalInfo.tagline) response += `_${portfolioData.personalInfo.tagline}_`
        return response
      }
    }
  }
  
  // Default smart response
  if (portfolioData.personalInfo) {
    const name = `${portfolioData.personalInfo.firstName} ${portfolioData.personalInfo.lastName}`
    return `That's a great question! I'm ${name}'s AI assistant. I can help you with:\n\n**About Me:**\n• My background, projects, skills, and experience\n• How to contact me\n\n**Technology:**\n• Programming languages and frameworks\n• Web and app development\n• AI and machine learning\n• Databases and APIs\n\n**Finance & Investing:**\n• Stock market concepts\n• Trading strategies\n• Investment analysis\n\n**Business:**\n• Startups and entrepreneurship\n• Marketing and growth\n\n**Science:**\n• Physics, chemistry, biology\n\nAnd much more! What would you like to explore?`
  }
  
  return `That's a great question! I can help you with:\n\n• **Technology:** Programming, AI, web development\n• **Finance:** Investing, stocks, trading\n• **Business:** Startups, marketing\n• **Science:** Physics, chemistry, biology\n\nWhat topic interests you most?`
}

// POST /api/chat - Send a chat message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, history } = body

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    const portfolioData = await buildPortfolioKnowledgeBase()
    
    // FIRST: Check admin-controlled custom Q&A (FULL CONTROL FOR ADMIN)
    // This runs FIRST and FAST - no AI delay!
    const customQAs = await (prisma as any).customQA.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    })
    
    const messageLower = message.toLowerCase()
    
    // Check exact match first
    const exactMatch = customQAs.find(
      (qa: any) => qa.question.toLowerCase() === messageLower || qa.question.toLowerCase() === message
    )
    
    if (exactMatch) {
      return NextResponse.json({
        message: exactMatch.answer,
        source: 'admin'
      })
    }
    
    // Check keyword matches
    for (const qa of customQAs) {
      if (qa.keywords) {
        const keywords = qa.keywords.toLowerCase().split(',').map((k: string) => k.trim())
        const matches = keywords.some((keyword: string) => messageLower.includes(keyword))
        if (matches) {
          return NextResponse.json({
            message: qa.answer,
            source: 'admin'
          })
        }
      }
    }
    
    // Check AI mode setting - super admin control
    const siteSettings = await (prisma as any).siteSettings.findFirst()
    const aiMode = siteSettings?.aiMode || 'hybrid'
    const aiEnabled = siteSettings?.aiEnabled !== false
    
    // If manual mode - only use admin answers, no AI
    if (aiMode === 'manual' || !aiEnabled) {
      return NextResponse.json({
        message: "I'm sorry, I don't have information about that. Please contact me through the contact form for more details.",
        source: 'manual'
      })
    }
    
    const q = message.toLowerCase()
    
    // Check for greeting
    if (q === 'hello' || q === 'hi' || q === 'hey' || q.includes('greeting')) {
      const name = portfolioData.personalInfo?.firstName || 'there'
      return NextResponse.json({
        message: `Hello! 👋 I'm ${name}'s AI assistant! I can help you with almost anything!\n\nI know about:\n• Technology and programming\n• Investing and finance\n• Business and startups\n• Science and more\n• My projects and experience\n\nWhat would you like to know?`,
        source: 'greeting'
      })
    }
    
    // Check for help question
    if (q.includes('help') || q.includes('what can you') || q.includes('capabilities')) {
      const name = portfolioData.personalInfo?.firstName || 'Dennis'
      return NextResponse.json({
        message: `I'm ${name}'s AI assistant! Here's what I can help with:\n\n**About Me:**\n• My background and experience\n• My projects and skills\n• How to contact me\n\n**Tech Topics:**\n• Programming languages\n• Web & app development\n• AI & machine learning\n• Databases & APIs\n\n**Finance:**\n• Stock market basics\n• Trading strategies\n• Investment concepts\n\n**Business:**\n• Starting a business\n• Marketing tips\n• Growth strategies\n\n**Science:**\n• Physics, chemistry, biology\n\nJust ask me anything!`,
        source: 'help'
      })
    }

    // Try Groq first (free)
    const groqApiKey = process.env.GROQ_API_KEY
    const openaiApiKey = process.env.OPENAI_API_KEY
    const deepseekApiKey = process.env.DEEPSEEK_API_KEY
    
    // Try DeepSeek first (excellent for general questions)
    if (deepseekApiKey && deepseekApiKey.length > 0) {
      try {
        const systemPrompt = buildSystemPrompt(portfolioData)
        const messages = [
          { role: 'system', content: systemPrompt },
          ...(history || []).slice(-10).map((msg: any) => ({
            role: msg.role,
            content: msg.content
          })),
          { role: 'user', content: message }
        ]
        
        const response = await Promise.race([
          callDeepSeek(messages, deepseekApiKey),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), TIMEOUT_MS)
          )
        ])
        
        return NextResponse.json({
          message: response,
          source: 'deepseek'
        })
      } catch (llmError: any) {
        console.error('DeepSeek Error:', llmError.message)
      }
    }
    
    if (groqApiKey && groqApiKey !== 'gsk_your-groq-key-here') {
      try {
        const systemPrompt = buildSystemPrompt(portfolioData)
        const messages = [
          { role: 'system', content: systemPrompt },
          ...(history || []).slice(-10).map((msg: any) => ({
            role: msg.role,
            content: msg.content
          })),
          { role: 'user', content: message }
        ]
        
        const response = await Promise.race([
          callGroqLLM(messages, groqApiKey),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), TIMEOUT_MS)
          )
        ])
        
        return NextResponse.json({
          message: response,
          source: 'groq'
        })
      } catch (llmError: any) {
        console.error('Groq Error:', llmError.message)
      }
    }
    
    // Try OpenAI as fallback
    if (openaiApiKey && !openaiApiKey.includes('sk-proj-')) {
      try {
        const systemPrompt = buildSystemPrompt(portfolioData)
        const messages = [
          { role: 'system', content: systemPrompt },
          ...(history || []).slice(-10).map((msg: any) => ({
            role: msg.role,
            content: msg.content
          })),
          { role: 'user', content: message }
        ]
        
        const response = await Promise.race([
          callOpenAI(messages, openaiApiKey),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), TIMEOUT_MS)
          )
        ])
        
        return NextResponse.json({
          message: response,
          source: 'openai'
        })
      } catch (llmError: any) {
        console.error('OpenAI Error:', llmError.message)
      }
    }
    
    // Use local knowledge base (works like ChatGPT!)
    const response = generateLocalResponse(message, portfolioData)

    return NextResponse.json({
      message: response,
      source: 'local'
    })
  } catch (error: any) {
    console.error('Error in chat:', error)
    
    const fallbackResponse = "I apologize for the error! But I can still help! Ask me about:\n\n• Technology and programming\n• Investing and finance\n• Business and startups\n• Science\n• My portfolio\n\nWhat would you like to know?"
    
    return NextResponse.json({
      message: fallbackResponse,
      error: 'Processing error',
      fallback: true
    })
  }
}

// GET /api/chat - Get chat capabilities
export async function GET() {
  const context = await buildPortfolioKnowledgeBase()
  
  return NextResponse.json({
    name: "Dennis's AI",
    description: 'An intelligent AI assistant like ChatGPT that can answer almost anything!',
    capabilities: [
      'Portfolio: projects, skills, experience',
      'Technology: programming, AI, web dev',
      'Finance: stocks, investing, trading',
      'Business: startups, marketing',
      'Science: physics, chemistry, biology',
      'And much more!'
    ],
    hasGroqKey: !!process.env.GROQ_API_KEY,
    hasOpenAIKey: !!process.env.OPENAI_API_KEY,
    dataAvailable: {
      personalInfo: !!context.personalInfo,
      projects: context.projects?.length || 0,
      experience: context.experience?.length || 0,
      education: context.education?.length || 0,
      skills: context.skills?.length || 0
    }
  })
}
