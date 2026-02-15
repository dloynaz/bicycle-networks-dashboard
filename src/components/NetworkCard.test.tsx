import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import NetworkCard from './NetworkCard';
import type { Network } from '../types';

describe('NetworkCard', () => {
  const baseNetwork: Network = {
    id: 'net-1',
    name: 'City Bikes',
    company: [],
    location: { city: '', country: '', latitude: 0, longitude: 0 },
  };

  it('renders a fallback location label', () => {
    render(<NetworkCard network={baseNetwork} onClick={() => {}} />);
    expect(screen.getByText('Unknown location')).toBeInTheDocument();
  });

  it('invokes onClick when clicked', () => {
    const onClick = vi.fn();
    render(<NetworkCard network={baseNetwork} onClick={onClick} />);

    fireEvent.click(screen.getByText('City Bikes'));
    expect(onClick).toHaveBeenCalledWith('net-1');
  });
});
