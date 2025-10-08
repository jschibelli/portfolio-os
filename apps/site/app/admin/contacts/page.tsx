"use client";

import { useState, useEffect } from "react";
import { Mail, Send, XCircle, CheckCircle, Clock, Search, Filter, RefreshCw, Eye, User, Building2, Calendar, AlertCircle } from "lucide-react";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  company?: string;
  projectType?: string;
  message: string;
  status: 'pending' | 'sent' | 'failed';
  emailSentAt?: string;
  emailError?: string;
  retryCount: number;
  lastRetryAt?: string;
  ipAddress?: string;
  createdAt: string;
  updatedAt: string;
}

interface PaginationInfo {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

interface Summary {
  total: number;
  pending: number;
  sent: number;
  failed: number;
}

export default function ContactsPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    limit: 50,
    offset: 0,
    hasMore: false,
  });
  const [summary, setSummary] = useState<Summary>({
    total: 0,
    pending: 0,
    sent: 0,
    failed: 0,
  });

  // Fetch submissions from API
  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: pagination.limit.toString(),
        offset: pagination.offset.toString(),
      });
      
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      
      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const response = await fetch(`/api/admin/contacts?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setSubmissions(data.data);
        setPagination(data.pagination);
        setSummary(data.summary);
      } else {
        console.error('Failed to fetch submissions:', data.error);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Retry sending email for a failed submission
  const handleRetry = async (submissionId: string) => {
    setRetrying(submissionId);
    try {
      const response = await fetch(`/api/admin/contacts/${submissionId}/retry`, {
        method: 'POST',
      });
      const data = await response.json();

      if (data.success) {
        // Refresh submissions after successful retry
        await fetchSubmissions();
        alert('Email sent successfully!');
      } else {
        alert(`Failed to send email: ${data.error}`);
      }
    } catch (error) {
      console.error('Error retrying email:', error);
      alert('An error occurred while retrying email');
    } finally {
      setRetrying(null);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [statusFilter, pagination.offset]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1";
    switch (status) {
      case 'sent':
        return <span className={`${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400`}>
          {getStatusIcon(status)} Sent
        </span>;
      case 'failed':
        return <span className={`${baseClasses} bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400`}>
          {getStatusIcon(status)} Failed
        </span>;
      case 'pending':
        return <span className={`${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400`}>
          {getStatusIcon(status)} Pending
        </span>;
      default:
        return <span className={`${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400`}>
          {getStatusIcon(status)} Unknown
        </span>;
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-3">
            <Mail className="w-8 h-8" />
            Contact Form Submissions
          </h1>
          <p className="text-stone-600 dark:text-stone-400 mt-2">
            Manage and view all contact form submissions
          </p>
        </div>
        
        <button
          onClick={() => fetchSubmissions()}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-stone-800 p-4 rounded-lg border border-stone-200 dark:border-stone-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-stone-600 dark:text-stone-400 text-sm">Total</p>
              <p className="text-2xl font-bold text-stone-900 dark:text-stone-100">{summary.total}</p>
            </div>
            <Mail className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-stone-800 p-4 rounded-lg border border-stone-200 dark:border-stone-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-stone-600 dark:text-stone-400 text-sm">Sent</p>
              <p className="text-2xl font-bold text-green-600">{summary.sent}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-stone-800 p-4 rounded-lg border border-stone-200 dark:border-stone-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-stone-600 dark:text-stone-400 text-sm">Failed</p>
              <p className="text-2xl font-bold text-red-600">{summary.failed}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-stone-800 p-4 rounded-lg border border-stone-200 dark:border-stone-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-stone-600 dark:text-stone-400 text-sm">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{summary.pending}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-stone-800 p-4 rounded-lg border border-stone-200 dark:border-stone-700 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, email, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchSubmissions()}
              className="w-full pl-10 pr-4 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-stone-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="sent">Sent</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <button
            onClick={() => fetchSubmissions()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-stone-600 dark:text-stone-400">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
            Loading submissions...
          </div>
        ) : submissions.length === 0 ? (
          <div className="p-8 text-center text-stone-600 dark:text-stone-400">
            <Mail className="w-12 h-12 mx-auto mb-4 text-stone-400" />
            <p>No contact submissions found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-stone-50 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 dark:divide-stone-700">
                {submissions.map((submission) => (
                  <tr key={submission.id} className="hover:bg-stone-50 dark:hover:bg-stone-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <User className="w-5 h-5 text-stone-400 mt-1" />
                        <div>
                          <p className="font-medium text-stone-900 dark:text-stone-100">{submission.name}</p>
                          <p className="text-sm text-stone-600 dark:text-stone-400">{submission.email}</p>
                          {submission.company && (
                            <p className="text-xs text-stone-500 dark:text-stone-500 flex items-center gap-1 mt-1">
                              <Building2 className="w-3 h-3" />
                              {submission.company}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-stone-900 dark:text-stone-100">
                        {submission.projectType || 'Not specified'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(submission.status)}
                      {submission.retryCount > 0 && (
                        <p className="text-xs text-stone-500 mt-1">
                          Retries: {submission.retryCount}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-stone-600 dark:text-stone-400">
                        <Calendar className="w-4 h-4" />
                        {new Date(submission.createdAt).toLocaleDateString()}
                      </div>
                      <p className="text-xs text-stone-500 dark:text-stone-500">
                        {new Date(submission.createdAt).toLocaleTimeString()}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedSubmission(submission)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {submission.status === 'failed' && (
                          <button
                            onClick={() => handleRetry(submission.id)}
                            disabled={retrying === submission.id}
                            className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors disabled:opacity-50"
                            title="Retry sending email"
                          >
                            <RefreshCw className={`w-4 h-4 ${retrying === submission.id ? 'animate-spin' : ''}`} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && submissions.length > 0 && (
          <div className="px-6 py-4 bg-stone-50 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-700 flex items-center justify-between">
            <p className="text-sm text-stone-600 dark:text-stone-400">
              Showing {pagination.offset + 1} to {pagination.offset + submissions.length} of {pagination.total} submissions
            </p>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, offset: Math.max(0, prev.offset - prev.limit) }))}
                disabled={pagination.offset === 0}
                className="px-4 py-2 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-600 rounded-lg text-stone-900 dark:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setPagination(prev => ({ ...prev, offset: prev.offset + prev.limit }))}
                disabled={!pagination.hasMore}
                className="px-4 py-2 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-600 rounded-lg text-stone-900 dark:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedSubmission(null)}>
          <div className="bg-white dark:bg-stone-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6">
              <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">Submission Details</h2>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-stone-500 dark:text-stone-400">Name</label>
                <p className="text-stone-900 dark:text-stone-100 mt-1">{selectedSubmission.name}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-stone-500 dark:text-stone-400">Email</label>
                <p className="text-stone-900 dark:text-stone-100 mt-1">{selectedSubmission.email}</p>
              </div>

              {selectedSubmission.company && (
                <div>
                  <label className="text-sm font-medium text-stone-500 dark:text-stone-400">Company</label>
                  <p className="text-stone-900 dark:text-stone-100 mt-1">{selectedSubmission.company}</p>
                </div>
              )}

              {selectedSubmission.projectType && (
                <div>
                  <label className="text-sm font-medium text-stone-500 dark:text-stone-400">Project Type</label>
                  <p className="text-stone-900 dark:text-stone-100 mt-1">{selectedSubmission.projectType}</p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-stone-500 dark:text-stone-400">Message</label>
                <div className="mt-1 p-4 bg-stone-50 dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-700">
                  <p className="text-stone-900 dark:text-stone-100 whitespace-pre-wrap">{selectedSubmission.message}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-stone-500 dark:text-stone-400">Status</label>
                  <div className="mt-1">{getStatusBadge(selectedSubmission.status)}</div>
                </div>

                <div>
                  <label className="text-sm font-medium text-stone-500 dark:text-stone-400">Submitted</label>
                  <p className="text-stone-900 dark:text-stone-100 mt-1">
                    {new Date(selectedSubmission.createdAt).toLocaleString()}
                  </p>
                </div>

                {selectedSubmission.emailSentAt && (
                  <div>
                    <label className="text-sm font-medium text-stone-500 dark:text-stone-400">Email Sent</label>
                    <p className="text-stone-900 dark:text-stone-100 mt-1">
                      {new Date(selectedSubmission.emailSentAt).toLocaleString()}
                    </p>
                  </div>
                )}

                {selectedSubmission.retryCount > 0 && (
                  <div>
                    <label className="text-sm font-medium text-stone-500 dark:text-stone-400">Retry Count</label>
                    <p className="text-stone-900 dark:text-stone-100 mt-1">{selectedSubmission.retryCount}</p>
                  </div>
                )}
              </div>

              {selectedSubmission.emailError && (
                <div>
                  <label className="text-sm font-medium text-red-500">Email Error</label>
                  <div className="mt-1 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <p className="text-red-900 dark:text-red-100 text-sm">{selectedSubmission.emailError}</p>
                  </div>
                </div>
              )}

              {selectedSubmission.ipAddress && (
                <div>
                  <label className="text-sm font-medium text-stone-500 dark:text-stone-400">IP Address</label>
                  <p className="text-stone-900 dark:text-stone-100 mt-1 font-mono text-sm">{selectedSubmission.ipAddress}</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              {selectedSubmission.status === 'failed' && (
                <button
                  onClick={() => {
                    handleRetry(selectedSubmission.id);
                    setSelectedSubmission(null);
                  }}
                  disabled={retrying === selectedSubmission.id}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${retrying === selectedSubmission.id ? 'animate-spin' : ''}`} />
                  Retry Email
                </button>
              )}
              <button
                onClick={() => setSelectedSubmission(null)}
                className="px-4 py-2 bg-stone-200 dark:bg-stone-700 text-stone-900 dark:text-stone-100 rounded-lg hover:bg-stone-300 dark:hover:bg-stone-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

