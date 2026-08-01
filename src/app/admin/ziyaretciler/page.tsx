import VisitorAnalyticsHub from '@/components/admin/VisitorAnalyticsHub';

export const metadata = {
  title: 'Ziyaretçi Analitiği | Admin',
};

export default function AdminVisitorsPage() {
  return (
    <div className="mx-auto max-w-[1600px]">
      <VisitorAnalyticsHub />
    </div>
  );
}
