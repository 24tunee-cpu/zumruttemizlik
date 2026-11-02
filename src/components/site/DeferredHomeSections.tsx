'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const Testimonials = dynamic(
  () => import('@/components/site/Testimonials').then((mod) => mod.Testimonials),
  {
    ssr: true,
    loading: () => <div className="h-96 animate-pulse bg-slate-900" />,
  }
);

const BlogSection = dynamic(
  () => import('@/components/site/BlogSection').then((mod) => mod.BlogSection),
  {
    ssr: false,
    loading: () => <div className="h-96 animate-pulse bg-slate-950" />,
  }
);

const ContactForm = dynamic(
  () => import('@/components/site/ContactForm').then((mod) => mod.ContactForm),
  {
    ssr: false,
    loading: () => <div className="h-[640px] animate-pulse bg-slate-900" />,
  }
);

type HomeTestimonial = {
  id: string;
  name: string;
  location: string;
  rating: number;
  content: string;
  avatar?: string;
  service?: string;
  isActive: boolean;
};

function SectionLoading({ height = 'h-96' }: { height?: string }) {
  return (
    <div className={`${height} flex items-center justify-center animate-pulse bg-slate-900`}>
      <span className="sr-only">Yükleniyor...</span>
    </div>
  );
}

export default function DeferredHomeSections({
  initialTestimonials = [],
}: {
  initialTestimonials?: HomeTestimonial[];
}) {
  return (
    <>
      <Suspense fallback={<SectionLoading height="h-96" />}>
        <Testimonials initialTestimonials={initialTestimonials} />
      </Suspense>

      <Suspense fallback={<SectionLoading height="h-96" />}>
        <BlogSection
          limit={3}
          featuredLayout
          title="Temizlik Rehberi & Fiyat Blogu"
          description="Zekeriyaköy, Sarıyer ve İstanbul geneli için 2026 fiyat rehberleri, temizlik ipuçları ve profesyonel hizmet önerileri."
        />
      </Suspense>

      <Suspense fallback={<SectionLoading height="h-[640px]" />}>
        <ContactForm variant="dark" layout="home" />
      </Suspense>
    </>
  );
}
