import { redirect } from 'next/navigation'

export default function HomePage() {
  // Redirect to the main site or show a landing page
  redirect('/blog')
}
