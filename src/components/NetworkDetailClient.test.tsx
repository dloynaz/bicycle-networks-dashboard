import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import NetworkDetailClient from './NetworkDetailClient';
import type { Network } from '../types';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ back: vi.fn() }),
}));

const network: Network = {
  id: 'net-1',
  name: 'Test Network',
  company: ['Operator'],
  location: { city: 'Test City', country: 'TC', latitude: 0, longitude: 0 },
  stations: [
    { id: 's1', name: 'Alpha', free_bikes: 2, empty_slots: 8, latitude: 1, longitude: 1 },
    { id: 's2', name: 'Beta', free_bikes: 10, empty_slots: 1, latitude: 2, longitude: 2 },
  ],
};

const getFirstStationName = () => {
  const rows = screen.getAllByRole('row');
  const bodyRow = rows.find((row) => within(row).queryByText('Alpha') || within(row).queryByText('Beta'));
  return bodyRow ? bodyRow.textContent || '' : '';
};

describe('NetworkDetailClient', () => {
  it('sorts stations by free bikes and toggles order', () => {
    render(<NetworkDetailClient network={network} />);

    expect(getFirstStationName()).toContain('Alpha');

    fireEvent.click(screen.getByText('Free Bikes'));
    expect(getFirstStationName()).toContain('Beta');
  });

  it('switches sorting to empty slots', () => {
    render(<NetworkDetailClient network={network} />);

    fireEvent.click(screen.getByText('Empty Slots'));
    expect(getFirstStationName()).toContain('Alpha');
  });
});
