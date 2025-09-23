"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Search, 
  Filter,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Tag,
  BookOpen,
  Loader2
} from "lucide-react";

interface CaseStudy {
  id: string;
  title: string;
  excerpt: string;
  status: string;
  publishedAt: string | null;
  tags: string[];
  views: number;
  featured: boolean;
  slug: string;
  author?: {
    name: string;
    email: string;
  };
}

export default function CaseStudiesPage() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchCaseStudies();
  }, []);

  const fetchCaseStudies = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/case-studies");
      if (response.ok) {
        const data = await response.json();
        setCaseStudies(data);
      } else {
        console.error("Failed to fetch case studies");
      }
    } catch (error) {
      console.error("Error fetching case studies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this case study?")) {
      try {
        const response = await fetch(`/api/admin/case-studies/${id}`, {
          method: "DELETE"
        });
        
        if (response.ok) {
          setCaseStudies(caseStudies.filter(cs => cs.id !== id));
        } else {
          alert("Failed to delete case study");
        }
      } catch (error) {
        console.error("Error deleting case study:", error);
        alert("Failed to delete case study");
      }
    }
  };

  const filteredCaseStudies = caseStudies.filter(caseStudy => {
    const matchesSearch = caseStudy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         caseStudy.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || caseStudy.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">Case Studies</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage and showcase your project case studies
          </p>
        </div>
        <Link href="/admin/case-studies/new">
          <Button className="flex items-center space-x-2 w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            <span>New Case Study</span>
          </Button>
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search case studies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
        >
          <option value="all">All Status</option>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="SCHEDULED">Scheduled</option>
        </select>
      </div>

      {/* Case Studies Grid */}
      <div className="grid gap-6">
        {filteredCaseStudies.map((caseStudy) => (
          <div
            key={caseStudy.id}
            className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 lg:p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h3 className="text-lg lg:text-xl font-semibold text-slate-900 dark:text-slate-100">
                    {caseStudy.title}
                  </h3>
                  {caseStudy.featured && (
                    <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200 rounded-full">
                      Featured
                    </span>
                  )}
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    caseStudy.status === 'PUBLISHED' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200'
                      : caseStudy.status === 'SCHEDULED'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200'
                      : 'bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-200'
                  }`}>
                    {caseStudy.status}
                  </span>
                </div>
                
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  {caseStudy.excerpt}
                </p>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {caseStudy.publishedAt 
                        ? new Date(caseStudy.publishedAt).toLocaleDateString()
                        : 'Not published'
                      }
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span>{caseStudy.views} views</span>
                  </div>
                  {caseStudy.author && (
                    <div className="flex items-center space-x-1">
                      <span>By {caseStudy.author.name}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 mt-4">
                  {caseStudy.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-center lg:justify-end gap-2">
                <Link href={`/admin/case-studies/${caseStudy.id}/edit`}>
                  <Button variant="ghost" size="sm" className="flex-1 lg:flex-none">
                    <Edit className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href={`/case-studies/${caseStudy.slug}`}>
                  <Button variant="ghost" size="sm" className="flex-1 lg:flex-none">
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-600 hover:text-red-700 flex-1 lg:flex-none"
                  onClick={() => handleDelete(caseStudy.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCaseStudies.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <BookOpen className="h-12 w-12 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
            {caseStudies.length === 0 ? 'No case studies yet' : 'No case studies match your filters'}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {caseStudies.length === 0 
              ? 'Get started by creating your first case study to showcase your work.'
              : 'Try adjusting your search terms or filters.'
            }
          </p>
          {caseStudies.length === 0 && (
            <Link href="/admin/case-studies/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Case Study
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
