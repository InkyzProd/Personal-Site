/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Github, Terminal } from 'lucide-react';

export default function Footer() {
  const currentYear = 2026;

  return (
    <footer className="relative border-t border-[#23272f] bg-[#0a0a0a] text-[#a1a1aa] py-12 px-4 sm:px-6 lg:px-8 z-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Brand & Copyright */}
        <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2 font-mono text-sm text-[#f4f4f5] font-semibold">
            <Terminal className="w-4 h-4 text-[#5865F2]" />
            <span>inkyz.id</span>
          </div>
          <span className="hidden sm:inline text-[#23272f]">/</span>
          <span className="text-xs font-mono text-[#a1a1aa]">
            © {currentYear} Inkyz. All rights reserved.
          </span>
        </div>

        {/* Center: Build Credit */}
        <div className="text-xs font-mono text-center text-[#a1a1aa]">
          Designed with <span className="text-[#22c55e]">restraint</span> &{' '}
          <span className="text-[#5865F2]">obsidian surfaces</span>.
        </div>

        {/* Right: Social / Channel Links */}
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/<PLACEHOLDER_USERNAME>"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className="text-[#a1a1aa] hover:text-[#f4f4f5] transition-colors p-1"
          >
            <Github className="w-4 h-4" />
          </a>

          <a
            href="https://discord.com/users/<PLACEHOLDER_INVITE_OR_USER_ID>"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Discord account"
            className="text-[#a1a1aa] hover:text-[#5865F2] transition-colors p-1 font-mono text-xs"
          >
            Discord
          </a>

          <a
            href="mailto:<PLACEHOLDER_EMAIL>"
            aria-label="Send Email"
            className="text-[#a1a1aa] hover:text-[#38bdf8] transition-colors p-1 font-mono text-xs"
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
