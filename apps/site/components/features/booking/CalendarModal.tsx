'use client';

import { useState } from 'react';
import { Calendar, Clock, X } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';

interface TimeSlot {
	start: string;
	end: string;
	duration: number;
}

interface CalendarModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSlotSelect: (slot: TimeSlot) => void;
	availableSlots: TimeSlot[];
	timezone: string;
	businessHours?: {
		start: number;
		end: number;
		timezone: string;
	};
	meetingDurations?: number[];
	message?: string;
}

export function CalendarModal({ 
	isOpen, 
	onClose, 
	onSlotSelect, 
	availableSlots,
	timezone,
	message 
}: CalendarModalProps) {
	const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);

	const handleTimeSlotClick = (slot: TimeSlot) => {
		console.log('🗓️ Time slot clicked:', slot);
		setSelectedTimeSlot(slot);
	};

	const handleConfirm = () => {
		alert('Schedule Meeting button clicked!');
		console.log('✅ Confirm clicked, selected slot:', selectedTimeSlot);
		if (selectedTimeSlot) {
			console.log('📞 Calling onSlotSelect with:', selectedTimeSlot);
			onSlotSelect(selectedTimeSlot);
			onClose();
		} else {
			console.warn('⚠️ No time slot selected');
			alert('Please select a time slot first!');
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
						<Button variant="ghost" size="sm" onClick={onClose}>
							<X className="h-4 w-4" />
						</Button>
					</div>
					<div className="flex flex-col gap-2">
						{message && (
							<p className="text-sm text-muted-foreground">{message}</p>
						)}
						<div className="flex items-center space-x-2 text-sm text-muted-foreground">
							<Calendar className="h-4 w-4" />
							<span>Timezone: {timezone}</span>
						</div>
					</div>
				</CardHeader>

				<CardContent>
					<div className="space-y-4">
						{availableSlots.length === 0 ? (
							<p className="text-center text-muted-foreground py-8">
								No available time slots found. Please try a different date range.
							</p>
						) : (
							<div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto">
								{availableSlots.map((slot, index) => {
									const startDate = new Date(slot.start);
									const endDate = new Date(slot.end);
									const isSelected = selectedTimeSlot?.start === slot.start;
									
									return (
										<Button
											key={index}
											variant={isSelected ? 'default' : 'outline'}
											className="h-auto justify-start p-3"
											onClick={() => handleTimeSlotClick(slot)}
										>
											<div className="flex w-full items-center space-x-2">
												<Clock className="h-4 w-4 flex-shrink-0" />
												<div className="flex-1 text-left">
													<div className="font-medium">
														{startDate.toLocaleDateString()} at {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
													</div>
													<div className="text-xs text-muted-foreground">
														{slot.duration} minutes
													</div>
												</div>
											</div>
										</Button>
									);
								})}
							</div>
						)}

						<div className="flex space-x-3 pt-4">
							<Button variant="outline" onClick={onClose} className="flex-1">
								Cancel
							</Button>
							<Button
								onClick={handleConfirm}
								disabled={!selectedTimeSlot}
								className="flex-1"
							>
								Schedule Meeting
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
