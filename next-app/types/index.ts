// Types for the Iceland trip data

export interface TripData {
  title: string;
  dateRange: string;
  duration: string;
  totalDays: number;
  travelers: string;
  vehicle: string;
  route: string;
  totalDistance: {
    km: number;
    miles: number;
  };
  mapUrl: string;
  resources: Resource[];
}

export interface Resource {
  title: string;
  items: ResourceItem[];
}

export interface ResourceItem {
  name: string;
  url?: string;
  description?: string;
  note?: string;
  subitems?: ResourceItem[];
}

export interface DayData {
  id: string;
  dayNumber: number;
  date: string;
  title: string;
  emoji: string;
  route: {
    from: string;
    to: string;
  };
  driving: {
    total: {
      distance: {
        km: number;
        miles: number;
      };
      time: string;
    };
    segments: DrivingSegment[];
  };
  summary: string;
  shortSummary?: string;
  image: {
    src: string;
    alt: string;
  };
  quote: {
    text: string;
    author: string;
  };
  mapUrl: string;
  schedule: Activity[];
  highlights: (string | Highlight)[];
  accommodation: Accommodation;
  alternatives: Alternative[];
  badWeatherAlternatives: Alternative[];
  hotSprings?: HotSpring[];
  tip?: string;
  notes?: string | string[];
}

export interface DrivingSegment {
  from: string;
  to: string;
  distance: {
    km: number;
    miles: number;
  };
  time: string;
}

export interface Activity {
  time: string;
  title: string;
  description: string;
  isHighlight?: boolean;
  isHiddenGem?: boolean;
  subActivities?: SubActivity[];
}

export interface SubActivity {
  title: string;
  description?: string;
}

export interface Highlight {
  title: string;
  description: string;
  link?: string;
}

export interface Accommodation {
  name: string;
  address: string;
  cost: string;
  roomType: string;
  notes?: string;
}

export interface Alternative {
  title: string;
  description: string;
  link?: string;
  isGem?: boolean;
  isUserSelected?: boolean;
}

export interface HotSpring {
  name: string;
  description: string;
  location: string;
  cost: string;
  link?: string;
  isEveningRelaxation?: boolean;
}
