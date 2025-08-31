'use client';

import { Calendar, Check, Clock, MapPin, User, X } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';

interface BookingConfirmationModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	bookingDetails: {
		name: string;
		email: string;
		timezone: string;
		startTime: string;
		endTime: string;
		duration: number;
		meetingType?: string;
	};
	isLoading?: boolean;
}

export function BookingConfirmationModal({
	isOpen,
	onClose,
	onConfirm,
	bookingDetails,
	isLoading = false,
}: BookingConfirmationModalProps) {
	if (!isOpen) return null;

	const formatDateTime = (dateString: string, timezone: string) => {
		const date = new Date(dateString);
		return date.toLocaleString('en-US', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: 'numeric',
			minute: '2-digit',
			timeZone: timezone,
			timeZoneName: 'short',
		});
	};

	const formatTime = (dateString: string, timezone: string) => {
		const date = new Date(dateString);
		return date.toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: '2-digit',
			timeZone: timezone,
		});
	};

	const formatDate = (dateString: string, timezone: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			timeZone: timezone,
		});
	};

	return (
		<div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center duration-300">
			{/* Backdrop */}
			<div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

			{/* Modal */}
			<Card className="animate-in slide-in-from-bottom-4 mx-4 w-full max-w-md duration-300 ease-out">
				<CardHeader className="pb-4 text-center">
					<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
						<Calendar className="h-6 w-6 text-green-600" />
					</div>
					<CardTitle className="text-xl font-semibold text-gray-900">
						Confirm Your Booking
					</CardTitle>
					<p className="mt-2 text-sm text-gray-600">
						Please review your meeting details before confirming
					</p>
				</CardHeader>

				<CardContent className="space-y-6">
					{/* Meeting Details */}
					<div className="space-y-4">
						<div className="flex items-start space-x-3 rounded-lg bg-gray-50 p-3">
							<Clock className="mt-0.5 h-5 w-5 text-blue-600" />
							<div className="flex-1">
								<p className="font-medium text-gray-900">
									{formatDate(bookingDetails.startTime, bookingDetails.timezone)}
								</p>
								<p className="text-sm text-gray-600">
									{formatTime(bookingDetails.startTime, bookingDetails.timezone)} -{' '}
									{formatTime(bookingDetails.endTime, bookingDetails.timezone)}
								</p>
								<p className="mt-1 text-xs text-gray-500">
									Duration: {bookingDetails.duration} minutes
								</p>
							</div>
						</div>

						<div className="flex items-start space-x-3 rounded-lg bg-gray-50 p-3">
							<User className="mt-0.5 h-5 w-5 text-green-600" />
							<div className="flex-1">
								<p className="font-medium text-gray-900">{bookingDetails.name}</p>
								<p className="text-sm text-gray-600">{bookingDetails.email}</p>
							</div>
						</div>

						<div className="flex items-start space-x-3 rounded-lg bg-gray-50 p-3">
							<MapPin className="mt-0.5 h-5 w-5 text-purple-600" />
							<div className="flex-1">
								<p className="font-medium text-gray-900">Meeting Type</p>
								<p className="text-sm text-gray-600">
									{bookingDetails.meetingType || 'Consultation'}
								</p>
								<p className="mt-1 text-xs text-gray-500">
									Google Meet link will be available in the calendar event
								</p>
							</div>
						</div>
					</div>

					{/* Confirmation Message */}
					<div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
						<div className="flex items-start space-x-2">
							<Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
							<div>
								<p className="text-sm font-medium text-blue-900">What happens next:</p>
								<ul className="mt-1 space-y-1 text-xs text-blue-700">
									<li>• Calendar event will be created in John&apos;s calendar</li>
									<li>• You&apos;ll receive a confirmation email with details</li>
									<li>• Meeting will be added to John&apos;s schedule</li>
									<li>• Reminder will be sent 30 minutes before the meeting</li>
								</ul>
							</div>
						</div>
					</div>

					{/* Action Buttons */}
					<div className="flex space-x-3 pt-4">
						<Button variant="outline" onClick={onClose} disabled={isLoading} className="flex-1">
							<X className="mr-2 h-4 w-4" />
							Cancel
						</Button>
						<Button
							onClick={onConfirm}
							disabled={isLoading}
							className="flex-1 bg-green-600 hover:bg-green-700"
						>
							{isLoading ? (
								<>
									<div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white" />
									Confirming...
								</>
							) : (
								<>
									<Check className="mr-2 h-4 w-4" />
									Confirm Booking
								</>
							)}
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
