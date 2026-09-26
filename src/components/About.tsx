/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'motion/react';
import { Layers, Server, Cpu, Terminal, Calendar, MapPin } from 'lucide-react';
import { SkillCategory, ExperienceItem } from '../types';

const SKILL_CATEGORIES: (SkillCategory & { icon: React.ReactNode })[] = [
  {
    title: 'Languages & Runtimes',
    icon: <Terminal className="w-4 h-4 text-[#22c55e]" />,
    items: ['Node.js', 'JavaScript', 'Go', 'TypeScript', 'PAWN', 'Lua', 'Python (exploring)'],
  },
  {
    title: 'Backend & APIs',
    icon: <Server className="w-4 h-4 text-[#5865F2]" />,
    items: ['Express.js', 'Hono', 'WebSocket', 'NLP', 'LLM', 'REST APIs', 'Cloudflare Workers', 'MySQL', 'PostgreSQL', 'Redis', 'Valkey'],
  },
  {
    title: 'Infrastructure & Tools',
    icon: <Cpu className="w-4 h-4 text-[#38bdf8]" />,
    items: ['Linux', 'Docker', 'Nix', 'VPS Administration', 'Git', 'Bash / Shell'],
  },
  {
    title: 'Frontend & Creative',
    icon: <Layers className="w-4 h-4 text-[#a855f7]" />,
    items: ['SvelteKit', 'Skeleton UI', 'Bulma', 'Wired Elements', 'Tailwind', 'Shacdn', 'ArrowJS', 'PicoCSS', 'ChakraUI'],
  },
];

const EXPERIENCE_TIMELINE: ExperienceItem[] = [
  {
    role: 'Independent Backend & Systems Developer',
    period: '2020 – Present',
    location: 'Remote / Indonesia',
    description:
      'Shipping Node.js backends, manual WebSocket infrastructure, and self-hosted VPS environments for communities and small clients. Building APIs from primitives with Express and Hono, Discord bots without framework shortcuts, and Cloudflare Worker services.',
  },
  {
    role: 'Game Server Developer — SA-MP & open.mp',
    period: '2020 – 2022',
    location: 'Remote',
    description:
      'Wrote gamemodes in PAWN, designed C++ plugins, and integrated MySQL databases for multiplayer communities. Led the Java Stories (JS-RP) migration from openRP to the open.mp architecture.',
  },
  {
    role: 'Music Producers',
    period: '2018 – 2022',
    location: 'House',
    description:
      'I started learning and producing EDM music as a hobby and also got involved with the music community in Indonesia.'
  },
];

const SPRING_CONFIG = { stiffness: 120, damping: 24 };

function SkillCard({
  cat,
  index,
  reducedMotion,
}: {
  cat: (typeof SKILL_CATEGORIES)[0];
  index: number;
  reducedMotion: boolean | null;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'center center'],
  });

  const startOffset = index * 0.06;
  const rawRotY = useTransform(scrollYProgress, [startOffset, 1], [-6, 0]);
  const rawRotX = useTransform(scrollYProgress, [startOffset, 1], [-4, 0]);
  const rawY = useTransform(scrollYProgress, [startOffset, 1], [40, 0]);
  const rawScale = useTransform(scrollYProgress, [startOffset, 1], [0.97, 1]);
  const rawOpacity = useTransform(scrollYProgress, [startOffset, 1], [0.5, 1]);

  const rotateY = useSpring(rawRotY, SPRING_CONFIG);
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
              rotateY,
              rotateX,
              y,
              scale,
              opacity,
              transformOrigin: 'center',
              transformStyle: 'preserve-3d',
            }
      }
      className="p-4 rounded-xl bg-[#111215] border border-[#23272f] hover:border-[#23272f]/80 transition-colors will-change-transform"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-lg bg-[#16181d] border border-[#23272f]">
          {cat.icon}
        </div>
        <span className="font-mono text-xs font-semibold text-[#f4f4f5]">
          {cat.title}
        </span>
      </div>

      <ul className="flex flex-wrap gap-1.5">
        {cat.items.map((item) => (
          <li
            key={item}
            className="px-2.5 py-1 rounded-md bg-[#16181d] border border-[#23272f]/70 text-[11px] font-mono text-[#a1a1aa] hover:text-[#f4f4f5] hover:border-[#5865F2]/40 transition-colors"
          >
            {item}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

function TimelineItem({
  item,
  index,
  reducedMotion,
}: {
  item: ExperienceItem;
  index: number;
  reducedMotion: boolean | null;
}) {
  const itemRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: itemRef,
    offset: ['start end', 'center center'],
  });

  const startOffset = index * 0.1;
  const rawRotX = useTransform(scrollYProgress, [startOffset, 1], [-6, 0]);
  const rawX = useTransform(scrollYProgress, [startOffset, 1], [-20, 0]);
  const rawOpacity = useTransform(scrollYProgress, [startOffset, 1], [0.2, 1]);

  const rotateX = useSpring(rawRotX, SPRING_CONFIG);
  const x = useSpring(rawX, SPRING_CONFIG);
  const opacity = useSpring(rawOpacity, SPRING_CONFIG);

  return (
    <motion.div
      ref={itemRef}
      style={
        reducedMotion
          ? { transformOrigin: 'left center' }
          : {
              rotateX,
              x,
              opacity,
              transformOrigin: 'left center',
              transformStyle: 'preserve-3d',
            }
      }
      className="p-5 rounded-xl bg-[#111215] border border-[#23272f] hover:border-[#23272f]/90 transition-all group will-change-transform"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
        <span className="font-mono text-sm font-semibold text-[#f4f4f5] group-hover:text-white transition-colors">
          {item.role}
        </span>
        <span className="flex items-center gap-1 text-xs font-mono text-[#22c55e]">
          <Calendar className="w-3 h-3" />
          {item.period}
        </span>
      </div>

      <div className="flex items-center gap-1.5 text-xs font-mono text-[#a1a1aa] mb-3">
        <MapPin className="w-3 h-3 text-[#5865F2]" />
        <span>{item.location}</span>
      </div>

      <p className="text-xs sm:text-sm text-[#a1a1aa] leading-relaxed">
        {item.description}
      </p>
    </motion.div>
  );
}

function BioCard({
  title,
  dotColor,
  children,
  index,
  reducedMotion,
}: {
  title: string;
  dotColor: string;
  children: React.ReactNode;
  index: number;
  reducedMotion: boolean | null;
}) {
  const bioRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: bioRef,
    offset: ['start end', 'center center'],
  });

  const startOffset = index * 0.08;
  const rawRotX = useTransform(scrollYProgress, [startOffset, 1], [-6, 0]);
  const rawY = useTransform(scrollYProgress, [startOffset, 1], [30, 0]);
  const rawOpacity = useTransform(scrollYProgress, [startOffset, 1], [0.3, 1]);

  const rotateX = useSpring(rawRotX, SPRING_CONFIG);
  const y = useSpring(rawY, SPRING_CONFIG);
  const opacity = useSpring(rawOpacity, SPRING_CONFIG);

  return (
    <motion.div
      ref={bioRef}
      style={
        reducedMotion
          ? { transformOrigin: 'center top' }
          : {
              rotateX,
              y,
              opacity,
              transformOrigin: 'center top',
              transformStyle: 'preserve-3d',
            }
      }
      className="p-6 rounded-2xl bg-[#111215] border border-[#23272f] will-change-transform"
    >
      <h3 className="text-sm font-mono text-[#f4f4f5] font-semibold mb-2 flex items-center gap-2">
        <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
        {title}
      </h3>
      <p>{children}</p>
    </motion.div>
  );
}

export default function About() {
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
      id="about"
      aria-label="About Section"
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111215] border border-[#23272f] text-xs font-mono text-[#5865F2] mb-3">
          <span>01 // BACKGROUND</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#f4f4f5] tracking-tight">
          About & Core Competencies
        </h2>
        <p className="mt-2 text-sm sm:text-base text-[#a1a1aa] max-w-xl">
          A blend of systems programming discipline, cloud infrastructure, and low-latency architecture.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: 3 Bio Paragraphs */}
        <div className="lg:col-span-6 flex flex-col gap-6 text-[#a1a1aa] text-base leading-relaxed [perspective:1200px]">
          <BioCard
            title="Engineering Philosophy"
            dotColor="bg-[#22c55e]"
            index={0}
            reducedMotion={reducedMotion}
          >
            I write code the way I wish most codebases were written: readable first, 
            clever last. I default to the platform — building WebSocket layers from 
            primitives instead of hiding behind discord.js, wiring APIs directly with 
            Express or Hono, and treating every dependency as a long-term liability 
            rather than a shortcut.
          </BioCard>

          <BioCard
            title="Infrastructure & Self-Hosting"
            dotColor="bg-[#5865F2]"
            index={1}
            reducedMotion={reducedMotion}
          >
            I work close to the metal: Linux environments, Docker containers, Nix 
            for reproducibility, and hands-on VPS administration across Indonesian 
            cloud providers. Go is my tool for cross-compilation and backend 
            automation when Node.js isn't the right shape for the problem — 
            including Discord bots with their own database handling.
          </BioCard>

          <BioCard
            title="Beyond Code"
            dotColor="bg-[#38bdf8]"
            index={2}
            reducedMotion={reducedMotion}
          >
            Code is one language I speak. From 2019 to 2023 I produced trap and 
            dubstep under various aliases, designed visual identities for indie games 
            and developer communities, and spent years building game server ecosystems 
            for SA-MP and open.mp. I believe tools should feel human — and community 
            is where that matters most.
          </BioCard>
        </div>

        {/* Right Column: Skills (4 Categories) & Timeline */}
        <div className="lg:col-span-6 flex flex-col gap-8 [perspective:1200px]">
          {/* 4 Skill Categories with Staggered Scroll-Linked 3D Rotations */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#a1a1aa] mb-4 flex items-center gap-2">
              <span>Technical Stack</span>
              <span className="h-px flex-1 bg-[#23272f]" />
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 [perspective:1200px]">
              {SKILL_CATEGORIES.map((cat, idx) => (
                <SkillCard
                  key={cat.title}
                  cat={cat}
                  index={idx}
                  reducedMotion={reducedMotion}
                />
              ))}
            </div>
          </div>

          {/* Experience Timeline */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#a1a1aa] mb-4 flex items-center gap-2">
              <span>Timeline</span>
              <span className="h-px flex-1 bg-[#23272f]" />
            </h3>

            <div className="space-y-4 [perspective:1200px]">
              {EXPERIENCE_TIMELINE.map((item, idx) => (
                <TimelineItem
                  key={item.role}
                  item={item}
                  index={idx}
                  reducedMotion={reducedMotion}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
