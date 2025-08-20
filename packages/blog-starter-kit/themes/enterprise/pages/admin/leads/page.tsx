import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Building, Mail, User, DollarSign, Clock, ExternalLink } from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  email: string;
  company: string | null;
  role: string | null;
  project: string;
  budget: string | null;
  timeline: string | null;
  links: string; // JSON string
  notes: string | null;
  status: string;
  summary: string | null;
  createdAt: string;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await fetch('/api/admin/leads');
        if (!response.ok) {
          throw new Error('Failed to fetch leads');
        }
        const data = await response.json();
        setLeads(data.leads || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch leads');
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW':
        return 'bg-blue-100 text-blue-800';
      case 'CONTACTED':
        return 'bg-yellow-100 text-yellow-800';
      case 'QUALIFIED':
        return 'bg-green-100 text-green-800';
      case 'PROPOSAL_SENT':
        return 'bg-purple-100 text-purple-800';
      case 'CLOSED_WON':
        return 'bg-green-100 text-green-800';
      case 'CLOSED_LOST':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const parseLinks = (linksString: string): string[] => {
    try {
      const links = JSON.parse(linksString);
      return Array.isArray(links) ? links : [];
    } catch {
      return [];
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading leads...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-800">Error: {error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
          <p className="text-gray-600 mt-2">Manage client leads and project inquiries</p>
        </div>

        <div className="grid gap-6">
          {leads.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <User className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No leads yet</h3>
                <p className="text-gray-600">When users submit project inquiries through the chatbot, they&apos;ll appear here.</p>
              </CardContent>
            </Card>
          ) : (
            leads.map((lead) => {
              const links = parseLinks(lead.links);
              return (
                <Card key={lead.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <User className="w-5 h-5 text-gray-400" />
                        <div>
                          <CardTitle className="text-lg">{lead.name}</CardTitle>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Mail className="w-4 h-4" />
                              <span>{lead.email}</span>
                            </div>
                            {lead.company && (
                              <div className="flex items-center space-x-1">
                                <Building className="w-4 h-4" />
                                <span>{lead.company}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <Badge className={getStatusColor(lead.status)}>
                        {lead.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Project</h4>
                        <p className="text-gray-700">{lead.project}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {lead.budget && (
                          <div className="flex items-center space-x-2 text-sm">
                            <DollarSign className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">Budget:</span>
                            <span>{lead.budget}</span>
                          </div>
                        )}
                        {lead.timeline && (
                          <div className="flex items-center space-x-2 text-sm">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">Timeline:</span>
                            <span>{lead.timeline}</span>
                          </div>
                        )}
                        {lead.role && (
                          <div className="flex items-center space-x-2 text-sm">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">Role:</span>
                            <span>{lead.role}</span>
                          </div>
                        )}
                      </div>

                      {links.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Links</h4>
                          <div className="flex flex-wrap gap-2">
                            {links.map((link, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                asChild
                              >
                                <a href={link} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="w-3 h-3 mr-1" />
                                  Link {index + 1}
                                </a>
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}

                      {lead.notes && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">Notes</h4>
                          <p className="text-gray-700 text-sm">{lead.notes}</p>
                        </div>
                      )}

                      {lead.summary && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">AI Summary</h4>
                          <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded border">
                            {lead.summary}
                          </p>
                        </div>
                      )}

                      <div className="text-sm text-gray-500">
                        Submitted on {new Date(lead.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
