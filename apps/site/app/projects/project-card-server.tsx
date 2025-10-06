import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { ArrowRight, Calendar, Code, Users, CheckCircle } from 'lucide-react';
import { Project } from '../../components/features/portfolio/project-card';

interface ProjectCardServerProps {
  project: Project;
}

export function ProjectCardServer({ project }: ProjectCardServerProps) {
  return (
    <Card className="group h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="p-0">
        <div className="relative aspect-video overflow-hidden rounded-t-lg">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {project.status && (
            <Badge 
              variant={project.status === 'completed' ? 'default' : 'secondary'}
              className="absolute top-3 right-3"
            >
              {project.status}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-6">
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
            {project.title}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Technologies */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {project.technologies.slice(0, 4).map((tech) => (
                <Badge key={tech} variant="outline" className="text-xs">
                  {tech}
                </Badge>
              ))}
              {project.technologies.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{project.technologies.length - 4} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Project Details */}
        <div className="mb-4 space-y-2 text-sm text-muted-foreground">
          {project.client && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>{project.client}</span>
            </div>
          )}
          {project.startDate && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{new Date(project.startDate).getFullYear()}</span>
            </div>
          )}
          {project.industry && (
            <div className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              <span>{project.industry}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-auto space-y-2">
          {project.slug && (
            <Button asChild className="w-full">
              <Link href={`/projects/${project.slug}`}>
                View Project
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
          
          {project.liveUrl && (
            <Button variant="outline" asChild className="w-full">
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                Live Demo
              </a>
            </Button>
          )}
          
          {project.caseStudyUrl && (
            <Button variant="ghost" asChild className="w-full">
              <a href={project.caseStudyUrl} target="_blank" rel="noopener noreferrer">
                Case Study
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
