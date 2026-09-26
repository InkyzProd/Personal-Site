/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'motion/react';
import { Server, HardDrive, Palette, Package, ArrowUpRight } from 'lucide-react';

const SPRING_CONFIG = { stiffness: 120, damping: 24 };

const CAPABILITIES = [
  {
    title: 'Backend & APIs',
    icon: <Server className="w-4 h-4 text-[#22c55e]" />,
    description:
      'Systems that stay fast under load. Manual WebSocket layers, REST APIs with Express and Hono, Discord bots without framework shortcuts, and automation pipelines in Node.js and Go.',
    tech: ['Node.js', 'Express', 'Hono', 'Go', 'MySQL', 'Cloudflare Workers'],
  },
  {
    title: 'Infrastructure & Self-Hosting',
    icon: <HardDrive className="w-4 h-4 text-[#5865F2]" />,
    description:
      'Linux environments, Docker containers, Nix for reproducibility, and hands-on VPS administration. I keep my own stack running the way I keep my code — lean, documented, and predictable.',
    tech: ['Linux', 'Docker', 'Nix', 'VPS', 'Git', 'Cloudflare'],
  },
  {
    title: 'Creative & Community',
    icon: <Palette className="w-4 h-4 text-[#a855f7]" />,
    description:
      'Code is one language I speak. Trap and dubstep production from 2019–2023, visual identity design for indie games and developer communities, and game server ecosystems for SA-MP and open.mp.',
    tech: ['FL Studio', 'Graphic Design', 'UI/UX', 'PAWN'],
  },
];

function CapabilityCard({
  cap,
  index,
  reducedMotion,
}: {
  cap: (typeof CAPABILITIES)[0];
  index: number;
  reducedMotion: boolean | null;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'center center'],
  });

  const startOffset = index * 0.08;
  const rawRotX = useTransform(scrollYProgress, [startOffset, 1], [-8, 0]);
  const rawY = useTransform(scrollYProgress, [startOffset, 1], [40, 0]);
  const rawScale = useTransform(scrollYProgress, [startOffset, 1], [0.97, 1]);
  const rawOpacity = useTransform(scrollYProgress, [startOffset, 1], [0.4, 1]);

  const rotateX = useSpring(rawRotX, SPRING_CONFIG);
  const y = useSpring(rawY, SPRING_CONFIG);
  const scale = useSpring(rawScale, SPRING_CONFIG);
  const opacity = useSpring(rawOpacity, SPRING_CONFIG);

  return (
    <motion.div
      ref={cardRef}
      style={
        reducedMotion
          ? { transformOrigin: 'center' }
          : {
              rotateX,
              y,
              scale,
              opacity,
              transformOrigin: 'center',
              transformStyle: 'preserve-3d',
            }
      }
      className="group relative flex flex-col p-6 rounded-2xl bg-[#111215] border border-[#23272f] hover:border-[#5865F2]/40 transition-colors duration-300 will-change-transform"
    >
      {/* Icon */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-[#16181d] border border-[#23272f] group-hover:border-[#5865F2]/40 transition-colors">
          {cap.icon}
        </div>
        <h3 className="font-mono text-sm font-semibold text-[#f4f4f5] tracking-tight">
          {cap.title}
        </h3>
      </div>

      {/* Description */}
      <p className="text-sm leading-relaxed text-[#a1a1aa] mb-6 flex-1">
        {cap.description}
      </p>

      {/* Tech badges */}
      <div className="flex flex-wrap gap-1.5 pt-4 border-t border-[#23272f]/60">
        {cap.tech.map((t) => (
          <span
            key={t}
            className="px-2 py-0.5 rounded bg-[#16181d] border border-[#23272f]/70 text-[11px] font-mono text-[#a1a1aa] group-hover:text-[#d4d4d8] transition-colors"
          >
            {t}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export default function Capabilities() {
  const reducedMotion = useReducedMotion();
  const headingRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: headingProgress } = useScroll({
    target: headingRef,
    offset: ['start end', 'center center'],
  });

  const rawHeadingRotX = useTransform(headingProgress, [0, 1], [-8, 0]);
  const rawHeadingY = useTransform(headingProgress, [0, 1], [30, 0]);
  const rawHeadingOpacity = useTransform(headingProgress, [0, 1], [0.4, 1]);

  const headingRotX = useSpring(rawHeadingRotX, SPRING_CONFIG);
  const headingY = useSpring(rawHeadingY, SPRING_CONFIG);
  const headingOpacity = useSpring(rawHeadingOpacity, SPRING_CONFIG);

  return (
    <section
      id="projects"
      aria-label="Capabilities Section"
      className="relative py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto z-10 [perspective:1200px]"
    >
      {/* Scroll-Linked 3D Section Header */}
      <motion.div
        ref={headingRef}
        style={
          reducedMotion
            ? {}
            : {
                rotateX: headingRotX,
                y: headingY,
                opacity: headingOpacity,
                transformOrigin: 'center bottom',
                transformStyle: 'preserve-3d',
              }
        }
        className="mb-14 will-change-transform"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111215] border border-[#23272f] text-xs font-mono text-[#22c55e] mb-3">
          <span>02 // CAPABILITIES</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#f4f4f5] tracking-tight">
              What I Do
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#a1a1aa] max-w-xl">
              Backend systems, Discord infrastructure, and creative work — mostly closed-source for clients and communities.
            </p>
          </div>
          <div className="font-mono text-xs text-[#a1a1aa] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#5865F2]" />
            <span>Available on request</span>
          </div>
        </div>
      </motion.div>

      {/* 3 Capability Cards */}
      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        style={{ perspective: '1200px' }}
      >
        {CAPABILITIES.map((cap, index) => (
          <CapabilityCard
            key={cap.title}
            cap={cap}
            index={index}
            reducedMotion={reducedMotion}
          />
        ))}
      </div>

      {/* npm Publication — Concrete Evidence */}
      <div className="mt-10 flex justify-center">
        <a
          href="https://www.npmjs.com/package/toksik"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-[#111215] border border-[#23272f] hover:border-[#cb3837]/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#cb3837]"
        >
          <Package className="w-4 h-4 text-[#cb3837]" />
          <span className="text-xs sm:text-sm font-mono text-[#a1a1aa] group-hover:text-[#f4f4f5] transition-colors">
            Published on npm: <span className="text-[#f4f4f5] font-semibold">Toksik</span>
          </span>
          <span className="hidden sm:inline text-[11px] font-mono text-[#52525b] group-hover:text-[#71717a] transition-colors">
            — badwords filter for JavaScript
          </span>
          <ArrowUpRight className="w-3.5 h-3.5 text-[#52525b] group-hover:text-[#f4f4f5] transition-colors" />
        </a>
      </div>
    </section>
  );
}