import MatchSchedule from '@/components/MatchSchedule';

export const metadata = {
  title: 'Schedule - Ajker Khela',
  description: 'View upcoming match schedule and live streaming times.'
};

export default function SchedulePage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 w-full">
      <div className="max-w-3xl mx-auto">
        <MatchSchedule />
      </div>
    </div>
  );
}
