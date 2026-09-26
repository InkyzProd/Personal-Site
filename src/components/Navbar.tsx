/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  id: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'About', href: '#about', id: 'about' },
  { label: 'Projects', href: '#projects', id: 'projects' },
  { label: 'Contact', href: '#contact', id: 'contact' },
];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState<string>('top');
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const navLinksContainerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<{ [key: string]: HTMLAnchorElement | null }>({});
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  // Monitor prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Monitor scroll position and detect visible section
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 24);

      const sections = ['contact', 'projects', 'about'];
      let current = 'top';

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.42) {
            current = sectionId;
            break;
          }
        }
      }

      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Magnetic Pull Effect on hover for nav links (radius ~80px, max 4-6px shift)
  useEffect(() => {
    // Only run if fine pointer (mouse) and not reduced motion
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer || reducedMotion) return;

    const container = navLinksContainerRef.current;
    if (!container) return;

    const handlePointerMove = (e: PointerEvent) => {
      const cursorX = e.clientX;
      const cursorY = e.clientY;

      NAV_ITEMS.forEach((item) => {
        const el = itemRefs.current[item.id];
        if (!el) return;

        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const distanceX = cursorX - centerX;
        const distanceY = cursorY - centerY;
        const distance = Math.hypot(distanceX, distanceY);

        const magnetRadius = 80;
        const maxPull = 5; // max 5px shift

        if (distance < magnetRadius) {
          const factor = (1 - distance / magnetRadius) * maxPull;
          const pullX = (distanceX / distance) * factor;
          const pullY = (distanceY / distance) * factor;

          el.style.transform = `translate3d(${pullX.toFixed(1)}px, ${pullY.toFixed(1)}px, 0)`;
        } else {
          el.style.transform = 'translate3d(0, 0, 0)';
        }
      });
    };

    const handlePointerLeave = () => {
      NAV_ITEMS.forEach((item) => {
        const el = itemRefs.current[item.id];
        if (el) {
          el.style.transform = 'translate3d(0, 0, 0)';
        }
      });
    };

    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [reducedMotion]);

  // Handle escape key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (href === '#top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const targetEl = document.querySelector(href);
    if (targetEl) {
      const navOffset = 90;
      const elementPosition = targetEl.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <>
      {/* Accessible Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-[100] px-4 py-2 bg-[#111215] text-[#22c55e] border border-[#23272f] rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
      >
        Skip to main content
      </a>

      {/* Floating Island Navigation Container */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4 md:pt-6 pointer-events-none transition-all duration-300">
        <nav
          aria-label="Primary Navigation"
          className={`pointer-events-auto flex items-center justify-between rounded-full border bg-[#111215]/85 backdrop-blur-xl transition-all duration-300 ${
            scrolled
              ? 'py-2.5 px-4 md:px-5 border-[#23272f] shadow-[0_12px_32px_-8px_rgba(0,0,0,0.85)]'
              : 'py-3 px-5 md:px-6 border-[#23272f]/80 shadow-[0_10px_28px_-10px_rgba(0,0,0,0.65)]'
          }`}
          style={{
            boxShadow: scrolled
              ? '0 12px 32px -8px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.08)'
              : '0 10px 28px -10px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.06)',
          }}
        >
          {/* Distinctive Monogram Wordmark */}
          <a
            href="#top"
            onClick={(e) => handleNavClick(e, '#top')}
            aria-label="Inkyz home"
            className="group flex items-center gap-3 pr-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5865F2] rounded-full py-1 pl-1"
          >
            {/* Minimalist 'i' Monogram Badge */}
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#16181d] border border-[#23272f] group-hover:border-[#5865F2]/60 group-hover:shadow-[0_0_12px_rgba(88,101,242,0.35)] transition-all duration-300">
              <span className="font-mono text-xs font-bold text-[#f4f4f5] group-hover:text-[#5865F2] transition-colors">
                i
              </span>
            </div>

            {/* Wordmark with glowing accent .id */}
            <div className="flex items-baseline font-mono text-sm font-semibold tracking-tight">
              <span className="text-[#f4f4f5] group-hover:text-white transition-colors">
                inkyz
              </span>
              <span className="text-[#22c55e] [text-shadow:0_0_8px_rgba(34,197,94,0.45)] transition-all group-hover:[text-shadow:0_0_12px_rgba(34,197,94,0.7)]">
                .id
              </span>
            </div>
          </a>

          {/* Desktop Nav Links with Magnetic Pull & High-Contrast Sliding Pill */}
          <div
            ref={navLinksContainerRef}
            className="hidden md:flex items-center gap-2 relative px-2"
            onMouseLeave={() => setHoveredItem(null)}
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              const isHovered = hoveredItem === item.id;

              return (
                <a
                  key={item.id}
                  ref={(el) => {
                    itemRefs.current[item.id] = el;
                  }}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  className={`relative px-4 py-2 rounded-full text-sm font-mono tracking-wide z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22c55e] transition-colors duration-200 select-none ${
                    isActive
                      ? 'text-[#f4f4f5] font-semibold'
                      : 'text-[#a1a1aa] hover:text-[#f4f4f5]'
                  }`}
                  style={{
                    transitionProperty: 'color, transform',
                    transitionDuration: '180ms',
                    transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {/* High-Contrast Active Pill: Dark gradient, accent border, and subtle inner glow */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavPill"
                      className="absolute inset-0 rounded-full bg-gradient-to-b from-[#1c1f26] to-[#14161b] border border-[#5865F2]/40 shadow-[0_0_16px_rgba(88,101,242,0.18)] -z-10"
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 30,
                      }}
                      style={{
                        boxShadow:
                          'inset 0 1px 1px rgba(255,255,255,0.12), 0 0 14px rgba(88,101,242,0.22)',
                      }}
                    />
                  )}

                  {/* Subtle Hover Pill if not active */}
                  {!isActive && isHovered && (
                    <motion.div
                      layoutId="hoverNavPill"
                      className="absolute inset-0 rounded-full bg-[#181a20] border border-[#23272f]/60 -z-10"
                      transition={{ duration: 0.15 }}
                    />
                  )}

                  <span>{item.label}</span>
                </a>
              );
            })}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-full bg-[#16181d] border border-[#23272f] text-[#a1a1aa] hover:text-[#f4f4f5] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22c55e]"
          >
            {mobileMenuOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </button>
        </nav>
      </header>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              aria-hidden="true"
            />

            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.96 }}
              transition={{ type: 'spring', damping: 25, stiffness: 320 }}
              className="fixed top-20 left-4 right-4 z-50 md:hidden bg-[#111215] border border-[#23272f] rounded-2xl p-4 shadow-2xl max-w-sm mx-auto"
            >
              <div className="flex flex-col gap-1.5">
                <div className="px-3 py-1.5 text-[11px] font-mono text-[#a1a1aa] uppercase tracking-wider border-b border-[#23272f]/60 mb-1 flex items-center justify-between">
                  <span>Navigation</span>
                  <span className="flex items-center gap-1.5 text-[#22c55e]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-status-dot" />
                    online
                  </span>
                </div>

                {NAV_ITEMS.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <a
                      key={item.id}
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-mono text-sm transition-colors ${
                        isActive
                          ? 'bg-[#16181d] text-[#f4f4f5] border border-[#5865F2]/40 font-semibold shadow-[0_0_12px_rgba(88,101,242,0.15)]'
                          : 'text-[#a1a1aa] hover:bg-[#16181d]/50 hover:text-[#f4f4f5]'
                      }`}
                    >
                      <span>{item.label}</span>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
                      )}
                    </a>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
