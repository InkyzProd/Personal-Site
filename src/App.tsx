/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import BackgroundAurora from './components/BackgroundAurora';
import SideNav from './components/SideNav';
import Hero from './components/Hero';
import About from './components/About';
import Capabilities from './components/Capabilities';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import RadialFabContact from './components/RadialFabContact';

export default function App() {
  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-[#f4f4f5] selection:bg-[#5865F2]/30 selection:text-white">
      {/* Option A: Layered Aurora Background (<5KB, pure CSS, zero JS) */}
      <BackgroundAurora />

      {/* Side Dot Navigation */}
      <SideNav />

      {/* Main Page Content */}
      <main id="main-content" className="relative z-10 focus:outline-none">
        <Hero />
        <About />
        <Capabilities />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Centerpiece Interaction: Signature Radial / Orbital FAB Menu */}
      <RadialFabContact />
    </div>
  );
}
