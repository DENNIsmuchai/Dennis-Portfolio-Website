'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Textarea } from '@/components/ui/textarea'
import { CheckCircle, RefreshCcw, Globe, Search, Share2, Code } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

interface GlobalSettings {
  siteTitle: string
  siteTagline: string
  metaDescription: string
  metaKeywords: string
  ogImage: string
  twitterCardType: string
  defaultLanguage: string
  locale: string
  customCss: string
  favicon: string
  appleTouchIcon: string
  maintenanceMode: boolean
  analyticsEnabled: boolean
}

const defaultSettings: GlobalSettings = {
  siteTitle: 'My Portfolio',
  siteTagline: '',
  metaDescription: '',
  metaKeywords: '',
  ogImage: '',
  twitterCardType: 'summary_large_image',
  defaultLanguage: 'en',
  locale: 'en-US',
  customCss: '',
  favicon: '',
  appleTouchIcon: '',
  maintenanceMode: false,
  analyticsEnabled: true,
}

export default function GlobalSettingsPage() {
  const [settings, setSettings] = useState<GlobalSettings>(defaultSettings)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { setLanguage } = useLanguage()
  const [activeTab, setActiveTab] = useState('general')

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/global-settings')
      if (response.ok) {
        const data = await response.json()
        setSettings({ ...defaultSettings, ...data })
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    }
  }

  const handleSave = async () => {
    setIsLoading(true)
    setIsSuccess(false)

    try {
      const response = await fetch('/api/global-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        setIsSuccess(true)
        setTimeout(() => setIsSuccess(false), 3000)
        // Update language context when saving
        setLanguage(settings.defaultLanguage as 'en' | 'fr' | 'sw')
        // Also broadcast to other tabs
        if (typeof window !== 'undefined') {
          const bc = new BroadcastChannel('language-changes')
          bc.postMessage({ type: 'language-change', language: settings.defaultLanguage })
          bc.close()
        }
      }
    } catch (error) {
      console.error('Error saving settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: keyof GlobalSettings, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="container mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Global Settings</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your website's overall configuration and preferences
            </p>
          </div>
          <Button onClick={handleSave} disabled={isLoading} className="flex items-center gap-2">
            {isLoading ? <RefreshCcw className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        {isSuccess && (
          <Alert className="mb-6 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-600 dark:text-green-400">
              Settings saved successfully!
            </AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-3xl">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Globe className="h-4 w-4" /> General
            </TabsTrigger>
            <TabsTrigger value="seo" className="flex items-center gap-2">
              <Search className="h-4 w-4" /> SEO
            </TabsTrigger>
            <TabsTrigger value="social" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" /> Social
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <Code className="h-4 w-4" /> Advanced
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Basic website information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="siteTitle">Site Title</Label>
                    <Input
                      id="siteTitle"
                      value={settings.siteTitle}
                      onChange={(e) => handleChange('siteTitle', e.target.value)}
                      placeholder="My Portfolio"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="siteTagline">Site Tagline</Label>
                    <Input
                      id="siteTagline"
                      value={settings.siteTagline}
                      onChange={(e) => handleChange('siteTagline', e.target.value)}
                      placeholder="Welcome to my portfolio"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="defaultLanguage">Default Language</Label>
                    <select
                      id="defaultLanguage"
                      value={settings.defaultLanguage}
                      onChange={(e) => handleChange('defaultLanguage', e.target.value)}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                    >
                      <option value="en">English</option>
                      <option value="fr">French</option>
                      <option value="sw">Swahili</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="locale">Locale</Label>
                    <select
                      id="locale"
                      value={settings.locale}
                      onChange={(e) => handleChange('locale', e.target.value)}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                    >
                      <option value="en-US">English (US)</option>
                      <option value="en-GB">English (UK)</option>
                      <option value="es-ES">Spanish (Spain)</option>
                      <option value="fr-FR">French (France)</option>
                      <option value="de-DE">German (Germany)</option>
                      <option value="zh-CN">Chinese (Simplified)</option>
                      <option value="ja-JP">Japanese (Japan)</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                    <p className="text-sm text-gray-500">Show a maintenance page to visitors</p>
                  </div>
                  <Switch
                    id="maintenanceMode"
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) => handleChange('maintenanceMode', checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <Label htmlFor="analyticsEnabled">Analytics</Label>
                    <p className="text-sm text-gray-500">Enable visitor analytics tracking</p>
                  </div>
                  <Switch
                    id="analyticsEnabled"
                    checked={settings.analyticsEnabled}
                    onCheckedChange={(checked) => handleChange('analyticsEnabled', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo">
            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
                <CardDescription>Optimize your site for search engines</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea
                    id="metaDescription"
                    value={settings.metaDescription}
                    onChange={(e) => handleChange('metaDescription', e.target.value)}
                    placeholder="Enter a brief description of your website..."
                    rows={3}
                  />
                  <p className="text-xs text-gray-500">{settings.metaDescription?.length || 0}/160 characters</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metaKeywords">Meta Keywords</Label>
                  <Input
                    id="metaKeywords"
                    value={settings.metaKeywords}
                    onChange={(e) => handleChange('metaKeywords', e.target.value)}
                    placeholder="portfolio, developer, engineer"
                  />
                  <p className="text-xs text-gray-500">Separate keywords with commas</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social">
            <Card>
              <CardHeader>
                <CardTitle>Social Media Settings</CardTitle>
                <CardDescription>Configure how your site appears on social media</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ogImage">OpenGraph Image URL</Label>
                  <Input
                    id="ogImage"
                    value={settings.ogImage}
                    onChange={(e) => handleChange('ogImage', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                  <p className="text-xs text-gray-500">Recommended size: 1200x630 pixels</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitterCardType">Twitter Card Type</Label>
                  <select
                    id="twitterCardType"
                    value={settings.twitterCardType}
                    onChange={(e) => handleChange('twitterCardType', e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                  >
                    <option value="summary">Summary</option>
                    <option value="summary_large_image">Summary with Large Image</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="favicon">Favicon URL</Label>
                  <Input
                    id="favicon"
                    value={settings.favicon}
                    onChange={(e) => handleChange('favicon', e.target.value)}
                    placeholder="https://example.com/favicon.ico"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="appleTouchIcon">Apple Touch Icon URL</Label>
                  <Input
                    id="appleTouchIcon"
                    value={settings.appleTouchIcon}
                    onChange={(e) => handleChange('appleTouchIcon', e.target.value)}
                    placeholder="https://example.com/icon.png"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
                <CardDescription>Custom CSS and advanced configurations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customCss">Custom CSS</Label>
                  <Textarea
                    id="customCss"
                    value={settings.customCss}
                    onChange={(e) => handleChange('customCss', e.target.value)}
                    placeholder=".my-class { color: red; }"
                    rows={10}
                    className="font-mono text-sm"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
