import React from 'react';
import { fetchNetworkById } from '../../../lib/api';
import type { Network } from '../../../types';
import NetworkDetailClient from '../../../components/NetworkDetailClient';

type Props = {
  params: { id: string };
};

export default async function NetworkDetail({ params }: Props) {
  // `params` may be a Promise in some Next.js configurations; unwrap it first.
  const resolvedParams = (await params) as { id?: string };
  const id = resolvedParams?.id;
  if (!id) {
    console.warn('[NetworkDetail] missing params.id', resolvedParams);
    return <div className="min-h-screen bg-background text-neutral font-sans p-4">Network not found</div>;
  }

  const network: Network | null = await fetchNetworkById(id);

  if (!network) {
    return (
      <div className="min-h-screen bg-background text-neutral font-sans p-4">Network not found</div>
    );
  }

  return <NetworkDetailClient network={network} />;
}