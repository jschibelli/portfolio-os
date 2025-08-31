export interface Skill {
	name: string;
	icon: string;
	category: string;
}

export const skills: Skill[] = [
	// Languages & Scripting
	{ name: 'JavaScript (ES6+)', icon: '⚡', category: 'Languages' },
	{ name: 'TypeScript', icon: '🔷', category: 'Languages' },
	{ name: 'PHP', icon: '🐘', category: 'Languages' },
	{ name: 'HTML5', icon: '🌐', category: 'Languages' },
	{ name: 'CSS3', icon: '🎨', category: 'Languages' },
	{ name: 'Sass/SCSS', icon: '💅', category: 'Languages' },

	// Front-End
	{ name: 'React', icon: '⚛️', category: 'Front-End' },
	{ name: 'Next.js', icon: '▲', category: 'Front-End' },
	{ name: 'AngularJS', icon: '🅰️', category: 'Front-End' },
	{ name: 'Tailwind CSS', icon: '🎨', category: 'Front-End' },

	// Back-End & APIs
	{ name: 'Node.js', icon: '🟢', category: 'Back-End' },
	{ name: 'Express', icon: '🚂', category: 'Back-End' },
	{ name: 'Nest.js', icon: '🪺', category: 'Back-End' },
	{ name: 'GraphQL', icon: '🔵', category: 'APIs' },
	{ name: 'REST', icon: '🌐', category: 'APIs' },
	{ name: 'JSON', icon: '📄', category: 'APIs' },

	// Testing
	{ name: 'Playwright', icon: '🎭', category: 'Testing' },
	{ name: 'Jest', icon: '🧪', category: 'Testing' },

	// CI/CD & DevOps
	{ name: 'GitHub Actions', icon: '⚙️', category: 'DevOps' },
	{ name: 'Docker', icon: '🐳', category: 'DevOps' },
	{ name: 'Kubernetes', icon: '☸️', category: 'DevOps' },
	{ name: 'Vercel', icon: '▲', category: 'DevOps' },

	// Databases & CMS
	{ name: 'SQL Server', icon: '🗄️', category: 'Databases' },
	{ name: 'MySQL', icon: '🐬', category: 'Databases' },
	{ name: 'WordPress', icon: '📝', category: 'CMS' },
	{ name: 'Contentful', icon: '📝', category: 'CMS' },
];
