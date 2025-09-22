export default function AboutPage() {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900">
      {/* Header Section */}
      <section className="py-16 bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            About Me
          </h1>
          <p className="text-xl text-stone-200 max-w-3xl mx-auto">
            Learn more about my journey, skills, and approach to web development.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-stone-800 rounded-lg shadow-sm border border-stone-200 dark:border-stone-700 p-8">
              <h2 className="text-3xl font-bold text-stone-900 dark:text-stone-100 mb-6">
                My Story
              </h2>
              <p className="text-lg text-stone-600 dark:text-stone-400 mb-6">
                I'm a Senior Front-End Developer with 15+ years of experience building modern web applications. 
                I specialize in React, Next.js, TypeScript, and Tailwind CSS, with a focus on creating 
                accessible, performant, and user-centric digital experiences.
              </p>
              <p className="text-lg text-stone-600 dark:text-stone-400 mb-6">
                My philosophy centers on writing code that is teachable, maintainable, and user-centric. 
                I believe great code should be accessible to everyone and built with the end user in mind.
              </p>
              <h3 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-4">
                Skills & Technologies
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-stone-100 dark:bg-stone-700 rounded-lg p-4 text-center">
                  <span className="text-stone-900 dark:text-stone-100 font-medium">React</span>
                </div>
                <div className="bg-stone-100 dark:bg-stone-700 rounded-lg p-4 text-center">
                  <span className="text-stone-900 dark:text-stone-100 font-medium">Next.js</span>
                </div>
                <div className="bg-stone-100 dark:bg-stone-700 rounded-lg p-4 text-center">
                  <span className="text-stone-900 dark:text-stone-100 font-medium">TypeScript</span>
                </div>
                <div className="bg-stone-100 dark:bg-stone-700 rounded-lg p-4 text-center">
                  <span className="text-stone-900 dark:text-stone-100 font-medium">Tailwind CSS</span>
                </div>
                <div className="bg-stone-100 dark:bg-stone-700 rounded-lg p-4 text-center">
                  <span className="text-stone-900 dark:text-stone-100 font-medium">Accessibility</span>
                </div>
                <div className="bg-stone-100 dark:bg-stone-700 rounded-lg p-4 text-center">
                  <span className="text-stone-900 dark:text-stone-100 font-medium">SEO</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

