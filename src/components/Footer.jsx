import { Trophy } from "lucide-react";
import Link from "next/link";

const footerLinks = [
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
  { label: "Support", href: "/support" },
  { label: "Contact", href: "/contact" },
];

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-white dark:bg-zinc-900 py-12 mt-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Trophy size={24} className="text-[#E61944]" />
            <span className="text-xl font-bold tracking-tight">
              AjkerKhela
              <span className="text-zinc-500 dark:text-zinc-400 font-medium">
                LIVE
              </span>
            </span>
          </div>
          <div className="flex gap-8 text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {footerLinks.map((link) => (
              <Link key={link.label} href={link.href} className="hover:text-[#E61944] transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            &copy; 2026 AjkerKhela. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;