import { ProjectMeta } from '../../../data/projects/types';
import { Activity, Calendar, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';
import { parseChangelog, getRecentUpdates, getUpcomingFeatures, getCurrentVersion } from '../../../lib/changelog-parser';

interface ProjectVersionProps {
  project: ProjectMeta;
}

export function ProjectVersion({ project }: ProjectVersionProps) {
  // Get dynamic changelog data (only for Portfolio OS)
  const isDynamic = project.id === 'portfolio-os';
  const versionInfo = isDynamic ? getCurrentVersion() : null;
  const recentUpdates = isDynamic ? getRecentUpdates() : project.recentUpdates || [];
  const upcomingFeatures = isDynamic ? getUpcomingFeatures() : project.upcomingFeatures || [];
  
  // Determine which version data to use
  const version = project.version || versionInfo?.version;
  const versionStatus = (project.versionStatus || versionInfo?.status) as 'alpha' | 'beta' | 'rc' | 'stable' | undefined;
  const lastUpdated = project.lastUpdated || versionInfo?.date;
  
  // Only show if version data is available
  if (!version) {
    return null;
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'alpha':
        return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20';
      case 'beta':
        return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20';
      case 'rc':
        return 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20';
      case 'stable':
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
      default:
        return 'text-stone-600 dark:text-stone-400 bg-stone-50 dark:bg-stone-900';
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'alpha':
        return 'Alpha';
      case 'beta':
        return 'Beta';
      case 'rc':
        return 'Release Candidate';
      case 'stable':
        return 'Stable';
      default:
        return 'In Development';
    }
  };

  return (
    <div className="bg-stone-50 dark:bg-stone-900 rounded-lg p-6 border border-stone-200 dark:border-stone-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
          Version & Status
        </h3>
        <Activity className="w-5 h-5 text-green-500" />
      </div>

      {/* Version Badge */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl font-bold text-stone-900 dark:text-stone-100">
            v{version}
          </span>
          <span className={`text-xs font-semibold px-2 py-1 rounded ${getStatusColor(versionStatus)}`}>
            {getStatusLabel(versionStatus)}
          </span>
        </div>
        {lastUpdated && (
          <div className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>Updated {lastUpdated}</span>
          </div>
        )}
      </div>

      {/* Recent Updates */}
      {recentUpdates && recentUpdates.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100 mb-2 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
            What&apos;s New
          </h4>
          <ul className="space-y-1.5">
            {recentUpdates.slice(0, 4).map((update, index) => (
              <li key={index} className="flex items-start gap-2 text-xs text-stone-600 dark:text-stone-400">
                <span className="text-stone-400 dark:text-stone-500 mt-0.5">•</span>
                <span>{update}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Upcoming Features */}
      {upcomingFeatures && upcomingFeatures.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            Coming Soon
          </h4>
          <ul className="space-y-1.5">
            {upcomingFeatures.slice(0, 3).map((feature, index) => (
              <li key={index} className="flex items-start gap-2 text-xs text-stone-600 dark:text-stone-400">
                <span className="text-stone-400 dark:text-stone-500 mt-0.5">•</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Changelog Link */}
      {project.changelogUrl && (
        <a
          href={project.changelogUrl}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 transition-colors group"
        >
          View Full Changelog
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </a>
      )}
    </div>
  );
}

