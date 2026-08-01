import { prisma } from '../src/lib/prisma';

async function main() {
  const sessions = await prisma.visitorSession.findMany({
    select: { id: true, sessionKey: true, lastSeenAt: true },
    orderBy: { lastSeenAt: 'desc' },
  });

  const byKey = new Map<string, typeof sessions>();
  for (const s of sessions) {
    const list = byKey.get(s.sessionKey) ?? [];
    list.push(s);
    byKey.set(s.sessionKey, list);
  }

  let dupGroups = 0;
  let deleted = 0;
  for (const [key, list] of byKey) {
    if (list.length <= 1) continue;
    dupGroups++;
    const [, ...remove] = list;
    for (const r of remove) {
      await prisma.visitorEvent.deleteMany({ where: { sessionDbId: r.id } });
      await prisma.visitorSession.delete({ where: { id: r.id } });
      deleted++;
    }
    console.log(`sessionKey ${key}: kept 1, removed ${remove.length}`);
  }

  console.log(`Done. Duplicate groups: ${dupGroups}, deleted sessions: ${deleted}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
