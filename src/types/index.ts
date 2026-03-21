export interface User {
  id: string
  name?: string | null
  email: string
  role: 'ADMIN' | 'EDITOR'
  image?: string | null
}

export interface Section {
  id: string
  name: string
  title: string
  type: string
  content?: Record<string, any> | null
  isVisible: boolean
  order: number
  navLabel?: string | null
  showInNav: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Project {
  id: string
  title: string
  slug: string
  description: string
  content?: string | null
  image?: string | null
  images?: string | null
  githubUrl?: string | null
  demoUrl?: string | null
  techStack: string[]
  featured: boolean
  isPublished: boolean
  order: number
  views: number
  createdAt: Date
  updatedAt: Date
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  content: string
  coverImage?: string | null
  tags: string[]
  isPublished: boolean
  publishedAt?: Date | null
  views: number
  createdAt: Date
  updatedAt: Date
}

export interface Experience {
  id: string
  company: string
  position: string
  location?: string | null
  startDate: Date
  endDate?: Date | null
  isCurrent: boolean
  description: string
  highlights?: string | null
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface Education {
  id: string
  institution: string
  degree: string
  field?: string | null
  location?: string | null
  startDate: Date
  endDate?: Date | null
  isCurrent: boolean
  description?: string | null
  gpa?: string | null
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface Certification {
  id: string
  name: string
  organization: string
  issueDate: Date
  expiryDate?: Date | null
  credentialId?: string | null
  credentialUrl?: string | null
  image?: string | null
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface SkillCategory {
  id: string
  name: string
  label: string
  order: number
  isVisible: boolean
  createdAt: Date
  updatedAt: Date
  skills?: Skill[]
}

export interface Skill {
  id: string
  name: string
  category: string
  categoryId?: string | null
  proficiency: number
  icon?: string | null
  isVisible: boolean
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface Theme {
  id: string
  name: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  backgroundColor: string
  surfaceColor: string
  textColor: string
  mutedColor: string
  fontFamily: string
  isDarkMode: boolean
  animationIntensity: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface SocialLink {
  id: string
  platform: string
  url: string
  icon?: string | null
  isVisible: boolean
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface PersonalInfo {
  id: string
  firstName: string
  lastName: string
  title: string
  tagline?: string | null
  bio: string
  email: string
  phone?: string | null
  location?: string | null
  avatar?: string | null
  bannerImage?: string | null
  aboutImage?: string | null
  interests?: string | null
  resumeUrl?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Analytics {
  id: string
  page: string
  visitorId: string
  sessionId: string
  userAgent?: string | null
  referrer?: string | null
  country?: string | null
  city?: string | null
  createdAt: Date
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  subject?: string | null
  message: string
  isRead: boolean
  createdAt: Date
}

export interface Resume {
  id: string
  fileName: string
  fileUrl: string
  fileSize: number
  isActive: boolean
  uploadedAt: Date
  createdAt: Date
}
