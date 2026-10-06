import Shell from '@/components/layout/Shell';
import ConclaveIndex from '@/components/sections/ConclaveIndex';

export const metadata = {
  title: 'Developer Hub — LuxSync Community',
  description:
    'Support, community discussion and public .lfx fixture library for LuxSync Commander.',
};

export default function CommunityPage() {
  return (
    <Shell>
      <ConclaveIndex />
    </Shell>
  );
}
