// Compute a compact list of page numbers around the current page.
export function getPageNumbers(current: number, total: number, maxVisible = 5): number[] {
  if (total <= 0) return [];
  const count = Math.min(maxVisible, total);
  const start = current > 3 ? current - 2 : 1;

  const pages: number[] = [];
  for (let i = 0; i < count; i += 1) {
    const page = start + i;
    if (page <= total) pages.push(page);
  }

  return pages;
}