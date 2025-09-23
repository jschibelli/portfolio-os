// 📄 Plan: Ozzy of Front-End Stylistic Overhaul for Cursor

/\*\*

- GOAL: Apply a goth-metal design aesthetic to existing Next.js + Tailwind + shadcn/ui project.
- Adapt existing components and layout—no structural changes—purely stylistic.
- This plan is tailored for Cursor to interpret and build per section.
  \*/

// ✨ Design Tokens (globals.css or theme.css)
// Cursor: Create/update CSS variables for MetalDark and LightCozy themes
:root[data-theme='MetalDark'] {
--background: #0b0c10;
--foreground: #f0f0f0;
--card: #121417;
--primary: #ff3c00; /_ Flame orange _/
--primary-foreground: #fff;
--muted: #1f1f1f;
--accent: #ff9800;
--radius: 0.25rem;
}

:root[data-theme='LightCozy'] {
--background: #fafafa;
--foreground: #1a1a1a;
--card: #ffffff;
--primary: #0088cc;
--primary-foreground: #fff;
--muted: #efefef;
--accent: #0066aa;
--radius: 0.5rem;
}

// 🧱 COMPONENTS TO CREATE OR MODIFY (each should be in /components/ui or appropriate directory)

/\*\* Cursor: Create NavBar.tsx

- - Uses @radix-ui/react-navigation-menu
- - Includes site title ("Mindware"), links (Blog, About), and Theme Toggle
- - Fixed top bar with semi-transparent backdrop
    \*/

/\*\* Cursor: Create ThemeToggle.tsx

- - Uses next-themes and shadcn/ui button
- - Toggle between 'MetalDark' and 'LightCozy'
- - Animates icon swap with Framer Motion
    \*/

/\*\* Cursor: Create BlogPostCard.tsx

- - Props: title, slug, date, excerpt, tags, coverImage
- - Layout: responsive card with hover effect (shadow or border pulse)
- - Uses Lucide icons and Tailwind styling with CSS vars
    \*/

/\*\* Cursor: Create Hero.tsx (optional)

- - Big intro section with tagline: "I build sharp, scalable frontends with metal in my blood."
- - Background can be dark gradient with light text
- - Optional CTA: View Blog or Summon Me
    \*/

/\*\* Cursor: Create LikeButton.tsx

- - Icon button (Lucide heart or clap) with motion animation
- - Local state counter (optionally integrate real backend later)
    \*/

/\*\* Cursor: Create ShareMenu.tsx

- - Dropdown menu with social share links (Twitter, LinkedIn, etc.)
- - Uses Radix DropdownMenu + Lucide icons
    \*/

/\*\* Cursor: Create Footer.tsx

- - Simple flex layout with muted background
- - Includes © 2025 John Schibelli and theme switcher or icon links
    \*/

// 🧠 NOTES
// - All components use Tailwind utilities + class-variance-authority for variants
// - Each component should be self-contained and cleanly typed (TypeScript)
// - Use existing GraphQL integration for content (no changes needed)

// ✅ FINAL INTEGRATION
// Cursor: Update layout.tsx to include new <NavBar /> and <Footer />
// Cursor: Replace old theme toggle with <ThemeToggle />
// Cursor: Replace blog list with <BlogPostCard /> in map loop

// 🎯 Bonus: Add <Hero /> to home page before blog post list for branding
