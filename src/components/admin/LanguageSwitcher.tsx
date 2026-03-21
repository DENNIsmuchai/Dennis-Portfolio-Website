'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Globe } from 'lucide-react'

const languages = [
  { value: 'en', label: 'English', flag: '🇺🇸' },
  { value: 'fr', label: 'Français', flag: '🇫🇷' },
  { value: 'sw', label: 'Kiswahili', flag: '🇰🇪' },
]

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <Select
        value={language}
        onValueChange={(value: 'en' | 'fr' | 'sw') => setLanguage(value)}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent>
          {languages.map((lang) => (
            <SelectItem key={lang.value} value={lang.value}>
              <span className="flex items-center gap-2">
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
