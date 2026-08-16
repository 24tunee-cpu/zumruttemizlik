import { revalidatePath as nextRevalidatePath } from 'next/cache';

/** Next.js request dışında (tsx script) sessizce atlar — cron route'ta normal çalışır */
export function safeRevalidatePath(path: string): void {
  try {
    nextRevalidatePath(path);
  } catch {
    // Script/test ortamında static generation store yok — DB güncellemesi yeterli
  }
}
