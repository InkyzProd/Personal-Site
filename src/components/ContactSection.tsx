/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

const SPRING_CONFIG = { stiffness: 120, damping: 24 };

const CHANNELS = [
  {
    type: 'Chat',
    label: 'WhatsApp',
    url: 'https://wa.me/inkyz.id',
    hoverBorder: 'hover:border-[#22c55e]/50',
    hoverColor: 'group-hover:text-[#22c55e]',
  },
  {
    type: 'Code',
    label: 'GitHub',
    url: 'https://github.com/InkyzProd',
    hoverBorder: 'hover:border-white/50',
    hoverColor: 'group-hover:text-white',
  },
  {
    type: 'Community',
    label: 'Discord',
    url: 'https://discord.com/users/305829524547960835',
    hoverBorder: 'hover:border-[#5865F2]/50',
    hoverColor: 'group-hover:text-[#5865F2]',
  },
  {
    type: 'Direct Mail',
    label: 'Email',
    url: 'mailto:inkyz.id@gmail.com',
    hoverBorder: 'hover:border-[#38bdf8]/50',
    hoverColor: 'group-hover:text-[#38bdf8]',
  },
];

function ChannelItem({
  channel,
  index,
  reducedMotion,
}: {
  channel: (typeof CHANNELS)[0];
  index: number;
  reducedMotion: boolean | null;
}) {
  const itemRef = useRef<HTMLAnchorElement>(null);
  const { scrollYProgress } = useScroll({
    target: itemRef,
    offset: ['start end', 'center center'],
  });

  const startOffset = index * 0.05;
  const rawRotX = useTransform(scrollYProgress, [startOffset, 1], [-4, 0]);
  const rawY = useTransform(scrollYProgress, [startOffset, 1], [20, 0]);
  const rawOpacity = useTransform(scrollYProgress, [startOffset, 1], [0.3, 1]);

  const rotateX = useSpring(rawRotX, SPRING_CONFIG);
  const y = useSpring(rawY, SPRING_CONFIG);
  const opacity = useSpring(rawOpacity, SPRING_CONFIG);

  return (
    <motion.a
      ref={itemRef}
      href={channel.url}
      target={channel.label !== 'Email' ? '_blank' : undefined}
      rel={channel.label !== 'Email' ? 'noopener noreferrer' : undefined}
      style={
        reducedMotion
          ? { transformOrigin: 'center bottom' }
          : {
              rotateX,
              y,
              opacity,
              transformOrigin: 'center bottom',
              transformStyle: 'preserve-3d',
            }
      }
      className={`p-3 rounded-xl bg-[#16181d]/80 border border-[#23272f] ${channel.hoverBorder} transition-colors group flex flex-col justify-between will-change-transform`}
    >
      <span className="text-[10px] font-mono uppercase tracking-wider text-[#a1a1aa]">
        {channel.type}
      </span>
      <span
        className={`text-xs font-mono font-semibold text-[#f4f4f5] ${channel.hoverColor} flex items-center justify-between mt-1 transition-colors`}
      >
        {channel.label}
        <ArrowUpRight className={`w-3 h-3 text-[#a1a1aa] ${channel.hoverColor}`} />
      </span>
    </motion.a>
  );
}

export default function ContactSection() {
  const reducedMotion = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: cardProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'center center'],
  });

  const rawCardRotX = useTransform(cardProgress, [0, 1], [-6, 0]);
  const rawCardY = useTransform(cardProgress, [0, 1], [40, 0]);
  const rawCardScale = useTransform(cardProgress, [0, 1], [0.98, 1]);
  const rawCardOpacity = useTransform(cardProgress, [0, 1], [0.5, 1]);

  const cardRotX = useSpring(rawCardRotX, SPRING_CONFIG);
  const cardY = useSpring(rawCardY, SPRING_CONFIG);
  const cardScale = useSpring(rawCardScale, SPRING_CONFIG);
  const cardOpacity = useSpring(rawCardOpacity, SPRING_CONFIG);

  return (
    <section
      id="contact"
      aria-label="Contact Section"
      className="relative py-24 md:py-32 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto z-10 [perspective:1200px]"
    >
      {/* Scroll-Linked 3D Main Card Container */}
      <motion.div
        ref={cardRef}
        style={
          reducedMotion
            ? {
                boxShadow:
                  '0 24px 48px -12px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.06)',
                transformOrigin: 'center bottom',
              }
            : {
                rotateX: cardRotX,
                y: cardY,
                scale: cardScale,
                opacity: cardOpacity,
                boxShadow:
                  '0 24px 48px -12px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.06)',
                transformOrigin: 'center bottom',
                transformStyle: 'preserve-3d',
              }
        }
        className="relative rounded-3xl bg-[#111215] border border-[#23272f] p-8 sm:p-12 lg:p-16 overflow-hidden text-center will-change-transform"
      >
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-b from-[#5865F2]/10 via-[#22c55e]/5 to-transparent blur-3xl rounded-full pointer-events-none -z-0"
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16181d] border border-[#23272f] text-xs font-mono text-[#22c55e] mb-6">
            <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-status-dot" />
            <span>03 // OPEN CHANNELS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#f4f4f5] tracking-tight mb-4">
            Let's build something{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22c55e] via-white to-[#5865F2]">
              extraordinary.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-[#a1a1aa] leading-relaxed mb-8">
            Available for distributed architecture consulting, Go backend contracts, and specialized
            infrastructure projects. Click below or open the floating orbital menu at the bottom-right.
          </p>

          {/* 4 Staggered Scroll-Linked Channel Cards */}
          <div
            className="pt-8 border-t border-[#23272f]/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left"
            style={{ perspective: '1000px' }}
          >
            {CHANNELS.map((channel, index) => (
              <ChannelItem
                key={channel.label}
                channel={channel}
                index={index}
                reducedMotion={reducedMotion}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
