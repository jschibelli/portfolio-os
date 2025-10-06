import { ProjectMeta } from '../../data/projects/types';

interface ProjectsStructuredDataProps {
  projects: ProjectMeta[];
}

export function ProjectsStructuredData({ projects }: ProjectsStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Projects | John Schibelli Portfolio",
    "description": "Explore John Schibelli's portfolio of React, Next.js, and TypeScript projects. View case studies, live demos, and technical implementations.",
    "url": "https://johnschibelli.dev/projects",
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": projects.length,
      "itemListElement": projects.map((project, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "CreativeWork",
          "@id": `https://johnschibelli.dev/projects/${project.slug}`,
          "name": project.title,
          "description": project.description,
          "url": `https://johnschibelli.dev/projects/${project.slug}`,
          "image": project.image ? `https://johnschibelli.dev${project.image}` : undefined,
          "author": {
            "@type": "Person",
            "name": "John Schibelli",
            "url": "https://johnschibelli.dev"
          },
          "dateCreated": project.startDate,
          "dateModified": project.endDate || project.startDate,
          "keywords": project.tags?.join(", "),
          "programmingLanguage": project.technologies?.join(", "),
          "genre": "Web Development",
          "inLanguage": "en-US"
        }
      }))
    },
    "author": {
      "@type": "Person",
      "name": "John Schibelli",
      "url": "https://johnschibelli.dev",
      "jobTitle": "Full-Stack Developer",
      "worksFor": {
        "@type": "Organization",
        "name": "Freelance"
      }
    },
    "publisher": {
      "@type": "Person",
      "name": "John Schibelli",
      "url": "https://johnschibelli.dev"
    },
    "datePublished": "2024-01-01",
    "dateModified": new Date().toISOString(),
    "inLanguage": "en-US"
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2)
      }}
    />
  );
}
