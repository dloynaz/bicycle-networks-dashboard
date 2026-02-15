import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import StationMap from './StationMap';

vi.mock('mapbox-gl', () => ({
  __esModule: true,
  default: {
    accessToken: '',
  },
}));

vi.mock('leaflet', () => {
  throw new Error('Leaflet load failed');
});

describe('StationMap', () => {
  it('shows a fallback error when Leaflet fails to load', async () => {
    render(
      <StationMap
        stations={[]}
        networkLocation={{ latitude: 0, longitude: 0 }}
      />
    );

    expect(await screen.findByText('Unable to load the fallback map.')).toBeInTheDocument();
  });
});
