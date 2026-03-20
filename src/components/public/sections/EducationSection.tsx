'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { GraduationCap, Calendar, MapPin, Award } from 'lucide-react'
import type { Education } from '@/types'
import { formatDateRange } from '@/lib/utils'

interface EducationSectionProps {
  id: string
  title: string
  content?: Record<string, any> | null
  education: Education[]
}

export function EducationSection({ id, title, education }: EducationSectionProps) {
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
            My academic background and qualifications
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {education.map((edu, index) => (
            <motion.div
              key={edu.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="glass h-full">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                        <GraduationCap className="h-6 w-6 text-secondary" />
                      </div>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-1">{edu.degree}</h3>

                      <p className="text-primary font-medium mb-2">
                        {edu.institution}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDateRange(edu.startDate, edu.endDate, edu.isCurrent)}
                        </span>
                        {edu.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {edu.location}
                          </span>
                        )}
                      </div>

                      {edu.field && (
                        <p className="text-sm text-muted-foreground mb-2">
                          Field of Study: {edu.field}
                        </p>
                      )}

                      {edu.gpa && (
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="gap-1">
                            <Award className="h-3 w-3" />
                            GPA: {edu.gpa}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {education.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No education added yet.</p>
          </div>
        )}
      </div>
    </section>
  )
}
