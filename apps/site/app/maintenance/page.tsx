import { Mail, Calendar, Github, Linkedin, Wrench, Clock, CheckCircle } from 'lucide-react';

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Logo/Profile Image */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-stone-700 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">JS</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            John Schibelli
          </h1>
          
          <p className="text-xl md:text-2xl text-stone-300 mb-2">
            Senior Front-End Developer
          </p>
          
          <p className="text-lg text-stone-400 max-w-2xl mx-auto leading-relaxed">
            I specialize in React, Next.js, and TypeScript — helping teams ship apps that are maintainable, scalable, and a pleasure to use.
          </p>
        </div>

        {/* Maintenance Notice */}
        <div className="mt-12 p-8 bg-stone-800/50 rounded-lg border border-stone-700">
          <div className="flex items-center justify-center mb-6">
            <Wrench className="w-8 h-8 text-amber-500 mr-3" />
            <h2 className="text-2xl font-semibold text-white">Site Maintenance</h2>
          </div>
          
          <p className="text-stone-300 mb-6 text-lg">
            I'm currently performing scheduled maintenance and updates to improve your experience. 
            The site will be back online shortly with enhanced features and performance improvements.
          </p>
          
          <div className="flex items-center justify-center gap-4 text-sm text-stone-400">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Estimated completion: <span className="text-amber-400 font-semibold">30 minutes</span></span>
            </div>
          </div>
        </div>

        {/* Status Updates */}
        <div className="mt-8 p-6 bg-stone-800/30 rounded-lg border border-stone-700">
          <h3 className="text-lg font-semibold text-white mb-4">Maintenance Progress</h3>
          
          <div className="space-y-3 text-left">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-stone-300">Database optimization completed</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-stone-300">Performance improvements applied</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-stone-300">Security updates in progress</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-stone-600 rounded-full"></div>
              <span className="text-stone-500">Final testing and validation</span>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-12">
          <h3 className="text-xl font-semibold text-white mb-6">
            Need Immediate Assistance?
          </h3>
          
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="mailto:john@schibelli.dev"
              className="flex items-center gap-2 px-6 py-3 bg-stone-700 hover:bg-stone-600 rounded-lg text-white transition-colors"
            >
              <Mail className="w-5 h-5" />
              john@schibelli.dev
            </a>
            
            <a
              href="https://calendly.com/johnschibelli"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-stone-700 hover:bg-stone-600 rounded-lg text-white transition-colors"
            >
              <Calendar className="w-5 h-5" />
              Schedule a Call
            </a>
            
            <a
              href="https://github.com/jschibelli"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-stone-700 hover:bg-stone-600 rounded-lg text-white transition-colors"
            >
              <Github className="w-5 h-5" />
              GitHub
            </a>
            
            <a
              href="https://linkedin.com/in/johnschibelli"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-stone-700 hover:bg-stone-600 rounded-lg text-white transition-colors"
            >
              <Linkedin className="w-5 h-5" />
              LinkedIn
            </a>
          </div>
        </div>

        {/* Skills Preview */}
        <div className="mt-16">
          <h3 className="text-lg font-semibold text-white mb-4">
            Technologies in Use
          </h3>
          
          <div className="flex flex-wrap justify-center gap-3">
            {[
              'React', 'Next.js', 'TypeScript', 'Node.js', 
              'Tailwind CSS', 'Prisma', 'PostgreSQL', 'Vercel'
            ].map((skill) => (
              <span
                key={skill}
                className="px-4 py-2 bg-stone-700/50 rounded-full text-stone-300 text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-stone-700">
          <p className="text-stone-500 text-sm">
            © 2025 John Schibelli. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
