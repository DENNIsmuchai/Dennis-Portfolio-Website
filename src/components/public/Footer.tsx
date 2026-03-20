'use client'

import Link from 'next/link'
import { Github, Linkedin, Twitter, Mail } from 'lucide-react'
import type { PersonalInfo, SocialLink } from '@/types'
import { useLanguage } from '@/contexts/LanguageContext'

interface FooterProps {
  personalInfo: PersonalInfo | null
  socialLinks: SocialLink[]
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  email: Mail,
}

export function Footer({ personalInfo, socialLinks }: FooterProps) {
  const { t } = useLanguage()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border/50 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="text-center md:text-left">
            <Link href="/" className="flex items-center gap-2 justify-center md:justify-start">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-800 to-amber-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {personalInfo?.firstName?.[0] || 'P'}
                </span>
              </div>
              <span className="font-semibold">
                {personalInfo?.firstName} {personalInfo?.lastName}
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mt-2">
              {personalInfo?.title}
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((link) => {
              const Icon = iconMap[link.platform.toLowerCase()] || Mail
              return (
                <Link
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-muted hover:bg-primary/20 transition-colors"
                >
                  <Icon className="h-5 w-5" />
                </Link>
              )
            })}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-border/50 text-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} {personalInfo?.firstName} {personalInfo?.lastName}. {t('general.allRightsReserved')}.
          </p>
        </div>
      </div>
    </footer>
  )
}
