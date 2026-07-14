import { PrismaClient } from '@prisma/client';
import { runFullGeoSync } from '../src/lib/geo-citation';

async function main() {
  const prisma = new PrismaClient();
  try {
    const result = await runFullGeoSync(prisma, 'manual');
    console.log(JSON.stringify(result, null, 2));
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
