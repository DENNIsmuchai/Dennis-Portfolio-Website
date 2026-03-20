'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Mail, Phone } from 'lucide-react'
import type { PersonalInfo } from '@/types'

interface AboutSectionProps {
  id: string
  title: string
  content?: Record<string, any> | null
  personalInfo: PersonalInfo | null
}

export function AboutSection({ id, title, personalInfo }: AboutSectionProps) {
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
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl transform rotate-3" />
              <div className="relative aspect-square rounded-2xl overflow-hidden">
                {personalInfo?.aboutImage ? (
                  <Image
                    src={personalInfo.aboutImage}
                    alt="About"
                    fill
                    className="object-cover object-center"
                    priority
                    quality={90}
                  />
                ) : personalInfo?.avatar ? (
                  <Image
                    src={personalInfo.avatar}
                    alt="About"
                    fill
                    className="object-cover object-center"
                    priority
                    quality={90}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                    <span className="text-8xl font-bold text-gradient">A</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-2xl font-bold mb-4">
                Who am I?
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {personalInfo?.bio || 
                  'I am a passionate developer with expertise in building modern web applications. I love creating elegant solutions to complex problems.'}
              </p>
            </div>

            {/* Info Cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              <Card className="glass">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">{personalInfo?.location || 'Remote'}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-secondary/10">
                    <Mail className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium text-sm">{personalInfo?.email || 'hello@example.com'}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tags */}
            <div>
              <p className="text-sm text-muted-foreground mb-3">Interests</p>
              <div className="flex flex-wrap gap-2">
                {(personalInfo?.interests ? personalInfo.interests.split(',').map(i => i.trim()) : ['Web Development', 'AI/ML', 'Open Source', 'Design', 'Problem Solving']).map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

