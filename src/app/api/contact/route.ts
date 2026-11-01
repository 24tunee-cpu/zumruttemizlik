/**
 * @fileoverview Contact API Route
 * @description İletişim formu ve iletişim talepleri yönetimi API endpoint'i.
 * POST (public) - yeni iletişim talebi, GET (admin only) - talep listesi.
 *
 * @architecture
 * - Server-Side API Route
 * - Prisma ORM database access
 * - Honeypot spam protection
 * - Admin authentication for list access
 *
 * @security
 * - POST: Public endpoint, rate limiting (3 req/5min), honeypot protection
 * - GET: Admin authentication required (JWT) - KRİTİK! Hassas veriler!
 * - Email/phone validation
 * - Input sanitization (XSS koruması)
 * - Spam bot protection (honeypot fields)
 *
 * @admin-sync
 * POST: Front-end /iletisim sayfasındaki form tarafından kullanılır.
 * GET: Admin paneldeki /admin/iletisim sayfası tarafından kullanılır.
 * @version 1.0.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  requireAdminAuth,
  sanitizeInput,
  isValidEmail,
  isValidPhone,
  getClientIp,
} from '@/lib/security';
import { checkDistributedRateLimit } from '@/lib/rate-limit';
import { publicCorsHeaders } from '@/lib/cors';

/** Rate limit window for POST: 5 minutes */
const RATE_LIMIT_WINDOW_POST = 5 * 60 * 1000;

/** Max requests per window for POST: 3 */
const MAX_REQUESTS_POST = 3;

/** Rate limit window for GET: 1 minute */
const RATE_LIMIT_WINDOW_GET = 60 * 1000;

/** Max requests per window for GET: 30 */
const MAX_REQUESTS_GET = 30;

/** Maximum field lengths */
const MAX_LENGTHS = {
  name: 100,
  email: 200,
  phone: 20,
  message: 2000,
  service: 50,
} as const;

function isMongoObjectId(value: string): boolean {
  return /^[a-f\d]{24}$/i.test(value);
}

// ============================================
// API HANDLERS
// ============================================

/**
 * OPTIONS handler for CORS preflight
 */
export async function OPTIONS(request: NextRequest) {
  return NextResponse.json(
    {},
    { headers: publicCorsHeaders(request.headers.get('origin')) }
  );
}

/**
 * GET handler - List all contact requests (admin only)
 * Basitleştirilmiş versiyon: auth geçtiyse, hata olsa bile en kötü boş dizi döner.
 */
export async function GET(request: NextRequest) {
  const headers = publicCorsHeaders(request.headers.get('origin'));
  const ip = getClientIp(request);

  // Admin authentication
  const authError = await requireAdminAuth(request);
  if (authError) {
    console.warn('Unauthorized contact requests list attempt', { ip });
    return authError;
  }

  const limit = await checkDistributedRateLimit(
    `contact-get:${ip}`,
    MAX_REQUESTS_GET,
    RATE_LIMIT_WINDOW_GET
  );
  if (!limit.allowed) {
    console.warn('Rate limit exceeded on GET contact', { ip, backend: limit.backend });
    return NextResponse.json(
      { error: 'Çok fazla istek. Lütfen 1 dakika bekleyin.' },
      { status: 429, headers }
    );
  }

  try {
    console.log('Fetching contact requests (simple)', { ip });

    // Önce tam alanlarla dene; bazı legacy kayıtlarda updatedAt/null problemi varsa
    // daha dar bir seçimle yeniden deneyeceğiz.
    let rows: Array<Record<string, unknown>> = [];

    try {
      rows = await prisma.contactRequest.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          service: true,
          message: true,
          read: true,
          pipelineStatus: true,
          internalNotes: true,
          reminderAt: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (primaryError) {
      console.warn('Contact list primary query failed, retrying with limited fields', {
        ip,
        error: primaryError instanceof Error ? primaryError.message : String(primaryError),
      });

      // Problemli timestamp alanlarını tamamen dışarıda bırakarak tekrar dene
      rows = await prisma.contactRequest.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          service: true,
          message: true,
          read: true,
          pipelineStatus: true,
          internalNotes: true,
          reminderAt: true,
        },
      });
    }

    return NextResponse.json(rows, { headers });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to fetch contact requests (fallback to empty list)', {
      error: errorMessage,
      ip,
    });
    // En kötü durumda bile boş dizi döndür (UI kırılmasın)
    return NextResponse.json([], { headers });
  }
}

/**
 * POST handler - Create new contact request (public)
 * @param request NextRequest object
 * @returns Created contact request JSON
 */
export async function POST(request: NextRequest) {
  const headers = publicCorsHeaders(request.headers.get('origin'));
  const ip = getClientIp(request);

  const postLimit = await checkDistributedRateLimit(
    `contact-post:${ip}`,
    MAX_REQUESTS_POST,
    RATE_LIMIT_WINDOW_POST
  );
  if (!postLimit.allowed) {
    console.warn('Rate limit exceeded on POST contact', { ip, backend: postLimit.backend });
    return NextResponse.json(
      { error: 'Çok fazla mesaj gönderdiniz. Lütfen 5 dakika sonra tekrar deneyin.' },
      { status: 429, headers }
    );
  }

  try {
    const data = await request.json();

    // Honeypot spam protection
    if (data.website || data.honeypot) {
      console.warn('Honeypot triggered - potential spam bot', { ip, email: data.email });
      return NextResponse.json(
        { error: 'Spam tespit edildi' },
        { status: 400, headers }
      );
    }

    // Validation
    if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
      return NextResponse.json(
        { error: 'İsim zorunludur' },
        { status: 400, headers }
      );
    }

    if (data.name.length > MAX_LENGTHS.name) {
      return NextResponse.json(
        { error: `İsim en fazla ${MAX_LENGTHS.name} karakter olabilir` },
        { status: 400, headers }
      );
    }

    if (!data.email || typeof data.email !== 'string' || data.email.trim().length === 0) {
      return NextResponse.json(
        { error: 'E-posta adresi zorunludur' },
        { status: 400, headers }
      );
    }

    if (data.email.length > MAX_LENGTHS.email) {
      return NextResponse.json(
        { error: 'E-posta adresi çok uzun' },
        { status: 400, headers }
      );
    }

    if (!isValidEmail(data.email)) {
      return NextResponse.json(
        { error: 'Geçerli bir e-posta adresi giriniz' },
        { status: 400, headers }
      );
    }

    if (!data.message || typeof data.message !== 'string' || data.message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Mesaj zorunludur' },
        { status: 400, headers }
      );
    }

    if (data.message.length > MAX_LENGTHS.message) {
      return NextResponse.json(
        { error: `Mesaj en fazla ${MAX_LENGTHS.message} karakter olabilir` },
        { status: 400, headers }
      );
    }

    if (data.phone && typeof data.phone === 'string') {
      if (data.phone.length > MAX_LENGTHS.phone) {
        return NextResponse.json(
          { error: 'Telefon numarası çok uzun' },
          { status: 400, headers }
        );
      }
      if (!isValidPhone(data.phone)) {
        return NextResponse.json(
          { error: 'Geçerli bir telefon numarası giriniz' },
          { status: 400, headers }
        );
      }
    }

    // Sanitize input data
    const sanitizedData = {
      name: sanitizeInput(data.name),
      email: sanitizeInput(data.email.toLowerCase().trim()),
      phone: data.phone && typeof data.phone === 'string'
        ? sanitizeInput(data.phone)
        : '',
      service: data.service && typeof data.service === 'string'
        ? sanitizeInput(data.service).slice(0, MAX_LENGTHS.service)
        : 'Genel',
      message: sanitizeInput(data.message),
    };

    console.log('Creating new contact request', { email: sanitizedData.email, ip });

    const newContact = await prisma.contactRequest.create({
      data: {
        ...sanitizedData,
        read: false,
      },
    });

    console.log('Contact request created successfully', { id: newContact.id, email: sanitizedData.email });

    return NextResponse.json(
      {
        success: true,
        message: 'Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.',
        contact: newContact,
      },
      { status: 201, headers }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to create contact request', { error: errorMessage, ip });
    return NextResponse.json(
      { error: 'Mesaj gönderilemedi. Lütfen tekrar deneyin.' },
      { status: 500, headers }
    );
  }
}
