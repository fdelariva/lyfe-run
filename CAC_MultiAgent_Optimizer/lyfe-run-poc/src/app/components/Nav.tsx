'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Dashboard' },
  { href: '/creatives', label: 'Creatives' },
  { href: '/lp-preview', label: 'Landing Pages' },
  { href: '/config', label: 'Config & Run' },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-zinc-800 bg-zinc-950 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 flex items-center gap-1 h-12">
        <span className="font-heading text-accent text-lg tracking-widest mr-4">
          LYFE RUN
        </span>
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1.5 text-sm rounded transition-colors ${
                active
                  ? 'bg-accent/10 text-accent font-medium'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
