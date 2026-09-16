import { Calendar, CheckCircle, Clock, Github, Linkedin, Mail, Wrench } from 'lucide-react';

export const metadata = {
	robots: {
		index: false,
		follow: false,
	},
};
export default function MaintenancePage() {
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

				{/* Maintenance Notice */}
				<div className="mt-12 rounded-lg border border-stone-700 bg-stone-800/50 p-8">
					<div className="mb-6 flex items-center justify-center">
						<Wrench className="mr-3 h-8 w-8 text-amber-500" />
						<h2 className="text-2xl font-semibold text-white">Site Maintenance</h2>
					</div>

					<p className="mb-6 text-lg text-stone-300">
						I'm currently performing scheduled maintenance and updates to improve your experience.
						The site will be back online shortly with enhanced features and performance
						improvements.
					</p>

					<div className="flex items-center justify-center gap-4 text-sm text-stone-400">
						<div className="flex items-center gap-2">
							<Clock className="h-4 w-4" />
							<span>
								Estimated completion:{' '}
								<span className="font-semibold text-amber-400">30 minutes</span>
							</span>
						</div>
					</div>
				</div>

				{/* Status Updates */}
				<div className="mt-8 rounded-lg border border-stone-700 bg-stone-800/30 p-6">
					<h3 className="mb-4 text-lg font-semibold text-white">Maintenance Progress</h3>

					<div className="space-y-3 text-left">
						<div className="flex items-center gap-3">
							<CheckCircle className="h-5 w-5 text-green-500" />
							<span className="text-stone-300">Database optimization completed</span>
						</div>
						<div className="flex items-center gap-3">
							<CheckCircle className="h-5 w-5 text-green-500" />
							<span className="text-stone-300">Performance improvements applied</span>
						</div>
						<div className="flex items-center gap-3">
							<div className="h-5 w-5 animate-spin rounded-full border-2 border-amber-500 border-t-transparent"></div>
							<span className="text-stone-300">Security updates in progress</span>
						</div>
						<div className="flex items-center gap-3">
							<div className="h-5 w-5 rounded-full border-2 border-stone-600"></div>
							<span className="text-stone-500">Final testing and validation</span>
						</div>
					</div>
				</div>

				{/* Contact Information */}
				<div className="mt-12">
					<h3 className="mb-6 text-xl font-semibold text-white">Need Immediate Assistance?</h3>

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
					<h3 className="mb-4 text-lg font-semibold text-white">Technologies in Use</h3>

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
