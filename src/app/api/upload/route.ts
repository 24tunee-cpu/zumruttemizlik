/**
 * @fileoverview Upload API Route
 * @description Admin panel için güvenli dosya yükleme API endpoint'i.
 * Rate limiting, dosya validasyonu ve güvenlik kontrolleri ile.
 *
 * @security
 * - Admin authentication required (JWT token)
 * - Rate limiting: 10 requests per minute per IP
 * - File type validation (JPEG, PNG, GIF, WebP, ICO)
 * - File size limit: 5MB
 * - Filename sanitization (path traversal protection)
 * - CORS headers for admin domain
 *
 * @admin-sync
 * Bu endpoint admin paneldeki medya yöneticisi tarafından kullanılır.
 * Yüklenen dosyalar /public/uploads klasöründe saklanır.
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/security';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

// ============================================
// CONFIGURATION
// ============================================

/** Logger instance */

/** Allowed MIME types for upload */
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/ico',
  'image/icon',
  'image/x-icon',
  'image/vnd.microsoft.icon',
  'application/ico',
  'application/x-ico',
  'application/vnd.microsoft.icon',
] as const;

/** Maximum file size: 5MB */
const MAX_FILE_SIZE = 5 * 1024 * 1024;

/** Upload directory path */
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

/** Rate limiting map (IP -> timestamp array) */
const rateLimitMap = new Map<string, number[]>();

/** Rate limit window: 1 minute */
const RATE_LIMIT_WINDOW = 60 * 1000;

/** Max requests per window: 10 */
const MAX_REQUESTS = 10;

// ============================================
// CORS HEADERS
// ============================================

function getCorsHeaders(origin: string | null): Record<string, string> {
  // Eğer origin yoksa veya aynı origin ise CORS gerekmez
  if (!origin) {
    return {};
  }

  // Environment variable'dan izin verilen origin'leri al
  const allowedOrigins = process.env.ADMIN_URL
    ? process.env.ADMIN_URL.split(',').map(o => o.trim())
    : ['http://localhost:3001', 'http://localhost:3000'];

  // Origin izin verilen listesinde mi kontrol et
  const isAllowed = allowedOrigins.some(allowed => {
    // Exact match veya subdomain match
    return origin === allowed || origin === allowed.replace(/^https?:\/\//, '');
  });

  if (isAllowed) {
    return {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    };
  }

  // Development için daha esnek
  if (process.env.NODE_ENV === 'development') {
    return {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };
  }

  return {};
}

// ============================================
// RATE LIMITING
// ============================================

/**
 * Check rate limit for IP address
 * @param ip Client IP address
 * @returns boolean - true if rate limited
 */
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];

  // Filter out old timestamps outside the window
  const validTimestamps = timestamps.filter(
    timestamp => now - timestamp < RATE_LIMIT_WINDOW
  );

  // Check if limit exceeded
  if (validTimestamps.length >= MAX_REQUESTS) {
    return true;
  }

  // Add current timestamp
  validTimestamps.push(now);
  rateLimitMap.set(ip, validTimestamps);

  return false;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Sanitize filename to prevent path traversal attacks
 * @param filename Original filename
 * @returns Sanitized filename
 */
function sanitizeFilename(filename: string): string {
  // Remove path traversal attempts
  const cleanName = filename
    .replace(/\.\./g, '') // Remove double dots
    .replace(/[<>:"|?*]/g, '') // Remove illegal characters
    .replace(/^\/+/, '') // Remove leading slashes
    .replace(/\/$/, ''); // Remove trailing slashes

  return cleanName;
}

/**
 * Get file extension from MIME type
 * @param mimeType MIME type
 * @returns File extension
 */
function getExtensionFromMimeType(mimeType: string): string {
  const extensionMap: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'image/ico': 'ico',
    'image/icon': 'ico',
    'image/x-icon': 'ico',
    'image/vnd.microsoft.icon': 'ico',
    'application/ico': 'ico',
    'application/x-ico': 'ico',
    'application/vnd.microsoft.icon': 'ico',
  };

  return extensionMap[mimeType] || 'jpg';
}

function extensionFromFilename(filename: string): string | null {
  const n = filename.toLowerCase();
  if (n.endsWith('.png')) return 'png';
  if (n.endsWith('.jpg') || n.endsWith('.jpeg')) return 'jpg';
  if (n.endsWith('.webp')) return 'webp';
  if (n.endsWith('.gif')) return 'gif';
  if (n.endsWith('.ico')) return 'ico';
  return null;
}

function isAllowedImageFile(file: File): boolean {
  if (ALLOWED_TYPES.includes(file.type as (typeof ALLOWED_TYPES)[number])) return true;
  const ext = extensionFromFilename(file.name);
  if (ext === 'ico') {
    // Tarayıcı/OS kombinasyonları .ico için farklı MIME döndürebiliyor.
    return (
      !file.type ||
      file.type === 'application/octet-stream' ||
      file.type === 'image/ico' ||
      file.type === 'image/icon' ||
      file.type === 'image/x-icon' ||
      file.type === 'image/vnd.microsoft.icon' ||
      file.type === 'application/ico' ||
      file.type === 'application/x-ico' ||
      file.type === 'application/vnd.microsoft.icon'
    );
  }
  return false;
}

function resolveFileExtension(file: File): string {
  if (ALLOWED_TYPES.includes(file.type as (typeof ALLOWED_TYPES)[number])) {
    return getExtensionFromMimeType(file.type);
  }
  const fromName = extensionFromFilename(file.name);
  if (fromName) return fromName;
  return 'jpg';
}

/**
 * Generate unique filename
 * @param mimeType File MIME type
 * @returns Unique filename
 */
function generateUniqueFilename(file: File): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 10);
  const extension = resolveFileExtension(file);

  return `${timestamp}-${randomString}.${extension}`;
}

// ============================================
// API HANDLERS
// ============================================

/**
 * OPTIONS handler for CORS preflight
 */
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);
  return NextResponse.json({}, { headers: corsHeaders });
}

/**
 * Get client IP from request headers
 * @param request NextRequest object
 * @returns Client IP address
 */
function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  if (realIp) {
    return realIp;
  }

  return 'unknown';
}

/**
 * POST handler - Upload image (admin only)
 * @param request Next.js request object
 * @returns JSON response with upload result
 */
export async function POST(request: NextRequest) {
  // Apply CORS headers
  const origin = request.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);
  const headers = { ...corsHeaders };

  // Get client IP
  const ip = getClientIp(request);

  // Rate limiting check
  if (checkRateLimit(ip)) {
    console.warn('Rate limit exceeded', { ip });
    return NextResponse.json(
      { error: 'Cok fazla istek. Lutfen 1 dakika bekleyin.' },
      { status: 429, headers }
    );
  }

  // Admin authentication
  const authError = await requireAdminAuth(request);
  if (authError) {
    console.warn('Unauthorized upload attempt', {
      ip,
      hasCookie: !!request.cookies.get('next-auth.session-token'),
      hasAuthorization: !!request.headers.get('authorization'),
      authStatus: authError.status
    });
    return authError;
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    // Validate file exists
    if (!file) {
      return NextResponse.json(
        { error: 'Dosya secilmedi' },
        { status: 400, headers }
      );
    }

    // Validate file type (bazı tarayıcılar .ico için type göndermez — uzantı ile kabul)
    if (!isAllowedImageFile(file)) {
      console.warn('Invalid file type attempted', { type: file.type, name: file.name, ip });
      return NextResponse.json(
        {
          error:
            'Geçersiz dosya türü. JPEG, PNG, GIF, WebP veya ICO yükleyebilirsiniz; logo/favicon için PNG de kullanılabilir.',
        },
        { status: 400, headers }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      console.warn('File size exceeded', { size: file.size, ip });
      return NextResponse.json(
        {
          error: 'Dosya boyutu cok buyuk. Maksimum 5MB yukleyebilirsiniz.'
        },
        { status: 400, headers }
      );
    }

    // Validate file size is not zero
    if (file.size === 0) {
      return NextResponse.json(
        { error: 'Dosya bos olamaz' },
        { status: 400, headers }
      );
    }

    // Generate safe filename
    const fileName = generateUniqueFilename(file);

    // Ensure uploads directory exists
    if (!existsSync(UPLOADS_DIR)) {
      try {
        // Windows için mode parametresi kaldırıldı (chmod desteklenmez)
        await mkdir(UPLOADS_DIR, { recursive: true });
        console.log('Created uploads directory:', UPLOADS_DIR);
      } catch (dirError) {
        console.error('Failed to create uploads directory', { error: dirError, dir: UPLOADS_DIR });
        return NextResponse.json(
          { error: 'Upload klasoru olusturulamadi. Lutfen sistem yoneticisine basvurun.' },
          { status: 500, headers }
        );
      }
    }

    // Write file securely
    const filePath = path.join(UPLOADS_DIR, fileName);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    try {
      // Windows için mode parametresi kaldırıldı (chmod desteklenmez)
      await writeFile(filePath, buffer);
    } catch (writeError) {
      console.error('Failed to write file', { error: writeError, filePath, size: file.size });
      return NextResponse.json(
        { error: 'Dosya yazilamadi. Disk dolu veya izin sorunu olabilir.' },
        { status: 500, headers }
      );
    }

    console.log('File uploaded successfully', {
      fileName,
      size: file.size,
      type: file.type,
      ip
    });

    // Return public URL
    const publicUrl = `/uploads/${fileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName,
      size: file.size,
      type: file.type,
    }, { headers });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to upload file', { error: errorMessage, ip });

    return NextResponse.json(
      { error: 'Dosya yuklenemedi. Lutfen tekrar deneyin.' },
      { status: 500, headers }
    );
  }
}
