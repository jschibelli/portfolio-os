import { Building, Clock, DollarSign, ExternalLink, Mail, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';

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
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="text-center">
						<div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-600"></div>
						<p className="mt-4 text-gray-600">Loading leads...</p>
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-gray-50 py-8">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="text-center">
						<div className="rounded-md border border-red-200 bg-red-50 p-4">
							<p className="text-red-800">Error: {error}</p>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900">Leads</h1>
					<p className="mt-2 text-gray-600">Manage client leads and project inquiries</p>
				</div>

				<div className="grid gap-6">
					{leads.length === 0 ? (
						<Card>
							<CardContent className="p-8 text-center">
								<User className="mx-auto mb-4 h-12 w-12 text-gray-400" />
								<h3 className="mb-2 text-lg font-medium text-gray-900">No leads yet</h3>
								<p className="text-gray-600">
									When users submit project inquiries through the chatbot, they&apos;ll appear here.
								</p>
							</CardContent>
						</Card>
					) : (
						leads.map((lead) => {
							const links = parseLinks(lead.links);
							return (
								<Card key={lead.id} className="transition-shadow hover:shadow-md">
									<CardHeader>
										<div className="flex items-center justify-between">
											<div className="flex items-center space-x-3">
												<User className="h-5 w-5 text-gray-400" />
												<div>
													<CardTitle className="text-lg">{lead.name}</CardTitle>
													<div className="flex items-center space-x-4 text-sm text-gray-600">
														<div className="flex items-center space-x-1">
															<Mail className="h-4 w-4" />
															<span>{lead.email}</span>
														</div>
														{lead.company && (
															<div className="flex items-center space-x-1">
																<Building className="h-4 w-4" />
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
												<h4 className="mb-1 font-medium text-gray-900">Project</h4>
												<p className="text-gray-700">{lead.project}</p>
											</div>

											<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
												{lead.budget && (
													<div className="flex items-center space-x-2 text-sm">
														<DollarSign className="h-4 w-4 text-gray-400" />
														<span className="font-medium">Budget:</span>
														<span>{lead.budget}</span>
													</div>
												)}
												{lead.timeline && (
													<div className="flex items-center space-x-2 text-sm">
														<Clock className="h-4 w-4 text-gray-400" />
														<span className="font-medium">Timeline:</span>
														<span>{lead.timeline}</span>
													</div>
												)}
												{lead.role && (
													<div className="flex items-center space-x-2 text-sm">
														<User className="h-4 w-4 text-gray-400" />
														<span className="font-medium">Role:</span>
														<span>{lead.role}</span>
													</div>
												)}
											</div>

											{links.length > 0 && (
												<div>
													<h4 className="mb-2 font-medium text-gray-900">Links</h4>
													<div className="flex flex-wrap gap-2">
														{links.map((link, index) => (
															<Button key={index} variant="outline" size="sm" asChild>
																<a href={link} target="_blank" rel="noopener noreferrer">
																	<ExternalLink className="mr-1 h-3 w-3" />
																	Link {index + 1}
																</a>
															</Button>
														))}
													</div>
												</div>
											)}

											{lead.notes && (
												<div>
													<h4 className="mb-1 font-medium text-gray-900">Notes</h4>
													<p className="text-sm text-gray-700">{lead.notes}</p>
												</div>
											)}

											{lead.summary && (
												<div>
													<h4 className="mb-1 font-medium text-gray-900">AI Summary</h4>
													<p className="rounded border bg-gray-50 p-3 text-sm text-gray-700">
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
