import { Calendar, Clock, Mail, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '../../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';

interface Booking {
	id: string;
	name: string;
	email: string;
	timezone: string;
	startTime: string;
	endTime: string;
	meetingType: string | null;
	notes: string | null;
	status: string;
	createdAt: string;
}

export default function BookingsPage() {
	const [bookings, setBookings] = useState<Booking[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchBookings = async () => {
			try {
				const response = await fetch('/api/admin/bookings');
				if (!response.ok) {
					throw new Error('Failed to fetch bookings');
				}
				const data = await response.json();
				setBookings(data.bookings || []);
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Failed to fetch bookings');
			} finally {
				setLoading(false);
			}
		};

		fetchBookings();
	}, []);

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'CONFIRMED':
				return 'bg-green-100 text-green-800';
			case 'PENDING':
				return 'bg-yellow-100 text-yellow-800';
			case 'CANCELLED':
				return 'bg-red-100 text-red-800';
			case 'COMPLETED':
				return 'bg-blue-100 text-blue-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	const formatDateTime = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleString('en-US', {
			weekday: 'short',
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 py-8">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="text-center">
						<div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-600"></div>
						<p className="mt-4 text-gray-600">Loading bookings...</p>
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
					<h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
					<p className="mt-2 text-gray-600">Manage meeting bookings and appointments</p>
				</div>

				<div className="grid gap-6">
					{bookings.length === 0 ? (
						<Card>
							<CardContent className="p-8 text-center">
								<Calendar className="mx-auto mb-4 h-12 w-12 text-gray-400" />
								<h3 className="mb-2 text-lg font-medium text-gray-900">No bookings yet</h3>
								<p className="text-gray-600">
									When users book meetings through the chatbot, they&apos;ll appear here.
								</p>
							</CardContent>
						</Card>
					) : (
						bookings.map((booking) => (
							<Card key={booking.id} className="transition-shadow hover:shadow-md">
								<CardHeader>
									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-3">
											<User className="h-5 w-5 text-gray-400" />
											<div>
												<CardTitle className="text-lg">{booking.name}</CardTitle>
												<div className="flex items-center space-x-2 text-sm text-gray-600">
													<Mail className="h-4 w-4" />
													<span>{booking.email}</span>
												</div>
											</div>
										</div>
										<Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
									</div>
								</CardHeader>
								<CardContent>
									<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
										<div className="space-y-2">
											<div className="flex items-center space-x-2 text-sm">
												<Calendar className="h-4 w-4 text-gray-400" />
												<span className="font-medium">Date & Time:</span>
												<span>{formatDateTime(booking.startTime)}</span>
											</div>
											<div className="flex items-center space-x-2 text-sm">
												<Clock className="h-4 w-4 text-gray-400" />
												<span className="font-medium">Duration:</span>
												<span>
													{Math.round(
														(new Date(booking.endTime).getTime() -
															new Date(booking.startTime).getTime()) /
															(1000 * 60),
													)}{' '}
													minutes
												</span>
											</div>
											<div className="text-sm">
												<span className="font-medium">Timezone:</span> {booking.timezone}
											</div>
											{booking.meetingType && (
												<div className="text-sm">
													<span className="font-medium">Type:</span> {booking.meetingType}
												</div>
											)}
										</div>
										<div>
											{booking.notes && (
												<div className="text-sm">
													<span className="font-medium">Notes:</span>
													<p className="mt-1 text-gray-600">{booking.notes}</p>
												</div>
											)}
											<div className="mt-2 text-sm text-gray-500">
												Booked on {new Date(booking.createdAt).toLocaleDateString()}
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						))
					)}
				</div>
			</div>
		</div>
	);
}
