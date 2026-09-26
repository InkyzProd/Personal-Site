/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus } from 'lucide-react';

interface ContactItem {
  id: string;
  name: string;
  label: string;
  url: string;
  angle: number; // Angle in degrees in upper-left quadrant (90 = up, 180 = left)
  color: string;
  hoverBorder: string;
  icon: React.ReactNode;
}

// Inline SVGs matching Simple Icons brand specs
const WhatsAppIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M17.472 14.382c-.301-.15-1.78-.879-2.056-.98-.276-.1-.476-.15-.677.15-.2.301-.777.98-.953 1.18-.175.201-.351.226-.652.075-.301-.15-1.272-.469-2.423-1.496-.896-.799-1.5-1.786-1.676-2.087-.176-.301-.019-.464.132-.614.135-.135.301-.351.451-.527.151-.175.201-.301.301-.501.1-.2.05-.376-.025-.526-.075-.15-.677-1.632-.928-2.234-.244-.587-.492-.507-.677-.517l-.577-.01c-.2 0-.526.075-.802.376-.276.301-1.053 1.028-1.053 2.508 0 1.48 1.078 2.909 1.229 3.109.15.201 2.12 3.238 5.137 4.542.718.31 1.279.496 1.716.635.722.23 1.379.197 1.898.12.578-.087 1.78-.727 2.031-1.43.25-.702.25-1.303.175-1.43-.075-.125-.276-.201-.577-.351z" />
    <path d="M12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.662 1.435 5.176L2 22l4.981-1.408A9.957 9.957 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.2a8.16 8.16 0 0 1-4.328-1.234l-.31-.184-2.957.836.837-2.884-.202-.321A8.17 8.17 0 0 1 3.8 12c0-4.521 3.679-8.2 8.2-8.2 4.522 0 8.2 3.679 8.2 8.2 0 4.522-3.678 8.2-8.2 8.2z" />
  </svg>
);

const GitHubIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"
    />
  </svg>
);

const DiscordIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

const EmailIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67z" />
    <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908z" />
  </svg>
);

// 4 Contact channels with exact placeholder URL conventions
const CONTACT_ITEMS: ContactItem[] = [
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    label: 'Chat on WhatsApp',
    url: 'https://wa.me/inkyz.id',
    angle: 172, // Far left horizontal
    color: '#22c55e',
    hoverBorder: 'hover:border-[#22c55e]',
    icon: <WhatsAppIcon />,
  },
  {
    id: 'github',
    name: 'GitHub',
    label: 'View GitHub',
    url: 'https://github.com/InkyzProd',
    angle: 146, // Upper-left diagonal low
    color: '#f4f4f5',
    hoverBorder: 'hover:border-white',
    icon: <GitHubIcon />,
  },
  {
    id: 'discord',
    name: 'Discord',
    label: 'Join Discord',
    url: 'https://discord.com/users/305829524547960835',
    angle: 121, // Upper-left diagonal high
    color: '#5865F2',
    hoverBorder: 'hover:border-[#5865F2]',
    icon: <DiscordIcon />,
  },
  {
    id: 'email',
    name: 'Email',
    label: 'Send Email',
    url: 'mailto:inkyz.id@gmail.com',
    angle: 94, // Almost straight up
    color: '#38bdf8',
    hoverBorder: 'hover:border-[#38bdf8]',
    icon: <EmailIcon />,
  },
];

export default function RadialFabContact() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const fabButtonRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  // Check user prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Listen for custom trigger event (e.g. from Hero CTA "Get in Touch")
  useEffect(() => {
    const handleOpenFab = () => setIsOpen(true);
    window.addEventListener('open-contact-fab', handleOpenFab);
    return () => window.removeEventListener('open-contact-fab', handleOpenFab);
  }, []);

  // Handle escape key to collapse
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        fabButtonRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Handle outside click dismissal
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node) &&
        isOpen
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Radius of orbit in pixels
  const orbitRadius = 114;

  return (
    <div
      ref={containerRef}
      className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 pointer-events-auto select-none"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        paddingRight: 'env(safe-area-inset-right, 0px)',
      }}
    >
      <div className="relative flex items-center justify-center">
        {/* Orbital Radial Menu Items */}
        <AnimatePresence>
          {isOpen && (
            <>
              {CONTACT_ITEMS.map((item, index) => {
                // Calculate target position in quadrant relative to FAB center
                const rad = (item.angle * Math.PI) / 180;
                const targetX = Math.round(Math.cos(rad) * orbitRadius);
                const targetY = -Math.round(Math.sin(rad) * orbitRadius);

                return (
                  <motion.div
                    key={item.id}
                    className="absolute"
                    initial={
                      reducedMotion
                        ? { opacity: 0, scale: 0.5, x: 0, y: 0 }
                        : {
                            opacity: 0,
                            scale: 0.2,
                            x: 0,
                            y: 0,
                          }
                    }
                    animate={
                      reducedMotion
                        ? {
                            opacity: 1,
                            scale: 1,
                            x: targetX,
                            y: targetY,
                            transition: {
                              duration: 0.15,
                              delay: index * 0.04,
                            },
                          }
                        : {
                            opacity: 1,
                            scale: 1,
                            x: targetX,
                            y: targetY,
                            transition: {
                              type: 'spring',
                              stiffness: 420,
                              damping: 24,
                              mass: 0.8,
                              delay: index * 0.06, // 60ms stagger fan-out
                            },
                          }
                    }
                    exit={
                      reducedMotion
                        ? {
                            opacity: 0,
                            scale: 0.4,
                            x: 0,
                            y: 0,
                            transition: { duration: 0.12 },
                          }
                        : {
                            opacity: 0,
                            scale: 0.2,
                            x: 0,
                            y: 0,
                            transition: {
                              type: 'spring',
                              stiffness: 500,
                              damping: 32,
                              delay: (CONTACT_ITEMS.length - 1 - index) * 0.03,
                            },
                          }
                    }
                  >
                    {/* Subtle Idle Orbital Drift Animation when menu is resting open */}
                    <motion.div
                      animate={
                        reducedMotion
                          ? undefined
                          : {
                              x: [0, 2.5, -2, 0],
                              y: [0, -3, 2, 0],
                            }
                      }
                      transition={
                        reducedMotion
                          ? undefined
                          : {
                              duration: 7 + index * 0.8,
                              repeat: Infinity,
                              ease: 'easeInOut',
                            }
                      }
                      className="group relative flex items-center justify-center"
                    >
                      {/* Interactive Link Item */}
                      <a
                        ref={(el) => {
                          itemRefs.current[index] = el;
                        }}
                        href={item.url}
                        target={item.id !== 'email' ? '_blank' : undefined}
                        rel={
                          item.id !== 'email'
                            ? 'noopener noreferrer'
                            : undefined
                        }
                        aria-label={item.label}
                        className={`flex items-center justify-center w-12 h-12 rounded-full bg-[#111215] border border-[#23272f] shadow-lg text-[#a1a1aa] hover:text-white ${item.hoverBorder} hover:scale-110 active:scale-95 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22c55e] z-20`}
                        style={{
                          boxShadow:
                            '0 8px 20px -4px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.06)',
                        }}
                      >
                        <span
                          className="transition-colors duration-200 group-hover:text-inherit"
                          style={{ color: item.color }}
                        >
                          {item.icon}
                        </span>
                      </a>

                      {/* Tooltip Badge on hover / focus */}
                      <div
                        className="pointer-events-none absolute right-full mr-3 px-2.5 py-1 rounded-md bg-[#16181d] border border-[#23272f] text-xs font-mono text-[#f4f4f5] whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-150 z-30"
                        style={{
                          boxShadow: '0 4px 16px rgba(0,0,0,0.6)',
                        }}
                      >
                        <span>{item.label}</span>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </>
          )}
        </AnimatePresence>

        {/* Centerpiece Floating Action Button (FAB) */}
        <button
          ref={fabButtonRef}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-haspopup="true"
          aria-label={
            isOpen ? 'Close contact menu' : 'Open contact radial menu'
          }
          className={`relative z-30 flex items-center justify-center w-14 h-14 rounded-full border transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22c55e] ${
            isOpen
              ? 'bg-[#16181d] border-[#5865F2] text-[#f4f4f5] scale-95'
              : 'bg-[#111215] border-[#23272f] text-[#f4f4f5] hover:border-[#5865F2]/80 hover:scale-105 active:scale-95 fab-idle-glow'
          }`}
          style={{
            boxShadow: isOpen
              ? '0 0 24px rgba(88, 101, 242, 0.4), inset 0 1px 0 rgba(255,255,255,0.1)'
              : '0 8px 28px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.08)',
          }}
        >
          {/* Animated Icon: Plus rotating smoothly 45deg to form an X */}
          <div className="relative w-6 h-6 flex items-center justify-center">
            <motion.div
              animate={{
                rotate: isOpen ? 45 : 0,
                color: isOpen ? '#5865F2' : '#f4f4f5',
              }}
              transition={
                reducedMotion
                  ? { duration: 0 }
                  : { duration: 0.25, ease: [0.4, 0, 0.2, 1] }
              }
              className="flex items-center justify-center will-change-transform"
              style={{ transformOrigin: 'center' }}
            >
              <Plus className="w-5 h-5" />
            </motion.div>

            {/* Active status pip on the FAB button (fades out when open) */}
            <motion.span
              initial={false}
              animate={{
                opacity: isOpen ? 0 : 1,
                scale: isOpen ? 0.4 : 1,
              }}
              transition={{ duration: 0.2 }}
              className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#22c55e] animate-status-dot border-2 border-[#111215] pointer-events-none"
            />
          </div>
        </button>
      </div>
    </div>
  );
}
