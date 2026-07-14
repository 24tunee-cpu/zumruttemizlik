import { PrismaClient } from '@prisma/client';
import { repairV2BlogSchedule } from '../src/lib/repair-blog-schedule';

async function main() {
  const prisma = new PrismaClient();
  try {
    const result = await repairV2BlogSchedule(prisma);
    console.log('Blog schedule repair complete:');
    console.log(JSON.stringify(result, null, 2));
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
