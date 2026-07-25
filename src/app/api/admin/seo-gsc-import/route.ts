import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  analyzeGscImport,
  applyGscSuggestions,
  mergeGscCsvTexts,
  type BlogSuggestion,
  type GscImportReport,
  type ProgrammaticSuggestion,
} from '@/lib/gsc-import-engine';
import { requireAdminAuth } from '@/lib/security';

type ImportBody = {
  csv?: string;
  /** Birden fazla GSC export dosyası — birleştirilir */
  csvFiles?: string[];
  apply?: boolean;
  /** apply=true iken analiz sonucundan gelen öneriler */
  programmatic?: ProgrammaticSuggestion[];
  blog?: BlogSuggestion[];
};

export async function POST(request: NextRequest) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  const body = (await request.json().catch(() => ({}))) as ImportBody;
  const sources = [
    ...(body.csv?.trim() ? [body.csv.trim()] : []),
    ...(Array.isArray(body.csvFiles) ? body.csvFiles.map((c) => c.trim()).filter(Boolean) : []),
  ];

  if (sources.length === 0 && !body.apply) {
    return NextResponse.json({ error: 'CSV metni veya dosya zorunlu.' }, { status: 400 });
  }

  if (body.apply) {
    const programmatic = Array.isArray(body.programmatic) ? body.programmatic : [];
    const blog = Array.isArray(body.blog) ? body.blog : [];
    if (programmatic.length === 0 && blog.length === 0) {
      return NextResponse.json({ error: 'Uygulanacak öneri yok. Önce analiz çalıştırın.' }, { status: 400 });
    }

    const result = await applyGscSuggestions(programmatic, blog, prisma);

    await prisma.seoAutomationSyncLog.create({
      data: {
        source: 'gsc_csv_apply',
        status: result.errors.length ? 'partial' : 'success',
        message: `GSC CSV uygulandı: ${result.programmaticApplied} bölge, ${result.blogApplied} blog`,
        finishedAt: new Date(),
        stats: result,
      },
    });

    return NextResponse.json({
      applied: true,
      ...result,
      totalApplied: result.programmaticApplied + result.blogApplied,
    });
  }

  let report: GscImportReport;
  try {
    const rows = mergeGscCsvTexts(sources);
    report = analyzeGscImport(rows);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'CSV parse hatası';
    return NextResponse.json({ error: message }, { status: 400 });
  }

  return NextResponse.json({
    applied: false,
    fileCount: sources.length,
    ...report,
  });
}
