import { describe, expect, it, vi } from 'vitest';

vi.mock('axios', () => {
  const apiGet = vi.fn();
  return {
    __esModule: true,
    default: {
      create: vi.fn(() => ({ get: apiGet })),
    },
    create: vi.fn(() => ({ get: apiGet })),
    __apiGet: apiGet,
  };
});

import { fetchNetworkById, fetchNetworks } from './api';

const getApiGet = async () => {
  const axios = await import('axios');
  return (axios as any).__apiGet as ReturnType<typeof vi.fn>;
};

describe('api', () => {
  it('normalizes network list', async () => {
    const apiGet = await getApiGet();
    apiGet.mockResolvedValueOnce({
      data: {
        networks: [
          {
            id: 'net-1',
            name: 'City Bikes',
            company: 'Bike Co',
            location: { city: 'Paris', country: 'FR', latitude: 1, longitude: 2 },
          },
        ],
      },
    });

    const networks = await fetchNetworks();
    expect(networks).toHaveLength(1);
    expect(networks[0]).toEqual({
      id: 'net-1',
      name: 'City Bikes',
      company: ['Bike Co'],
      location: {
        city: 'Paris',
        country: 'FR',
        latitude: 1,
        longitude: 2,
      },
    });
  });

  it('fetches a network by id with stations', async () => {
    const apiGet = await getApiGet();
    apiGet.mockResolvedValueOnce({
      status: 200,
      data: {
        network: {
          id: 'net-2',
          name: 'Metro Bikes',
          company: ['Metro'],
          location: { city: 'Berlin', country: 'DE', latitude: 10, longitude: 20 },
          stations: [
            { id: 's1', name: 'Station 1', free_bikes: 4, empty_slots: 6, latitude: 1, longitude: 2 },
          ],
        },
      },
    });

    const network = await fetchNetworkById('net-2');
    expect(network?.stations).toHaveLength(1);
    expect(network?.stations?.[0]).toEqual({
      id: 's1',
      name: 'Station 1',
      free_bikes: 4,
      empty_slots: 6,
      latitude: 1,
      longitude: 2,
    });
  });

  it('returns null when network id is not found', async () => {
    const apiGet = await getApiGet();
    apiGet
      .mockResolvedValueOnce({ status: 404, data: {} })
      .mockResolvedValueOnce({ data: { networks: [] } });

    const network = await fetchNetworkById('missing');
    expect(network).toBeNull();
  });

  it('resolves 404 via networks list and retries', async () => {
    const apiGet = await getApiGet();
    apiGet
      .mockResolvedValueOnce({ status: 404, data: {} })
      .mockResolvedValueOnce({
        data: {
          networks: [
            { id: 'real-id', name: 'City Bikes', href: '/v2/networks/real-id' },
          ],
        },
      })
      .mockResolvedValueOnce({
        status: 200,
        data: {
          network: {
            id: 'real-id',
            name: 'City Bikes',
            company: 'Operator',
            location: { city: 'Rome', country: 'IT', latitude: 3, longitude: 4 },
          },
        },
      });

    const network = await fetchNetworkById('city-bikes');
    expect(network?.id).toBe('real-id');
    expect(network?.name).toBe('City Bikes');
  });
});
