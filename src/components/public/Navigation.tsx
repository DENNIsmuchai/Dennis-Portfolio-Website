'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Menu, X, Download } from 'lucide-react'
import type { Section, PersonalInfo } from '@/types'
import { LanguageSwitcher } from './LanguageSwitcher'
import { useLanguage } from '@/contexts/LanguageContext'

interface CustomPage {
  id: string
  slug: string
  title: string
  showInNav: boolean
}

interface NavigationTab {
  id: string
  title: string
  slug: string
  icon: string | null
  contentType: string
  externalUrl: string | null
  isVisible: boolean
}

interface NavigationProps {
  sections: Section[]
  personalInfo: PersonalInfo | null
  customPages?: CustomPage[]
}

export function Navigation({ sections, personalInfo }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { t } = useLanguage()

  const [customPages, setCustomPages] = useState<CustomPage[]>([])
  const [navTabs, setNavTabs] = useState<NavigationTab[]>([])

  useEffect(() => {
    // Fetch custom pages for navigation
    fetch('/api/custom-pages?showInNav=true')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCustomPages(data.filter((p: CustomPage) => p.showInNav))
        }
      })
      .catch(console.error)

    // Fetch navigation tabs
    fetch('/api/navigation-tabs?active=true')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setNavTabs(data.filter((t: NavigationTab) => t.isVisible))
        }
      })
      .catch(console.error)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = sections.filter(s => s.showInNav)

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-lg shadow-amber-900/20'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-800 to-amber-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {personalInfo?.firstName?.[0] || 'P'}
                </span>
              </div>
              <span className="font-semibold hidden sm:block">
                {personalInfo?.firstName || 'Portfolio'}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  href={`#${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted"
                >
                  {item.navLabel || item.title}
                </Link>
              ))}
              {/* Custom Pages in Navigation */}
              {customPages.map((page) => (
                <Link
                  key={page.id}
                  href={`/${page.slug}`}
                  className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted"
                >
                  {page.title}
                </Link>
              ))}
              {/* Navigation Tabs */}
              {navTabs.map((tab) => (
                <Link
                  key={tab.id}
                  href={tab.externalUrl || `/tab/${tab.slug}`}
                  target={tab.externalUrl ? '_blank' : undefined}
                  rel={tab.externalUrl ? 'noopener noreferrer' : undefined}
                  className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted"
                >
                  {tab.title}
                </Link>
              ))}
            </nav>

            {/* CTA Button */}
            <div className="hidden md:flex items-center gap-4">
              <LanguageSwitcher />
              {personalInfo?.resumeUrl && (
                <Button variant="gradient" size="sm" asChild>
                  <Link href={personalInfo.resumeUrl} target="_blank" className="gap-2">
                    <Download className="h-4 w-4" />
                    {t('general.downloadResume')}
                  </Link>
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-md hover:bg-muted"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-16 z-40 md:hidden"
          >
            <div className="bg-background/95 backdrop-blur-xl border-b border-border/50 p-4">
              <nav className="flex flex-col gap-2">
                <div className="mb-2">
                  <LanguageSwitcher />
                </div>
                {navItems.map((item) => (
                  <Link
                    key={item.id}
                    href={`#${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.navLabel || item.title}
                  </Link>
                ))}
                {/* Custom Pages in Mobile Navigation */}
                {customPages.map((page) => (
                  <Link
                    key={page.id}
                    href={`/${page.slug}`}
                    className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {page.title}
                  </Link>
                ))}
                {/* Navigation Tabs in Mobile */}
                {navTabs.map((tab) => (
                  <Link
                    key={tab.id}
                    href={tab.externalUrl || `/tab/${tab.slug}`}
                    target={tab.externalUrl ? '_blank' : undefined}
                    rel={tab.externalUrl ? 'noopener noreferrer' : undefined}
                    className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {tab.title}
                  </Link>
                ))}
                {personalInfo?.resumeUrl && (
                  <Button variant="gradient" className="mt-2" asChild>
                    <Link href={personalInfo.resumeUrl} target="_blank" className="gap-2">
                      <Download className="h-4 w-4" />
                      {t('general.downloadResume')}
                    </Link>
                  </Button>
                )}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
