import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create admin user
  const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10)

  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@example.com' },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@example.com',
      name: 'Admin',
      password: adminPassword,
      role: 'ADMIN',
    },
  })
  console.log('Created admin user:', admin.email)

  // Create default sections
  const sections = [
    { name: 'hero', title: 'Hero', type: 'HERO', order: 1, navLabel: 'Home' },
    { name: 'about', title: 'About Me', type: 'ABOUT', order: 2, navLabel: 'About' },
    { name: 'projects', title: 'Projects', type: 'PROJECTS', order: 3, navLabel: 'Projects' },
    { name: 'skills', title: 'Skills', type: 'SKILLS', order: 4, navLabel: 'Skills' },
    { name: 'experience', title: 'Experience', type: 'EXPERIENCE', order: 5, navLabel: 'Experience' },
    { name: 'education', title: 'Education', type: 'EDUCATION', order: 6, navLabel: 'Education' },
    { name: 'blog', title: 'Blog', type: 'BLOG', order: 7, navLabel: 'Blog' },
    { name: 'contact', title: 'Contact', type: 'CONTACT', order: 8, navLabel: 'Contact' },
    { name: 'currently-tracking', title: 'Currently Tracking', type: 'CURRENTLY_TRACKING', order: 9, navLabel: 'Tracking', isVisible: false },
  ]

  for (const section of sections) {
    await prisma.section.upsert({
      where: { name: section.name },
      update: {},
      create: section,
    })
  }
  console.log('Created default sections')

  // Create default personal info
  await prisma.personalInfo.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      firstName: 'John',
      lastName: 'Doe',
      title: 'Full Stack Developer',
      tagline: 'I build exceptional digital experiences with modern technologies.',
      bio: 'Passionate developer with expertise in building modern web applications. I love creating elegant solutions to complex problems.',
      email: 'hello@example.com',
      location: 'San Francisco, CA',
    },
  })
  console.log('Created default personal info')

  // Create default theme
  await prisma.theme.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      name: 'default',
      primaryColor: '#3b82f6',
      secondaryColor: '#8b5cf6',
      accentColor: '#10b981',
      backgroundColor: '#0f172a',
      surfaceColor: '#1e293b',
      textColor: '#f8fafc',
      mutedColor: '#64748b',
      fontFamily: 'inter',
      isDarkMode: true,
      animationIntensity: 'medium',
      isActive: true,
    },
  })
  console.log('Created default theme')

  // Create skill categories first
  const skillCategories = [
    { name: 'LANGUAGE', label: 'Programming Languages', order: 1 },
    { name: 'FRAMEWORK', label: 'Frameworks & Libraries', order: 2 },
    { name: 'DATABASE', label: 'Databases', order: 3 },
    { name: 'CLOUD', label: 'Cloud & DevOps', order: 4 },
    { name: 'TOOL', label: 'Tools & Technologies', order: 5 },
    { name: 'SOFT_SKILL', label: 'Soft Skills', order: 6 },
  ]

  for (const cat of skillCategories) {
    await prisma.skillCategory.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    })
  }

  // Create sample skills with category relation
  const skills = [
    { name: 'JavaScript', categoryName: 'LANGUAGE', proficiency: 95 },
    { name: 'TypeScript', categoryName: 'LANGUAGE', proficiency: 90 },
    { name: 'Python', categoryName: 'LANGUAGE', proficiency: 85 },
    { name: 'React', categoryName: 'FRAMEWORK', proficiency: 95 },
    { name: 'Next.js', categoryName: 'FRAMEWORK', proficiency: 90 },
    { name: 'Node.js', categoryName: 'FRAMEWORK', proficiency: 88 },
    { name: 'PostgreSQL', categoryName: 'DATABASE', proficiency: 85 },
    { name: 'MongoDB', categoryName: 'DATABASE', proficiency: 80 },
    { name: 'AWS', categoryName: 'CLOUD', proficiency: 75 },
    { name: 'Docker', categoryName: 'TOOL', proficiency: 80 },
    { name: 'Git', categoryName: 'TOOL', proficiency: 90 },
    { name: 'Problem Solving', categoryName: 'SOFT_SKILL', proficiency: 95 },
  ]

  for (const skill of skills) {
    const { categoryName, ...skillData } = skill
    await prisma.skill.upsert({
      where: { id: skill.name.toLowerCase().replace(/\s+/g, '-') },
      update: {},
      create: {
        id: skill.name.toLowerCase().replace(/\s+/g, '-'),
        ...skillData,
        category: { connect: { name: categoryName } },
      },
    })
  }
  console.log('Created sample skills')

  // Create sample social links
  const socialLinks = [
    { platform: 'github', url: 'https://github.com', icon: 'github', order: 1 },
    { platform: 'linkedin', url: 'https://linkedin.com', icon: 'linkedin', order: 2 },
    { platform: 'twitter', url: 'https://twitter.com', icon: 'twitter', order: 3 },
  ]

  for (const link of socialLinks) {
    await prisma.socialLink.upsert({
      where: { id: link.platform },
      update: {},
      create: {
        id: link.platform,
        ...link,
      },
    })
  }
  console.log('Created sample social links')

  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
