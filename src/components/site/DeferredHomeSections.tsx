'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const Testimonials = dynamic(
  () => import('@/components/site/Testimonials').then((mod) => mod.Testimonials),
  {
    ssr: false,
    loading: () => <div className="h-96 bg-slate-900 animate-pulse" />,
  }
);

const BlogSection = dynamic(
  () => import('@/components/site/BlogSection').then((mod) => mod.BlogSection),
  {
    ssr: false,
    loading: () => <div className="h-96 bg-slate-950 animate-pulse" />,
  }
);

const ContactForm = dynamic(
  () => import('@/components/site/ContactForm').then((mod) => mod.ContactForm),
  {
    ssr: false,
    loading: () => <div className="h-[640px] bg-slate-900 animate-pulse" />,
  }
);

function SectionLoading({ height = 'h-96' }: { height?: string }) {
  return (
    <div className={`${height} flex items-center justify-center bg-slate-900 animate-pulse`}>
      <span className="sr-only">Yükleniyor...</span>
    </div>
  );
}

export default function DeferredHomeSections() {
  return (
    <>
      <Suspense fallback={<SectionLoading height="h-96" />}>
        <Testimonials />
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
