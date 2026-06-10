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
    <footer className="border-t border-zinc-800 bg-zinc-950/40 backdrop-blur-md py-12 mt-12 text-zinc-400">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Logo block */}
          <Link href="#" className="flex items-center gap-2">
            <Trophy size={24} className="text-[#E61944]" />
            <span className="text-xl font-bold tracking-tight text-white">
              AjkerKhela
              <span className="text-zinc-500 font-medium ml-1 text-sm uppercase tracking-wider">
                LIVE
              </span>
            </span>
          </Link>

          {/* Links block */}
          <div className="flex gap-8 text-sm font-semibold text-zinc-400">
            {footerLinks.map((link) => (
              <Link key={link.label} href={link.href} className="hover:text-[#E61944] transition-colors">
                {link.label}
              </Link>
            ))}
          </div>

          {/* Copyright & Developer block */}
          <div className="flex flex-col items-center md:items-end gap-1.5 text-xs text-zinc-500">
            <p>
              &copy; 2026 AjkerKhela. All rights reserved.
            </p>
            <p className="text-[11px]">
              Developed by{" "}
              <Link
                href="https://linkedin.com/in/mahmudulhasanzb"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-[#E61944] underline transition-colors font-bold"
              >
                Mahmudul Hasan
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;