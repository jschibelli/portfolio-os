export interface Skill {
	name: string;
	icon: string;
	category: string;
}

export const skills: Skill[] = [
	// Frontend Technologies
	{ name: 'React', icon: '⚛️', category: 'Frontend' },
	{ name: 'Next.js', icon: '▲', category: 'Frontend' },
	{ name: 'TypeScript', icon: '🔷', category: 'Frontend' },
	{ name: 'Tailwind CSS', icon: '🎨', category: 'Frontend' },
	{ name: 'JavaScript (ES6+)', icon: '⚡', category: 'Frontend' },
	{ name: 'HTML5', icon: '🌐', category: 'Frontend' },
	{ name: 'CSS3', icon: '💎', category: 'Frontend' },

	// Backend Technologies
	{ name: 'Node.js', icon: '🟢', category: 'Backend' },
	{ name: 'Express', icon: '🚂', category: 'Backend' },
	{ name: 'Nest.js', icon: '🪺', category: 'Backend' },
	{ name: 'Database Integration', icon: '🗄️', category: 'Backend' },
	{ name: 'APIs', icon: '🔗', category: 'Backend' },
	{ name: 'GraphQL', icon: '🔵', category: 'Backend' },
	{ name: 'REST', icon: '🌐', category: 'Backend' },

	// Tools & Platforms
	{ name: 'AWS', icon: '☁️', category: 'Tools & Platforms' },
	{ name: 'Vercel', icon: '▲', category: 'Tools & Platforms' },
	{ name: 'GitHub', icon: '🐙', category: 'Tools & Platforms' },
	{ name: 'Docker', icon: '🐳', category: 'Tools & Platforms' },
	{ name: 'GitHub Actions', icon: '⚙️', category: 'Tools & Platforms' },
	{ name: 'VS Code', icon: '💻', category: 'Tools & Platforms' },
	{ name: 'Figma', icon: '🎨', category: 'Tools & Platforms' },

	// Specialties
	{ name: 'Accessibility', icon: '♿', category: 'Specialties' },
	{ name: 'SEO', icon: '🔍', category: 'Specialties' },
	{ name: 'AI Integration', icon: '🤖', category: 'Specialties' },
	{ name: 'Performance Optimization', icon: '⚡', category: 'Specialties' },
	{ name: 'Testing', icon: '🧪', category: 'Specialties' },
	{ name: 'UI/UX Design', icon: '✨', category: 'Specialties' },
];
