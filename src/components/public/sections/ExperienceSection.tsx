'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Briefcase, Calendar, MapPin } from 'lucide-react'
import type { Experience } from '@/types'
import { formatDateRange } from '@/lib/utils'

interface ExperienceSectionProps {
  id: string
  title: string
  content?: Record<string, any> | null
  experience: Experience[]
}

export function ExperienceSection({ id, title, experience }: ExperienceSectionProps) {
  return (
    <section id={id} className="py-24">
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
            My professional journey and career highlights
          </p>
        </motion.div>

        <div className="space-y-6">
          {experience.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="glass">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Briefcase className="h-6 w-6 text-primary" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                        <h3 className="text-xl font-bold">{exp.position}</h3>
                        {exp.isCurrent && (
                          <Badge variant="default" className="w-fit">
                            Current
                          </Badge>
                        )}
                      </div>

                      <p className="text-lg text-primary font-medium mb-2">
                        {exp.company}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDateRange(exp.startDate, exp.endDate, exp.isCurrent)}
                        </span>
                        {exp.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {exp.location}
                          </span>
                        )}
                      </div>

                      <p className="text-muted-foreground mb-4">
                        {exp.description}
                      </p>

                      {exp.highlights && (
                        <div className="flex flex-wrap gap-2">
                          {exp.highlights.split('\n').filter(Boolean).map((highlight, i) => (
                            <Badge key={i} variant="secondary">
                              {highlight}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {experience.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No experience added yet.</p>
          </div>
        )}
      </div>
    </section>
  )
}

