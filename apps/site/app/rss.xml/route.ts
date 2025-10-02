import { redirect } from 'next/navigation';

export async function GET() {
  redirect('/blog/rss.xml');
}
