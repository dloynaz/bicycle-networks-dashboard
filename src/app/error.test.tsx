import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import Error from './error';

describe('Error page', () => {
  it('renders fallback message and calls reset', () => {
    const reset = vi.fn();
    render(<Error error={new Error('Boom')} reset={reset} />);

    expect(screen.getByText('An unexpected error occurred. Please try again.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(reset).toHaveBeenCalled();
  });
});
