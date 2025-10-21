'use client';

import { useState, useEffect } from 'react';
import AudienceSpecificCTA from '../../components/features/cta/audience-specific-cta';
import EnhancedCTASection from '../../components/features/cta/enhanced-cta-section';
import { BookingModal } from '../../components/features/booking/BookingModal';

interface TimeSlot {
  start: string;
  end: string;
  duration: number;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export function ProjectsCTASection() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  const fetchAvailableSlots = async () => {
    setIsLoadingSlots(true);
    try {
      // Fetch available slots from the API - get slots for next 14 days
      console.log('📅 [Frontend] Fetching available slots...');
      const response = await fetch('/api/schedule/availability?days=14&duration=30');
      console.log('📅 [Frontend] Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📅 [Frontend] Received data:', data);
        console.log('📅 [Frontend] Slot count:', data.count);
        console.log('📅 [Frontend] First few slots:', data.slots?.slice(0, 3));
        setAvailableSlots(data.slots || []);
      } else {
        const errorData = await response.json();
        console.error('❌ [Frontend] Failed to fetch slots:', response.status, errorData);
        setAvailableSlots([]);
      }
    } catch (error) {
      console.error('❌ [Frontend] Error fetching available slots:', error);
      setAvailableSlots([]);
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const handleScheduleInterview = () => {
    fetchAvailableSlots();
    setIsBookingModalOpen(true);
  };

  const handleBookingComplete = async (bookingData: {
    name: string;
    email: string;
    timezone: string;
    slot: TimeSlot;
  }) => {
    try {
      // Call the booking API to create the calendar event
      const response = await fetch('/api/schedule/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startISO: bookingData.slot.start,
          durationMinutes: bookingData.slot.duration,
          timeZone: bookingData.timezone,
          attendeeEmail: bookingData.email,
          attendeeName: bookingData.name,
          summary: 'Consultation with John Schibelli',
          description: 'Consultation scheduled via portfolio website',
          sendUpdates: 'all',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to book interview');
      }

      const result = await response.json();
      
      // Close the modal
      setIsBookingModalOpen(false);
      
      // Show success message (you could add a toast notification here)
      alert(`✅ Interview confirmed!\n\nMeet Link: ${result?.booking?.googleMeetLink || 'Check your email'}`);
    } catch (error) {
      console.error('Error booking interview:', error);
      alert('❌ Sorry, there was an error booking the interview. Please try again or contact John directly.');
    }
  };

  return (
    <>
      <AudienceSpecificCTA 
        audience="recruiters" 
        className="bg-stone-50 dark:bg-stone-900" 
        onScheduleClick={handleScheduleInterview}
      />
      <AudienceSpecificCTA 
        audience="startup-founders" 
        className="bg-white dark:bg-stone-950" 
        onScheduleClick={handleScheduleInterview}
      />
      <AudienceSpecificCTA audience="clients" className="bg-stone-50 dark:bg-stone-900" />
      <EnhancedCTASection audience="general" />

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        availableSlots={availableSlots}
        timezone="America/New_York"
        businessHours={{ start: 9, end: 18, timezone: 'America/New_York' }}
        meetingDurations={[30, 60]}
        message="Schedule a consultation to discuss your project or opportunity. Select your preferred date and time below."
        onBookingComplete={handleBookingComplete}
        isLoadingSlots={isLoadingSlots}
      />
    </>
  );
}

