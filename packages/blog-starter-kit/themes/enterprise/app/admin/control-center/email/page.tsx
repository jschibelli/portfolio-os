'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Mail, Star, Clock, Send, RefreshCw, Loader2, Trash2, Archive, 
  Reply, Forward, Eye, EyeOff, FolderOpen, Inbox, Send as SendIcon,
  AlertTriangle, FileText, ChevronDown
} from 'lucide-react';
// import { toast } from 'sonner';
const toast = (message: string) => console.log('Toast:', message);

interface Email {
  id: string;
  subject: string;
  from: string;
  to?: string;
  snippet: string;
  body?: string;
  bodyHtml?: string;
  bodyText?: string;
  date: string;
  internalDate: string;
  isRead: boolean;
  isStarred: boolean;
  folder: 'inbox' | 'sent' | 'spam' | 'trash' | 'drafts';
  attachments?: Array<{ name: string; size: string; type: string }>;
}

interface Folder {
  id: string;
  name: string;
  icon: React.ReactNode;
  count: number;
  unreadCount: number;
}

const EmailPage = () => {
  const [emails, setEmails] = useState<{ [key: string]: Email[] }>({
    inbox: [],
    sent: [],
    spam: [],
    trash: [],
    drafts: [],
  });
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<string>('inbox');
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [composeForm, setComposeForm] = useState({
    to: '',
    subject: '',
    message: '',
  });
  const [nextPageTokens, setNextPageTokens] = useState<{ [key: string]: string | undefined }>({
    inbox: undefined,
    sent: undefined,
    spam: undefined,
    trash: undefined,
    drafts: undefined,
  });

  // Convert folders to state so counts can be updated
  const [folders, setFolders] = useState<Folder[]>([
    { id: 'inbox', name: 'Inbox', icon: <Inbox className="h-4 w-4" />, count: 0, unreadCount: 0 },
    { id: 'sent', name: 'Sent', icon: <SendIcon className="h-4 w-4" />, count: 0, unreadCount: 0 },
    { id: 'drafts', name: 'Drafts', icon: <FileText className="h-4 w-4" />, count: 0, unreadCount: 0 },
    { id: 'spam', name: 'Spam', icon: <AlertTriangle className="h-4 w-4" />, count: 0, unreadCount: 0 },
    { id: 'trash', name: 'Trash', icon: <Trash2 className="h-4 w-4" />, count: 0, unreadCount: 0 },
  ]);

  // Helper function to update folder counts
  const updateFolderCounts = (emailData: { [key: string]: Email[] }) => {
    const updatedFolders = folders.map(folder => {
      const folderEmails = emailData[folder.id] || [];
      const count = folderEmails.length;
      const unreadCount = folderEmails.filter(e => !e.isRead).length;
      
      console.log(`updateFolderCounts: ${folder.id} = ${count} emails, ${unreadCount} unread`);
      
      return {
        ...folder,
        count,
        unreadCount,
      };
    });
    
    console.log('updateFolderCounts: Setting new folders:', updatedFolders);
    setFolders(updatedFolders);
  };

  // Helper function to format date properly
  const formatDate = (internalDate: string) => {
    try {
      if (!internalDate) return 'Unknown date';
      
      // Convert milliseconds to date
      const date = new Date(parseInt(internalDate));
      
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      
      const now = new Date();
      const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
      
      if (diffInHours < 1) {
        return 'Just now';
      } else if (diffInHours < 24) {
        return `${Math.floor(diffInHours)} hour${Math.floor(diffInHours) !== 1 ? 's' : ''} ago`;
      } else if (diffInHours < 48) {
        return 'Yesterday';
      } else {
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
      }
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Fetch emails from API
  const fetchEmails = async (pageToken?: string, isLoadMore: boolean = false) => {
    if (!isLoadMore) {
      setLoading(true);
    }
    
    try {
      // Fetch emails for all folders
      const folderPromises = folders.map(async (folder) => {
        try {
          const response = await fetch(`/api/gmail/list?folder=${folder.id}&limit=20${pageToken ? `&pageToken=${pageToken}` : ''}`);
          if (response.ok) {
            const data = await response.json();
            console.log(`Raw API response for ${folder.id}:`, data);
            
            return {
              folder: folder.id,
              emails: data.messages?.map((msg: any) => {
                console.log(`Processing message in ${folder.id}:`, msg);
                return {
                  id: msg.id,
                  subject: msg.subject || '(No Subject)',
                  from: msg.from || 'Unknown',
                  to: msg.to || '',
                  snippet: msg.snippet || '',
                  body: msg.body || '',
                  bodyHtml: msg.bodyHtml || '',
                  bodyText: msg.bodyText || '',
                  date: formatDate(msg.internalDate),
                  internalDate: msg.internalDate,
                  isRead: msg.isRead !== undefined ? msg.isRead : true,
                  isStarred: msg.isStarred || false,
                  folder: folder.id as Email['folder'],
                  attachments: msg.attachments || [],
                };
              }) || [],
              nextPageToken: data.nextPageToken,
            };
          }
        } catch (error) {
          console.warn(`Failed to fetch ${folder.id} emails:`, error);
        }
        return { folder: folder.id, emails: [], nextPageToken: undefined };
      });

      const results = await Promise.allSettled(folderPromises);
      const newEmails: { [key: string]: Email[] } = { inbox: [], sent: [], spam: [], trash: [], drafts: [] };
      const nextPageTokens: { [key: string]: string | undefined } = { inbox: undefined, sent: undefined, spam: undefined, trash: undefined, drafts: undefined };
      
      results.forEach((result) => {
        if (result.status === 'fulfilled' && result.value) {
          if (isLoadMore) {
            // Append to existing emails
            newEmails[result.value.folder] = [...(emails[result.value.folder] || []), ...result.value.emails];
          } else {
            // Replace existing emails
            newEmails[result.value.folder] = result.value.emails;
          }
          nextPageTokens[result.value.folder] = result.value.nextPageToken;
        }
      });

      // If no emails fetched, show demo data
      const hasRealData = Object.values(newEmails).some(folderEmails => folderEmails.length > 0);
      if (!hasRealData && !isLoadMore) {
        console.warn('API not configured yet, showing demo data');
        newEmails.inbox = [
          {
            id: 'demo-1',
            subject: 'Welcome to Creator Cockpit!',
            from: 'team@creatorcockpit.com',
            to: 'you@example.com',
            snippet: 'Your email integration is ready to configure...',
            body: '<p>Welcome to Creator Cockpit!</p><p>Your email integration is ready to configure. Once you set up Gmail OAuth, you\'ll be able to:</p><ul><li>Read and manage emails</li><li>Send and schedule emails</li><li>Organize emails into folders</li><li>Search and filter emails</li></ul>',
            bodyHtml: '<p>Welcome to Creator Cockpit!</p><p>Your email integration is ready to configure. Once you set up Gmail OAuth, you\'ll be able to:</p><ul><li>Read and manage emails</li><li>Send and schedule emails</li><li>Organize emails into folders</li><li>Search and filter emails</li></ul>',
            bodyText: 'Welcome to Creator Cockpit! Your email integration is ready to configure. Once you set up Gmail OAuth, you\'ll be able to: Read and manage emails, Send and schedule emails, Organize emails into folders, Search and filter emails',
            date: 'Just now',
            internalDate: Date.now().toString(),
            isRead: false,
            isStarred: true,
            folder: 'inbox',
            attachments: [],
          },
          {
            id: 'demo-2',
            subject: 'Setup Required: Gmail OAuth',
            from: 'system@creatorcockpit.com',
            to: 'you@example.com',
            snippet: 'Configure your Gmail integration to start managing emails...',
            body: '<p>To get started with real email functionality:</p><ol><li>Set up Gmail OAuth in your environment variables</li><li>Configure the necessary scopes</li><li>Test the integration</li></ol>',
            bodyHtml: '<p>To get started with real email functionality:</p><ol><li>Set up Gmail OAuth in your environment variables</li><li>Configure the necessary scopes</li><li>Test the integration</li></ol>',
            bodyText: 'To get started with real email functionality: Set up Gmail OAuth in your environment variables, Configure the necessary scopes, Test the integration',
            date: '1 minute ago',
            internalDate: (Date.now() - 60000).toString(),
            isRead: false,
            isStarred: false,
            folder: 'inbox',
            attachments: [],
          },
          {
            id: 'demo-3',
            subject: 'Creator Cockpit Features',
            from: 'features@creatorcockpit.com',
            to: 'you@example.com',
            snippet: 'Learn about all the amazing features available in your control center...',
            body: '<p>Creator Cockpit includes:</p><ul><li>Email management with folders</li><li>Social media scheduling</li><li>Calendar integration</li><li>Analytics dashboard</li><li>And much more!</li></ul>',
            bodyHtml: '<p>Creator Cockpit includes:</p><ul><li>Email management with folders</li><li>Social media scheduling</li><li>Calendar integration</li><li>Analytics dashboard</li><li>And much more!</li></ul>',
            bodyText: 'Creator Cockpit includes: Email management with folders, Social media scheduling, Calendar integration, Analytics dashboard, And much more!',
            date: '5 minutes ago',
            internalDate: (Date.now() - 300000).toString(),
            isRead: true,
            isStarred: false,
            folder: 'inbox',
            attachments: [],
          }
        ];
        newEmails.sent = [
          {
            id: 'demo-sent-1',
            subject: 'Re: Project Update',
            from: 'you@example.com',
            to: 'client@example.com',
            snippet: 'Here\'s the latest update on our project...',
            body: '<p>Hi Client,</p><p>Here\'s the latest update on our project. We\'ve made significant progress...</p>',
            bodyHtml: '<p>Hi Client,</p><p>Here\'s the latest update on our project. We\'ve made significant progress...</p>',
            bodyText: 'Hi Client, Here\'s the latest update on our project. We\'ve made significant progress...',
            date: '2 hours ago',
            internalDate: (Date.now() - 7200000).toString(),
            isRead: true,
            isStarred: false,
            folder: 'sent',
            attachments: [],
          }
        ];
        newEmails.drafts = [
          {
            id: 'demo-draft-1',
            subject: 'New Project Proposal',
            from: 'you@example.com',
            to: 'prospect@example.com',
            snippet: 'I\'d like to discuss a new project opportunity...',
            body: '<p>Hi Prospect,</p><p>I\'d like to discuss a new project opportunity that I think would be perfect for your business...</p>',
            bodyHtml: '<p>Hi Prospect,</p><p>I\'d like to discuss a new project opportunity that I think would be perfect for your business...</p>',
            bodyText: 'Hi Prospect, I\'d like to discuss a new project opportunity that I think would be perfect for your business...',
            date: '1 day ago',
            internalDate: (Date.now() - 86400000).toString(),
            isRead: true,
            isStarred: false,
            folder: 'drafts',
            attachments: [],
          }
        ];
        toast.info('Showing demo data - configure your Gmail integration to see real emails');
      }

      setEmails(newEmails);
      
      // Update folder counts based on fetched emails
      const updatedFolders = folders.map(folder => {
        const folderEmails = newEmails[folder.id] || [];
        const count = folderEmails.length;
        const unreadCount = folderEmails.filter(e => !e.isRead).length;
        
        console.log(`Folder ${folder.id}: ${count} emails, ${unreadCount} unread`);
        
        return {
          ...folder,
          count,
          unreadCount,
        };
      });
      
      console.log('Updating folder counts:', updatedFolders);
      setFolders(updatedFolders);
      
      // Store next page tokens for pagination
      if (!isLoadMore) {
        setNextPageTokens(nextPageTokens);
      } else {
        setNextPageTokens(prev => ({ ...prev, ...nextPageTokens }));
      }
    } catch (error) {
      console.error('Error fetching emails:', error);
      toast.error('Failed to fetch emails');
    } finally {
      setLoading(false);
    }
  };

  // Load more emails for current folder
  const loadMoreEmails = async () => {
    const currentToken = nextPageTokens[selectedFolder];
    if (currentToken) {
      await fetchEmails(currentToken, true);
    }
  };

  // Open email for reading
  const openEmail = (email: Email) => {
    setSelectedEmail(email);
    setEmailDialogOpen(true);
    
    // Mark as read if it's unread
    if (!email.isRead) {
      // Update local state immediately for better UX
      setEmails(prev => {
        const newEmails = {
          ...prev,
          [selectedFolder]: prev[selectedFolder].map(e =>
            e.id === email.id ? { ...e, isRead: true } : e
          )
        };
        
        // Update folder counts (unread count changed)
        updateFolderCounts(newEmails);
        
        return newEmails;
      });
      
      // Also call the API
      markEmailAsRead(email.id);
    }
  };

  // Mark email as read
  const markEmailAsRead = async (emailId: string) => {
    try {
      const response = await fetch(`/api/gmail/mark-read`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: emailId }),
      });

      if (response.ok) {
        // Update local state
        setEmails(prev => {
          const newEmails = {
            ...prev,
            [selectedFolder]: prev[selectedFolder].map(email =>
              email.id === emailId ? { ...email, isRead: true } : email
            )
          };
          
          // Update folder counts (unread count changed)
          updateFolderCounts(newEmails);
          
          return newEmails;
        });
      }
    } catch (error) {
      console.error('Error marking email as read:', error);
    }
  };

  // Delete email (move to trash)
  const deleteEmail = async (emailId: string) => {
    try {
      const response = await fetch(`/api/gmail/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: emailId }),
      });

      if (response.ok) {
        // Move email to trash
        const emailToMove = emails[selectedFolder].find(e => e.id === emailId);
        if (emailToMove) {
          const updatedEmail = { ...emailToMove, folder: 'trash' as Email['folder'] };
          
          setEmails(prev => {
            const newEmails = {
              ...prev,
              [selectedFolder]: prev[selectedFolder].filter(e => e.id !== emailId),
              trash: [...prev.trash, updatedEmail],
            };
            
            // Update folder counts
            updateFolderCounts(newEmails);
            
            return newEmails;
          });
          
          toast.success('Email moved to trash');
        }
      } else {
        throw new Error('Failed to delete email');
      }
    } catch (error) {
      console.error('Error deleting email:', error);
      toast.error('API not configured yet - this is demo mode');
      
      // For demo mode, just move to trash locally
      const emailToMove = emails[selectedFolder].find(e => e.id === emailId);
      if (emailToMove) {
        const updatedEmail = { ...emailToMove, folder: 'trash' as Email['folder'] };
        
        setEmails(prev => {
          const newEmails = {
            ...prev,
            [selectedFolder]: prev[selectedFolder].filter(e => e.id !== emailId),
            trash: [...prev.trash, updatedEmail],
          };
          
          // Update folder counts
          updateFolderCounts(newEmails);
          
          return newEmails;
        });
        
        toast.success('Email moved to trash (demo mode)');
      }
    }
  };

  // Permanently delete from trash
  const permanentlyDelete = async (emailId: string) => {
    try {
      const response = await fetch(`/api/gmail/permanently-delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: emailId }),
      });

      if (response.ok) {
        setEmails(prev => {
          const newEmails = {
            ...prev,
            trash: prev.trash.filter(e => e.id !== emailId),
          };
          
          // Update folder counts
          updateFolderCounts(newEmails);
          
          return newEmails;
        });
        toast.success('Email permanently deleted');
      } else {
        throw new Error('Failed to permanently delete email');
      }
    } catch (error) {
      console.error('Error permanently deleting email:', error);
      toast.error('API not configured yet - this is demo mode');
      
      // For demo mode, just remove locally
              setEmails(prev => {
          const newEmails = {
            ...prev,
            trash: prev.trash.filter(e => e.id !== emailId),
          };
          
          // Update folder counts
          updateFolderCounts(newEmails);
          
          return newEmails;
        });
        toast.success('Email permanently deleted (demo mode)');
    }
  };

  // Restore email from trash
  const restoreEmail = async (emailId: string) => {
    try {
      const response = await fetch(`/api/gmail/restore`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: emailId }),
      });

      if (response.ok) {
        // Move email back to inbox
        const emailToRestore = emails.trash.find(e => e.id === emailId);
        if (emailToRestore) {
          const updatedEmail = { ...emailToRestore, folder: 'inbox' as Email['folder'] };
          
          setEmails(prev => {
            const newEmails = {
              ...prev,
              trash: prev.trash.filter(e => e.id !== emailId),
              inbox: [...prev.inbox, updatedEmail],
            };
            
            // Update folder counts
            updateFolderCounts(newEmails);
            
            return newEmails;
          });
          
          toast.success('Email restored to inbox');
        }
      } else {
        throw new Error('Failed to restore email');
      }
    } catch (error) {
      console.error('Error restoring email:', error);
      toast.error('API not configured yet - this is demo mode');
      
      // For demo mode, just restore locally
      const emailToRestore = emails.trash.find(e => e.id === emailId);
      if (emailToRestore) {
        const updatedEmail = { ...emailToRestore, folder: 'inbox' as Email['folder'] };
        
        setEmails(prev => {
          const newEmails = {
            ...prev,
            trash: prev.trash.filter(e => e.id !== emailId),
            inbox: [...prev.inbox, updatedEmail],
          };
          
          // Update folder counts
          updateFolderCounts(newEmails);
          
          return newEmails;
        });
        
        toast.success('Email restored to inbox (demo mode)');
      }
    }
  };

  // Toggle star
  const toggleStar = async (emailId: string) => {
    try {
      const email = emails[selectedFolder].find(e => e.id === emailId);
      if (!email) return;

      const response = await fetch(`/api/gmail/toggle-star`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: emailId }),
      });

      if (response.ok) {
        setEmails(prev => {
          const newEmails = {
            ...prev,
            [selectedFolder]: prev[selectedFolder].map(e =>
              e.id === emailId ? { ...e, isStarred: !e.isStarred } : e
            )
          };
          
          // Update folder counts
          updateFolderCounts(newEmails);
          
          return newEmails;
        });
      } else {
        throw new Error('Failed to toggle star');
      }
    } catch (error) {
      console.error('Error toggling star:', error);
      toast.error('API not configured yet - this is demo mode');
      
      // For demo mode, just toggle locally
      setEmails(prev => {
        const newEmails = {
          ...prev,
          [selectedFolder]: prev[selectedFolder].map(e =>
            e.id === emailId ? { ...e, isStarred: !e.isStarred } : e
          )
        };
        
        // Update folder counts
        updateFolderCounts(newEmails);
        
        return newEmails;
      });
    }
  };

  // Send email
  const sendEmail = async () => {
    if (!composeForm.to || !composeForm.subject || !composeForm.message) {
      toast.error('Please fill in all fields');
      return;
    }

    setSending(true);
    try {
      const response = await fetch('/api/gmail/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: composeForm.to,
          subject: composeForm.subject,
          bodyText: composeForm.message,
        }),
      });

      if (response.ok) {
        toast.success('Email sent successfully!');
        setComposeForm({ to: '', subject: '', message: '' });
        // Refresh emails to show the new one
        fetchEmails();
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('API not configured yet - this is demo mode');
    } finally {
      setSending(false);
    }
  };

  // Schedule email (creates a job)
  const scheduleEmail = async () => {
    if (!composeForm.to || !composeForm.subject || !composeForm.message) {
      toast.error('Please fill in all fields');
      return;
    }

    // For now, schedule for 1 hour from now
    const scheduledTime = new Date(Date.now() + 60 * 60 * 1000);
    
    try {
      const response = await fetch('/api/gmail/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: composeForm.to,
          subject: composeForm.subject,
          bodyText: composeForm.message,
          scheduledAt: scheduledTime.toISOString(),
        }),
      });

      if (response.ok) {
        toast.success('Email scheduled successfully!');
        setComposeForm({ to: '', subject: '', message: '' });
      } else {
        throw new Error('Failed to schedule email');
      }
    } catch (error) {
      console.error('Error scheduling email:', error);
      toast.error('API not configured yet - this is demo mode');
    } finally {
      setSending(false);
    }
  };



  useEffect(() => {
    fetchEmails();
  }, []);

  const currentEmails = emails[selectedFolder] || [];
  const hasMoreEmails = !!nextPageTokens[selectedFolder];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Email Management</h1>
          <p className="text-muted-foreground">
            Manage your emails across all folders, read messages, and organize your inbox.
          </p>
        </div>
        <Button onClick={() => fetchEmails()} disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Refresh
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {/* Folder Navigation */}
        <div className="space-y-2">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Folders</h3>
          {folders.map((folder) => (
            <div
              key={folder.id}
              className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                selectedFolder === folder.id
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted/50'
              }`}
              onClick={() => setSelectedFolder(folder.id)}
            >
              <div className="flex items-center gap-3">
                {folder.icon}
                <span className="font-medium">{folder.name}</span>
              </div>
              <div className="flex items-center gap-2">
                {folder.unreadCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {folder.unreadCount}
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground">
                  {folder.count}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Email List */}
        <div className="md:col-span-2 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold capitalize">{selectedFolder}</h3>
            <span className="text-sm text-muted-foreground">
              {currentEmails.length} emails
            </span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : currentEmails.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                No emails in {selectedFolder}
              </CardContent>
            </Card>
          ) : (
            <>
              {currentEmails.map((email) => (
                <Card 
                  key={email.id} 
                  className={`cursor-pointer hover:bg-muted/50 transition-colors ${
                    !email.isRead ? 'border-l-4 border-l-primary' : ''
                  }`}
                  onClick={() => openEmail(email)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <div className={`font-medium ${!email.isRead ? 'font-semibold' : ''}`}>
                            {email.subject}
                          </div>
                          {email.isStarred && (
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {selectedFolder === 'sent' ? `To: ${email.to}` : `From: ${email.from}`}
                        </div>
                        <div className="text-sm">{email.snippet}</div>
                        {email.attachments && email.attachments.length > 0 && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <FileText className="h-3 w-3" />
                            {email.attachments.length} attachment{email.attachments.length !== 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{email.date}</Badge>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleStar(email.id);
                            }}
                            className={email.isStarred ? 'text-yellow-500' : ''}
                          >
                            <Star className="h-4 w-4" />
                          </Button>
                          {selectedFolder !== 'trash' ? (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteEmail(email.id);
                              }}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          ) : (
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  restoreEmail(email.id);
                                }}
                                className="text-green-500 hover:text-green-700"
                              >
                                <Archive className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  permanentlyDelete(email.id);
                                }}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {/* Load More Button */}
              {hasMoreEmails && (
                <div className="flex justify-center pt-4">
                  <Button 
                    variant="outline" 
                    onClick={loadMoreEmails}
                    className="flex items-center gap-2"
                  >
                    <ChevronDown className="h-4 w-4" />
                    Load More Emails
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Quick Reply */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                Quick Reply
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="to" className="text-sm font-medium">To</label>
                <Input 
                  id="to" 
                  placeholder="recipient@example.com"
                  value={composeForm.to}
                  onChange={(e) => setComposeForm(prev => ({ ...prev, to: e.target.value }))}
                />
              </div>
              <div>
                <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                <Input 
                  id="subject" 
                  placeholder="Subject"
                  value={composeForm.subject}
                  onChange={(e) => setComposeForm(prev => ({ ...prev, subject: e.target.value }))}
                />
              </div>
              <div>
                <label htmlFor="message" className="text-sm font-medium">Message</label>
                <Textarea 
                  id="message" 
                  placeholder="Type your message here..." 
                  rows={4}
                  value={composeForm.message}
                  onChange={(e) => setComposeForm(prev => ({ ...prev, message: e.target.value }))}
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  className="flex-1" 
                  onClick={sendEmail}
                  disabled={sending}
                >
                  {sending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  Send
                </Button>
                <Button 
                  variant="outline" 
                  onClick={scheduleEmail}
                  disabled={sending}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Email Reading Dialog */}
      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{selectedEmail?.subject}</span>
              <div className="flex items-center gap-2">
                {selectedEmail && (
                  <>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleStar(selectedEmail.id)}
                      className={selectedEmail.isStarred ? 'text-yellow-500' : ''}
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        // TODO: Implement reply functionality
                        toast.info('Reply functionality coming soon!');
                      }}
                    >
                      <Reply className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        // TODO: Implement forward functionality
                        toast.info('Forward functionality coming soon!');
                      }}
                    >
                      <Forward className="h-4 w-4" />
                    </Button>
                    {selectedFolder !== 'trash' ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          deleteEmail(selectedEmail.id);
                          setEmailDialogOpen(false);
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    ) : (
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            restoreEmail(selectedEmail.id);
                            setEmailDialogOpen(false);
                          }}
                          className="text-green-500 hover:text-green-700"
                        >
                          <Archive className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            permanentlyDelete(selectedEmail.id);
                            setEmailDialogOpen(false);
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </DialogTitle>
          </DialogHeader>
          {selectedEmail && (
            <div className="space-y-4">
              <div className="border-b pb-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">From:</span> {selectedEmail.from}
                  </div>
                  <div>
                    <span className="font-medium">To:</span> {selectedEmail.to || 'N/A'}
                  </div>
                  <div>
                    <span className="font-medium">Date:</span> {selectedEmail.date}
                  </div>
                  <div>
                    <span className="font-medium">Folder:</span> {selectedEmail.folder}
                  </div>
                </div>
              </div>
              
              {selectedEmail.attachments && selectedEmail.attachments.length > 0 && (
                <div className="border-b pb-4">
                  <h4 className="font-medium mb-2">Attachments:</h4>
                  <div className="space-y-2">
                    {selectedEmail.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                        <FileText className="h-4 w-4" />
                        <span className="text-sm">{attachment.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {attachment.size}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="prose max-w-none">
                {selectedEmail.bodyHtml ? (
                  <div 
                    dangerouslySetInnerHTML={{ __html: selectedEmail.bodyHtml }}
                    className="text-sm leading-relaxed"
                  />
                ) : selectedEmail.bodyText ? (
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">
                    {selectedEmail.bodyText}
                  </div>
                ) : (
                  <p className="text-muted-foreground">{selectedEmail.snippet}</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmailPage;
