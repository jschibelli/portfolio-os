'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { 
  ArrowLeft,
  Megaphone,
  PenTool,
  Send,
  Sparkles
} from 'lucide-react'

interface AIAssistantProps {
  isOpen: boolean
  onClose: () => void
}

export function AIAssistant({ isOpen, onClose }: AIAssistantProps) {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([
    {
      role: 'assistant',
      content: `Hi, I'm your AI assistant.
Ask me anything about your draft or
let me browse the web for answers.
Use ctrl + shift + k to start this chat next time!`
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage = { role: 'user' as const, content: inputValue }
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        role: 'assistant' as const,
        content: `I understand you're asking about "${inputValue}". This is a simulated response. In a real implementation, this would connect to an AI service like OpenAI or Claude.`
      }
      setMessages(prev => [...prev, aiResponse])
      setIsLoading(false)
    }, 1000)
  }

  const handleQuickAction = (action: string) => {
    const actionMessages = {
      'title': 'Generate a catchy title for my article',
      'intro': 'Improve my intro paragraph',
      'conclusion': 'Generate a conclusion'
    }
    
    setInputValue(actionMessages[action as keyof typeof actionMessages] || action)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md bg-gray-900 border-gray-700 text-gray-100">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <CardTitle className="text-lg">AI Assistant</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200"
          >
            ×
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Chat Messages */}
          <div className="h-64 overflow-y-auto space-y-3">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-100'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickAction('title')}
              className="w-full justify-start text-gray-300 border-gray-600 hover:bg-gray-800"
            >
              <Megaphone className="w-4 h-4 mr-2 text-pink-500" />
              Generate a catchy title for my article
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickAction('intro')}
              className="w-full justify-start text-gray-300 border-gray-600 hover:bg-gray-800"
            >
              <PenTool className="w-4 h-4 mr-2 text-orange-500" />
              Improve my intro paragraph
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickAction('conclusion')}
              className="w-full justify-start text-gray-300 border-gray-600 hover:bg-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2 text-purple-500" />
              Generate a conclusion
            </Button>
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="What's the latest React stable release?"
              className="bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-400"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="border-gray-600 hover:bg-gray-800"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

