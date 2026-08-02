export type GuestCategory = 'VVIP / Dignitary' | 'Fleet Officer / Alumni' | 'Corporate Partner' | 'Media & Press' | 'Special Guest';

export type DeckClass = 'Naval Officer Lounge' | 'Horizon Executive Deck' | 'Admiral Suite' | 'Maritime Pavilion';

export type RsvpStatus = 'Confirmed' | 'Pending' | 'Declined';

export interface Guest {
  id: string;
  passCode: string;
  name: string;
  designation: string;
  organization: string;
  email: string;
  phone: string;
  category: GuestCategory;
  deck: DeckClass;
  seat: string;
  gate: string;
  plusOne: boolean;
  plusOneName?: string;
  dietaryPreference: 'Vegetarian' | 'Non-Vegetarian' | 'Jain' | 'Vegan';
  specialAssistance: boolean;
  rsvpStatus: RsvpStatus;
  checkedIn: boolean;
  checkInTime?: string;
  createdAt: string;
}

export interface EventScheduleItem {
  time: string;
  title: string;
  location: string;
  description: string;
  highlight?: boolean;
}
