/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'motion/react';
import { ExternalLink, Github, Sparkles, Terminal, Code2 } from 'lucide-react';
import projectsData from '../data/projects.json';
import { Project } from '../types';

const SPRING_CONFIG = { stiffness: 120, damping: 24 };

function ProjectCard({
  project,
  index,
  isFeatured,
  hasImgError,
  onImageError,
  reducedMotion,
}: {
  project: Project;
  index: number;
  isFeatured: boolean;
  hasImgError: boolean;
  onImageError: () => void;
  reducedMotion: boolean | null;
}) {
  const cardRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  });

  // Stagger start in row
  const staggerDelay = (index % 3) * 0.04;
  const inStart = staggerDelay;
  const centerPoint = 0.45;
  const outEnd = 0.95;

  // Keyframe range: [entrance, center/active, exit]
  const rotXStart = isFeatured ? -12 : -10;
  const yStart = isFeatured ? 70 : 60;
  const yExit = isFeatured ? -50 : -40;

  const rawRotX = useTransform(scrollYProgress, [inStart, centerPoint, outEnd], [rotXStart, 0, 8]);
  const rawY = useTransform(scrollYProgress, [inStart, centerPoint, outEnd], [yStart, 0, yExit]);
  const rawScale = useTransform(scrollYProgress, [inStart, centerPoint, outEnd], [0.96, 1, 0.97]);
  const rawOpacity = useTransform(scrollYProgress, [inStart, inStart + 0.15, outEnd - 0.15, outEnd], [0.5, 1, 1, 0.5]);

  const rotateX = useSpring(rawRotX, SPRING_CONFIG);
  const y = useSpring(rawY, SPRING_CONFIG);
  const scale = useSpring(rawScale, SPRING_CONFIG);
  const opacity = useSpring(rawOpacity, SPRING_CONFIG);

  return (
    <motion.article
      ref={cardRef}
      style={
        reducedMotion
          ? { transformOrigin: 'center center' }
          : {
              rotateX,
              y,
              scale,
              opacity,
              transformOrigin: 'center center',
              transformStyle: 'preserve-3d',
            }
      }
      className={`group relative flex flex-col justify-between rounded-2xl bg-[#111215] border transition-colors duration-300 overflow-hidden will-change-transform ${
        isFeatured
          ? 'border-[#23272f] hover:border-[#5865F2]/60 shadow-[0_4px_24px_rgba(0,0,0,0.5)]'
          : 'border-[#23272f]/80 hover:border-[#23272f]'
      }`}
    >
      {/* Featured Badge Accent Glow */}
      {isFeatured && (
        <div
          className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#5865F2]/15 via-transparent to-transparent pointer-events-none -z-0"
          aria-hidden="true"
        />
      )}

      {/* Card Thumbnail / Visual Fallback */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#16181d] border-b border-[#23272f]">
        {!hasImgError ? (
          <img
            src={project.thumbnail}
            alt={`${project.title} interface preview`}
            onError={onImageError}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#16181d] to-[#111215]">
            <div className="w-10 h-10 rounded-xl bg-[#0a0a0a] border border-[#23272f] flex items-center justify-center mb-2 shadow-inner group-hover:border-[#5865F2]/50 transition-colors">
              {isFeatured ? (
                <Terminal className="w-5 h-5 text-[#22c55e]" />
              ) : (
                <Code2 className="w-5 h-5 text-[#5865F2]" />
              )}
            </div>
            <span className="font-mono text-xs font-semibold text-[#f4f4f5]">
              {project.title}
            </span>
            <span className="text-[10px] font-mono text-[#a1a1aa] mt-0.5">
              {project.tech.slice(0, 2).join(' • ')}
            </span>
          </div>
        )}

        {/* Featured Badge pill */}
        {isFeatured && (
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#0a0a0a]/90 backdrop-blur-md border border-[#23272f] text-[10px] font-mono font-medium text-[#22c55e]">
            <Sparkles className="w-3 h-3 text-[#22c55e]" />
            <span>FEATURED</span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-lg font-bold text-[#f4f4f5] group-hover:text-white transition-colors">
              {project.title}
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-[#a1a1aa] leading-relaxed mb-6">
            {project.description}
          </p>
        </div>

        <div>
          {/* Tech stack badges */}
          <div className="flex flex-wrap gap-1.5 mb-6">
            {project.tech.map((badge) => (
              <span
                key={badge}
                className="px-2 py-0.5 rounded bg-[#16181d] border border-[#23272f] text-[11px] font-mono text-[#a1a1aa] group-hover:border-[#23272f]/90 transition-colors"
              >
                {badge}
              </span>
            ))}
          </div>

          {/* Actions / Links */}
          <div className="flex items-center gap-3 pt-3 border-t border-[#23272f]/60">
            <a
              href={project.repo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-[#a1a1aa] hover:text-[#f4f4f5] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-white rounded px-1.5 py-1"
              aria-label={`View ${project.title} source code on GitHub`}
            >
              <Github className="w-3.5 h-3.5" />
              <span>Code</span>
            </a>

            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-[#5865F2] hover:text-[#7983f5] transition-colors ml-auto focus:outline-none focus-visible:ring-1 focus-visible:ring-[#5865F2] rounded px-1.5 py-1"
              aria-label={`Open ${project.title} live system or repository`}
            >
              <span>Explore</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function Projects() {
  const reducedMotion = useReducedMotion();
  const projects: Project[] = projectsData;
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
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

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  // Sort: featured first
  const sortedProjects = [...projects].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  });

  return (
    <section
      id="projects"
      aria-label="Projects Section"
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
          <span>02 // WORK & SYSTEMS</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#f4f4f5] tracking-tight">
              Featured Engineering
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#a1a1aa] max-w-xl">
              A curated selection of backend systems, Discord infrastructure, and creative work. More available on request.
            </p>
          </div>
          <div className="font-mono text-xs text-[#a1a1aa] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#5865F2]" />
            <span>Selected Works</span>
          </div>
        </div>
      </motion.div>

      {/* Projects Grid with 3D Perspective */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        style={{ perspective: '1200px' }}
      >
        {sortedProjects.map((project, index) => {
          return (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              isFeatured={project.featured}
              hasImgError={!!imageErrors[project.id]}
              onImageError={() => handleImageError(project.id)}
              reducedMotion={reducedMotion}
            />
          );
        })}
      </div>
    </section>
  );
}
