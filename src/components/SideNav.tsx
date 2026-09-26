/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';

interface SectionDot {
  id: string;
  label: string;
}

const SECTIONS: SectionDot[] = [
  { id: 'top', label: 'Top' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

export default function SideNav() {
  const [activeSection, setActiveSection] = useState<string>('top');
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const dotRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const containerRef = useRef<HTMLElement>(null);

  // Monitor prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Section Tracking via IntersectionObserver
  useEffect(() => {
    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: '-35% 0px -40% 0px',
      threshold: 0,
    });

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Magnetic hover effect (desktop fine pointer only, disabled under reduced motion)
  useEffect(() => {
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer || reducedMotion) return;

    const container = containerRef.current;
    if (!container) return;

    const handlePointerMove = (e: PointerEvent) => {
      const cursorX = e.clientX;
      const cursorY = e.clientY;

      SECTIONS.forEach(({ id }) => {
        const btn = dotRefs.current[id];
        if (!btn) return;

        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const distX = cursorX - centerX;
        const distY = cursorY - centerY;
        const distance = Math.hypot(distX, distY);

        const magnetRadius = 40;
        const maxPull = 3; // max 3px shift

        if (distance < magnetRadius) {
          const factor = (1 - distance / magnetRadius) * maxPull;
          const pullX = (distX / distance) * factor;
          const pullY = (distY / distance) * factor;
          btn.style.transform = `translate3d(${pullX.toFixed(1)}px, ${pullY.toFixed(1)}px, 0)`;
        } else {
          btn.style.transform = 'translate3d(0, 0, 0)';
        }
      });
    };

    const handlePointerLeave = () => {
      SECTIONS.forEach(({ id }) => {
        const btn = dotRefs.current[id];
        if (btn) btn.style.transform = 'translate3d(0, 0, 0)';
      });
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    container.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [reducedMotion]);

  const scrollToSection = (id: string) => {
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    }
  };

  return (
    <nav
      ref={containerRef}
      aria-label="Section Navigation"
      className="hidden md:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-4 py-3 px-2 select-none"
    >
      {SECTIONS.map(({ id, label }) => {
        const isActive = activeSection === id;

        return (
          <div key={id} className="relative flex items-center justify-center group">
            {/* Tooltip Label (hover / focus) */}
            <span
              className="pointer-events-none absolute right-full mr-3.5 px-2.5 py-1 rounded bg-[#111215] border border-[#23272f] text-[11px] font-mono text-[#f4f4f5] tracking-wider uppercase opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-150 whitespace-nowrap shadow-xl"
              style={{
                boxShadow: '0 4px 16px rgba(0,0,0,0.7)',
              }}
            >
              {label}
            </span>

            {/* Dot Button with accessibility attributes */}
            <button
              ref={(el) => {
                dotRefs.current[id] = el;
              }}
              type="button"
              onClick={() => scrollToSection(id)}
              aria-label={`Scroll to ${label} section`}
              aria-current={isActive ? 'true' : undefined}
              className="relative flex items-center justify-center w-6 h-6 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22c55e]"
              style={{
                transition: 'transform 0.15s ease-out',
              }}
            >
              {/* Dot Geometry */}
              <span
                className={`rounded-full transition-all duration-300 ${
                  isActive
                    ? `w-2.5 h-2.5 bg-[#22c55e] ${
                        !reducedMotion
                          ? 'shadow-[0_0_10px_rgba(34,197,94,0.65)] ring-2 ring-[#22c55e]/25'
                          : ''
                      }`
                    : 'w-1.5 h-1.5 bg-[#52525b] group-hover:bg-[#a1a1aa] group-hover:scale-125'
                }`}
              />
            </button>
          </div>
        );
      })}
    </nav>
  );
}
