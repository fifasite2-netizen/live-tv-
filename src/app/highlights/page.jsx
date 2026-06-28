import HighlightsList from '@/components/HighlightsList';

export const metadata = {
  title: 'Highlights - Ajker Khela',
  description: 'Watch the latest match highlights, game clips, and football goals.',
};

export default function HighlightsPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 w-full">
      <HighlightsList showAll />
    </div>
  );
}
