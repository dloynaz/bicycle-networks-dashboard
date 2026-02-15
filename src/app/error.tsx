'use client';

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: Props) {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex items-center justify-center p-6">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold text-primary">Something went wrong</h1>
        <p className="mt-2 text-sm text-zinc-500">
          {error?.message || 'An unexpected error occurred. Please try again.'}
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-4 inline-flex items-center justify-center rounded-pill border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-primary hover:bg-zinc-50"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
