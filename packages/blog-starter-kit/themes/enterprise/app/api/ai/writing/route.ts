import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { action, content, title, excerpt } = await request.json();

    let prompt = '';
    let systemPrompt = '';

    switch (action) {
      case 'brainstorm':
        systemPrompt = 'You are a creative writing assistant. Help brainstorm article ideas and topics.';
        prompt = `Based on this title: "${title || 'Untitled'}", brainstorm 5-7 unique article ideas with brief descriptions.`;
        break;
      
      case 'improve':
        systemPrompt = 'You are a professional editor. Improve the writing while maintaining the author\'s voice.';
        prompt = `Improve this content for better readability and engagement:\n\n${content}`;
        break;
      
      case 'outline':
        systemPrompt = 'You are a content strategist. Create detailed article outlines.';
        prompt = `Create a detailed outline for an article titled: "${title || 'Untitled'}"\n\nExcerpt: ${excerpt || 'No excerpt provided'}`;
        break;
      
      case 'seo':
        systemPrompt = 'You are an SEO expert. Optimize content for search engines.';
        prompt = `Optimize this content for SEO:\n\nTitle: ${title}\nContent: ${content}\n\nProvide SEO title, meta description, and suggest keywords.`;
        break;
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const result = completion.choices[0]?.message?.content || 'No response generated';

    return NextResponse.json({ result });

  } catch (error) {
    console.error('AI Writing API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process AI request' },
      { status: 500 }
    );
  }
}
