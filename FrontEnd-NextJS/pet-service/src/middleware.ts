import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Logger } from 'next-axiom';

export async function middleware(request: NextRequest) {
  // Khởi tạo bộ ghi log của Axiom
  const log = new Logger();

  // 1. LẤY IP CỦA NGƯỜI TRUY CẬP
  // Khi host trên Vercel, IP thực của người dùng sẽ nằm ở header 'x-forwarded-for'
  const ip = request.headers.get('x-forwarded-for') || 'Unknown IP';
  
  // 2. LẤY ĐƯỜNG DẪN (URL) HỌ ĐANG TRUY CẬP
  const path = request.nextUrl.pathname;

  // 3. GỬI BÁO CÁO VỀ AXIOM (Để bạn demo trên Dashboard)
  log.info('Security Monitor: Request Detected', {
    ip_address: ip,
    path: path,
    method: request.method,
    userAgent: request.headers.get('user-agent'),
  });

  // Chờ cho log được đẩy đi xong
  await log.flush();

  // Cho phép người dùng đi tiếp vào trang web bình thường
  return NextResponse.next();
}

// CẤU HÌNH: Chỉ bắt log ở các trang chính (loại bỏ ảnh, css, js để tránh rác hệ thống)
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
