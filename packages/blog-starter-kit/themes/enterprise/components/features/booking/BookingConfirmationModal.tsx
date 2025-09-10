'use client';

import { useState } from 'react';
import { CheckCircle, X } from 'lucide-react';
import { Button } from '../../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Badge } from '../../ui/badge';

interface BookingConfirmationModalProps {
	isOpen: boolean;
	onClose: () => void;
	bookingDetails: {
		service: string;
		date: string;
		time: string;
		duration: string;
		price: string;
	};
}

export function BookingConfirmationModal({
	isOpen,
	onClose,
	bookingDetails,
}: BookingConfirmationModalProps) {
	const [isLoading, setIsLoading] = useState(false);

	const handleConfirm = async () => {
		setIsLoading(true);
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000));
		setIsLoading(false);
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<CheckCircle className="h-5 w-5 text-green-500" />
						Booking Confirmation
					</DialogTitle>
				</DialogHeader>

				<div className="space-y-4">
					<div className="rounded-lg border p-4">
						<h3 className="font-semibold mb-3">Booking Details</h3>
						<div className="space-y-2 text-sm">
							<div className="flex justify-between">
								<span className="text-muted-foreground">Service:</span>
								<span className="font-medium">{bookingDetails.service}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">Date:</span>
								<span className="font-medium">{bookingDetails.date}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">Time:</span>
								<span className="font-medium">{bookingDetails.time}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">Duration:</span>
								<span className="font-medium">{bookingDetails.duration}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">Price:</span>
								<span className="font-medium text-green-600">{bookingDetails.price}</span>
							</div>
						</div>
					</div>

					<div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4">
						<h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
							What happens next?
						</h4>
						<ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
							<li>• You&apos;ll receive a confirmation email</li>
							<li>• We&apos;ll send you a calendar invite</li>
							<li>• We&apos;ll reach out to discuss your project</li>
						</ul>
					</div>

					<div className="flex gap-2">
						<Button
							onClick={handleConfirm}
							disabled={isLoading}
							className="flex-1"
						>
							{isLoading ? 'Confirming...' : 'Confirm Booking'}
						</Button>
						<Button
							variant="outline"
							onClick={onClose}
							disabled={isLoading}
						>
							<X className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
