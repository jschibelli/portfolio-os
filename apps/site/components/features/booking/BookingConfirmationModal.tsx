'use client';

import { useState } from 'react';
import { CheckCircle, X } from 'lucide-react';
import { Button } from '../../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Badge } from '../../ui/badge';

// Centralized error types for better maintainability
enum BookingErrorType {
  NETWORK = 'NETWORK',
  SERVICE = 'SERVICE',
  VALIDATION = 'VALIDATION',
  UNKNOWN = 'UNKNOWN'
}

interface BookingError {
  type: BookingErrorType;
  message: string;
  userMessage: string;
}

// Centralized error handling utility
const createBookingError = (type: BookingErrorType, message: string): BookingError => {
  const errorMessages = {
    [BookingErrorType.NETWORK]: 'Connection Error: Please check your internet connection and try again.',
    [BookingErrorType.SERVICE]: 'Service Error: Our booking service is temporarily unavailable. Please try again in a few minutes.',
    [BookingErrorType.VALIDATION]: 'Validation Error: Invalid booking details. Please refresh the page and try again.',
    [BookingErrorType.UNKNOWN]: 'An unexpected error occurred. Please try again or contact support.'
  };

  return {
    type,
    message,
    userMessage: errorMessages[type]
  };
};

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
	const [error, setError] = useState<BookingError | null>(null);

	const handleConfirm = async () => {
		setIsLoading(true);
		setError(null);
		
		try {
			// Simulate API call with realistic timing
			// Using 1000ms to provide good UX while ensuring proper loading state
			await new Promise((resolve, reject) => {
				setTimeout(() => {
					const random = Math.random();
					// Simulate different types of API failures for realistic error handling
					if (random < 0.05) { // 5% chance of network error
						reject(createBookingError(BookingErrorType.NETWORK, 'Network connection failed'));
					} else if (random < 0.08) { // 3% chance of server error
						reject(createBookingError(BookingErrorType.SERVICE, 'Booking service temporarily unavailable'));
					} else if (random < 0.1) { // 2% chance of validation error
						reject(createBookingError(BookingErrorType.VALIDATION, 'Invalid booking details'));
					} else {
						resolve(true);
					}
				}, 1000);
			});
			
			setIsLoading(false);
			onClose();
		} catch (err) {
			setIsLoading(false);
			// Handle different error types with centralized error management
			if (err && typeof err === 'object' && 'type' in err && 'userMessage' in err) {
				setError(err as BookingError);
			} else {
				setError(createBookingError(BookingErrorType.UNKNOWN, 'Unexpected error occurred'));
			}
		}
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

					{error && (
						<div className="bg-red-50 dark:bg-red-950/20 rounded-lg p-4" role="alert" aria-live="polite">
							<h4 className="font-medium text-red-900 dark:text-red-100 mb-2">
								Booking Error
							</h4>
							<p className="text-sm text-red-800 dark:text-red-200">
								{error.userMessage}
							</p>
							{process.env.NODE_ENV === 'development' && (
								<details className="mt-2">
									<summary className="text-xs text-red-600 dark:text-red-400 cursor-pointer">
										Technical Details
									</summary>
									<p className="text-xs text-red-600 dark:text-red-400 mt-1">
										Type: {error.type} | Message: {error.message}
									</p>
								</details>
							)}
						</div>
					)}

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
							{isLoading ? 'Confirming...' : error ? 'Retry Booking' : 'Confirm Booking'}
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
