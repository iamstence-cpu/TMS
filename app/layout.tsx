import './globals.css';
import Link from 'next/link';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <header className="border-b bg-white">
          <nav className="container-page flex items-center justify-between py-3">
            <Link href="/" className="font-semibold">健康管理师岗位训练平台 MVP</Link>
            <div className="space-x-4 text-sm">
              <Link href="/trainings">训练主题</Link>
              <Link href="/admin">管理端</Link>
              <Link href="/about/safety">安全边界</Link>
            </div>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
