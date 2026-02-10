import axios from 'axios';
import { Network, Station } from '../types';

type RawNetwork = any;

export async function fetchNetworks(): Promise<Network[]> {
  const res = await axios.get('https://api.citybik.es/v2/networks');
  const networks: RawNetwork[] = res.data?.networks || [];

  return networks.map(normalizeNetwork);
}

export async function fetchNetworkById(id: string): Promise<Network | null> {
  try {
    const encodedId = encodeURIComponent(id);
    console.debug(`[fetchNetworkById] requesting id='${id}' (encoded='${encodedId}')`);

    const res = await axios.get(`https://api.citybik.es/v2/networks/${encodedId}`, {
      // Treat 4xx as a valid response so we can handle "not found" gracefully
      validateStatus: (status) => status >= 200 && status < 500,
    });
    // If the direct lookup 404s, try to resolve the id against the networks list
    console.debug(`[fetchNetworkById] response status=${res.status} for id='${id}'`);
    if (res.status === 404) {
      try {
        const listRes = await axios.get('https://api.citybik.es/v2/networks');
        const all: RawNetwork[] = listRes.data?.networks || [];

        const slug = (s: string) =>
          String(s)
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

        const idLower = id.toLowerCase();

        const candidate = all.find((n: any) => {
          const nid = String(n.id || '').toLowerCase();
          const href = String(n.href || '').toLowerCase();
          const nameSlug = slug(String(n.name || '')).toLowerCase();

          if (nid === idLower) return true;
          if (href.endsWith(`/${idLower}`)) return true;
          if (nameSlug === idLower) return true;
          // also try without dashes
          if (nid.replace(/-/g, '') === idLower.replace(/-/g, '')) return true;
          return false;
        });

        if (candidate && candidate.id) {
          const retryId = String(candidate.id);
          console.debug(`[fetchNetworkById] resolved candidate id='${retryId}' for requested id='${id}'`);
          const retryRes = await axios.get(`https://api.citybik.es/v2/networks/${retryId}`, {
            validateStatus: (status) => status >= 200 && status < 500,
          });
          if (retryRes.status === 200) {
            const raw2 = retryRes.data?.network;
            if (raw2) {
              const normalized2 = normalizeNetwork(raw2);
              if (raw2.stations) {
                normalized2.stations = raw2.stations.map((s: any) => ({
                  id: s.id ?? s.extra?.uid ?? `${s.latitude}-${s.longitude}`,
                  name: s.name ?? 'Unknown',
                  free_bikes: Number(s.free_bikes ?? 0),
                  empty_slots: Number(s.empty_slots ?? 0),
                  latitude: Number(s.latitude ?? s.lat ?? 0),
                  longitude: Number(s.longitude ?? s.lon ?? s.lng ?? 0),
                })) as Station[];
              }
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
    if (raw.stations) {
      normalized.stations = raw.stations.map((s: any) => ({
        id: s.id ?? s.extra?.uid ?? `${s.latitude}-${s.longitude}`,
        name: s.name ?? 'Unknown',
        free_bikes: Number(s.free_bikes ?? 0),
        empty_slots: Number(s.empty_slots ?? 0),
        latitude: Number(s.latitude ?? s.lat ?? 0),
        longitude: Number(s.longitude ?? s.lon ?? s.lng ?? 0),
      })) as Station[];
    }
    return normalized;
  } catch (e) {
    console.error('fetchNetworkById error', e);
    return null;
  }
}

function normalizeNetwork(raw: RawNetwork): Network {
  const company = Array.isArray(raw.company)
    ? raw.company.map(String)
    : raw.company
    ? [String(raw.company)]
    : [];

  const location = raw.location || raw.city || {};
  const latitude = Number(location.latitude ?? location.lat ?? 0);
  const longitude = Number(location.longitude ?? location.lng ?? location.lon ?? 0);

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
