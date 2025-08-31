import { ArrowLeft, Calendar, Check, Clock, Mail, User, X } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Input } from './input';
import { Label } from './label';

interface TimeSlot {
	start: string;
	end: string;
	duration: number;
}

interface BookingModalProps {
	isOpen: boolean;
	onClose: () => void;
	availableSlots: TimeSlot[];
	timezone: string;
	businessHours: { start: number; end: number; timezone: string };
	meetingDurations: number[];
	message?: string;
	initialStep?: Step;
	onBookingComplete: (bookingData: {
		name: string;
		email: string;
		timezone: string;
		slot: TimeSlot;
	}) => void;
}

type Step = 'contact' | 'calendar' | 'contact-after-calendar' | 'confirmation';

export function BookingModal({
	isOpen,
	onClose,
	availableSlots,
	timezone,
	businessHours,
	meetingDurations,
	message = 'Schedule a meeting with John',
	initialStep = 'contact',
	onBookingComplete,
}: BookingModalProps) {
	const [currentStep, setCurrentStep] = useState<Step>(initialStep);
	const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
	const [contactData, setContactData] = useState({
		name: '',
		email: '',
		timezone: 'America/New_York',
	});
	const [meetingType, setMeetingType] = useState<'video' | 'conference' | 'consultation'>(
		'consultation',
	);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [isClosing, setIsClosing] = useState(false);
	const [isBooking, setIsBooking] = useState(false);

	if (!isOpen) return null;

	const formatTime = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleTimeString('en-US', {
			hour: '2-digit',
			minute: '2-digit',
			timeZone: timezone,
		});
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			weekday: 'short',
			month: 'short',
			day: 'numeric',
			timeZone: timezone,
		});
	};

	const handleInputChange = (field: string, value: string) => {
		setContactData((prev) => ({ ...prev, [field]: value }));
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: '' }));
		}
	};

	const validateContactForm = () => {
		const newErrors: Record<string, string> = {};

		if (!contactData.name.trim()) {
			newErrors.name = 'Name is required';
		}

		if (!contactData.email.trim()) {
			newErrors.email = 'Email is required';
		} else if (!/\S+@\S+\.\S+/.test(contactData.email)) {
			newErrors.email = 'Please enter a valid email address';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleContactSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (validateContactForm()) {
			setCurrentStep('calendar');
		}
	};

	const handleSlotSelect = (slot: TimeSlot) => {
		setSelectedSlot(slot);
		// If we started at calendar step, move to contact collection
		if (initialStep === 'calendar') {
			setCurrentStep('contact-after-calendar');
		}
	};

	const handleConfirmBooking = async () => {
		if (selectedSlot && contactData.name && contactData.email) {
			setIsBooking(true);
			try {
				console.log('🔍 Debug - Starting booking process...');
				console.log('🔍 Debug - Booking data:', {
					name: contactData.name,
					email: contactData.email,
					timezone: contactData.timezone,
					startTime: selectedSlot.start,
					endTime: selectedSlot.end,
					duration: selectedSlot.duration,
					meetingType: meetingType,
				});

				// Call the booking API (App Router)
				const response = await fetch('/api/schedule/book', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						startISO: selectedSlot.start,
						durationMinutes: selectedSlot.duration,
						timeZone: contactData.timezone,
						attendeeEmail: contactData.email,
						attendeeName: contactData.name,
						summary: 'Meeting with John',
						description: `Booked via site UI. Meeting type: ${meetingType}`,
						sendUpdates: 'all',
					}),
				});

				console.log('🔍 Debug - Booking API response status:', response.status);

				if (response.ok) {
					const result = await response.json();
					console.log('🔍 Debug - Booking successful:', result);

					// Move to confirmation step
					setCurrentStep('confirmation');

					// Notify parent component about the successful booking
					onBookingComplete({
						...contactData,
						slot: selectedSlot,
					});
				} else {
					const errorData = await response.json();
					console.error('🔍 Debug - Booking failed:', errorData);
					alert(`Failed to book the meeting: ${errorData.error || response.statusText}`);
				}
			} catch (error) {
				console.error('🔍 Debug - Error booking meeting:', error);
				alert('Failed to book the meeting. Please try again.');
			} finally {
				setIsBooking(false);
			}
		}
	};

	const handleBack = () => {
		if (currentStep === 'calendar') {
			setCurrentStep('contact');
		} else if (currentStep === 'contact-after-calendar') {
			setCurrentStep('calendar');
		} else if (currentStep === 'confirmation') {
			setCurrentStep('calendar');
		}
	};

	const handleClose = () => {
		setIsClosing(true);
		setTimeout(() => {
			setCurrentStep('contact');
			setSelectedSlot(null);
			setContactData({ name: '', email: '', timezone: 'America/New_York' });
			setErrors({});
			setIsClosing(false);
			onClose();
		}, 200);
	};

	// Group slots by date
	const slotsByDate = availableSlots.reduce(
		(acc, slot) => {
			const date = formatDate(slot.start);
			if (!acc[date]) {
				acc[date] = [];
			}
			acc[date].push(slot);
			return acc;
		},
		{} as Record<string, TimeSlot[]>,
	);

	// Debug logging
	console.log('🔍 Debug - BookingModal received slots:', {
		totalSlots: availableSlots.length,
		slotsByDate: Object.keys(slotsByDate),
		firstFewSlots: availableSlots.slice(0, 5),
		timezone: timezone,
		currentTime: new Date().toISOString(),
	});

	const getStepTitle = () => {
		switch (currentStep) {
			case 'contact':
				return 'Contact Information';
			case 'calendar':
				return 'Select Time';
			case 'contact-after-calendar':
				return 'Contact Information';
			case 'confirmation':
				return 'Booking Confirmed';
			default:
				return 'Schedule Meeting';
		}
	};

	const getStepIcon = () => {
		switch (currentStep) {
			case 'contact':
				return <User className="h-5 w-5 text-blue-600" />;
			case 'calendar':
				return <Calendar className="h-5 w-5 text-blue-600" />;
			case 'contact-after-calendar':
				return <User className="h-5 w-5 text-blue-600" />;
			case 'confirmation':
				return <Check className="h-5 w-5 text-green-600" />;
			default:
				return <Calendar className="h-5 w-5 text-blue-600" />;
		}
	};

	return (
		<div
			className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-2 transition-all duration-300 sm:p-4 ${isClosing ? 'animate-out fade-out' : 'animate-in fade-in'}`}
		>
			<Card
				className={`max-h-[95vh] w-full max-w-md overflow-hidden transition-all duration-300 sm:max-h-[90vh] sm:max-w-lg ${isClosing ? 'animate-out slide-out-to-bottom-4' : 'animate-in slide-in-from-bottom-4'}`}
			>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
					<div className="flex items-center space-x-2">
						{getStepIcon()}
						<CardTitle className="text-lg sm:text-xl">{getStepTitle()}</CardTitle>
					</div>
					<Button variant="ghost" size="sm" onClick={handleClose} className="h-8 w-8 p-0">
						<X className="h-4 w-4" />
					</Button>
				</CardHeader>

				<CardContent className="space-y-4">
					{/* Progress Indicator */}
					<div className="mb-4 flex items-center justify-center space-x-2">
						<div
							className={`h-3 w-3 rounded-full ${currentStep === 'contact' ? 'bg-blue-600' : 'bg-gray-300'}`}
						/>
						<div
							className={`h-3 w-3 rounded-full ${currentStep === 'calendar' ? 'bg-blue-600' : 'bg-gray-300'}`}
						/>
						<div
							className={`h-3 w-3 rounded-full ${currentStep === 'contact-after-calendar' ? 'bg-blue-600' : 'bg-gray-300'}`}
						/>
						<div
							className={`h-3 w-3 rounded-full ${currentStep === 'confirmation' ? 'bg-blue-600' : 'bg-gray-300'}`}
						/>
					</div>

					{/* Contact Information Step */}
					{currentStep === 'contact' && (
						<div className="animate-in fade-in space-y-4 duration-200">
							<p className="text-sm text-gray-600 sm:text-base">{message}</p>

							{/* Demo Mode Notice */}
							{message.includes('Demo Mode') && (
								<div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3">
									<div className="flex items-start space-x-2">
										<div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100">
											<span className="text-xs font-bold text-yellow-600">ℹ</span>
										</div>
										<div className="text-sm text-yellow-800">
											<p className="font-medium">Demo Mode Active</p>
											<p>
												This is showing sample data. To see real calendar availability, configure
												Google Calendar API in your environment variables.
											</p>
										</div>
									</div>
								</div>
							)}

							<form onSubmit={handleContactSubmit} className="space-y-4">
								<div className="space-y-2">
									<Label
										htmlFor="name"
										className="flex items-center space-x-2 text-sm sm:text-base"
									>
										<User className="h-4 w-4" />
										<span>
											Full Name <span className="text-red-500">*</span>
										</span>
									</Label>
									<Input
										id="name"
										type="text"
										value={contactData.name}
										onChange={(e) => handleInputChange('name', e.target.value)}
										placeholder="Enter your full name"
										className={`text-sm sm:text-base ${errors.name ? 'border-red-500' : ''}`}
									/>
									{errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
								</div>

								<div className="space-y-2">
									<Label
										htmlFor="email"
										className="flex items-center space-x-2 text-sm sm:text-base"
									>
										<Mail className="h-4 w-4" />
										<span>
											Email Address <span className="text-red-500">*</span>
										</span>
									</Label>
									<Input
										id="email"
										type="email"
										value={contactData.email}
										onChange={(e) => handleInputChange('email', e.target.value)}
										placeholder="Enter your email address"
										className={`text-sm sm:text-base ${errors.email ? 'border-red-500' : ''}`}
									/>
									{errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
								</div>

								<div className="space-y-2">
									<Label
										htmlFor="timezone"
										className="flex items-center space-x-2 text-sm sm:text-base"
									>
										<Clock className="h-4 w-4" />
										<span>Timezone</span>
									</Label>
									<select
										id="timezone"
										value={contactData.timezone}
										onChange={(e) => handleInputChange('timezone', e.target.value)}
										className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-base"
									>
										<option value="America/New_York">Eastern Time (ET)</option>
										<option value="America/Chicago">Central Time (CT)</option>
										<option value="America/Denver">Mountain Time (MT)</option>
										<option value="America/Los_Angeles">Pacific Time (PT)</option>
										<option value="Europe/London">London (GMT)</option>
										<option value="Europe/Paris">Paris (CET)</option>
										<option value="Asia/Tokyo">Tokyo (JST)</option>
										<option value="Australia/Sydney">Sydney (AEDT)</option>
									</select>
								</div>

								<Button type="submit" className="w-full">
									Continue to Time Selection
								</Button>
							</form>
						</div>
					)}

					{/* Calendar Selection Step */}
					{currentStep === 'calendar' && (
						<div className="animate-in fade-in space-y-4 duration-200">
							<div className="flex items-center justify-between">
								<Button
									variant="ghost"
									size="sm"
									onClick={handleBack}
									className="flex items-center space-x-1"
								>
									<ArrowLeft className="h-4 w-4" />
									<span className="hidden sm:inline">Back</span>
								</Button>
								<div className="text-sm text-gray-500">
									{contactData.name} • {contactData.email}
								</div>
							</div>

							{/* Meeting Type Selection */}
							<div className="space-y-3">
								<Label className="flex items-center space-x-2 text-sm sm:text-base">
									<span>Meeting Type</span>
								</Label>
								<div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
									<Button
										variant={meetingType === 'video' ? 'default' : 'outline'}
										size="sm"
										onClick={() => setMeetingType('video')}
										className="h-auto justify-start p-3"
									>
										<div className="flex items-center space-x-2">
											<div className="h-3 w-3 rounded-full bg-green-500"></div>
											<span className="text-sm">Video Call</span>
										</div>
									</Button>
									<Button
										variant={meetingType === 'conference' ? 'default' : 'outline'}
										size="sm"
										onClick={() => setMeetingType('conference')}
										className="h-auto justify-start p-3"
									>
										<div className="flex items-center space-x-2">
											<div className="h-3 w-3 rounded-full bg-blue-500"></div>
											<span className="text-sm">Conference Call</span>
										</div>
									</Button>
									<Button
										variant={meetingType === 'consultation' ? 'default' : 'outline'}
										size="sm"
										onClick={() => setMeetingType('consultation')}
										className="h-auto justify-start p-3"
									>
										<div className="flex items-center space-x-2">
											<div className="h-3 w-3 rounded-full bg-purple-500"></div>
											<span className="text-sm">Consultation</span>
										</div>
									</Button>
								</div>
							</div>

							<div className="max-h-64 space-y-4 overflow-y-auto sm:max-h-80">
								{Object.entries(slotsByDate).map(([date, slots]) => (
									<div key={date} className="space-y-2">
										<h3 className="text-sm font-medium text-gray-900 sm:text-base">{date}</h3>
										<div className="grid grid-cols-1 gap-2">
											{slots.map((slot, index) => (
												<Button
													key={index}
													variant={selectedSlot === slot ? 'default' : 'outline'}
													className="h-auto justify-start p-3 text-sm sm:text-base"
													onClick={() => handleSlotSelect(slot)}
												>
													<div className="flex w-full items-center space-x-2">
														<Clock className="h-4 w-4 flex-shrink-0" />
														<div className="flex-1 text-left">
															<div className="font-medium">
																{formatTime(slot.start)} - {formatTime(slot.end)}
															</div>
															<div className="text-xs text-gray-500 sm:text-sm">
																{slot.duration} minutes
															</div>
														</div>
														{selectedSlot === slot && (
															<Check className="ml-auto h-4 w-4 flex-shrink-0" />
														)}
													</div>
												</Button>
											))}
										</div>
									</div>
								))}
							</div>

							{availableSlots.length === 0 && (
								<div className="py-8 text-center">
									<Calendar className="mx-auto mb-4 h-12 w-12 text-gray-400" />
									<p className="text-sm text-gray-600 sm:text-base">No available slots found.</p>
								</div>
							)}

							<div className="flex space-x-2 border-t pt-4">
								<Button variant="outline" onClick={handleBack} className="flex-1">
									Back
								</Button>
								<Button
									onClick={handleConfirmBooking}
									disabled={!selectedSlot || isBooking}
									className="flex-1"
								>
									{isBooking ? 'Booking...' : 'Confirm Booking'}
								</Button>
							</div>
						</div>
					)}

					{/* Contact Information After Calendar Selection */}
					{currentStep === 'contact-after-calendar' && selectedSlot && (
						<div className="animate-in fade-in space-y-4 duration-200">
							<div className="flex items-center justify-between">
								<Button
									variant="ghost"
									size="sm"
									onClick={() => setCurrentStep('calendar')}
									className="flex items-center space-x-1"
								>
									<ArrowLeft className="h-4 w-4" />
									<span className="hidden sm:inline">Back</span>
								</Button>
								<div className="text-sm text-gray-500">
									Selected: {formatDate(selectedSlot.start)} at {formatTime(selectedSlot.start)}
								</div>
							</div>

							<div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
								<div className="flex items-start space-x-2">
									<div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
										<span className="text-xs font-bold text-blue-600">✓</span>
									</div>
									<div className="text-sm text-blue-800">
										<p className="font-medium">Time slot selected!</p>
										<p>Please provide your contact information to complete the booking.</p>
									</div>
								</div>
							</div>

							<form
								onSubmit={(e) => {
									e.preventDefault();
									if (validateContactForm()) {
										handleConfirmBooking();
									}
								}}
								className="space-y-4"
							>
								<div className="space-y-2">
									<Label
										htmlFor="name"
										className="flex items-center space-x-2 text-sm sm:text-base"
									>
										<User className="h-4 w-4" />
										<span>Full Name *</span>
									</Label>
									<Input
										id="name"
										type="text"
										placeholder="Enter your full name"
										value={contactData.name}
										onChange={(e) => handleInputChange('name', e.target.value)}
										className={errors.name ? 'border-red-500' : ''}
									/>
									{errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
								</div>

								<div className="space-y-2">
									<Label
										htmlFor="email"
										className="flex items-center space-x-2 text-sm sm:text-base"
									>
										<Mail className="h-4 w-4" />
										<span>Email Address *</span>
									</Label>
									<Input
										id="email"
										type="email"
										placeholder="Enter your email address"
										value={contactData.email}
										onChange={(e) => handleInputChange('email', e.target.value)}
										className={errors.email ? 'border-red-500' : ''}
									/>
									{errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
								</div>

								<div className="space-y-2">
									<Label
										htmlFor="timezone"
										className="flex items-center space-x-2 text-sm sm:text-base"
									>
										<Clock className="h-4 w-4" />
										<span>Timezone</span>
									</Label>
									<select
										id="timezone"
										value={contactData.timezone}
										onChange={(e) => handleInputChange('timezone', e.target.value)}
										className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-base"
									>
										<option value="America/New_York">Eastern Time (ET)</option>
										<option value="America/Chicago">Central Time (CT)</option>
										<option value="America/Denver">Mountain Time (MT)</option>
										<option value="America/Los_Angeles">Pacific Time (PT)</option>
										<option value="Europe/London">London (GMT)</option>
										<option value="Europe/Paris">Paris (CET)</option>
										<option value="Asia/Tokyo">Tokyo (JST)</option>
										<option value="Australia/Sydney">Sydney (AEDT)</option>
									</select>
								</div>

								<Button type="submit" className="w-full" disabled={isBooking}>
									{isBooking ? 'Booking...' : 'Confirm Booking'}
								</Button>
							</form>
						</div>
					)}

					{/* Confirmation Step */}
					{currentStep === 'confirmation' && selectedSlot && (
						<div className="animate-in fade-in space-y-6 text-center duration-200">
							{/* Success Icon */}
							<div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 shadow-lg">
								<Check className="h-10 w-10 text-green-600" />
							</div>

							{/* Success Message */}
							<div className="space-y-3">
								<h3 className="text-2xl font-bold text-green-800">Booking Confirmed!</h3>
								<p className="text-base text-gray-600">
									Your meeting with John has been scheduled successfully.
								</p>
							</div>

							{/* Meeting Details Card */}
							<div className="space-y-4 rounded-xl border-2 border-green-200 bg-gradient-to-r from-green-50 to-blue-50 p-6">
								<h4 className="mb-4 text-lg font-semibold text-gray-900">Meeting Details</h4>
								<div className="grid grid-cols-1 gap-3 text-sm">
									<div className="flex items-center justify-between border-b border-green-100 py-2">
										<span className="font-medium text-gray-600">Name:</span>
										<span className="font-semibold text-gray-900">{contactData.name}</span>
									</div>
									<div className="flex items-center justify-between border-b border-green-100 py-2">
										<span className="font-medium text-gray-600">Email:</span>
										<span className="font-semibold text-gray-900">{contactData.email}</span>
									</div>
									<div className="flex items-center justify-between border-b border-green-100 py-2">
										<span className="font-medium text-gray-600">Date:</span>
										<span className="font-semibold text-gray-900">
											{formatDate(selectedSlot.start)}
										</span>
									</div>
									<div className="flex items-center justify-between border-b border-green-100 py-2">
										<span className="font-medium text-gray-600">Time:</span>
										<span className="font-semibold text-gray-900">
											{formatTime(selectedSlot.start)} - {formatTime(selectedSlot.end)}
										</span>
									</div>
									<div className="flex items-center justify-between py-2">
										<span className="font-medium text-gray-600">Duration:</span>
										<span className="font-semibold text-gray-900">
											{selectedSlot.duration} minutes
										</span>
									</div>
								</div>
							</div>

							{/* Next Steps */}
							<div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-4">
								<div className="flex items-start space-x-3">
									<div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
										<span className="text-xs font-bold text-blue-600">✓</span>
									</div>
									<div className="text-left">
										<p className="mb-1 text-sm font-medium text-blue-900">What happens next:</p>
										<ul className="space-y-1 text-sm text-blue-800">
											<li>• Calendar invitation sent to your email</li>
											<li>• Add Google Meet video conferencing in Google Calendar</li>
											<li>• Meeting reminder 15 minutes before start time</li>
										</ul>
									</div>
								</div>
							</div>

							{/* Close Button */}
							<Button
								onClick={handleClose}
								className="w-full bg-green-600 py-3 text-base font-semibold text-white hover:bg-green-700"
							>
								Done
							</Button>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
