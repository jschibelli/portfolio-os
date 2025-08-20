import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { Calendar, Clock, X, Check } from 'lucide-react';

interface TimeSlot {
  start: string;
  end: string;
  duration: number;
}

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableSlots: TimeSlot[];
  timezone: string;
  businessHours: { start: number; end: number; timezone: string };
  meetingDurations: number[];
  message?: string;
  onSlotSelect?: (slot: TimeSlot) => void;
}

export function CalendarModal({
  isOpen,
  onClose,
  availableSlots,
  timezone,
  businessHours,
  meetingDurations,
  message = 'Here are the available time slots for scheduling:',
  onSlotSelect
}: CalendarModalProps) {
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  if (!isOpen) return null;

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: timezone
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      timeZone: timezone
    });
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    if (onSlotSelect) {
      onSlotSelect(slot);
    }
  };

  const handleConfirm = () => {
    if (selectedSlot && onSlotSelect) {
      onSlotSelect(selectedSlot);
    }
    onClose();
  };

  // Group slots by date
  const slotsByDate = availableSlots.reduce((acc, slot) => {
    const date = formatDate(slot.start);
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(slot);
    return acc;
  }, {} as Record<string, TimeSlot[]>);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <CardTitle>Schedule a Meeting</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-gray-600">{message}</p>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {Object.entries(slotsByDate).map(([date, slots]) => (
              <div key={date} className="space-y-2">
                <h3 className="font-medium text-gray-900">{date}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {slots.map((slot, index) => (
                    <Button
                      key={index}
                      variant={selectedSlot === slot ? "default" : "outline"}
                      className="justify-start h-auto p-3"
                      onClick={() => handleSlotSelect(slot)}
                    >
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <div className="text-left">
                          <div className="font-medium">
                            {formatTime(slot.start)} - {formatTime(slot.end)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {slot.duration} minutes
                          </div>
                        </div>
                        {selectedSlot === slot && (
                          <Check className="h-4 w-4 ml-auto" />
                        )}
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {availableSlots.length === 0 && (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No available slots found for the selected time range.</p>
              <p className="text-sm text-gray-500 mt-2">
                Business hours: {businessHours.start}:00 - {businessHours.end}:00 ({businessHours.timezone})
              </p>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-gray-500">
              <p>Timezone: {timezone}</p>
              <p>Meeting durations: {meetingDurations.join(', ')} minutes</p>
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              {selectedSlot && (
                <Button onClick={handleConfirm}>
                  Confirm Selection
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
