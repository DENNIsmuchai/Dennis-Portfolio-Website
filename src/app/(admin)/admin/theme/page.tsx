'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, RefreshCcw, ExternalLink } from 'lucide-react'

interface Theme {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  backgroundColor: string
  surfaceColor: string
  textColor: string
  mutedColor: string
  fontFamily: string
  isDarkMode: boolean
  animationIntensity: string
}

const defaultTheme: Theme = {
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
}

const fontOptions = [
  { value: 'inter', label: 'Inter' },
  { value: 'roboto', label: 'Roboto' },
  { value: 'poppins', label: 'Poppins' },
  { value: 'montserrat', label: 'Montserrat' },
]

export default function ThemePage() {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    fetchTheme()
  }, [])

  const fetchTheme = async () => {
    try {
      const response = await fetch('/api/theme')
      if (response.ok) {
        const data = await response.json()
        setTheme({ ...defaultTheme, ...data })
      }
    } catch (error) {
      console.error('Error fetching theme:', error)
    }
  }

  const handleSave = async () => {
    setIsLoading(true)
    setIsSuccess(false)

    try {
      const response = await fetch('/api/theme', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(theme),
      })

      if (response.ok) {
        setIsSuccess(true)
        // Apply theme to document immediately
        applyTheme(theme)
      }
    } catch (error) {
      console.error('Error saving theme:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const applyTheme = (t: Theme) => {
    const root = document.documentElement
    root.style.setProperty('--primary', t.primaryColor)
    root.style.setProperty('--secondary', t.secondaryColor)
    root.style.setProperty('--accent', t.accentColor)
    root.style.setProperty('--background', t.backgroundColor)
    root.style.setProperty('--surface', t.surfaceColor)
    root.style.setProperty('--text', t.textColor)
    root.style.setProperty('--muted', t.mutedColor)
  }

  const handleReset = () => {
    setTheme(defaultTheme)
    applyTheme(defaultTheme)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Theme Customizer</h1>
        <p className="text-muted-foreground mt-2">
          Customize the look and feel of your portfolio website.
        </p>
      </div>

      {isSuccess && (
        <Alert className="bg-green-500/10 border-green-500/20">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-500">
            Theme saved successfully!
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="colors" className="space-y-6">
        <TabsList className="glass">
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="colors" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle>Brand Colors</CardTitle>
                <CardDescription>Customize your brand colors</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="primary">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primary"
                      type="color"
                      value={theme.primaryColor}
                      onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={theme.primaryColor}
                      onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondary">Secondary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondary"
                      type="color"
                      value={theme.secondaryColor}
                      onChange={(e) => setTheme({ ...theme, secondaryColor: e.target.value })}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={theme.secondaryColor}
                      onChange={(e) => setTheme({ ...theme, secondaryColor: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accent">Accent Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="accent"
                      type="color"
                      value={theme.accentColor}
                      onChange={(e) => setTheme({ ...theme, accentColor: e.target.value })}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={theme.accentColor}
                      onChange={(e) => setTheme({ ...theme, accentColor: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader>
                <CardTitle>Background Colors</CardTitle>
                <CardDescription>Customize background and surface colors</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="background">Background Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="background"
                      type="color"
                      value={theme.backgroundColor}
                      onChange={(e) => setTheme({ ...theme, backgroundColor: e.target.value })}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={theme.backgroundColor}
                      onChange={(e) => setTheme({ ...theme, backgroundColor: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="surface">Surface Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="surface"
                      type="color"
                      value={theme.surfaceColor}
                      onChange={(e) => setTheme({ ...theme, surfaceColor: e.target.value })}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={theme.surfaceColor}
                      onChange={(e) => setTheme({ ...theme, surfaceColor: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="text">Text Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="text"
                      type="color"
                      value={theme.textColor}
                      onChange={(e) => setTheme({ ...theme, textColor: e.target.value })}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={theme.textColor}
                      onChange={(e) => setTheme({ ...theme, textColor: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>Customize the overall appearance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="darkMode" className="text-base">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">Enable dark mode by default</p>
                </div>
                <Switch
                  id="darkMode"
                  checked={theme.isDarkMode}
                  onCheckedChange={(checked) => setTheme({ ...theme, isDarkMode: checked })}
                />
              </div>

              <div className="space-y-2">
                <Label>Animation Intensity</Label>
                <div className="flex gap-2">
                  {['low', 'medium', 'high'].map((intensity) => (
                    <Button
                      key={intensity}
                      variant={theme.animationIntensity === intensity ? 'default' : 'outline'}
                      onClick={() => setTheme({ ...theme, animationIntensity: intensity })}
                      className="flex-1 capitalize"
                    >
                      {intensity}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
              <CardDescription>See how your theme looks</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="rounded-lg p-8 space-y-4"
                style={{
                  backgroundColor: theme.backgroundColor,
                  color: theme.textColor,
                }}
              >
                <h3
                  className="text-2xl font-bold"
                  style={{ color: theme.primaryColor }}
                >
                  Sample Heading
                </h3>
                <p style={{ color: theme.mutedColor }}>
                  This is how your text will look with the selected theme.
                </p>
                <div className="flex gap-2">
                  <button
                    className="px-4 py-2 rounded-lg text-white"
                    style={{ backgroundColor: theme.primaryColor }}
                  >
                    Primary Button
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg text-white"
                    style={{ backgroundColor: theme.secondaryColor }}
                  >
                    Secondary Button
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg text-white"
                    style={{ backgroundColor: theme.accentColor }}
                  >
                    Accent Button
                  </button>
                </div>
                <div
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: theme.surfaceColor }}
                >
                  <p>Card content with surface background</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle>Full Site Preview</CardTitle>
              <CardDescription>View your entire website with the current theme settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                See how all sections of your portfolio look with the selected theme. The preview page shows 
                your actual content including hero, about, projects, skills, and more.
              </p>
              <div className="flex gap-4">
                <Button 
                  onClick={() => window.open('/admin/preview', '_blank')} 
                  className="gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open Full Preview
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.open('/', '_blank')} 
                  className="gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  View Live Site
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex gap-4">
        <Button onClick={handleSave} disabled={isLoading} className="gap-2">
          {isLoading ? 'Saving...' : 'Save Theme'}
        </Button>
        <Button variant="outline" onClick={handleReset} className="gap-2">
          <RefreshCcw className="h-4 w-4" />
          Reset to Default
        </Button>
      </div>
    </div>
  )
}
