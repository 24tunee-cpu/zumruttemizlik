/**
 * Kanonik ekip üyeleri — seedKey ile upsert; panelden eklenen kayıtlarda seedKey kullanılmaz.
 */
import type { PrismaClient } from '@prisma/client';

export type TeamMemberSeedRow = {
  seedKey: string;
  name: string;
  role: string;
  bio: string;
  image: string | null;
  phone: string | null;
  email: string | null;
  linkedin: string | null;
  order: number;
  isActive: boolean;
};

const IMG_PATRON = 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400';

export const TEAM_SEED_DATA: TeamMemberSeedRow[] = [
  {
    seedKey: 'zumrutvadi-team-01',
    name: 'Vedat Günen',
    role: 'Kurucu',
    bio: 'Zümrüt Vadi Temizlik’in kurucusu; İstanbul genelinde operasyon ve müşteri memnuniyetinden sorumlu.',
    image: IMG_PATRON,
    phone: null,
    email: null,
    linkedin: null,
    order: 1,
    isActive: true,
  },
];

export async function upsertCanonicalTeamMembers(prisma: PrismaClient): Promise<number> {
  for (const row of TEAM_SEED_DATA) {
    const { seedKey, ...fields } = row;
    const existing = await prisma.teamMember.findFirst({ where: { seedKey } });
    if (existing) {
      await prisma.teamMember.update({
        where: { id: existing.id },
        data: {
          name: fields.name,
          role: fields.role,
          bio: fields.bio,
          image: fields.image,
          phone: fields.phone,
          email: fields.email,
          linkedin: fields.linkedin,
          order: fields.order,
          isActive: fields.isActive,
        },
      });
    } else {
      await prisma.teamMember.create({
        data: { seedKey, ...fields },
      });
    }
  }

  await prisma.teamMember.deleteMany({
    where: {
      seedKey: null,
      name: { in: ['Ahmet Yilmaz', 'Ayse Kaya', 'Mehmet Demir'] },
    },
  });

  return TEAM_SEED_DATA.length;
}
