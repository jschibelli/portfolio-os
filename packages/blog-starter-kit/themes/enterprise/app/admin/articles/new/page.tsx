"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "../../../../components/ui/button";
import { 
  Save, 
  Eye, 
  Calendar, 
  Globe, 
  Settings,
  X,
  ChevronLeft,
  Sparkles,
  Image as ImageIcon,
  Tag,
  Link as LinkIcon,
  EyeOff,
  MessageCircle,
  Heart,
  Clock,
  Users,
  Search
} from "lucide-react";

export default function NewArticle() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [articleData, setArticleData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    status: "DRAFT",
    visibility: "PUBLIC",
    publishedAt: null,
    tags: [],
    series: null,
    coverImage: null,
    seoTitle: "",
    seoDescription: "",
    canonicalUrl: "",
    ogImage: null,
    allowComments: true,
    allowReactions: true
  });

  const handleSave = async (type: 'draft' | 'publish' | 'schedule') => {
    // TODO: Implement save logic
    console.log('Saving article:', { type, articleData });
  };

  const toggleSettings = () => setIsSettingsOpen(!isSettingsOpen);

  const handleAIAssistance = async (action: string) => {
    try {
      const response = await fetch("/api/ai/writing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          action,
          title: articleData.title,
          excerpt: articleData.excerpt,
          content: articleData.content
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAiResponse(data.result);
    } catch (error) {
      console.error("Error calling AI assistance:", error);
      setAiResponse("Failed to get AI response. Please check your OpenAI API key.");
    }
  };

  const handleOGImageGeneration = async () => {
    try {
      const response = await fetch("/api/ai/og-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          title: articleData.title,
          excerpt: articleData.excerpt
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setArticleData({...articleData, ogImage: data.imageUrl});
      alert("OG Image generated successfully! Check the settings panel.");
    } catch (error) {
      console.error("Error generating OG image:", error);
      alert("Failed to generate OG image. Please check your OpenAI API key.");
    }
  };

  return (
    <div className="flex h-screen bg-stone-50 dark:bg-stone-900">
      {/* Main Editor Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSettingsOpen ? 'mr-96' : ''}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800">
          <div className="flex items-center space-x-4">
        <Link
          href="/admin/articles"
              className="flex items-center text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
        >
              <ChevronLeft className="h-5 w-5 mr-1" />
              Back to Articles
        </Link>
            <div className="h-6 w-px bg-stone-300 dark:bg-stone-600" />
            <h1 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
              {articleData.title || "Untitled Article"}
            </h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleSettings}
              className="flex items-center space-x-2"
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSave('draft')}
              className="flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Save Draft</span>
            </Button>
            
            <Button
              size="sm"
              onClick={() => handleSave('publish')}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
            >
              <Globe className="h-4 w-4" />
              <span>Publish</span>
            </Button>
          </div>
      </div>

        {/* Editor */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Title Input */}
          <div>
            <input
              type="text"
                placeholder="Article title..."
                value={articleData.title}
                onChange={(e) => setArticleData({...articleData, title: e.target.value})}
                className="w-full text-4xl font-bold bg-transparent border-none outline-none text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-600"
            />
          </div>

            {/* Excerpt Input */}
          <div>
            <textarea
                placeholder="Write a brief excerpt..."
                value={articleData.excerpt}
                onChange={(e) => setArticleData({...articleData, excerpt: e.target.value})}
              rows={3}
                className="w-full text-lg bg-transparent border-none outline-none text-stone-700 dark:text-stone-300 placeholder-stone-400 dark:placeholder-stone-600 resize-none"
            />
          </div>

            {/* Content Editor */}
            <div className="min-h-[400px]">
              <textarea
                placeholder="Start writing your article content here..."
                value={articleData.content}
                onChange={(e) => setArticleData({...articleData, content: e.target.value})}
                className="w-full h-full min-h-[400px] text-base leading-relaxed bg-transparent border-none outline-none text-stone-800 dark:text-stone-200 placeholder-stone-400 dark:placeholder-stone-600 resize-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right Side Settings Panel */}
      <div className={`fixed right-0 top-0 h-full w-96 bg-white dark:bg-stone-800 border-l border-stone-200 dark:border-stone-700 transform transition-transform duration-300 ease-in-out ${isSettingsOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full flex flex-col">
          {/* Panel Header */}
          <div className="flex items-center justify-between p-4 border-b border-stone-200 dark:border-stone-700">
            <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">Article Settings</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSettings}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* AI Writing Assistant */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center space-x-3 mb-3">
                <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-medium text-blue-900 dark:text-blue-100">AI Writing Assistant</h3>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                Get help with writing, brainstorming, or improving your content using OpenAI
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-blue-600 border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  onClick={() => handleAIAssistance('brainstorm')}
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  Brainstorm
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-blue-600 border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  onClick={() => handleAIAssistance('improve')}
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  Improve
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-blue-600 border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  onClick={() => handleAIAssistance('outline')}
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  Outline
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-blue-600 border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  onClick={() => handleAIAssistance('seo')}
                >
                  <Search className="h-3 w-3 mr-1" />
                  SEO
                </Button>
              </div>
              
              {/* AI Response Display */}
              {aiResponse && (
                <div className="mt-4 p-3 bg-white dark:bg-stone-800 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100">AI Response</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setAiResponse('')}
                      className="h-6 w-6 p-0 text-blue-600"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-sm text-stone-700 dark:text-stone-300 whitespace-pre-wrap max-h-32 overflow-y-auto">
                    {aiResponse}
                  </div>
                </div>
              )}
            </div>

            {/* OG Image Generator */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center space-x-3 mb-3">
                <ImageIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <h3 className="font-medium text-purple-900 dark:text-purple-100">OG Image Generator</h3>
              </div>
              <p className="text-sm text-purple-700 dark:text-purple-300 mb-3">
                Generate beautiful social media images for your article using AI
              </p>
              <Button 
                size="sm" 
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                onClick={handleOGImageGeneration}
              >
                <Sparkles className="h-3 w-3 mr-1" />
                Generate OG Image
              </Button>
            </div>

            {/* Publishing */}
            <div className="space-y-3">
              <h3 className="font-medium text-stone-900 dark:text-stone-100 flex items-center">
                <Globe className="h-4 w-4 mr-2" />
                Publishing
              </h3>
              <div className="space-y-2">
              <select
                  value={articleData.status}
                  onChange={(e) => setArticleData({...articleData, status: e.target.value})}
                  className="w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-md bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="SCHEDULED">Scheduled</option>
              </select>
              <select
                  value={articleData.visibility}
                  onChange={(e) => setArticleData({...articleData, visibility: e.target.value})}
                  className="w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-md bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100"
              >
                <option value="PUBLIC">Public</option>
                <option value="PRIVATE">Private</option>
                <option value="UNLISTED">Unlisted</option>
              </select>
            </div>
          </div>

            {/* Cover Image */}
            <div className="space-y-3">
              <h3 className="font-medium text-stone-900 dark:text-stone-100 flex items-center">
                <ImageIcon className="h-4 w-4 mr-2" />
                Cover Image
              </h3>
              <div className="border-2 border-dashed border-stone-300 dark:border-stone-600 rounded-lg p-6 text-center">
                <ImageIcon className="h-8 w-8 mx-auto text-stone-400 mb-2" />
                <p className="text-sm text-stone-600 dark:text-stone-400">Click to upload cover image</p>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-3">
              <h3 className="font-medium text-stone-900 dark:text-stone-100 flex items-center">
                <Tag className="h-4 w-4 mr-2" />
                Tags
              </h3>
              <input
                type="text"
                placeholder="Add tags..."
                className="w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-md bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100"
            />
          </div>

            {/* SEO */}
            <div className="space-y-3">
              <h3 className="font-medium text-stone-900 dark:text-stone-100 flex items-center">
                <Search className="h-4 w-4 mr-2" />
                SEO & Social
              </h3>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="SEO title"
                  value={articleData.seoTitle}
                  onChange={(e) => setArticleData({...articleData, seoTitle: e.target.value})}
                  className="w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-md bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100"
                />
                <textarea
                  placeholder="SEO description"
                  value={articleData.seoDescription}
                  onChange={(e) => setArticleData({...articleData, seoDescription: e.target.value})}
                  rows={2}
                  className="w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-md bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100"
                />
                <input
                  type="text"
                  placeholder="Canonical URL"
                  value={articleData.canonicalUrl}
                  onChange={(e) => setArticleData({...articleData, canonicalUrl: e.target.value})}
                  className="w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-md bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100"
                />
              </div>
            </div>

            {/* Engagement */}
            <div className="space-y-3">
              <h3 className="font-medium text-stone-900 dark:text-stone-100 flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Engagement
              </h3>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={articleData.allowComments}
                    onChange={(e) => setArticleData({...articleData, allowComments: e.target.checked})}
                    className="rounded border-stone-300 text-stone-600 focus:ring-stone-500"
                  />
                  <span className="text-sm text-stone-700 dark:text-stone-300">Allow comments</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={articleData.allowReactions}
                    onChange={(e) => setArticleData({...articleData, allowReactions: e.target.checked})}
                    className="rounded border-stone-300 text-stone-600 focus:ring-stone-500"
                  />
                  <span className="text-sm text-stone-700 dark:text-stone-300">Allow reactions</span>
                </label>
              </div>
            </div>
          </div>
          </div>
      </div>
    </div>
  );
}
