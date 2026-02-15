import { notFound } from 'next/navigation';
import { fetchNetworkById } from '../../../lib/api';
import type { Network } from '../../../types';
import NetworkDetailClient from '../../../components/NetworkDetailClient';

type Props = {
  params: { id: string };
};

// NetworkDetail fetches network data and renders the client detail view.
export default async function NetworkDetail({ params }: Props) {
  // Normalize params across Next.js configurations.
  const resolvedParams = (await params) as { id?: string };
  const id = resolvedParams?.id;
  if (!id) {
    notFound();
  }

  // Server-side fetch to hydrate the client detail view.
  const network: Network | null = await fetchNetworkById(id);

  if (!network) {
    notFound();
  }

  return <NetworkDetailClient network={network} />;
}