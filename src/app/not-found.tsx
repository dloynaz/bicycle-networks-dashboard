export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex items-center justify-center p-6">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold text-primary">Page not found</h1>
        <p className="mt-2 text-sm text-zinc-500">
          The requested network could not be found. Please check the link or try again.
        </p>
      </div>
    </div>
  );
}
