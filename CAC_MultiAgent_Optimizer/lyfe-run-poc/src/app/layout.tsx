import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Lyfe Run — CAC Optimizer Dashboard',
  description: 'Multi-Agent CAC Optimization for Run Club Leaders',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="min-h-screen bg-dark text-white antialiased">
        {children}
      </body>
    </html>
  );
}
