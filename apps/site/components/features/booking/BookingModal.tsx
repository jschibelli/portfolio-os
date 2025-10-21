'use client';

import { useState } from 'react';
import { Calendar, Clock, MapPin, User, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

interface TimeSlot {
	start?: string;
	end?: string;
	duration?: number;
	// Alternative property names that might be used
	startISO?: string;
	endISO?: string;
	startTime?: string;
	endTime?: string;
	time?: string;
}

interface BookingModalProps {
	isOpen: boolean;
	onClose: () => void;
	availableSlots?: TimeSlot[];
	timezone?: string;
	businessHours?: { start: number; end: number; timezone: string };
	meetingDurations?: number[];
	message?: string;
	initialStep?: string;
	onBookingComplete?: (bookingData: any) => void;
	isLoadingSlots?: boolean; // New prop for loading state
}

export function BookingModal({ 
	isOpen, 
	onClose, 
	availableSlots = [], 
	timezone = 'America/New_York',
	businessHours = { start: 9, end: 18, timezone: 'America/New_York' },
	meetingDurations = [30, 60],
	message = 'Schedule a meeting with John',
	initialStep = 'contact',
	onBookingComplete,
	isLoadingSlots = false
}: BookingModalProps) {
	const [step, setStep] = useState(1);
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
	const [selectedTime, setSelectedTime] = useState<string>('');
	const [currentMonth, setCurrentMonth] = useState(new Date());
	const [conflictError, setConflictError] = useState<string | null>(null);
	const [isBooking, setIsBooking] = useState(false);

	const [bookingData, setBookingData] = useState({
		name: '',
		email: '',
		service: '',
		timezone: 'America/New_York',
	});

	if (!isOpen) {
		return null;
	}

	// Generate calendar days
	const generateCalendarDays = () => {
		const year = currentMonth.getFullYear();
		const month = currentMonth.getMonth();
		const firstDay = new Date(year, month, 1);
		const lastDay = new Date(year, month + 1, 0);
		const startDate = new Date(firstDay);
		startDate.setDate(startDate.getDate() - firstDay.getDay());
		
		const days = [];
		for (let i = 0; i < 42; i++) {
			const date = new Date(startDate);
			date.setDate(startDate.getDate() + i);
			days.push(date);
		}
		return days;
	};

	// Get available times for selected date
	const getAvailableTimesForDate = (date: Date) => {
		if (!date) return [];
		
		// Convert date to local date string (YYYY-MM-DD) to avoid timezone issues
		const dateStr = date.toLocaleDateString('en-CA'); // Returns YYYY-MM-DD format
		
		console.log('🔍 [BookingModal] Filtering slots for date:', {
			selectedDate: dateStr,
			totalSlots: availableSlots.length,
			firstFewSlots: availableSlots.slice(0, 3).map(slot => ({
				start: slot.start || slot.startISO || slot.startTime || slot.time,
				formatted: slot.start ? new Date(slot.start).toLocaleDateString('en-CA') : 'invalid'
			}))
		});
		
		const matchingSlots = availableSlots.filter(slot => {
			// Try different possible property names for the start time
			const startValue = slot.start || slot.startISO || slot.startTime || slot.time;
			
			if (!startValue) {
				return false;
			}
			
			try {
				// Convert slot start time to local date string
				const slotDate = new Date(startValue);
				
				// Check if the date is valid
				if (isNaN(slotDate.getTime())) {
					return false;
				}
				
				const slotDateStr = slotDate.toLocaleDateString('en-CA');
				
				const matches = slotDateStr === dateStr;
				if (matches) {
					console.log('✅ [BookingModal] Found matching slot:', {
						slotStart: startValue,
						slotDate: slotDateStr,
						selectedDate: dateStr
					});
				}
				
				return matches;
			} catch (error) {
				console.error('❌ [BookingModal] Error parsing slot date:', startValue, error);
				return false;
			}
		});
		
		console.log('📅 [BookingModal] Filtered slots result:', {
			selectedDate: dateStr,
			matchingSlots: matchingSlots.length,
			slots: matchingSlots.map(slot => ({
				start: slot.start || slot.startISO || slot.startTime || slot.time,
				formatted: slot.start ? new Date(slot.start).toLocaleDateString('en-CA') : 'invalid'
			}))
		});
		
		return matchingSlots;
	};

	// Generate time slots for a day using real calendar availability
	const generateTimeSlots = (date: Date) => {
		// Always get real available slots for this date first
		const realSlots = getAvailableTimesForDate(date);
		
		// If we have real calendar data, use it
		if (realSlots.length > 0) {
			const timeSlots = realSlots.map(slot => {
				// Try different possible property names
				const startValue = slot.start || slot.startISO || slot.startTime || slot.time;
				const endValue = slot.end || slot.endISO || slot.endTime;
				
				const startTime = new Date(startValue!);
				const endTime = endValue ? new Date(endValue) : new Date(startTime.getTime() + 60 * 60 * 1000); // Default 1 hour
				const duration = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));
				
				return {
					time: startTime.toLocaleTimeString('en-US', { 
						hour: 'numeric', 
						minute: '2-digit',
						hour12: true 
					}),
					value: startValue,
					available: true,
					duration: duration,
					isRealData: true
				};
			});
			
			// Sort time slots by time
			timeSlots.sort((a, b) => new Date(a.value!).getTime() - new Date(b.value!).getTime());
			
			return timeSlots;
		}
		
		// If no real slots, return empty array (no mock data)
		// This ensures users only see actual available times from Google Calendar
		return [];
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!selectedDate || !selectedTime) {
			return;
		}
		// Clear any previous conflict errors
		setConflictError(null);
		// Move to confirmation step instead of opening new modal
		setStep(4);
	};

	const handleConfirm = async () => {
		if (!onBookingComplete) return;
		
		setIsBooking(true);
		setConflictError(null);

		try {
			const selectedSlot = availableSlots.find(slot => {
				const startValue = slot.start || slot.startISO || slot.startTime || slot.time;
				return startValue === selectedTime;
			});

			if (!selectedSlot) {
				setConflictError('Selected time slot is no longer available. Please choose another time.');
				setIsBooking(false);
				return;
			}

			// Check for conflicts before booking
			const conflictCheckResponse = await fetch('/api/schedule/check-conflict', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					startISO: selectedTime,
					durationMinutes: selectedSlot.duration || 30,
					timeZone: bookingData.timezone,
				}),
			});

			// Only check conflict if API call was successful
			if (conflictCheckResponse.ok) {
				const conflictData = await conflictCheckResponse.json();

				// Only show error if there's an actual conflict
				if (conflictData.hasConflict === true) {
					setConflictError(
						conflictData.message || 
						'This time slot conflicts with an existing meeting. Please select a different time.'
					);
					setIsBooking(false);
					// Go back to calendar selection
					setStep(1);
					return;
				}
			} else {
				// If conflict check fails, log but proceed with booking
				console.warn('Conflict check API failed, proceeding with booking');
			}

			// No conflict, proceed with booking
			await onBookingComplete({
				name: bookingData.name,
				email: bookingData.email,
				timezone: bookingData.timezone,
				slot: {
					start: selectedTime,
					end: selectedSlot?.end || selectedSlot?.endISO || selectedSlot?.endTime || '',
					duration: selectedSlot?.duration || 30
				}
			});

			// Reset state on success
			onClose();
			setStep(1);
			setSelectedDate(null);
			setSelectedTime('');
			setConflictError(null);
			setBookingData({
				name: '',
				email: '',
				service: '',
				timezone: 'America/New_York',
			});
		} catch (error) {
			console.error('Error confirming booking:', error);
			setConflictError('An error occurred while checking availability. Please try again.');
		} finally {
			setIsBooking(false);
		}
	};

	const handleBackToForm = () => {
		// Clear conflict error when going back
		setConflictError(null);
		setStep(1);
	};

	// Format date and time for confirmation
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
				hour12: true 
			})
		};
	};

	const handleBackdropClick = (e: React.MouseEvent) => {
		if (e.target === e.currentTarget) {
			onClose();
		}
	};

	return (
		<>
			{/* Simplified Modal for Testing */}
			<div 
				className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50" 
				onClick={handleBackdropClick}
				style={{ zIndex: 9999 }}
			>
				{/* Modal */}
				<div 
					className="w-full max-w-4xl max-h-[95vh] bg-white dark:bg-stone-900 shadow-2xl border border-stone-200 dark:border-stone-700 mx-2 sm:mx-4 rounded-lg overflow-hidden" 
													onClick={(e) => {
														e.stopPropagation();
													}}
					style={{ 
						position: 'relative',
						zIndex: 10000,
						pointerEvents: 'auto'
					}}
				>
					{/* Header */}
					<div className="pb-4 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-700 p-4">
						<div className="flex items-center justify-between">
							<h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
								{step === 4 ? 'Confirm Your Meeting' : 'Book a Consultation'}
							</h2>
							<button 
								onClick={onClose}
								className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded"
							>
								<X className="h-4 w-4" />
							</button>
						</div>
						<p className="text-sm text-stone-600 dark:text-stone-400 mt-2">
							{step === 4 ? 'Review your meeting details before confirming' : 'Schedule a meeting to discuss your project'}
						</p>
					</div>

					{/* Content */}
					<div className="bg-white dark:bg-stone-900 p-3 sm:p-6">
						
						{step === 4 ? (
							/* Confirmation Step */
							<div className="space-y-6">
								{/* Conflict Error Display */}
								{conflictError && (
									<div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20 p-4">
										<div className="flex items-start gap-3">
											<div className="flex-shrink-0">
												<svg className="h-5 w-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
												</svg>
											</div>
											<div className="flex-1">
												<h4 className="font-medium text-red-900 dark:text-red-100 mb-1">
													Scheduling Conflict
												</h4>
												<p className="text-sm text-red-800 dark:text-red-200">
													{conflictError}
												</p>
											</div>
										</div>
									</div>
								)}

								<div className="rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50 p-6">
									<h3 className="font-semibold mb-4 text-stone-900 dark:text-stone-100">Meeting Details</h3>
									<div className="space-y-3 text-sm">
										<div className="flex justify-between items-start">
											<span className="text-stone-600 dark:text-stone-400">Date:</span>
											<span className="font-medium text-stone-900 dark:text-stone-100 text-right">
												{selectedTime && formatDateTime(selectedTime).date}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-stone-600 dark:text-stone-400">Time:</span>
											<span className="font-medium text-stone-900 dark:text-stone-100">
												{selectedTime && formatDateTime(selectedTime).time}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-stone-600 dark:text-stone-400">Duration:</span>
											<span className="font-medium text-stone-900 dark:text-stone-100">
												{availableSlots.find(slot => {
													const startValue = slot.start || slot.startISO || slot.startTime || slot.time;
													return startValue === selectedTime;
												})?.duration || 30} minutes
											</span>
										</div>
										<div className="pt-3 border-t border-stone-200 dark:border-stone-700">
											<div className="flex justify-between">
												<span className="text-stone-600 dark:text-stone-400">Name:</span>
												<span className="font-medium text-stone-900 dark:text-stone-100">{bookingData.name}</span>
											</div>
										</div>
										<div className="flex justify-between">
											<span className="text-stone-600 dark:text-stone-400">Email:</span>
											<span className="font-medium text-stone-900 dark:text-stone-100">{bookingData.email}</span>
										</div>
									</div>
								</div>

								<div className="bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 rounded-lg p-4">
									<h4 className="font-medium text-stone-900 dark:text-stone-100 mb-2">
										What happens next?
									</h4>
									<ul className="text-sm text-stone-700 dark:text-stone-300 space-y-1.5">
										<li>• Calendar event will be created with Google Meet link</li>
										<li>• You&apos;ll receive a confirmation email</li>
										<li>• Meeting details will be sent to your inbox</li>
									</ul>
								</div>

								<div className="flex gap-3">
									<button
										onClick={handleBackToForm}
										disabled={isBooking}
										className="flex-1 h-10 px-4 py-2 border border-stone-300 dark:border-stone-600 rounded-md bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed"
									>
										Back
									</button>
									<button
										onClick={handleConfirm}
										disabled={isBooking}
										className="flex-1 h-10 px-4 py-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-md hover:bg-stone-800 dark:hover:bg-stone-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
									>
										{isBooking && (
											<svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
												<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
												<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
											</svg>
										)}
										{isBooking ? 'Confirming...' : 'Confirm Booking'}
									</button>
								</div>
							</div>
						) : (
							/* Booking Form */
							<>
								{message && (
									<div className="mb-4 sm:mb-6 p-3 bg-stone-50 dark:bg-stone-800 rounded-lg">
										<p className="text-sm text-stone-700 dark:text-stone-300">{message}</p>
									</div>
								)}

								{/* Conflict Error Display in Form */}
								{conflictError && (
									<div className="mb-4 sm:mb-6 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20 p-4">
										<div className="flex items-start gap-3">
											<div className="flex-shrink-0">
												<svg className="h-5 w-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
												</svg>
											</div>
											<div className="flex-1">
												<h4 className="font-medium text-red-900 dark:text-red-100 mb-1">
													Scheduling Conflict
												</h4>
												<p className="text-sm text-red-800 dark:text-red-200">
													{conflictError}
												</p>
												<button
													onClick={() => setConflictError(null)}
													className="mt-2 text-xs text-red-700 dark:text-red-300 underline hover:no-underline"
												>
													Dismiss
												</button>
											</div>
										</div>
									</div>
								)}
								
								<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
							{/* Left Column - Contact Info */}
							<div className="space-y-4">
								<h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100">Contact Information</h3>
								
								<div className="space-y-4">
									<div className="space-y-2">
										<label htmlFor="name" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Name</label>
										<input
											id="name"
											type="text"
											value={bookingData.name}
											onChange={(e) => {
												setBookingData({ ...bookingData, name: e.target.value });
											}}
											required
											className="w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-md bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
											placeholder="Enter your name"
										/>
									</div>

									<div className="space-y-2">
										<label htmlFor="email" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Email</label>
										<input
											id="email"
											type="email"
											value={bookingData.email}
											onChange={(e) => {
												setBookingData({ ...bookingData, email: e.target.value });
											}}
											required
											className="w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-md bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
											placeholder="Enter your email"
										/>
									</div>

									<div className="space-y-2">
										<label htmlFor="service" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Service</label>
										<select
											id="service"
											value={bookingData.service}
											onChange={(e) => {
												setBookingData({ ...bookingData, service: e.target.value });
											}}
											className="w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-md bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
										>
											<option value="">Select a service</option>
											<option value="web-development">Web Development</option>
											<option value="ui-ux-design">UI/UX Design</option>
											<option value="consulting">Consulting</option>
											<option value="maintenance">Maintenance & Support</option>
										</select>
									</div>
								</div>
							</div>

							{/* Right Column - Calendar & Time Selection */}
							<div className="space-y-4">
								<h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100">Select Date & Time</h3>
								
								{/* Calendar */}
								<div className="border border-stone-200 dark:border-stone-700 rounded-lg p-3 sm:p-4">
									<div className="flex items-center justify-between mb-3 sm:mb-4">
										<h4 className="font-medium text-stone-900 dark:text-stone-100 text-sm sm:text-base">
											{currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
										</h4>
										<div className="flex space-x-1 sm:space-x-2">
											<Button
												variant="outline"
												size="sm"
												className="h-7 w-7 sm:h-8 sm:w-8 p-0"
												onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
											>
												<ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
											</Button>
											<Button
												variant="outline"
												size="sm"
												className="h-7 w-7 sm:h-8 sm:w-8 p-0"
												onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
											>
												<ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
											</Button>
										</div>
									</div>
									
									{/* Calendar Grid */}
									<div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-2">
										{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
											<div key={day} className="text-center text-xs font-medium text-stone-500 dark:text-stone-400 p-1 sm:p-2">
												{day.slice(0, 1)}
											</div>
										))}
									</div>
									
									<div className="grid grid-cols-7 gap-0.5 sm:gap-1">
										{generateCalendarDays().map((date, index) => {
											const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
											const isToday = date.toDateString() === new Date().toDateString();
											const isSelected = selectedDate?.toDateString() === date.toDateString();
											const hasRealAvailability = getAvailableTimesForDate(date).length > 0;
											const isPastDate = date < new Date(new Date().setHours(0, 0, 0, 0));
											
											// For testing: if no real availability data, show all future dates as available
											const hasAvailability = hasRealAvailability || (availableSlots.length === 0 && !isPastDate && isCurrentMonth);
											
											const handleDateClick = (e: React.MouseEvent) => {
												e.preventDefault();
												e.stopPropagation();
												
												setSelectedDate(date);
												setSelectedTime(''); // Reset selected time when date changes
											};
											
											return (
												<button
													key={index}
													className={`h-6 w-6 sm:h-8 sm:w-8 p-0 text-xs flex items-center justify-center rounded transition-colors ${
														isSelected 
															? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900' 
															: 'hover:bg-stone-100 dark:hover:bg-stone-800'
													} ${
														!isCurrentMonth ? 'text-stone-300 dark:text-stone-600' : 'text-stone-900 dark:text-stone-100'
													} ${isToday ? 'ring-2 ring-stone-400' : ''} ${
														hasAvailability && isCurrentMonth ? 'bg-green-50 dark:bg-green-900/20' : ''
													} ${isPastDate ? 'opacity-50 cursor-not-allowed' : ''}`}
													onClick={isPastDate ? undefined : handleDateClick}
													disabled={isPastDate}
													type="button"
												>
													{date.getDate()}
												</button>
											);
										})}
									</div>
								</div>

								{/* Time Selection */}
								{selectedDate && (
									<div className="border border-stone-200 dark:border-stone-700 rounded-lg p-3 sm:p-4">
										<h4 className="font-medium text-stone-900 dark:text-stone-100 mb-3 text-sm sm:text-base">
											Available Times for {selectedDate.toLocaleDateString('en-US', { 
												weekday: 'long', 
												month: 'long', 
												day: 'numeric' 
											})}
										</h4>
										{(() => {
											// Show loading state while fetching slots
											if (isLoadingSlots) {
												return (
													<div className="text-center py-8 text-stone-500 dark:text-stone-400">
														<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-900 dark:border-stone-100 mx-auto mb-3"></div>
														<p className="text-sm">Loading available times...</p>
														<p className="text-xs mt-1">Fetching your calendar availability</p>
													</div>
												);
											}

											const timeSlots = generateTimeSlots(selectedDate);
											return timeSlots.length > 0 ? (
												<div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
													{timeSlots.map((slot, index) => (
														<button
															key={index}
															className={`text-xs h-8 sm:h-9 px-2 py-1 rounded border ${
																selectedTime === slot.value 
																	? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900' 
																	: 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 border-stone-300 dark:border-stone-600 hover:bg-stone-50 dark:hover:bg-stone-700'
															}`}
															onClick={() => {
																setSelectedTime(slot.value || '');
															}}
															type="button"
														>
															<div className="flex flex-col items-center">
																<span>{slot.time}</span>
																{slot.duration && (
																	<span className="text-xs opacity-70">({slot.duration}m)</span>
																)}
															</div>
														</button>
													))}
												</div>
											) : (
												<div className="text-center py-8 text-stone-500 dark:text-stone-400">
													<Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
													<p className="text-sm">No available times for this date</p>
													<p className="text-xs mt-1">This date is either fully booked or not available</p>
													<p className="text-xs mt-1">Please select a date with green highlighting</p>
												</div>
											);
										})()}
									</div>
								)}
							</div>
						</div>

							{/* Action Buttons */}
							<div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-4 sm:pt-6 border-t border-stone-200 dark:border-stone-700 mt-4 sm:mt-6">
								<button 
									onClick={onClose}
									className="flex-1 h-10 sm:h-9 px-4 py-2 border border-stone-300 dark:border-stone-600 rounded-md bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700"
								>
									Cancel
								</button>
								<button 
									onClick={handleSubmit}
									disabled={!bookingData.name || !bookingData.email || !bookingData.service || !selectedDate || !selectedTime}
									className="flex-1 h-10 sm:h-9 px-4 py-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-md hover:bg-stone-800 dark:hover:bg-stone-200 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									Schedule Meeting
								</button>
							</div>
						</>
						)}
					</div>
				</div>
			</div>
		</>
	);
}
