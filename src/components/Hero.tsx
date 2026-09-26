/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { ArrowDown } from 'lucide-react';

export default function Hero() {
  const [imgError, setImgError] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // References for Zero-Rerender Multi-Layer Parallax & 3D Tilt
  const heroRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const photoCardRef = useRef<HTMLDivElement>(null);
  const photoInnerRef = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);
  const photoSubtextRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bioRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const specRowRef = useRef<HTMLDivElement>(null);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Multi-Layer Hero Parallax, Scroll Rotation & 3D Card Tilt via RAF + Lerp (Zero React State Re-renders)
  useEffect(() => {
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (reducedMotion) return;

    const hero = heroRef.current;
    if (!hero) return;

    // Target normalized positions (-1 to 1)
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    // Photo Card Tilt target & current
    let targetTiltX = 0; // rotateX degrees from pointer
    let targetTiltY = 0; // rotateY degrees from pointer
    let currentTiltX = 0;
    let currentTiltY = 0;

    // Scroll progress & smooth rotation (-4deg -> 0deg -> +3deg)
    let targetScrollRotX = 0;
    let currentScrollRotX = 0;
    let scrollYOffset = 0;

    const handlePointerMoveHero = (e: PointerEvent) => {
      if (!isFinePointer) return;
      const rect = hero.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      targetX = Math.max(-1, Math.min(1, (e.clientX - centerX) / (rect.width / 2)));
      targetY = Math.max(-1, Math.min(1, (e.clientY - centerY) / (rect.height / 2)));
    };

    const handlePointerLeaveHero = () => {
      targetX = 0;
      targetY = 0;
    };

    const handleScroll = () => {
      const top = window.scrollY;
      const heroHeight = hero.offsetHeight || window.innerHeight;
      const scrollRatio = Math.min(1.5, Math.max(0, top / heroHeight));

      // Scroll rotateX: -4deg at start, 0deg at rest, +3deg when scrolling past
      if (scrollRatio <= 0.4) {
        targetScrollRotX = -4 * (1 - scrollRatio / 0.4);
      } else {
        targetScrollRotX = Math.min(3, (scrollRatio - 0.4) * 3);
      }

      // Secondary subtle parallax: max ±8px
      scrollYOffset = Math.min(30, top * 0.08);
    };

    // 3D Card Hover & Sheen Tracking
    const photoContainer = photoCardRef.current;
    const handlePointerMoveCard = (e: PointerEvent) => {
      if (!photoContainer || !isFinePointer) return;
      const rect = photoContainer.getBoundingClientRect();
      const cardCenterX = rect.left + rect.width / 2;
      const cardCenterY = rect.top + rect.height / 2;

      const posX = Math.max(-1, Math.min(1, (e.clientX - cardCenterX) / (rect.width / 2)));
      const posY = Math.max(-1, Math.min(1, (e.clientY - cardCenterY) / (rect.height / 2)));

      // 8deg max tilt
      targetTiltY = posX * 8;
      targetTiltX = -posY * 8;

      // Update Prismatic Sheen coordinates
      const sheenX = ((e.clientX - rect.left) / rect.width) * 100;
      const sheenY = ((e.clientY - rect.top) / rect.height) * 100;
      if (sheenRef.current) {
        sheenRef.current.style.background = `radial-gradient(circle at ${sheenX}% ${sheenY}%, rgba(255,255,255,0.14) 0%, rgba(88,101,242,0.12) 35%, transparent 70%)`;
        sheenRef.current.style.opacity = '0.55';
      }
    };

    const handlePointerLeaveCard = () => {
      targetTiltX = 0;
      targetTiltY = 0;
      if (sheenRef.current) {
        sheenRef.current.style.opacity = '0';
      }
    };

    hero.addEventListener('pointermove', handlePointerMoveHero, { passive: true });
    hero.addEventListener('pointerleave', handlePointerLeaveHero);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    if (photoContainer) {
      photoContainer.addEventListener('pointermove', handlePointerMoveCard, { passive: true });
      photoContainer.addEventListener('pointerleave', handlePointerLeaveCard);
    }

    let animationFrameId: number;

    const animateLoop = () => {
      // Lerp pointer parallax values
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      // Lerp 3D tilt & scroll rotation values
      currentTiltX += (targetTiltX - currentTiltX) * 0.1;
      currentTiltY += (targetTiltY - currentTiltY) * 0.1;
      currentScrollRotX += (targetScrollRotX - currentScrollRotX) * 0.08;

      // Layer 1: Ambient Glow (Factor: -40px opposite pointer)
      if (glowRef.current) {
        const gx = (-currentX * 40).toFixed(2);
        const gy = (-currentY * 40 - scrollYOffset * 0.4).toFixed(2);
        glowRef.current.style.transform = `translate3d(${gx}px, ${gy}px, -40px)`;
      }

      // Layer 2: Profile Photo Container (+25px parallax + pointer tilt + scroll rotX)
      if (photoCardRef.current) {
        const px = (currentX * 25).toFixed(2);
        const py = (currentY * 25 - scrollYOffset * 0.3).toFixed(2);
        const totalRotX = (currentTiltX + currentScrollRotX).toFixed(2);
        const totalRotY = currentTiltY.toFixed(2);
        photoCardRef.current.style.transform = `translate3d(${px}px, ${py}px, 0px) rotateX(${totalRotX}deg) rotateY(${totalRotY}deg)`;
      }

      // Photo Subtext (translateZ: 20px)
      if (photoSubtextRef.current) {
        const stx = (currentX * 10).toFixed(2);
        const sty = (currentY * 10).toFixed(2);
        photoSubtextRef.current.style.transform = `translate3d(${stx}px, ${sty}px, 20px)`;
      }

      // Layer 3: Badge "available for work" (Factor: -12px opposite pointer)
      if (badgeRef.current) {
        const bx = (-currentX * 12).toFixed(2);
        const by = (-currentY * 12).toFixed(2);
        badgeRef.current.style.transform = `translate3d(${bx}px, ${by}px, 0px)`;
      }

      // Layer 4: Headline (Factor: +6px with pointer, max 8px strict cap)
      if (headlineRef.current) {
        const hx = (currentX * 6).toFixed(2);
        const hy = (currentY * 6 - scrollYOffset * 0.15).toFixed(2);
        headlineRef.current.style.transform = `translate3d(${hx}px, ${hy}px, 0px)`;
      }

      // Layer 5: Bio paragraph (Factor: +4px)
      if (bioRef.current) {
        const bx = (currentX * 4).toFixed(2);
        const by = (currentY * 4 - scrollYOffset * 0.1).toFixed(2);
        bioRef.current.style.transform = `translate3d(${bx}px, ${by}px, 0px)`;
      }

      // Layer 6: CTA buttons (Factor: +3px with pointer, max 5px strict cap)
      if (ctaRef.current) {
        const cx = (currentX * 3).toFixed(2);
        const cy = (currentY * 3).toFixed(2);
        ctaRef.current.style.transform = `translate3d(${cx}px, ${cy}px, 0px)`;
      }

      // Layer 7: Monospace spec row (Factor: +8px)
      if (specRowRef.current) {
        const sx = (currentX * 8).toFixed(2);
        const sy = (currentY * 8).toFixed(2);
        specRowRef.current.style.transform = `translate3d(${sx}px, ${sy}px, 0px)`;
      }

      animationFrameId = requestAnimationFrame(animateLoop);
    };

    animationFrameId = requestAnimationFrame(animateLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      hero.removeEventListener('pointermove', handlePointerMoveHero);
      hero.removeEventListener('pointerleave', handlePointerLeaveHero);
      window.removeEventListener('scroll', handleScroll);
      if (photoContainer) {
        photoContainer.removeEventListener('pointermove', handlePointerMoveCard);
        photoContainer.removeEventListener('pointerleave', handlePointerLeaveCard);
      }
    };
  }, [reducedMotion]);

  return (
    <section
      ref={heroRef}
      id="top"
      aria-label="Hero Section"
      className="relative min-h-[92vh] flex flex-col justify-center pt-24 pb-16 md:pt-32 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto overflow-hidden"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
        {/* Left Column: Text & CTAs */}
        <div className="lg:col-span-8 flex flex-col items-start text-left z-10">
          {/* Live Status Badge */}
          <div
            ref={badgeRef}
            className="will-change-transform inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#111215] border border-[#23272f] text-xs font-mono text-[#a1a1aa] mb-6 shadow-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22c55e]" />
            </span>
            <span className="text-[#f4f4f5] font-medium">available for work</span>
            <span className="text-[#23272f]">•</span>
            <span className="text-[#a1a1aa]">2026</span>
          </div>

          {/* Main Headline */}
          <h1
            ref={headlineRef}
            className="will-change-transform text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#f4f4f5] leading-[1.12] mb-6"
          >
            Building backends that stay fast and interfaces{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#f4f4f5] to-[#a1a1aa]">
              that feel right.
            </span>
          </h1>

          {/* Bio Intro Paragraph */}
          <p
            ref={bioRef}
            className="will-change-transform text-base sm:text-lg text-[#a1a1aa] leading-relaxed max-w-2xl mb-8"
          >
            I'm <span className="text-[#f4f4f5] font-medium">InkyzProd</span>,{' '}
            <span className="text-[#f4f4f5] font-medium">A backend developer</span>, and{' '}
            <span className="text-[#f4f4f5] font-medium">creative producer focused on Node.js systems, self-hosted infrastructure, and community-driven tools</span>. Nearly five years shipping code, music, and design from Indonesia.
          </p>

          {/* Action CTAs */}
          <div
            ref={ctaRef}
            className="will-change-transform flex flex-wrap items-center gap-4 w-full sm:w-auto"
          >
            <a
              href="#projects"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#f4f4f5] hover:bg-white text-[#0a0a0a] font-medium text-sm transition-all duration-200 shadow-lg shadow-white/5 hover:shadow-white/10 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <span>Explore Projects</span>
              <ArrowDown className="w-4 h-4" />
            </a>
          </div>

          {/* Quick Monospace Spec Metric Row */}
          <div
            ref={specRowRef}
            className="will-change-transform mt-10 pt-6 border-t border-[#23272f]/60 grid grid-cols-3 gap-6 text-left"
          >
            <div>
              <span className="block text-[11px] font-mono text-[#a1a1aa] uppercase tracking-wider">
                Primary Core
              </span>
              <span className="font-mono text-sm font-semibold text-[#f4f4f5]">
                Node.js / Go
              </span>
            </div>
            <div>
              <span className="block text-[11px] font-mono text-[#a1a1aa] uppercase tracking-wider">
                Domain
              </span>
              <span className="font-mono text-sm font-semibold text-[#f4f4f5]">
                Backend & Systems
              </span>
            </div>
            <div>
              <span className="block text-[11px] font-mono text-[#a1a1aa] uppercase tracking-wider">
                Location
              </span>
              <span className="font-mono text-sm font-semibold text-[#f4f4f5]">
                ID / Remote
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Squircle Profile Visual with Conic Border & 3D Tilt */}
        <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center z-10 [perspective:1000px]">
          <div
            ref={photoCardRef}
            className="relative w-full max-w-[280px] flex flex-col items-center will-change-transform [transform-style:preserve-3d]"
          >
            {/* Ambient Backlight Glow (translateZ: -40px) */}
            <div
              ref={glowRef}
              className="absolute -inset-4 rounded-[30%] bg-gradient-to-tr from-[#5865F2]/25 via-[#22c55e]/20 to-transparent blur-2xl opacity-70 pointer-events-none -z-10 will-change-transform"
              aria-hidden="true"
            />

            {/* Profile Photo Squircle Wrapper with Rotating Conic Border & 3D Depth */}
            <div
              ref={photoInnerRef}
              className="relative w-full aspect-[4/5] rounded-[30%] shadow-2xl transition-colors duration-200"
              style={{
                transform: 'translateZ(0px)',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Layer 1: Rotating 120-deg Conic Gradient Arc */}
              <div
                className="conic-border absolute inset-0 pointer-events-none"
                aria-hidden="true"
              />

              {/* Layer 2: Inner Mask / Base Border (insets 1px to reveal 1px conic ring) */}
              <div
                className="absolute inset-[1px] rounded-[30%] bg-[#0a0a0a] border border-[#23272f]/80 pointer-events-none"
                aria-hidden="true"
              />

              {/* Layer 3: Image Viewport with 30% border-radius */}
              <div className="absolute inset-[2px] rounded-[30%] overflow-hidden bg-[#14161b] flex items-center justify-center">
                {!imgError ? (
                  <img
                    src="/favicon.svg"
                    alt="Inkyz - Software and Systems Engineer"
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover grayscale contrast-105 hover:grayscale-0 transition-all duration-500 select-none pointer-events-none rounded-[30%]"
                    loading="eager"
                  />
                ) : (
                  /* Clean Monospace Initials Fallback */
                  <div className="w-full h-full flex items-center justify-center bg-[#14161b] select-none rounded-[30%]">
                    <span className="font-mono text-3xl font-light text-[#52525b] tracking-wider">
                      IK
                    </span>
                  </div>
                )}

                {/* Prismatic Sheen Layer (mix-blend-mode: overlay, pointer-events: none) */}
                <div
                  ref={sheenRef}
                  className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300 mix-blend-overlay rounded-[30%]"
                />
              </div>
            </div>

            {/* Single Monospace Subtext Line (translateZ: 20px) */}
            <div
              ref={photoSubtextRef}
              className="mt-3 text-center will-change-transform select-none"
            >
              <span className="text-[11px] font-mono text-[#a1a1aa] tracking-wide">
                Inkyz — Systems & Infrastructure
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
