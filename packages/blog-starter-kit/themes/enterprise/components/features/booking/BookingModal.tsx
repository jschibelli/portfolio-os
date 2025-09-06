'use client';

import { useState } from 'react';
import { Calendar, Clock, MapPin, User, X } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { BookingConfirmationModal } from './BookingConfirmationModal';

interface BookingModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export function BookingModal({ isOpen, onClose }: BookingModalProps) {
	const [step, setStep] = useState(1);
	const [bookingData, setBookingData] = useState({
		name: '',
		email: '',
		service: '',
		date: '',
		time: '',
		timezone: 'America/New_York',
	});

	const [showConfirmation, setShowConfirmation] = useState(false);

	if (!isOpen) return null;

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setShowConfirmation(true);
	};

	const handleConfirm = () => {
		// Handle booking confirmation
		setShowConfirmation(false);
		onClose();
		setStep(1);
		setBookingData({
			name: '',
			email: '',
			service: '',
			date: '',
			time: '',
			timezone: 'America/New_York',
		});
	};

	return (
		<>
			<div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center duration-300">
				{/* Backdrop */}
				<div 
					className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
					onClick={onClose}
					onKeyDown={(e) => {
						if (e.key === 'Escape') {
							onClose();
						}
					}}
					role="button"
					tabIndex={0}
					aria-label="Close modal"
				/>

				{/* Modal */}
				<Card className="animate-in slide-in-from-bottom-4 mx-4 w-full max-w-md duration-300 ease-out">
					<CardHeader className="pb-4">
						<div className="flex items-center justify-between">
							<CardTitle className="text-xl font-semibold">Book a Consultation</CardTitle>
							<Button variant="ghost" size="sm" onClick={onClose}>
								<X className="h-4 w-4" />
							</Button>
						</div>
						<p className="text-sm text-muted-foreground">
							Schedule a meeting to discuss your project
						</p>
					</CardHeader>

					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="name">Name</Label>
								<Input
									id="name"
									value={bookingData.name}
									onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									value={bookingData.email}
									onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="service">Service</Label>
								<Select
									value={bookingData.service}
									onValueChange={(value) => setBookingData({ ...bookingData, service: value })}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select a service" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="web-development">Web Development</SelectItem>
										<SelectItem value="ui-ux-design">UI/UX Design</SelectItem>
										<SelectItem value="consulting">Consulting</SelectItem>
										<SelectItem value="maintenance">Maintenance & Support</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label htmlFor="date">Date</Label>
								<Input
									id="date"
									type="date"
									value={bookingData.date}
									onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="time">Time</Label>
								<Input
									id="time"
									type="time"
									value={bookingData.time}
									onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="timezone">Timezone</Label>
								<Select
									value={bookingData.timezone}
									onValueChange={(value) => setBookingData({ ...bookingData, timezone: value })}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="America/New_York">Eastern Time</SelectItem>
										<SelectItem value="America/Chicago">Central Time</SelectItem>
										<SelectItem value="America/Denver">Mountain Time</SelectItem>
										<SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="flex space-x-3 pt-4">
								<Button variant="outline" onClick={onClose} className="flex-1">
									Cancel
								</Button>
								<Button type="submit" className="flex-1">
									Schedule Meeting
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>
			</div>

			<BookingConfirmationModal
				isOpen={showConfirmation}
				onClose={() => setShowConfirmation(false)}
				bookingDetails={{
					service: bookingData.service,
					date: bookingData.date,
					time: bookingData.time,
					duration: '60 minutes',
					price: '$150',
				}}
			/>
		</>
	);
}
