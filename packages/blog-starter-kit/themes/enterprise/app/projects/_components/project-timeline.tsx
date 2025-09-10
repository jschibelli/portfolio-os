import { ProjectMeta } from '../../../data/projects/types';
import { CalendarIcon, ClockIcon } from 'lucide-react';

interface ProjectTimelineProps {
  project: ProjectMeta;
}

export function ProjectTimeline({ project }: ProjectTimelineProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: ProjectMeta['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 dark:text-green-400';
      case 'in-progress':
        return 'text-blue-600 dark:text-blue-400';
      case 'planned':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'archived':
        return 'text-gray-600 dark:text-gray-400';
      default:
        return 'text-stone-600 dark:text-stone-400';
    }
  };

  const getStatusText = (status: ProjectMeta['status']) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      case 'planned':
        return 'Planned';
      case 'archived':
        return 'Archived';
      default:
        return status;
    }
  };

  return (
    <div className="bg-stone-50 dark:bg-stone-900 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-4">
        Project Timeline
      </h3>
      
      <div className="space-y-4">
        {/* Status */}
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${
            project.status === 'completed' ? 'bg-green-500' :
            project.status === 'in-progress' ? 'bg-blue-500' :
            project.status === 'planned' ? 'bg-yellow-500' :
            'bg-gray-500'
          }`} />
          <span className={`font-medium ${getStatusColor(project.status)}`}>
            {getStatusText(project.status)}
          </span>
        </div>

        {/* Start Date */}
        {project.startDate && (
          <div className="flex items-center gap-3 text-sm text-stone-600 dark:text-stone-400">
            <CalendarIcon className="w-4 h-4" />
            <span>
              <strong>Started:</strong> {formatDate(project.startDate)}
            </span>
          </div>
        )}

        {/* End Date */}
        {project.endDate && (
          <div className="flex items-center gap-3 text-sm text-stone-600 dark:text-stone-400">
            <CalendarIcon className="w-4 h-4" />
            <span>
              <strong>Completed:</strong> {formatDate(project.endDate)}
            </span>
          </div>
        )}

        {/* Duration */}
        {project.duration && (
          <div className="flex items-center gap-3 text-sm text-stone-600 dark:text-stone-400">
            <ClockIcon className="w-4 h-4" />
            <span>
              <strong>Duration:</strong> {project.duration}
            </span>
          </div>
        )}

        {/* Team Size */}
        {project.teamSize && (
          <div className="flex items-center gap-3 text-sm text-stone-600 dark:text-stone-400">
            <span>
              <strong>Team Size:</strong> {project.teamSize}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
