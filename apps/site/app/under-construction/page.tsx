import { Calendar, Github, Linkedin, Mail } from 'lucide-react';

export default function UnderConstructionPage() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 p-4">
			<div className="mx-auto max-w-4xl text-center">
				{/* Logo/Profile Image */}
				<div className="mb-8">
					<div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-stone-700">
						<span className="text-2xl font-bold text-white">JS</span>
					</div>
				</div>

				{/* Main Content */}
				<div className="space-y-6">
					<h1 className="mb-4 text-4xl font-bold text-white md:text-6xl">John Schibelli</h1>

					<p className="mb-2 text-xl text-stone-300 md:text-2xl">Senior Software Engineer</p>

					<p className="mx-auto max-w-2xl text-lg leading-relaxed text-stone-400">
						I specialize in React, Next.js, and TypeScript — helping teams ship apps that are
						maintainable, scalable, and a pleasure to use.
					</p>
				</div>

				{/* Under Construction Notice */}
				<div className="mt-12 rounded-lg border border-stone-700 bg-stone-800/50 p-8">
					<div className="mb-6 flex items-center justify-center">
						<div className="mr-3 h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent"></div>
						<h2 className="text-2xl font-semibold text-white">Under Construction</h2>
					</div>

					<p className="mb-6 text-lg text-stone-300">
						I'm currently rebuilding my portfolio with the latest technologies. The new site will be
						launching soon with enhanced case studies, interactive demos, and a more comprehensive
						showcase of my work.
					</p>

					<div className="flex items-center justify-center gap-4 text-sm text-stone-400">
						<div className="flex items-center gap-2">
							<div className="h-4 w-4 animate-spin rounded-full border-2 border-amber-500 border-t-transparent"></div>
							<span>
								Expected launch: <span className="font-semibold text-amber-400">Q3 2025</span>
							</span>
						</div>
					</div>
				</div>

				{/* Contact Information */}
				<div className="mt-12">
					<h3 className="mb-6 text-xl font-semibold text-white">Let's Connect</h3>

					<div className="flex flex-wrap justify-center gap-4">
						<a
							href="mailto:john@schibelli.dev"
							className="flex items-center gap-2 rounded-lg bg-stone-700 px-6 py-3 text-white transition-colors hover:bg-stone-600"
						>
							<Mail className="h-5 w-5" />
							john@schibelli.dev
						</a>

						<a
							href="https://calendly.com/johnschibelli"
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-2 rounded-lg bg-stone-700 px-6 py-3 text-white transition-colors hover:bg-stone-600"
						>
							<Calendar className="h-5 w-5" />
							Schedule a Call
						</a>

						<a
							href="https://github.com/jschibelli"
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-2 rounded-lg bg-stone-700 px-6 py-3 text-white transition-colors hover:bg-stone-600"
						>
							<Github className="h-5 w-5" />
							GitHub
						</a>

						<a
							href="https://linkedin.com/in/johnschibelli"
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-2 rounded-lg bg-stone-700 px-6 py-3 text-white transition-colors hover:bg-stone-600"
						>
							<Linkedin className="h-5 w-5" />
							LinkedIn
						</a>
					</div>
				</div>

				{/* Skills Preview */}
				<div className="mt-16">
					<h3 className="mb-4 text-lg font-semibold text-white">What I'm Working With</h3>

					<div className="flex flex-wrap justify-center gap-3">
						{[
							'React',
							'Next.js',
							'TypeScript',
							'Node.js',
							'Tailwind CSS',
							'Prisma',
							'PostgreSQL',
							'Vercel',
						].map((skill) => (
							<span
								key={skill}
								className="rounded-full bg-stone-700/50 px-4 py-2 text-sm text-stone-300"
							>
								{skill}
							</span>
						))}
					</div>
				</div>

				{/* Footer */}
				<div className="mt-16 border-t border-stone-700 pt-8">
					<p className="text-sm text-stone-500">© 2025 John Schibelli. All rights reserved.</p>
				</div>
			</div>
		</div>
	);
}
