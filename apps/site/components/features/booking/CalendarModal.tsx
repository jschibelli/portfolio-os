'use client';

import { useState } from 'react';
import { Calendar, Clock, X } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';

interface TimeSlot {
	id: string;
	start: string;
	end: string;
	available: boolean;
	duration: number;
}

interface CalendarModalProps {
	isOpen: boolean;
	onClose: () => void;
	onTimeSlotSelect: (slot: TimeSlot) => void;
	selectedDate?: string;
}

export function CalendarModal({ isOpen, onClose, onTimeSlotSelect, selectedDate }: CalendarModalProps) {
	const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);

	// Mock time slots - in a real app, these would come from an API
	const timeSlots: TimeSlot[] = [
		{ id: '1', start: '09:00', end: '10:00', available: true, duration: 60 },
		{ id: '2', start: '10:00', end: '11:00', available: true, duration: 60 },
		{ id: '3', start: '11:00', end: '12:00', available: false, duration: 60 },
		{ id: '4', start: '13:00', end: '14:00', available: true, duration: 60 },
		{ id: '5', start: '14:00', end: '15:00', available: true, duration: 60 },
		{ id: '6', start: '15:00', end: '16:00', available: false, duration: 60 },
		{ id: '7', start: '16:00', end: '17:00', available: true, duration: 60 },
	];

	const handleTimeSlotClick = (slot: TimeSlot) => {
		if (slot.available) {
			setSelectedTimeSlot(slot);
		}
	};

	const handleConfirm = () => {
		if (selectedTimeSlot) {
			onTimeSlotSelect(selectedTimeSlot);
			onClose();
		}
	};

	if (!isOpen) return null;

	return (
		<div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center duration-300">
			{/* Backdrop */}
			<div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

			{/* Modal */}
			<Card className="animate-in slide-in-from-bottom-4 mx-4 w-full max-w-md duration-300 ease-out">
				<CardHeader className="pb-4">
					<div className="flex items-center justify-between">
						<CardTitle className="text-xl font-semibold">Select Time</CardTitle>
                                          <Button onClick={onClose}>
							<X className="h-4 w-4" />
						</Button>
					</div>
					<div className="flex items-center space-x-2 text-sm text-muted-foreground">
						<Calendar className="h-4 w-4" />
						<span>{selectedDate || 'Select a date'}</span>
					</div>
				</CardHeader>

				<CardContent>
					<div className="space-y-4">
						<div className="grid grid-cols-1 gap-2">
							{timeSlots.map((slot) => (
								<Button
									key={slot.id}
									className={`h-auto justify-start p-3 ${
										!slot.available ? 'opacity-50 cursor-not-allowed' : ''
									}`}
									onClick={() => handleTimeSlotClick(slot)}
									disabled={!slot.available}
								>
									<div className="flex w-full items-center space-x-2">
										<Clock className="h-4 w-4 flex-shrink-0" />
										<div className="flex-1 text-left">
											<div className="font-medium">
												{slot.start} - {slot.end}
											</div>
											<div className="text-xs text-muted-foreground">
												60 minutes
											</div>
										</div>
										{!slot.available && (
                                                                                  <Badge className="text-xs">
												Booked
											</Badge>
										)}
									</div>
								</Button>
							))}
						</div>

						<div className="flex space-x-3 pt-4">
                                                        <Button onClick={onClose} className="flex-1">
								Cancel
							</Button>
							<Button
								onClick={handleConfirm}
								disabled={!selectedTimeSlot}
								className="flex-1"
							>
								Confirm Time
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
