'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowDown, Github, Linkedin, Twitter } from 'lucide-react'
import type { PersonalInfo } from '@/types'
import { useLanguage } from '@/contexts/LanguageContext'

interface HeroSectionProps {
  id: string
  title: string
  content?: Record<string, any> | null
  personalInfo: PersonalInfo | null
}

export function HeroSection({ id, personalInfo }: HeroSectionProps) {
  const { t } = useLanguage()

  return (
    <section
      id={id}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900/90 to-slate-950"
    >
      {/* Finance Professional Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/30 via-slate-900/20 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-amber-700/10 via-transparent to-transparent" />
        {/* Subtle animated particles */}
        <div className="absolute inset-0 overflow-hidden">
          {personalInfo?.bannerImage && (
            <div className="absolute inset-0">
              <img 
                src={personalInfo.bannerImage} 
                alt="Cover" 
                className="w-full h-full object-cover opacity-30"
              />
            </div>
          )}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-800/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 py-32">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Content - Clean and Direct */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 text-center lg:text-left"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-sm font-medium text-blue-300/80 uppercase tracking-wider mb-4"
            >
              {t('general.welcome')}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight mb-4 text-white"
            >
              {personalInfo?.firstName || 'Your Name'}{' '}
              {personalInfo?.lastName || ''}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg sm:text-xl text-blue-100/80 mb-6 font-medium"
            >
              {personalInfo?.title || 'Your Title'}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-base text-blue-200/60 max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed"
            >
              {personalInfo?.tagline || personalInfo?.bio?.slice(0, 200) || 
                'Professional summary goes here.'}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start"
            >
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-slate-900 shadow-lg shadow-amber-600/25 font-semibold"
                asChild
              >
                <Link href="#contact">{t('nav.contact')}</Link>
              </Button>
              <Button 
                size="lg" 
                variant="ghost" 
                className="text-amber-200 hover:text-white hover:bg-amber-500/20"
                asChild
              >
                <Link href="#experience">{t('nav.experience')}</Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-3 mt-8 justify-center lg:justify-start"
            >
              <Link
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
              >
                <Twitter className="h-5 w-5" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Avatar - Simple and Clean */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex-shrink-0"
          >
            <div className="relative">
              <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden border-2 border-blue-500/30 bg-gradient-to-br from-blue-900/30 to-slate-800/30 glow-gold">
                {personalInfo?.avatar ? (
                  <Image
                    src={personalInfo.avatar}
                    alt={`${personalInfo.firstName} ${personalInfo.lastName}`}
                    fill
                    sizes="(max-width: 768px) 192px, 224px"
                    className="object-cover object-center rounded-full"
                    priority
                    quality={90}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-amber-500/30 to-orange-600/30 flex items-center justify-center">
                    <span className="text-4xl font-semibold text-slate-400">
                      {personalInfo?.firstName?.[0] || 'Y'}
                      {personalInfo?.lastName?.[0] || 'N'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Simple Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <Link
          href="#about"
          className="flex flex-col items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors"
        >
          <span className="text-xs uppercase tracking-wider">Scroll</span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ArrowDown className="h-4 w-4" />
          </motion.div>
        </Link>
      </motion.div>
    </section>
  )
}
