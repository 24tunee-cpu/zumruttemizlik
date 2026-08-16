import { validateAutopilotSlugs } from '../src/lib/seo-autopilot/validate-slugs';

const result = validateAutopilotSlugs();
if (!result.ok) {
  console.error('Slug doğrulama BAŞARISIZ:\n', result.errors.join('\n'));
  process.exit(1);
}
console.log(`OK — ${result.errors.length === 0 ? 'tüm autopilot slug\'ları geçerli' : ''}`);
