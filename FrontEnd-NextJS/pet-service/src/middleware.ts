import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Logger } from 'next-axiom';

// DANH SÁCH ĐEN (WAF RULES) - Các từ khóa độc hại cần chặn
const WAF_RULES = [
  '/wp-admin', 
  '/wp-login', 
  '/.env', 
  '/phpmyadmin', 
  'select+', 
  'union+select', 
  'or+1=1',
  'hack'
];

export async function middleware(request: NextRequest) {
  const log = new Logger();
  const ip = request.headers.get('x-forwarded-for') || 'Unknown IP';
  const path = request.nextUrl.pathname.toLowerCase();
  const searchParams = request.nextUrl.search.toLowerCase();
  const fullUrl = path + searchParams;

  // 1. TÍNH NĂNG WAF (FIREWALL): Kiểm tra xem người dùng có đang cố tấn công không
  const isMalicious = WAF_RULES.some((rule) => fullUrl.includes(rule));

  if (isMalicious) {
    // Ghi log cảnh báo ĐỎ về Axiom
    log.error('🚨 WAF BLOCKED ATTACK', {
      ip_address: ip,
      path: path,
      query: searchParams,
      method: request.method,
      reason: 'Matched WAF Rule (SQLi / Directory Brute-force)'
    });
    await log.flush();

    // Trả về giao diện lỗi 403 Forbidden của Firewall
    return new NextResponse(
      `<!DOCTYPE html>
       <html lang="en">
       <head><title>403 Forbidden - WAF</title></head>
       <body style="background-color: #1a1a1a; color: #ff4d4d; font-family: monospace; text-align: center; padding-top: 20%;">
         <h1>🛑 BỊ CHẶN BỞI WEB APPLICATION FIREWALL (WAF)</h1>
         <p>Hành vi truy cập của bạn (IP: ${ip}) đã bị đánh dấu là nguy hiểm và bị từ chối.</p>
         <p>Hệ thống tự động phát hiện dấu hiệu dò quét lỗ hổng hoặc SQL Injection.</p>
         <br/>
         <p><i>Protected by Custom Next.js Middleware WAF</i></p>
       </body>
       </html>`,
      { 
        status: 403, 
        headers: { 'content-type': 'text/html; charset=utf-8' } 
      }
    );
  }

  // 2. Ghi Log bình thường nếu an toàn
  log.info('Security Monitor: Request Detected', {
    ip_address: ip,
    path: path,
    method: request.method,
  });
  await log.flush();

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
