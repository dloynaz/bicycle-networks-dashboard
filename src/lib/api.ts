import axios from 'axios';
import { Network, Station } from '../types';

type RawLocation = {
  latitude?: unknown;
  longitude?: unknown;
  lat?: unknown;
  lng?: unknown;
  lon?: unknown;
  city?: unknown;
  name?: unknown;
  country?: unknown;
};

type RawStation = {
  id?: unknown;
  name?: unknown;
  free_bikes?: unknown;
  empty_slots?: unknown;
  latitude?: unknown;
  longitude?: unknown;
  lat?: unknown;
  lng?: unknown;
  lon?: unknown;
  extra?: { uid?: unknown };
};

type RawNetwork = {
  id?: unknown;
  name?: unknown;
  company?: unknown;
  location?: RawLocation;
  city?: RawLocation | unknown;
  href?: unknown;
  stations?: RawStation[];
};

const API_BASE = 'https://api.citybik.es/v2';
const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

// Fetch the full list of networks and normalize for UI consumption.
export async function fetchNetworks(): Promise<Network[]> {
  try {
    const res = await api.get('/networks');
    const networks: RawNetwork[] = Array.isArray(res.data?.networks) ? res.data.networks : [];
    return networks.map(normalizeNetwork);
  } catch (e) {
    throw new Error('Unable to load networks.');
  }
}

// Fetch a single network by id and hydrate stations when available.
export async function fetchNetworkById(id: string): Promise<Network | null> {
  try {
    const encodedId = encodeURIComponent(id);
    const res = await api.get(`/networks/${encodedId}`, {
      // Treat 4xx as a valid response so we can handle "not found" gracefully
      validateStatus: (status) => status >= 200 && status < 500,
    });
    // If the direct lookup 404s, try to resolve the id against the networks list
    if (res.status === 404) {
      try {
        const listRes = await api.get('/networks');
        const all: RawNetwork[] = Array.isArray(listRes.data?.networks) ? listRes.data.networks : [];

        const slug = (s: string) =>
          String(s)
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

        const idLower = id.toLowerCase();

        const candidate = all.find((n: RawNetwork) => {
          const nid = String(n.id ?? '').toLowerCase();
          const href = String(n.href ?? '').toLowerCase();
          const nameSlug = slug(String(n.name ?? '')).toLowerCase();

          if (nid === idLower) return true;
          if (href.endsWith(`/${idLower}`)) return true;
          if (nameSlug === idLower) return true;
          // also try without dashes
          if (nid.replace(/-/g, '') === idLower.replace(/-/g, '')) return true;
          return false;
        });

        if (candidate && candidate.id) {
          const retryId = String(candidate.id);
          const retryRes = await api.get(`/networks/${retryId}`, {
            validateStatus: (status) => status >= 200 && status < 500,
          });
          if (retryRes.status === 200) {
            const raw2 = retryRes.data?.network;
            if (raw2) {
              const normalized2 = normalizeNetwork(raw2);
              if (raw2.stations) normalized2.stations = normalizeStations(raw2.stations);
              return normalized2;
            }
          }
        }
      } catch (e) {
        // ignore list lookup errors and fall through to returning null
      }

      return null;
    }

    const raw = res.data?.network;
    if (!raw) return null;
    const normalized = normalizeNetwork(raw);
    if (Array.isArray(raw.stations)) normalized.stations = normalizeStations(raw.stations);
    return normalized;
  } catch (e) {
    return null;
  }
}

// Normalize raw network payloads into the app's `Network` shape.
function normalizeNetwork(raw: RawNetwork): Network {
  const company = Array.isArray(raw.company)
    ? raw.company.map(String)
    : raw.company
    ? [String(raw.company)]
    : [];

  const location: RawLocation = (raw.location as RawLocation) || (raw.city as RawLocation) || {};
  const latitude = toNumber(location.latitude ?? location.lat, 0);
  const longitude = toNumber(location.longitude ?? location.lng ?? location.lon, 0);

  return {
    id: String(raw.id),
    name: String(raw.name ?? 'Unknown'),
    company,
    location: {
      city: String(location.city ?? location.name ?? ''),
      country: String(location.country ?? ''),
      latitude,
      longitude,
    },
  };
}

// Normalize stations into the app's `Station` shape.
function normalizeStations(stations: RawStation[]): Station[] {
  return stations.map((s) => ({
    id: String(s.id ?? s.extra?.uid ?? `${s.latitude}-${s.longitude}`),
    name: String(s.name ?? 'Unknown'),
    free_bikes: toNumber(s.free_bikes, 0),
    empty_slots: toNumber(s.empty_slots, 0),
    latitude: toNumber(s.latitude ?? s.lat, 0),
    longitude: toNumber(s.longitude ?? s.lon ?? s.lng, 0),
  }));
}

function toNumber(value: unknown, fallback: number) {
  const num = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(num) ? num : fallback;
}
