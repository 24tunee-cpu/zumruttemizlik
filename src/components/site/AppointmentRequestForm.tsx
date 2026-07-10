'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Loader2, Send } from 'lucide-react';
import { toast } from '@/store/toastStore';
import { trackGa4Event } from '@/lib/ga4-client';

const SLOTS = [
  { value: 'morning', label: '09:00–12:00' },
  { value: 'afternoon', label: '12:00–17:00' },
  { value: 'evening', label: '17:00–20:00' },
  { value: 'flexible', label: 'Esnek' },
];
const SERVICE_HINTS = [
  'İnşaat sonrası temizlik',
  'Ofis temizliği',
  'Ev temizliği',
  'Koltuk yıkama',
  'Halı temizliği',
];

export function AppointmentRequestForm({ embedded = false }: { embedded?: boolean }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('flexible');
  const [district, setDistrict] = useState('');
  const [address, setAddress] = useState('');
  const [serviceHint, setServiceHint] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const minDate = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const submit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!name.trim() || !email.trim() || !preferredDate) {
        toast.error('Eksik bilgi', 'İsim, e-posta ve tercih tarihi zorunludur.');
        return;
      }
      setSubmitted(false);
      setLoading(true);
      try {
        const res = await fetch('/api/appointments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim() || undefined,
            preferredDate: new Date(preferredDate).toISOString(),
            timeSlot,
            district: district.trim() || undefined,
            address: address.trim() || undefined,
            serviceHint: serviceHint.trim() || undefined,
            notes: notes.trim() || undefined,
          }),
        });
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        if (!res.ok) throw new Error(data.error || 'Gönderilemedi');
        trackGa4Event('generate_lead', {
          form_id: 'appointment_request',
          form_destination: '/randevu',
        });
        setSubmitted(true);
        toast.success('Talebiniz alındı', 'En kısa sürede sizinle iletişime geçeceğiz.');
        setName('');
        setEmail('');
        setPhone('');
        setPreferredDate('');
        setTimeSlot('flexible');
        setDistrict('');
        setAddress('');
        setServiceHint('');
        setNotes('');
      } catch (err) {
        toast.error('Hata', err instanceof Error ? err.message : 'Bir sorun oluştu');
      } finally {
        setLoading(false);
      }
    },
    [name, email, phone, preferredDate, timeSlot, district, address, serviceHint, notes]
  );

  return (
    <motion.form
      onSubmit={submit}
      className={
        embedded
          ? 'space-y-4'
          : 'mx-auto max-w-xl space-y-4 rounded-2xl border border-slate-700/60 bg-slate-800/60 p-6 shadow-xl backdrop-blur-sm'
      }
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {!embedded && (
        <>
          <div className="flex items-center gap-2 text-emerald-400">
            <Calendar className="h-5 w-5" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-white">Keşif / randevu talebi</h2>
          </div>
          <p className="text-sm text-slate-400">
            Uygun olduğunuz gün ve saat dilimini seçin; ekibimiz onay ve net saat için sizi arar.
          </p>
        </>
      )}
      {submitted ? (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/40 px-3 py-2 text-sm text-emerald-300">
          Talebiniz alındı. Müsaitlik kontrolünden sonra sizinle iletişime geçeceğiz.
        </div>
      ) : null}
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm">
          <span className="mb-1 block font-medium text-slate-300">Ad Soyad *</span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium text-slate-300">E-posta *</span>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
          />
        </label>
      </div>
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-slate-300">Telefon</span>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
        />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm">
          <span className="mb-1 block font-medium text-slate-300">Tercih tarihi *</span>
          <input
            required
            type="date"
            value={preferredDate}
            onChange={(e) => setPreferredDate(e.target.value)}
            min={minDate}
            className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium text-slate-300">Saat dilimi</span>
          <select
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
            className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
          >
            {SLOTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-slate-300">İlçe</span>
        <input
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          placeholder="Örn. Sarıyer, Zekeriyaköy"
          className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-slate-300">Adres (isteğe bağlı)</span>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-slate-300">Hizmet</span>
        <input
          list="appointment-service-hints"
          value={serviceHint}
          onChange={(e) => setServiceHint(e.target.value)}
          placeholder="Örn. Ofis temizliği"
          className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
        />
        <datalist id="appointment-service-hints">
          {SERVICE_HINTS.map((hint) => (
            <option key={hint} value={hint} />
          ))}
        </datalist>
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-slate-300">Not</span>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
        />
      </label>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 font-semibold text-white shadow-lg shadow-emerald-500/20 transition-colors hover:bg-emerald-600 disabled:opacity-60"
      >
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
        Gönder
      </button>
    </motion.form>
  );
}
