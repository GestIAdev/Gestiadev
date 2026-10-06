import Shell from '@/components/layout/Shell';
import MediaGallery from '@/components/sections/MediaGallery';

export const metadata = {
  title: 'Media Gallery — LuxSync Live Demos',
  description:
    'Real footage of the LuxSync photonic control ecosystem: engine demos, live shows and technical presentations.',
};

export default function MediaPage() {
  return (
    <Shell>
      <MediaGallery />
    </Shell>
  );
}
