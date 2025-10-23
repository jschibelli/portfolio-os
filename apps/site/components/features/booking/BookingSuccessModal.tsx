'use client';

import { CheckCircle, ExternalLink, Calendar } from 'lucide-react';
import { Button } from '../../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';

interface BookingSuccessModalProps {
	isOpen: boolean;
	onClose: () => void;
	bookingDetails?: {
		meetLink?: string;
		calendarLink?: string;
		eventId?: string;
		startTime?: string;
		duration?: number;
	};
}

export function BookingSuccessModal({
	isOpen,
	onClose,
	bookingDetails,
}: BookingSuccessModalProps) {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent 
				className="sm:max-w-md z-[10000] bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-700" 
				aria-describedby="booking-success-description"
				style={{ zIndex: 10000 }}
			>
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2 text-stone-900 dark:text-stone-100">
						<CheckCircle className="h-5 w-5 text-green-500" />
						Meeting Confirmed!
					</DialogTitle>
					<div id="booking-success-description" className="sr-only">
						Your meeting has been successfully booked
					</div>
				</DialogHeader>

				<div className="space-y-4">
					<div className="rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20 p-4">
						<p className="text-sm text-green-800 dark:text-green-200">
							✅ Your meeting has been successfully booked and added to your calendar!
						</p>
					</div>

					{bookingDetails?.startTime && (
						<div className="rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50 p-4">
							<h3 className="font-semibold mb-2 text-stone-900 dark:text-stone-100 flex items-center gap-2">
								<Calendar className="h-4 w-4" />
								Meeting Details
							</h3>
							<div className="space-y-2 text-sm">
								<div className="flex justify-between">
									<span className="text-stone-600 dark:text-stone-400">Date & Time:</span>
									<span className="font-medium text-stone-900 dark:text-stone-100">
										{new Date(bookingDetails.startTime).toLocaleDateString()} at {new Date(bookingDetails.startTime).toLocaleTimeString()}
									</span>
								</div>
								{bookingDetails.duration && (
									<div className="flex justify-between">
										<span className="text-stone-600 dark:text-stone-400">Duration:</span>
										<span className="font-medium text-stone-900 dark:text-stone-100">
											{bookingDetails.duration} minutes
										</span>
									</div>
								)}
							</div>
						</div>
					)}

					{(bookingDetails?.meetLink || bookingDetails?.calendarLink) && (
						<div className="space-y-2">
							{bookingDetails.meetLink && (
								<Button
									asChild
									className="w-full bg-blue-600 hover:bg-blue-700 text-white"
								>
									<a
										href={bookingDetails.meetLink}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center justify-center gap-2"
									>
										<ExternalLink className="h-4 w-4" />
										Join Google Meet
									</a>
								</Button>
							)}
							{bookingDetails.calendarLink && (
								<Button
									asChild
									variant="outline"
									className="w-full border-stone-300 dark:border-stone-600"
								>
									<a
										href={bookingDetails.calendarLink}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center justify-center gap-2"
									>
										<Calendar className="h-4 w-4" />
										View in Calendar
									</a>
								</Button>
							)}
						</div>
					)}

					<div className="bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 rounded-lg p-4">
						<h4 className="font-medium text-stone-900 dark:text-stone-100 mb-2">
							What&apos;s next?
						</h4>
						<ul className="text-sm text-stone-700 dark:text-stone-300 space-y-1.5">
							<li>• Check your email for the calendar invite</li>
							<li>• The Google Meet link is included in the invite</li>
							<li>• You&apos;ll receive a reminder before the meeting</li>
						</ul>
					</div>

					<Button
						onClick={onClose}
						className="w-full bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-stone-200 text-white dark:text-stone-900"
					>
						Got it, thanks!
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

