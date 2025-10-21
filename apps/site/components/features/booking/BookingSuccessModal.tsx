'use client';

import { CheckCircle, Calendar, Video, ExternalLink } from 'lucide-react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@mindware-blog/ui/dialog';
import { Button } from '@mindware-blog/ui/button';

interface BookingSuccessModalProps {
	isOpen: boolean;
	onClose: () => void;
	meetingDetails?: {
		startTime: string;
		googleMeetLink?: string;
		googleEventLink?: string;
	};
}

export function BookingSuccessModal({
	isOpen,
	onClose,
	meetingDetails,
}: BookingSuccessModalProps) {
	const formatDateTime = (dateString: string) => {
		const date = new Date(dateString);
		return {
			date: date.toLocaleDateString('en-US', { 
				weekday: 'long', 
				year: 'numeric', 
				month: 'long', 
				day: 'numeric' 
			}),
			time: date.toLocaleTimeString('en-US', { 
				hour: 'numeric', 
				minute: '2-digit',
				timeZoneName: 'short'
			}),
		};
	};

	const dateTime = meetingDetails?.startTime 
		? formatDateTime(meetingDetails.startTime) 
		: null;

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent 
				className="sm:max-w-md z-[10000] bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-700" 
				aria-describedby="booking-success-description"
				style={{ zIndex: 10000 }}
			>
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2 text-stone-900 dark:text-stone-100">
						<CheckCircle className="h-6 w-6 text-green-500" />
						Meeting Confirmed!
					</DialogTitle>
					<div id="booking-success-description" className="sr-only">
						Your meeting has been successfully confirmed
					</div>
				</DialogHeader>

				<div className="space-y-6 py-4">
					{/* Success Message */}
					<div className="text-center">
						<p className="text-stone-700 dark:text-stone-300">
							Your meeting has been successfully scheduled.
						</p>
					</div>

					{/* Meeting Details */}
					{dateTime && (
						<div className="bg-stone-50 dark:bg-stone-800 rounded-lg p-4 space-y-3">
							<div className="flex items-start gap-3">
								<Calendar className="h-5 w-5 text-stone-600 dark:text-stone-400 mt-0.5" />
								<div>
									<p className="font-medium text-stone-900 dark:text-stone-100">
										{dateTime.date}
									</p>
									<p className="text-sm text-stone-600 dark:text-stone-400">
										{dateTime.time}
									</p>
								</div>
							</div>
						</div>
					)}

					{/* Action Links */}
					{(meetingDetails?.googleMeetLink || meetingDetails?.googleEventLink) && (
						<div className="space-y-2">
							{meetingDetails.googleMeetLink && (
								<Button
									variant="outline"
									className="w-full justify-start"
									onClick={() => window.open(meetingDetails.googleMeetLink, '_blank')}
								>
									<Video className="h-4 w-4" />
									<span>Join Google Meet</span>
									<ExternalLink className="h-3 w-3 ml-auto" />
								</Button>
							)}
							
							{meetingDetails.googleEventLink && (
								<Button
									variant="outline"
									className="w-full justify-start"
									onClick={() => window.open(meetingDetails.googleEventLink, '_blank')}
								>
									<Calendar className="h-4 w-4" />
									<span>Add to Calendar</span>
									<ExternalLink className="h-3 w-3 ml-auto" />
								</Button>
							)}
						</div>
					)}

					{/* Next Steps */}
					<div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4">
						<h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
							What&apos;s Next?
						</h4>
						<ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
							<li>• You&apos;ll receive a confirmation email shortly</li>
							<li>• Calendar invite has been sent to your email</li>
							<li>• Join the meeting using the Google Meet link above</li>
						</ul>
					</div>

					{/* Close Button */}
					<Button
						onClick={onClose}
						className="w-full"
					>
						Got it, thanks!
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

