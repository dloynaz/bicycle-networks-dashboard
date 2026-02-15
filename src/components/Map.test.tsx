import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Map from './Map';

vi.mock('mapbox-gl', () => ({
  __esModule: true,
  default: {
    accessToken: '',
  },
}));

vi.mock('leaflet', () => {
  throw new Error('Leaflet load failed');
});

describe('Map', () => {
  it('shows a fallback error when Leaflet fails to load', async () => {
    render(<Map networks={[]} onNetworkClick={() => {}} />);

    expect(await screen.findByText('Unable to load the fallback map.')).toBeInTheDocument();
  });
});
