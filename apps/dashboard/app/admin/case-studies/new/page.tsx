"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
  Users,
  Search,
  BookOpen,
  TrendingUp,
  Lightbulb,
  Target,
  CheckCircle,
  FileText
} from "lucide-react";

// No template imports needed for simplified case study structure

export default function NewCaseStudy() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [caseStudyData, setCaseStudyData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    status: "DRAFT",
    visibility: "PUBLIC",
    publishedAt: null,
    tags: [] as string[],
    category: "",
    client: "",
    industry: "",
    duration: "",
    teamSize: "",
    technologies: [] as string[],
    coverImage: null,
    seoTitle: "",
    seoDescription: "",
    canonicalUrl: "",
    ogImage: null,
    allowComments: true,
    allowReactions: true,
    featured: false
  });

  const handleSave = async (type: 'draft' | 'publish' | 'schedule') => {
    try {
      // Generate slug from title if not provided
      const slug = caseStudyData.slug || caseStudyData.title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const caseStudyDataToSave = {
        ...caseStudyData,
        slug,
        status: type === 'draft' ? 'DRAFT' : type === 'publish' ? 'PUBLISHED' : 'SCHEDULED',
        publishedAt: type === 'publish' ? new Date().toISOString() : null
      };

      const response = await fetch("/api/case-studies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(caseStudyDataToSave),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save case study");
      }

      const savedCaseStudy = await response.json();
      
      if (type === 'publish') {
        alert("Case study published successfully!");
        // Redirect to the case studies list
        window.location.href = "/admin/case-studies";
      } else if (type === 'draft') {
        alert("Case study saved as draft!");
        // Update the local state with the saved data
        setCaseStudyData(prev => ({ ...prev, id: savedCaseStudy.id }));
      } else {
        alert("Case study scheduled successfully!");
        window.location.href = "/admin/case-studies";
      }
    } catch (error) {
      console.error("Error saving case study:", error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Failed to save case study: ${errorMessage}`);
    }
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
          title: caseStudyData.title,
          excerpt: caseStudyData.excerpt,
          content: caseStudyData.content
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
          title: caseStudyData.title,
          excerpt: caseStudyData.excerpt
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCaseStudyData({...caseStudyData, ogImage: data.imageUrl});
      alert("OG Image generated successfully! Check the settings panel.");
    } catch (error) {
      console.error("Error generating OG image:", error);
      alert("Failed to generate OG image. Please check your OpenAI API key.");
    }
  };



  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      {/* Main Editor Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSettingsOpen ? 'mr-96' : ''}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <div className="flex items-center space-x-4">
            <Link
              href="/admin/case-studies"
              className="flex items-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              Back to Case Studies
            </Link>
            <div className="h-6 w-px bg-slate-300 dark:bg-slate-600" />
            <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              {caseStudyData.title || "Untitled Case Study"}
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
                placeholder="Case study title..."
                value={caseStudyData.title}
                onChange={(e) => setCaseStudyData({...caseStudyData, title: e.target.value})}
                className="w-full text-4xl font-bold bg-transparent border-none outline-none text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600"
              />
            </div>

            {/* Excerpt Input */}
            <div>
              <textarea
                placeholder="Write a brief excerpt..."
                value={caseStudyData.excerpt}
                onChange={(e) => setCaseStudyData({...caseStudyData, excerpt: e.target.value})}
                rows={3}
                className="w-full text-lg bg-transparent border-none outline-none text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-600 resize-none"
              />
            </div>

            {/* Project Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Client/Company
                </label>
                <input
                  type="text"
                  placeholder="Client name"
                  value={caseStudyData.client}
                  onChange={(e) => setCaseStudyData({...caseStudyData, client: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Industry
                </label>
                <input
                  type="text"
                  placeholder="Industry"
                  value={caseStudyData.industry}
                  onChange={(e) => setCaseStudyData({...caseStudyData, industry: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Duration
                </label>
                <input
                  type="text"
                  placeholder="e.g., 3 months"
                  value={caseStudyData.duration}
                  onChange={(e) => setCaseStudyData({...caseStudyData, duration: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Team Size
                </label>
                <input
                  type="text"
                  placeholder="e.g., 5 developers"
                  value={caseStudyData.teamSize}
                  onChange={(e) => setCaseStudyData({...caseStudyData, teamSize: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>
            
            {/* Technologies */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Technologies Used
              </label>
              <input
                type="text"
                placeholder="e.g., React, Node.js, PostgreSQL, AWS"
                value={Array.isArray(caseStudyData.technologies) ? caseStudyData.technologies.join(', ') : ''}
                onChange={(e) => setCaseStudyData({...caseStudyData, technologies: e.target.value.split(',').map(t => t.trim()).filter(t => t)})}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Separate multiple technologies with commas
              </p>
            </div>

            {/* Content Editor */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Case Study Content
                </label>
                <textarea
                  placeholder="Write your case study content here... You can use markdown formatting."
                  value={caseStudyData.content}
                  onChange={(e) => setCaseStudyData({...caseStudyData, content: e.target.value})}
                  rows={12}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 resize-none"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Use markdown formatting for headers, lists, links, and other formatting.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side Settings Panel */}
      <div className={`fixed right-0 top-0 h-full w-96 bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 transform transition-transform duration-300 ease-in-out ${isSettingsOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full flex flex-col">
          {/* Panel Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Case Study Settings</h2>
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
            {/* Case Study Info */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg p-4 border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center space-x-3 mb-3">
                <BookOpen className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-medium text-emerald-900 dark:text-emerald-100">Case Study Structure</h3>
              </div>
              <div className="space-y-2 text-sm text-emerald-800 dark:text-emerald-200">
                <p>Your case study will automatically generate a table of contents based on your markdown headers (##) when published.</p>
                <p className="text-xs opacity-75">Recommended sections: Problem Statement, Research & Analysis, Solution Design, Implementation, Results & Metrics, Lessons Learned, Next Steps</p>
              </div>
            </div>

            {/* AI Writing Assistant */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center space-x-3 mb-3">
                <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-medium text-blue-900 dark:text-blue-100">AI Writing Assistant</h3>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                Get help with writing, brainstorming, or improving your case study
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-blue-600 border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  onClick={() => handleAIAssistance('brainstorm')}
                >
                  <Lightbulb className="h-3 w-3 mr-1" />
                  Ideas
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-blue-600 border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  onClick={() => handleAIAssistance('improve')}
                >
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Improve
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-blue-600 border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  onClick={() => handleAIAssistance('outline')}
                >
                  <BookOpen className="h-3 w-3 mr-1" />
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
                <div className="mt-4 p-3 bg-white dark:bg-slate-800 rounded-lg border border-blue-200 dark:border-blue-800">
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
                  <div className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap max-h-32 overflow-y-auto">
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
                Generate beautiful social media images for your case study
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
              <h3 className="font-medium text-slate-900 dark:text-slate-100 flex items-center">
                <Globe className="h-4 w-4 mr-2" />
                Publishing
              </h3>
              <div className="space-y-2">
                <select
                  value={caseStudyData.status}
                  onChange={(e) => setCaseStudyData({...caseStudyData, status: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="SCHEDULED">Scheduled</option>
                </select>
                <select
                  value={caseStudyData.visibility}
                  onChange={(e) => setCaseStudyData({...caseStudyData, visibility: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                >
                  <option value="PUBLIC">Public</option>
                  <option value="PRIVATE">Private</option>
                  <option value="UNLISTED">Unlisted</option>
                </select>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={caseStudyData.featured}
                    onChange={(e) => setCaseStudyData({...caseStudyData, featured: e.target.checked})}
                    className="rounded border-slate-300 text-slate-600 focus:ring-slate-500"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Featured case study</span>
                </label>
              </div>
            </div>

            {/* Cover Image */}
            <div className="space-y-3">
              <h3 className="font-medium text-slate-900 dark:text-slate-100 flex items-center">
                <ImageIcon className="h-4 w-4 mr-2" />
                Cover Image
              </h3>
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center">
                <ImageIcon className="h-8 w-8 mx-auto text-slate-400 mb-2" />
                <p className="text-sm text-slate-600 dark:text-slate-400">Click to upload cover image</p>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-3">
              <h3 className="font-medium text-slate-900 dark:text-slate-100 flex items-center">
                <Tag className="h-4 w-4 mr-2" />
                Tags
              </h3>
              <input
                type="text"
                placeholder="Add tags..."
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
              />
            </div>

            {/* SEO */}
            <div className="space-y-3">
              <h3 className="font-medium text-slate-900 dark:text-slate-100 flex items-center">
                <Search className="h-4 w-4 mr-2" />
                SEO & Social
              </h3>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="SEO title"
                  value={caseStudyData.seoTitle}
                  onChange={(e) => setCaseStudyData({...caseStudyData, seoTitle: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                />
                <textarea
                  placeholder="SEO description"
                  value={caseStudyData.seoDescription}
                  onChange={(e) => setCaseStudyData({...caseStudyData, seoDescription: e.target.value})}
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                />
                <input
                  type="text"
                  placeholder="Canonical URL"
                  value={caseStudyData.canonicalUrl}
                  onChange={(e) => setCaseStudyData({...caseStudyData, canonicalUrl: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            {/* Engagement */}
            <div className="space-y-3">
              <h3 className="font-medium text-slate-900 dark:text-slate-100 flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Engagement
              </h3>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={caseStudyData.allowComments}
                    onChange={(e) => setCaseStudyData({...caseStudyData, allowComments: e.target.checked})}
                    className="rounded border-slate-300 text-slate-600 focus:ring-slate-500"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Allow comments</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={caseStudyData.allowReactions}
                    onChange={(e) => setCaseStudyData({...caseStudyData, allowReactions: e.target.checked})}
                    className="rounded border-slate-300 text-slate-600 focus:ring-slate-500"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Allow reactions</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
