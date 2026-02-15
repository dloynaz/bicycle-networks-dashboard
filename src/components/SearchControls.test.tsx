import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import SearchControls from './SearchControls';

describe('SearchControls', () => {
  it('calls onSearchChange when typing', () => {
    const onSearchChange = vi.fn();
    const onCountryChange = vi.fn();

    vi.useFakeTimers();

    render(
      <SearchControls
        search=""
        selectedCountry=""
        onSearchChange={onSearchChange}
        onCountryChange={onCountryChange}
      />
    );

    const input = screen.getByPlaceholderText('Search network');
    fireEvent.change(input, { target: { value: 'bike' } });

    vi.runAllTimers();

    expect(onSearchChange).toHaveBeenCalledWith('bike');

    vi.useRealTimers();
  });

  it('filters countries in the dropdown', () => {
    const onSearchChange = vi.fn();
    const onCountryChange = vi.fn();

    render(
      <SearchControls
        search=""
        selectedCountry=""
        onSearchChange={onSearchChange}
        onCountryChange={onCountryChange}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Country' }));

    const countrySearch = screen.getByPlaceholderText('Search country');
    fireEvent.change(countrySearch, { target: { value: 'United' } });

    const matches = screen.getAllByText(/United/i);
    expect(matches.length).toBeGreaterThan(0);
  });

  it('calls onCountryChange when selecting a country', () => {
    const onSearchChange = vi.fn();
    const onCountryChange = vi.fn();

    render(
      <SearchControls
        search=""
        selectedCountry=""
        onSearchChange={onSearchChange}
        onCountryChange={onCountryChange}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Country' }));
    fireEvent.click(screen.getByText('United States'));

    expect(onCountryChange).toHaveBeenCalledWith('United States');
  });
});
