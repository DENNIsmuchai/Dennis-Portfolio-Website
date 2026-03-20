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
import { Textarea } from '@/components/ui/textarea'
import { CheckCircle, RefreshCcw, Bot, Key, Settings, MessageSquare, Zap, Eye } from 'lucide-react'

interface AIConfig {
  provider: string
  model: string
  temperature: number
  maxTokens: number
  systemPrompt: string
  personalityTraits: string
  rateLimitPerHour: number
  featuresEnabled: string
  isActive: boolean
  apiKey: string
  apiEndpoint: string
}

const providers = [
  { value: 'openai', label: 'OpenAI', models: ['gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo'] },
  { value: 'anthropic', label: 'Anthropic', models: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'] },
  { value: 'deepseek', label: 'DeepSeek', models: ['deepseek-chat', 'deepseek-coder'] },
  { value: 'mistral', label: 'Mistral', models: ['mistral-large', 'mistral-medium', 'mistral-small'] },
  { value: 'ollama', label: 'Ollama (Local)', models: ['llama2', 'mistral', 'codellama', 'mixtral'] },
]

const defaultConfig: AIConfig = {
  provider: 'openai',
  model: 'gpt-4o',
  temperature: 0.7,
  maxTokens: 2048,
  systemPrompt: 'You are a helpful AI assistant for the portfolio owner. You have knowledge about their projects, skills, experience, and can answer questions about them.',
  personalityTraits: 'Professional, Knowledgeable, Helpful, Concise',
  rateLimitPerHour: 100,
  featuresEnabled: 'chat,search,knowledge',
  isActive: true,
  apiKey: '',
  apiEndpoint: '',
}

export default function AIControlPage() {
  const [config, setConfig] = useState<AIConfig>(defaultConfig)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [testMessage, setTestMessage] = useState('')
  const [testResponse, setTestResponse] = useState('')
  const [isTesting, setIsTesting] = useState(false)

  useEffect(() => {
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/ai-config')
      if (response.ok) {
        const data = await response.json()
        setConfig({ ...defaultConfig, ...data })
      }
    } catch (error) {
      console.error('Error fetching AI config:', error)
    }
  }

  const handleSave = async () => {
    setIsLoading(true)
    setIsSuccess(false)

    try {
      const response = await fetch('/api/ai-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      })

      if (response.ok) {
        setIsSuccess(true)
        setTimeout(() => setIsSuccess(false), 3000)
      }
    } catch (error) {
      console.error('Error saving AI config:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: keyof AIConfig, value: string | number | boolean) => {
    setConfig(prev => ({ ...prev, [field]: value }))
  }

  const handleTestChat = async () => {
    if (!testMessage.trim()) return
    
    setIsTesting(true)
    setTestResponse('')

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: testMessage }),
      })

      if (response.ok) {
        const data = await response.json()
        setTestResponse(data.response || 'No response')
      } else {
        setTestResponse('Error: Could not get response')
      }
    } catch (error) {
      setTestResponse('Error: Failed to connect to AI')
    } finally {
      setIsTesting(false)
    }
  }

  const toggleFeature = (feature: string) => {
    const features = config.featuresEnabled.split(',').filter(f => f.trim())
    const index = features.indexOf(feature)
    if (index > -1) {
      features.splice(index, 1)
    } else {
      features.push(feature)
    }
    handleChange('featuresEnabled', features.join(','))
  }

  const isFeatureEnabled = (feature: string) => {
    return config.featuresEnabled.split(',').includes(feature)
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Control Panel</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Configure your AI assistant settings and capabilities
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
              AI configuration saved successfully!
            </AlertDescription>
          </Alert>
        )}

        <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg mb-6">
          <div className="flex items-center gap-3">
            <Bot className="h-6 w-6 text-blue-600" />
            <div>
              <p className="font-semibold">AI Assistant Status</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {config.isActive ? 'Active and ready to respond' : 'Disabled'}
              </p>
            </div>
          </div>
          <Switch
            checked={config.isActive}
            onCheckedChange={(checked) => handleChange('isActive', checked)}
          />
        </div>

        <Tabs defaultValue="model" className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full max-w-4xl">
            <TabsTrigger value="model" className="flex items-center gap-2">
              <Bot className="h-4 w-4" /> Model
            </TabsTrigger>
            <TabsTrigger value="personality" className="flex items-center gap-2">
              <Settings className="h-4 w-4" /> Personality
            </TabsTrigger>
            <TabsTrigger value="features" className="flex items-center gap-2">
              <Zap className="h-4 w-4" /> Features
            </TabsTrigger>
            <TabsTrigger value="limits" className="flex items-center gap-2">
              <Key className="h-4 w-4" /> Limits
            </TabsTrigger>
            <TabsTrigger value="test" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" /> Test
            </TabsTrigger>
          </TabsList>

          <TabsContent value="model">
            <Card>
              <CardHeader>
                <CardTitle>Model Configuration</CardTitle>
                <CardDescription>Select your AI provider and model</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="provider">AI Provider</Label>
                    <select
                      id="provider"
                      value={config.provider}
                      onChange={(e) => handleChange('provider', e.target.value)}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                    >
                      {providers.map(p => (
                        <option key={p.value} value={p.value}>{p.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">Model</Label>
                    <select
                      id="model"
                      value={config.model}
                      onChange={(e) => handleChange('model', e.target.value)}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                    >
                      {providers.find(p => p.value === config.provider)?.models.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    value={config.apiKey}
                    onChange={(e) => handleChange('apiKey', e.target.value)}
                    placeholder="sk-..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apiEndpoint">Custom API Endpoint (Optional)</Label>
                  <Input
                    id="apiEndpoint"
                    value={config.apiEndpoint}
                    onChange={(e) => handleChange('apiEndpoint', e.target.value)}
                    placeholder="https://api.openai.com/v1"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="personality">
            <Card>
              <CardHeader>
                <CardTitle>AI Personality</CardTitle>
                <CardDescription>Define how your AI assistant behaves</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="personalityTraits">Personality Traits</Label>
                  <Input
                    id="personalityTraits"
                    value={config.personalityTraits}
                    onChange={(e) => handleChange('personalityTraits', e.target.value)}
                    placeholder="Professional, Knowledgeable, Friendly"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Temperature: {config.temperature}</Label>
                  <Slider
                    value={[config.temperature]}
                    min={0}
                    max={1}
                    step={0.1}
                    onValueChange={(value) => handleChange('temperature', value[0])}
                  />
                  <p className="text-xs text-gray-500">Higher values make output more random</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="systemPrompt">System Prompt</Label>
                  <Textarea
                    id="systemPrompt"
                    value={config.systemPrompt}
                    onChange={(e) => handleChange('systemPrompt', e.target.value)}
                    rows={8}
                    placeholder="You are a helpful AI assistant..."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features">
            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
                <CardDescription>Enable or disable AI features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {['chat', 'search', 'knowledge'].map((feature) => (
                  <div key={feature} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <p className="font-semibold capitalize">{feature}</p>
                      <p className="text-sm text-gray-500">
                        {feature === 'chat' && 'Allow users to chat with AI'}
                        {feature === 'search' && 'Enable semantic search'}
                        {feature === 'knowledge' && 'Use knowledge base for responses'}
                      </p>
                    </div>
                    <Switch
                      checked={isFeatureEnabled(feature)}
                      onCheckedChange={() => toggleFeature(feature)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="limits">
            <Card>
              <CardHeader>
                <CardTitle>Rate Limits</CardTitle>
                <CardDescription>Configure usage limits</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Max Tokens per Response: {config.maxTokens}</Label>
                  <Slider
                    value={[config.maxTokens]}
                    min={256}
                    max={8192}
                    step={256}
                    onValueChange={(value) => handleChange('maxTokens', value[0])}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Rate Limit (requests per hour): {config.rateLimitPerHour}</Label>
                  <Slider
                    value={[config.rateLimitPerHour]}
                    min={10}
                    max={500}
                    step={10}
                    onValueChange={(value) => handleChange('rateLimitPerHour', value[0])}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="test">
            <Card>
              <CardHeader>
                <CardTitle>Test Chat</CardTitle>
                <CardDescription>Test your AI configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="testMessage">Test Message</Label>
                  <Textarea
                    id="testMessage"
                    value={testMessage}
                    onChange={(e) => setTestMessage(e.target.value)}
                    placeholder="Ask a question..."
                    rows={3}
                  />
                </div>
                <Button onClick={handleTestChat} disabled={isTesting} className="w-full">
                  {isTesting ? 'Sending...' : 'Send Test Message'}
                </Button>
                {testResponse && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Label>Response:</Label>
                    <p className="mt-2 text-gray-700 dark:text-gray-300">{testResponse}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
