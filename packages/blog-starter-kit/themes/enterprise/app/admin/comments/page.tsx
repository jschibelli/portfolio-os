"use client";

import { useState } from "react";
import { MessageSquare, Check, X, Trash2, Search, Filter, Eye, Reply, Flag, User, Clock, ThumbsUp, ThumbsDown } from "lucide-react";

interface Comment {
  id: string;
  author: string;
  authorEmail: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected' | 'spam';
  createdAt: string;
  articleTitle: string;
  articleSlug: string;
  parentComment?: string;
  likes: number;
  dislikes: number;
  isFlagged: boolean;
  flaggedReason?: string;
}

const mockComments: Comment[] = [
  {
    id: "1",
    author: "John Doe",
    authorEmail: "john.doe@email.com",
    content: "Great article! This really helped me understand the concept better. Looking forward to more content like this.",
    status: "approved",
    createdAt: "2024-01-20 14:30",
    articleTitle: "The Future of AI in Content Creation",
    articleSlug: "future-ai-content-creation",
    likes: 5,
    dislikes: 0,
    isFlagged: false
  },
  {
    id: "2",
    author: "Sarah Wilson",
    authorEmail: "sarah.w@email.com",
    content: "I have a question about the implementation. Could you provide more details about the specific steps?",
    status: "pending",
    createdAt: "2024-01-20 15:45",
    articleTitle: "Building Scalable Web Applications",
    articleSlug: "building-scalable-web-apps",
    likes: 2,
    dislikes: 0,
    isFlagged: false
  },
  {
    id: "3",
    author: "Mike Johnson",
    authorEmail: "mike.j@email.com",
    content: "This is exactly what I was looking for. The examples are very clear and practical.",
    status: "approved",
    createdAt: "2024-01-20 16:20",
    articleTitle: "Design Systems: From Theory to Practice",
    articleSlug: "design-systems-theory-practice",
    likes: 8,
    dislikes: 1,
    isFlagged: false
  },
  {
    id: "4",
    author: "Anonymous User",
    authorEmail: "user123@temp.com",
    content: "SPAM: Check out my website for the best deals on everything!",
    status: "spam",
    createdAt: "2024-01-20 17:10",
    articleTitle: "SEO Strategies for 2024",
    articleSlug: "seo-strategies-2024",
    likes: 0,
    dislikes: 3,
    isFlagged: true,
    flaggedReason: "Spam content"
  },
  {
    id: "5",
    author: "Emma Davis",
    authorEmail: "emma.d@email.com",
    content: "I disagree with some of the points made here. The approach seems outdated.",
    status: "rejected",
    createdAt: "2024-01-20 18:00",
    articleTitle: "Modern JavaScript Best Practices",
    articleSlug: "modern-javascript-best-practices",
    likes: 1,
    dislikes: 4,
    isFlagged: false
  }
];

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedComments, setSelectedComments] = useState<string[]>([]);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const filteredComments = comments.filter(comment => {
    const matchesSearch = comment.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comment.articleTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || comment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'spam': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const handleStatusChange = (commentId: string, newStatus: Comment['status']) => {
    setComments(comments.map(comment => 
      comment.id === commentId ? { ...comment, status: newStatus } : comment
    ));
  };

  const handleBulkAction = (action: 'approve' | 'reject' | 'delete') => {
    if (selectedComments.length === 0) return;
    
    if (action === 'delete') {
      if (confirm(`Are you sure you want to delete ${selectedComments.length} comment(s)? This action cannot be undone.`)) {
        setComments(comments.filter(comment => !selectedComments.includes(comment.id)));
        setSelectedComments([]);
      }
    } else {
      const newStatus = action === 'approve' ? 'approved' : 'rejected';
      setComments(comments.map(comment => 
        selectedComments.includes(comment.id) ? { ...comment, status: newStatus } : comment
      ));
      setSelectedComments([]);
    }
  };

  const handleReply = (comment: Comment) => {
    setReplyingTo(comment);
    setShowReplyModal(true);
  };

  const submitReply = () => {
    if (!replyingTo || !replyContent.trim()) return;
    
    const newReply: Comment = {
      id: Date.now().toString(),
      author: "Admin",
      authorEmail: "admin@site.com",
      content: replyContent,
      status: "approved",
      createdAt: new Date().toLocaleString(),
      articleTitle: replyingTo.articleTitle,
      articleSlug: replyingTo.articleSlug,
      parentComment: replyingTo.id,
      likes: 0,
      dislikes: 0,
      isFlagged: false
    };
    
    setComments([...comments, newReply]);
    setShowReplyModal(false);
    setReplyingTo(null);
    setReplyContent("");
  };

  const pendingComments = comments.filter(c => c.status === 'pending');
  const approvedComments = comments.filter(c => c.status === 'approved');
  const flaggedComments = comments.filter(c => c.isFlagged);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Comments Management</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Moderate and manage user comments and feedback
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center">
            <MessageSquare className="w-8 h-8 text-slate-600 dark:text-slate-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Comments</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{comments.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">P</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Pending</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{pendingComments.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">A</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Approved</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{approvedComments.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">F</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Flagged</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{flaggedComments.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search comments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="spam">Spam</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedComments.length > 0 && (
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {selectedComments.length} comment(s) selected
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => handleBulkAction('approve')}
                className="px-3 py-1 text-sm bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
              >
                <Check className="w-4 h-4 inline mr-1" />
                Approve
              </button>
              <button
                onClick={() => handleBulkAction('reject')}
                className="px-3 py-1 text-sm bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
              >
                <X className="w-4 h-4 inline mr-1" />
                Reject
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-3 py-1 text-sm bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
              >
                <Trash2 className="w-4 h-4 inline mr-1" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {filteredComments.map((comment) => (
          <div key={comment.id} className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-start space-x-4">
              <input
                type="checkbox"
                checked={selectedComments.includes(comment.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedComments([...selectedComments, comment.id]);
                  } else {
                    setSelectedComments(selectedComments.filter(id => id !== comment.id));
                  }
                }}
                className="mt-1 rounded border-slate-300 text-slate-600 focus:ring-slate-500"
              />
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-slate-300 dark:bg-slate-600 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-900 dark:text-slate-100">
                        {comment.author}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        {comment.authorEmail}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(comment.status)}`}>
                      {comment.status}
                    </span>
                    {comment.isFlagged && (
                      <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-full">
                        <Flag className="w-3 h-3 inline mr-1" />
                        Flagged
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="mb-3">
                  <p className="text-slate-900 dark:text-slate-100">{comment.content}</p>
                </div>
                
                <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 mb-3">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {comment.createdAt}
                    </span>
                    <span className="flex items-center">
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      {comment.likes}
                    </span>
                    <span className="flex items-center">
                      <ThumbsDown className="w-4 h-4 mr-1" />
                      {comment.dislikes}
                    </span>
                  </div>
                  
                  <div className="text-slate-600 dark:text-slate-400">
                    On: <span className="font-medium">{comment.articleTitle}</span>
                  </div>
                </div>
                
                {comment.flaggedReason && (
                  <div className="mb-3 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
                    <p className="text-sm text-red-700 dark:text-red-300">
                      <strong>Flagged Reason:</strong> {comment.flaggedReason}
                    </p>
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
                  {comment.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(comment.id, 'approved')}
                        className="px-3 py-1 text-sm bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
                      >
                        <Check className="w-4 h-4 inline mr-1" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusChange(comment.id, 'rejected')}
                        className="px-3 py-1 text-sm bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                      >
                        <X className="w-4 h-4 inline mr-1" />
                        Reject
                      </button>
                    </>
                  )}
                  
                  <button
                    onClick={() => handleReply(comment)}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                  >
                    <Reply className="w-4 h-4 inline mr-1" />
                    Reply
                  </button>
                  
                  <button
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this comment?")) {
                        setComments(comments.filter(c => c.id !== comment.id));
                      }
                    }}
                    className="px-3 py-1 text-sm bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 inline mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reply Modal */}
      {showReplyModal && replyingTo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-2xl mx-4">
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">
              Reply to {replyingTo.author}
            </h3>
            
            <div className="mb-4 p-3 bg-slate-50 dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                <strong>Original Comment:</strong>
              </p>
              <p className="text-slate-900 dark:text-slate-100">{replyingTo.content}</p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Your Reply
              </label>
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                placeholder="Write your reply..."
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowReplyModal(false);
                  setReplyingTo(null);
                  setReplyContent("");
                }}
                className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitReply}
                disabled={!replyContent.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-slate-900 dark:bg-slate-100 text-slate-900 dark:text-slate-100 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors disabled:opacity-50"
              >
                Submit Reply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

