'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  Code2, 
  Database, 
  Cloud, 
  Wrench, 
  MessageSquare,
  Layers 
} from 'lucide-react'
import type { Skill } from '@/types'

interface SkillCategoryWithSkills {
  id: string
  name: string
  label: string
  order: number
  isVisible: boolean
  skills: Skill[]
}

interface SkillsSectionProps {
  id: string
  title: string
  content?: Record<string, any> | null
  skills?: Skill[]
  categories?: SkillCategoryWithSkills[]
}

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  LANGUAGE: Code2,
  FRAMEWORK: Layers,
  TOOL: Wrench,
  DATABASE: Database,
  CLOUD: Cloud,
  SOFT_SKILL: MessageSquare,
  OTHER: Code2,
}

// Fallback icon for custom categories
const DefaultIcon = Code2

const categoryLabels: Record<string, string> = {
  LANGUAGE: 'Languages',
  FRAMEWORK: 'Frameworks',
  TOOL: 'Tools',
  DATABASE: 'Databases',
  CLOUD: 'Cloud',
  SOFT_SKILL: 'Soft Skills',
  OTHER: 'Other',
}

export function SkillsSection({ id, title, skills, categories }: SkillsSectionProps) {
  // If categories are provided (new structure), use them
  // Otherwise, fall back to the old skills array approach
  const categoriesToShow = categories || []
  
  // If we have categories with skills, use them
  const skillsData = categoriesToShow.length > 0 
    ? categoriesToShow.filter(cat => cat.isVisible && cat.skills.length > 0)
    : []

  // Legacy support: if skills array is passed directly
  const legacySkillsByCategory = skills?.reduce((acc, skill) => {
    const catName = skill.category || 'OTHER'
    if (!acc[catName]) {
      acc[catName] = []
    }
    acc[catName].push(skill)
    return acc
  }, {} as Record<string, Skill[]>)

  return (
    <section id={id} className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">{title}</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full" />
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Technologies and tools I work with
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* New category-based approach */}
          {skillsData.length > 0 ? (
            skillsData.map((category, categoryIndex) => {
              const Icon = categoryIcons[category.name.toUpperCase()] || DefaultIcon
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
                >
                  <Card className="glass h-full">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold">
                          {category.label}
                        </h3>
                      </div>

                      <div className="space-y-4">
                        {category.skills.map((skill) => (
                          <div key={skill.id}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium">{skill.name}</span>
                              <span className="text-sm text-muted-foreground">
                                {skill.proficiency}%
                              </span>
                            </div>
                            <Progress value={skill.proficiency} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })
          ) : (
            /* Legacy approach: skills array with category field */
            Object.entries(legacySkillsByCategory || {}).map(([category, categorySkills], categoryIndex) => {
              const Icon = categoryIcons[category as string] || DefaultIcon
              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
                >
                  <Card className="glass h-full">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold">
                          {categoryLabels[category as string] || category}
                        </h3>
                      </div>

                      <div className="space-y-4">
                        {categorySkills.map((skill) => (
                          <div key={skill.id}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium">{skill.name}</span>
                              <span className="text-sm text-muted-foreground">
                                {skill.proficiency}%
                              </span>
                            </div>
                            <Progress value={skill.proficiency} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
           })
          )}
        </div>

        {(skillsData.length === 0 && (!legacySkillsByCategory || Object.keys(legacySkillsByCategory).length === 0)) && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No skills added yet.</p>
          </div>
        )}
      </div>
    </section>
  )
}

