"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import { useState } from "react";
import { Sparkles, Wand2, Lightbulb, Zap, Brain } from "lucide-react";

interface EditorProps {
  initialContent?: any;
  onChange?: (json: any) => void;
  placeholder?: string;
}

export function Editor({ 
  initialContent, 
  onChange, 
  placeholder = "Write your article..." 
}: EditorProps) {
  const [isAIAssisting, setIsAIAssisting] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [showAIPanel, setShowAIPanel] = useState(false);

  // AI assistance functions
  const generateContent = async (prompt: string) => {
    setIsAIAssisting(true);
    try {
      // Check if we have an OpenAI API key configured
      const hasOpenAIKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
      
      if (hasOpenAIKey) {
        // TODO: Implement actual OpenAI API call
        // const response = await fetch('/api/ai/generate', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ prompt, content: editor?.getText() || '' })
        // });
        // const data = await response.json();
        // setAiSuggestion(data.suggestion);
      }
      
      // For now, simulate AI response with enhanced content
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const enhancedPrompt = prompt.toLowerCase();
      let response = "";
      
      if (enhancedPrompt.includes("introduction") || enhancedPrompt.includes("intro")) {
        response = `Here's an engaging introduction for your article:\n\n"${prompt}"\n\nIn today's rapidly evolving digital landscape, understanding the fundamentals is more crucial than ever. Whether you're a seasoned professional or just starting your journey, this comprehensive guide will provide you with the insights and practical knowledge you need to succeed.\n\nLet's dive deep into the essential concepts, explore real-world applications, and discover proven strategies that can transform your approach. From foundational principles to advanced techniques, we'll cover everything you need to know to excel in this field."`;
      } else if (enhancedPrompt.includes("conclusion")) {
        response = `Here's a compelling conclusion for your article:\n\n"${prompt}"\n\nAs we've explored throughout this comprehensive guide, the key to success lies in understanding the fundamental principles and applying them consistently. The strategies and insights we've discussed provide a solid foundation for your continued growth and development.\n\nRemember, mastery is a journey, not a destination. Continue to practice, experiment, and refine your approach. The knowledge you've gained here is just the beginning of what's possible when you commit to continuous learning and improvement.\n\nTake action today, and start implementing these strategies in your own work. The results will speak for themselves."`;
      } else {
        response = `Here's AI-generated content based on your prompt: "${prompt}"\n\nThis response demonstrates how AI can assist with content creation, providing relevant and engaging material that aligns with your writing goals. The AI analyzes your request and generates contextually appropriate content that maintains consistency with your existing writing style and topic.\n\nKey benefits of AI assistance include:\n• Faster content generation\n• Consistent quality and tone\n• Creative inspiration and ideas\n• Time-saving for routine writing tasks\n• Enhanced productivity for content creators`;
      }
      
      setAiSuggestion(response);
    } catch (error) {
      console.error("AI generation failed:", error);
      setAiSuggestion("Sorry, AI assistance is currently unavailable. Please check your API configuration.");
    } finally {
      setIsAIAssisting(false);
    }
  };

  const expandContent = async () => {
    const currentContent = editor?.getText() || "";
    if (currentContent.length < 50) {
      setAiSuggestion("Please write more content first to enable AI expansion.");
      return;
    }
    
    setIsAIAssisting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const response = `AI expansion suggestion: Based on your current content, here are some additional points you could explore:\n\n1. Consider adding more examples\n2. Expand on the technical details\n3. Include relevant case studies\n4. Add practical applications\n5. Discuss future implications`;
      setAiSuggestion(response);
    } catch (error) {
      console.error("AI expansion failed:", error);
      setAiSuggestion("Sorry, AI expansion is currently unavailable.");
    } finally {
      setIsAIAssisting(false);
    }
  };

  const improveWriting = async () => {
    const currentContent = editor?.getText() || "";
    if (currentContent.length < 20) {
      setAiSuggestion("Please write some content first to enable AI writing improvement.");
      return;
    }
    
    setIsAIAssisting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const response = `AI writing improvement suggestions:\n\n• Consider using more active voice\n• Add transitional phrases between paragraphs\n• Include specific examples to support your points\n• Vary sentence structure for better flow\n• Ensure consistent terminology throughout`;
      setAiSuggestion(response);
    } catch (error) {
      console.error("AI improvement failed:", error);
      setAiSuggestion("Sorry, AI writing improvement is currently unavailable.");
    } finally {
      setIsAIAssisting(false);
    }
  };

  const insertAISuggestion = () => {
    if (aiSuggestion && editor) {
      editor.chain().focus().insertContent(aiSuggestion).run();
      setAiSuggestion("");
    }
  };

  const analyzeContent = async () => {
    const currentContent = editor?.getText() || "";
    if (currentContent.length < 30) {
      setAiSuggestion("Please write more content first to enable AI analysis.");
      return;
    }
    
    setIsAIAssisting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const wordCount = currentContent.split(/\s+/).length;
      const response = `Content Analysis:\n\n📊 Word Count: ${wordCount}\n📝 Readability: Good\n🎯 Key Topics: ${currentContent.split(' ').slice(0, 5).join(', ')}...\n💡 Suggestions: Consider adding more specific examples and data points to strengthen your arguments.`;
      setAiSuggestion(response);
    } catch (error) {
      console.error("AI analysis failed:", error);
      setAiSuggestion("Sorry, AI analysis is currently unavailable.");
    } finally {
      setIsAIAssisting(false);
    }
  };

  const generateSEOTitle = async () => {
    const currentContent = editor?.getText() || "";
    if (currentContent.length < 20) {
      setAiSuggestion("Please write some content first to generate SEO title suggestions.");
      return;
    }
    
    setIsAIAssisting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const response = `SEO Title Suggestions:\n\n1. "How to [Main Topic]: A Complete Guide"\n2. "[Main Topic] Best Practices: What You Need to Know"\n3. "The Ultimate Guide to [Main Topic] in 2024"\n4. "[Main Topic] Tips and Tricks for Success"\n5. "Mastering [Main Topic]: From Beginner to Expert"`;
      setAiSuggestion(response);
    } catch (error) {
      console.error("AI SEO generation failed:", error);
      setAiSuggestion("Sorry, AI SEO generation is currently unavailable.");
    } finally {
      setIsAIAssisting(false);
    }
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline cursor-pointer",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg",
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: "is-editor-empty",
      }),
      TaskList.configure({
        HTMLAttributes: {
          class: "list-none space-y-2",
        },
      }),
      TaskItem.configure({
        HTMLAttributes: {
          class: "flex items-start space-x-2",
        },
      }),
      CodeBlockLowlight.configure({
        lowlight: createLowlight(common),
        HTMLAttributes: {
          class: "bg-gray-100 rounded p-4 font-mono text-sm",
        },
      }),
    ],
    content: initialContent ?? { type: "doc", content: [] },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getJSON());
    },
    editorProps: {
      attributes: {
        class: "prose max-w-none focus:outline-none min-h-[400px] p-4",
      },
    },
    immediatelyRender: false,
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* AI Assistance Toolbar */}
      <div className="border-b p-3 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">AI Writing Assistant</span>
          </div>
          <button
            onClick={() => setShowAIPanel(!showAIPanel)}
            className="text-sm text-purple-600 hover:text-purple-800 transition-colors"
          >
            {showAIPanel ? "Hide" : "Show"} AI Panel
          </button>
        </div>
        
        {showAIPanel && (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => generateContent("Write an engaging introduction")}
                disabled={isAIAssisting}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                Generate Intro
              </button>
              <button
                onClick={expandContent}
                disabled={isAIAssisting}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors disabled:opacity-50"
              >
                <Wand2 className="w-4 h-4" />
                Expand Content
              </button>
              <button
                onClick={improveWriting}
                disabled={isAIAssisting}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors disabled:opacity-50"
              >
                <Lightbulb className="w-4 h-4" />
                Improve Writing
              </button>
              <button
                onClick={analyzeContent}
                disabled={isAIAssisting}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-orange-100 text-orange-700 rounded-md hover:bg-orange-200 transition-colors disabled:opacity-50"
              >
                <Zap className="w-4 h-4" />
                Analyze Content
              </button>
              <button
                onClick={generateSEOTitle}
                disabled={isAIAssisting}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                SEO Titles
              </button>
            </div>
            
            {/* Custom AI Prompt Input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ask AI to help with anything..."
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    generateContent(e.currentTarget.value.trim());
                    e.currentTarget.value = '';
                  }
                }}
              />
              <button
                onClick={() => {
                  const input = document.querySelector('input[placeholder="Ask AI to help with anything..."]') as HTMLInputElement;
                  if (input?.value.trim()) {
                    generateContent(input.value.trim());
                    input.value = '';
                  }
                }}
                disabled={isAIAssisting}
                className="px-4 py-2 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                <Zap className="w-4 h-4" />
              </button>
            </div>
            
            {aiSuggestion && (
              <div className="p-3 bg-white border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">AI Suggestion</span>
                  <div className="flex gap-2">
                    <button
                      onClick={insertAISuggestion}
                      className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      Insert
                    </button>
                    <button
                      onClick={() => setAiSuggestion("")}
                      className="px-2 py-1 text-xs bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
                <div className="text-sm text-gray-600 whitespace-pre-line">{aiSuggestion}</div>
              </div>
            )}
            
            {isAIAssisting && (
              <div className="flex items-center gap-2 text-sm text-purple-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                AI is thinking...
              </div>
            )}
            
            {/* AI Setup Info */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5" />
                <div className="text-xs text-blue-700">
                  <p className="font-medium mb-1">💡 AI Integration Setup</p>
                  <p>To enable real AI assistance, add your OpenAI API key to your environment variables:</p>
                  <code className="block mt-1 p-1 bg-blue-100 rounded text-xs">NEXT_PUBLIC_OPENAI_API_KEY=your_api_key_here</code>
                  <p className="mt-1">Currently running in demo mode with simulated AI responses.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Editor Toolbar */}
      <div className="border-b p-2 bg-gray-50 flex flex-wrap gap-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`p-2 rounded ${editor.isActive('bold') ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
        >
          B
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`p-2 rounded ${editor.isActive('italic') ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
        >
          I
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded ${editor.isActive('heading', { level: 3 }) ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
        >
          H3
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded ${editor.isActive('bulletList') ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
        >
          •
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded ${editor.isActive('orderedList') ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
        >
          1.
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-2 rounded ${editor.isActive('codeBlock') ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
        >
          &lt;/&gt;
        </button>
        <button
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          className={`p-2 rounded ${editor.isActive('taskList') ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
        >
          ☐
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

