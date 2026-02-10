export interface Station {
  id: string;
  name: string;
  free_bikes: number;
  empty_slots: number;
  latitude: number;
  longitude: number;
}

export interface NetworkLocation {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface Network {
  id: string;
  name: string;
  company: string[];
  location: NetworkLocation;
  stations?: Station[];
}
