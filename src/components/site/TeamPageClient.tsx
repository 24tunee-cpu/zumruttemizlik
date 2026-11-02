'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { Mail, Phone, Users } from 'lucide-react';
import { formatGoogleTrustLine } from '@/config/trust-signals';

export type PublicTeamMember = {
  id: string;
  name: string;
  role: string;
  bio?: string | null;
  image?: string | null;
  phone?: string | null;
  email?: string | null;
  linkedin?: string | null;
};

function TeamCard({ member, index }: { member: PublicTeamMember; index: number }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.article
      initial={{ opacity: 0, y: shouldReduceMotion ? 12 : 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: shouldReduceMotion ? 0 : index * 0.08,
        duration: shouldReduceMotion ? 0.2 : 0.45,
      }}
      className="rounded-2xl bg-white p-6 shadow-lg transition-shadow hover:shadow-xl dark:bg-slate-800"
    >
      <div className="mb-6 flex justify-center">
        <div className="relative h-32 w-32 overflow-hidden rounded-full bg-emerald-100 dark:bg-emerald-900/50">
          {member.image ? (
            <Image
              src={member.image}
              alt={member.name}
              fill
              className="object-cover"
              sizes="128px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-5xl font-bold text-emerald-400 dark:text-emerald-500">
                {member.name.charAt(0)}
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="text-center">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{member.name}</h3>
        <p className="mt-1 font-medium text-emerald-600 dark:text-emerald-400">{member.role}</p>
        {member.bio ? (
          <p className="mt-3 line-clamp-3 text-sm text-slate-600 dark:text-slate-400">{member.bio}</p>
        ) : null}
      </div>
      <div className="mt-6 flex justify-center gap-3">
        {member.phone ? (
          <a
            href={`tel:${member.phone}`}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-emerald-100 hover:text-emerald-600 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-emerald-900/50 dark:hover:text-emerald-400"
            aria-label={`${member.name} telefon`}
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
          </a>
        ) : null}
        {member.email ? (
          <a
            href={`mailto:${member.email}`}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-emerald-100 hover:text-emerald-600 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-emerald-900/50 dark:hover:text-emerald-400"
            aria-label={`${member.name} e-posta`}
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
          </a>
        ) : null}
        {member.linkedin ? (
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-emerald-100 hover:text-emerald-600 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-emerald-900/50 dark:hover:text-emerald-400"
            aria-label={`${member.name} LinkedIn`}
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
        ) : null}
      </div>
    </motion.article>
  );
}

export function TeamPageClient({ members }: { members: PublicTeamMember[] }) {
  const trust = formatGoogleTrustLine();

  return (
    <>
      <section className="bg-white py-16 dark:bg-slate-900" aria-label="Ekip üyeleri">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {members.length > 0 ? (
            <ul
              className="grid list-none gap-8 p-0 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              aria-label="Ekip üyeleri listesi"
            >
              {members.map((member, index) => (
                <li key={member.id} className="list-none">
                  <TeamCard member={member} index={index} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-16 text-center">
              <Users
                className="mx-auto mb-4 h-16 w-16 text-slate-300 dark:text-slate-600"
                aria-hidden="true"
              />
              <p className="text-lg text-slate-500 dark:text-slate-400">
                Ekip profilleri yakında eklenecektir. Şimdilik {trust} ve ücretsiz keşif ile
                iletişime geçebilirsiniz.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="bg-slate-50 py-16 dark:bg-slate-800" aria-labelledby="ekip-guven-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2
              id="ekip-guven-heading"
              className="text-3xl font-bold text-slate-900 dark:text-white"
            >
              Doğrulanmış güven
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-600 dark:text-slate-400">
              Uydurma “20+ yıl / 50+ personel / %100” iddiası yok — yalnızca operasyonel gerçekler
              ve Google sinyali.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <article className="rounded-2xl bg-white p-8 text-center shadow-lg dark:bg-slate-700">
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{trust}</p>
              <h3 className="mt-3 text-lg font-bold text-slate-900 dark:text-white">Google</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Güncel puan ve yorumlar harita sayfasında.
              </p>
            </article>
            <article className="rounded-2xl bg-white p-8 text-center shadow-lg dark:bg-slate-700">
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">7/24</p>
              <h3 className="mt-3 text-lg font-bold text-slate-900 dark:text-white">Destek</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Telefon / WhatsApp ile aynı gün randevu imkânı (kapasiteye göre).
              </p>
            </article>
            <article className="rounded-2xl bg-white p-8 text-center shadow-lg dark:bg-slate-700">
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">Ücretsiz</p>
              <h3 className="mt-3 text-lg font-bold text-slate-900 dark:text-white">Keşif</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Kapsam ve tahmini fiyat keşif sonrası netleşir.
              </p>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
