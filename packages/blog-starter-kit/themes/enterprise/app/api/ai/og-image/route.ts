import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { prompt, title, excerpt } = await request.json();

    // Create a comprehensive prompt for the image
    const imagePrompt = prompt || `Create a modern, professional blog header image for an article titled "${title}". The image should be suitable for social media sharing and represent the content described as: "${excerpt}". Use a clean, minimalist design with good contrast and readable text overlay.`;

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: imagePrompt,
      n: 1,
      size: "1024x1024", // DALL-E 3 only supports square images
      quality: "standard",
      style: "natural",
    });

    const imageUrl = response.data[0]?.url;

    if (!imageUrl) {
      return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
    }

    return NextResponse.json({ 
      imageUrl,
      prompt: imagePrompt,
      size: "1024x1024",
      note: "Generated as square image - can be cropped to 1200x630 for OG image use"
    });

  } catch (error) {
    console.error('OG Image Generation Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate OG image' },
      { status: 500 }
    );
  }
}
