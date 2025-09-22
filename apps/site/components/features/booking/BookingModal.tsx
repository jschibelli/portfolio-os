'use client';

import { useState } from 'react';
import { Calendar, Clock, MapPin, User, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { BookingConfirmationModal } from './BookingConfirmationModal';

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
	onBookingComplete
}: BookingModalProps) {
	const [step, setStep] = useState(1);
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
	const [selectedTime, setSelectedTime] = useState<string>('');
	const [currentMonth, setCurrentMonth] = useState(new Date());

	const [bookingData, setBookingData] = useState({
		name: '',
		email: '',
		service: '',
		timezone: 'America/New_York',
	});


	const [showConfirmation, setShowConfirmation] = useState(false);

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
				
				return slotDateStr === dateStr;
			} catch (error) {
				return false;
			}
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
		
		// If no available slots at all, or if all slots are invalid, provide some mock data for testing
		if (availableSlots.length === 0 || realSlots.length === 0) {
			const mockSlots = [];
			const baseDate = new Date(date);
			
			// Generate 3-4 mock time slots for the selected date
			for (let i = 0; i < 4; i++) {
				const hour = 9 + (i * 2); // 9 AM, 11 AM, 1 PM, 3 PM
				const mockStart = new Date(baseDate);
				mockStart.setHours(hour, 0, 0, 0);
				const mockEnd = new Date(mockStart);
				mockEnd.setHours(hour + 1, 0, 0, 0);
				
				mockSlots.push({
					time: mockStart.toLocaleTimeString('en-US', { 
						hour: 'numeric', 
						minute: '2-digit',
						hour12: true 
					}),
					value: mockStart.toISOString(),
					available: true,
					duration: 60,
					isRealData: false
				});
			}
			
			return mockSlots;
		}
		
		return [];
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!selectedDate || !selectedTime) return;
		setShowConfirmation(true);
	};

	const handleConfirm = () => {
		if (onBookingComplete) {
			onBookingComplete({
				...bookingData,
				date: selectedDate?.toISOString(),
				time: selectedTime
			});
		}
		setShowConfirmation(false);
		onClose();
		setStep(1);
		setSelectedDate(null);
		setSelectedTime('');
		setBookingData({
			name: '',
			email: '',
			service: '',
			timezone: 'America/New_York',
		});
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
							<h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">Book a Consultation</h2>
							<button 
								onClick={onClose}
								className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded"
							>
								<X className="h-4 w-4" />
							</button>
						</div>
						<p className="text-sm text-stone-600 dark:text-stone-400 mt-2">
							Schedule a meeting to discuss your project
						</p>
					</div>

					{/* Content */}
					<div className="bg-white dark:bg-stone-900 p-3 sm:p-6">
						
						{message && (
							<div className="mb-4 sm:mb-6 p-3 bg-stone-50 dark:bg-stone-800 rounded-lg">
								<p className="text-sm text-stone-700 dark:text-stone-300">{message}</p>
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
                                                                                                className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                                                                                                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
											>
												<ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
											</Button>
                                                                                        <Button
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
					</div>
				</div>
			</div>

			<BookingConfirmationModal
				isOpen={showConfirmation}
				onClose={() => setShowConfirmation(false)}
				bookingDetails={{
					service: bookingData.service,
					date: selectedDate?.toISOString() || '',
					time: selectedTime,
					duration: '60 minutes',
					price: '$150',
				}}
			/>
		</>
	);
}
