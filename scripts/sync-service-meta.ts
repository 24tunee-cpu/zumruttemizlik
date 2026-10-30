import { PrismaClient } from '@prisma/client';
import { upsertCanonicalServices } from '../src/lib/seed-services';

async function main() {
  const prisma = new PrismaClient();
  try {
    const n = await upsertCanonicalServices(prisma);
    console.log(`services upserted: ${n}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
