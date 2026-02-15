// Station represents a single bike station with capacity data.
export interface Station {
  id: string;
  name: string;
  free_bikes: number;
  empty_slots: number;
  latitude: number;
  longitude: number;
}

// NetworkLocation captures the geographic location of a network.
export interface NetworkLocation {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

// Network is the primary domain model used across the app.
export interface Network {
  id: string;
  name: string;
  company: string[];
  location: NetworkLocation;
  stations?: Station[];
}
