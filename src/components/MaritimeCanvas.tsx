import React, { useEffect, useRef, useState } from 'react';
import { maritimeAudio } from '../utils/audioSynth';
import { Volume2, VolumeX, Compass, Anchor, ArrowDown, Play } from 'lucide-react';

interface MaritimeCanvasProps {
  onExploreClick: () => void;
}

export const MaritimeCanvas: React.FC<MaritimeCanvasProps> = ({ onExploreClick }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = 480);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = 480;
    };

    window.addEventListener('resize', handleResize);

    // Particle system for glowing ocean wake forming "65"
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      alpha: number;
      size: number;
      color: string;
      life: number;
      maxLife: number;
    }

    const particles: Particle[] = [];

    // Precalculate points for "65" shape wake trail behind ship
    function get65Points(centerX: number, centerY: number, scale: number) {
      const points: { x: number; y: number }[] = [];
      // "6" loop
      for (let t = 0; t <= Math.PI * 2; t += 0.2) {
        points.push({
          x: centerX - 35 * scale + Math.cos(t) * 18 * scale,
          y: centerY + 10 * scale + Math.sin(t) * 18 * scale,
        });
      }
      for (let t = 0; t <= 1; t += 0.1) {
        points.push({
          x: centerX - 35 * scale + (18 - t * 8) * scale,
          y: centerY - 15 * scale + t * 25 * scale,
        });
      }

      // "5" loop
      for (let t = 0; t <= 1; t += 0.1) {
        points.push({ x: centerX + (10 + t * 28) * scale, y: centerY - 15 * scale });
        points.push({ x: centerX + 10 * scale, y: centerY - 15 * scale + t * 15 * scale });
      }
      for (let t = -Math.PI / 2; t <= Math.PI / 2; t += 0.2) {
        points.push({
          x: centerX + 22 * scale + Math.cos(t) * 15 * scale,
          y: centerY + 12 * scale + Math.sin(t) * 15 * scale,
        });
      }

      return points;
    }

    let time = 0;
    let vesselX = -120;
    const shipY = height * 0.58;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      // 1. Sky & Sea Gradient
      const skyGradient = ctx.createLinearGradient(0, 0, 0, height);
      skyGradient.addColorStop(0, '#040B14');
      skyGradient.addColorStop(0.35, '#0A192F');
      skyGradient.addColorStop(0.65, '#0E2A47');
      skyGradient.addColorStop(1, '#051329');
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, width, height);

      // 2. Stars / Celestial Horizon
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      for (let i = 0; i < 40; i++) {
        const starX = (i * 97) % width;
        const starY = (i * 37) % (height * 0.45);
        const starAlpha = 0.2 + 0.5 * Math.sin(time * 2 + i);
        ctx.fillStyle = `rgba(220, 235, 255, ${starAlpha})`;
        ctx.beginPath();
        ctx.arc(starX, starY, (i % 3 === 0) ? 1.8 : 1, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. Golden Moon/Sun Horizon Glow
      const glowGrad = ctx.createRadialGradient(width / 2, height * 0.48, 5, width / 2, height * 0.48, 280);
      glowGrad.addColorStop(0, 'rgba(212, 175, 55, 0.25)');
      glowGrad.addColorStop(0.5, 'rgba(212, 175, 55, 0.06)');
      glowGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(width / 2, height * 0.48, 280, 0, Math.PI * 2);
      ctx.fill();

      // 4. Update Vessel Movement across screen
      vesselX += 1.8;
      if (vesselX > width + 200) {
        vesselX = -200;
      }

      // 5. Spawn Wake Particles forming the "65" trail in the ocean
      if (vesselX > 100 && vesselX < width - 100 && Math.random() < 0.6) {
        const trailX = vesselX - 110; // Behind stern
        const points65 = get65Points(trailX, shipY + 22, 1);
        const pt = points65[Math.floor(Math.random() * points65.length)];

        if (pt) {
          particles.push({
            x: pt.x + (Math.random() - 0.5) * 4,
            y: pt.y + (Math.random() - 0.5) * 4,
            vx: -0.3 - Math.random() * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            alpha: 0.9,
            size: 2 + Math.random() * 2.5,
            color: Math.random() > 0.4 ? '212, 175, 55' : '100, 210, 255', // Gold & Aqua Foam
            life: 0,
            maxLife: 180 + Math.random() * 60,
          });
        }
      }

      // Render Wake Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha = Math.max(0, 0.95 - (p.life / p.maxLife));

        ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
        }
      }

      // Glowing "65" Watermark in the background ocean center
      ctx.save();
      ctx.font = 'bold 110px "Cinzel", "Playfair Display", Georgia, serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const watermarkGrad = ctx.createLinearGradient(width / 2 - 100, height * 0.6, width / 2 + 100, height * 0.6);
      watermarkGrad.addColorStop(0, 'rgba(212, 175, 55, 0.12)');
      watermarkGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.22)');
      watermarkGrad.addColorStop(1, 'rgba(212, 175, 55, 0.12)');
      ctx.fillStyle = watermarkGrad;
      ctx.shadowColor = 'rgba(212, 175, 55, 0.3)';
      ctx.shadowBlur = 15;
      ctx.fillText('65 YEARS', width / 2, height * 0.68);
      ctx.restore();

      // 6. Rolling Waves Layers
      const waveColors = [
        'rgba(14, 42, 71, 0.7)',
        'rgba(10, 31, 56, 0.85)',
        'rgba(5, 19, 41, 0.95)',
      ];

      waveColors.forEach((color, idx) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(0, height);
        const waveBaseY = height * 0.52 + idx * 25;
        const speed = time * (1.2 + idx * 0.4);
        const amplitude = 6 + idx * 4;
        const wavelength = 180 - idx * 30;

        for (let x = 0; x <= width; x += 10) {
          const y = waveBaseY + Math.sin(x / wavelength + speed) * amplitude;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fill();
      });

      // 7. Draw SCI Vessel (Sailing Forward)
      ctx.save();
      const pitch = Math.sin(time * 2) * 1.5; // gentle rocking
      ctx.translate(vesselX, shipY + pitch);

      // Ship Hull Shadow & Water Reflection
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.beginPath();
      ctx.ellipse(0, 18, 90, 12, 0, 0, Math.PI * 2);
      ctx.fill();

      // Hull (Navy / Maroon Dark Classic Liner/Cargo)
      ctx.fillStyle = '#0D1B2A';
      ctx.beginPath();
      ctx.moveTo(-90, -5);
      ctx.lineTo(75, -5);
      ctx.lineTo(95, 14); // Bow cut
      ctx.lineTo(-80, 14); // Stern
      ctx.closePath();
      ctx.fill();

      // Hull Red Stripe (SCI Signature Red Bottom Line)
      ctx.fillStyle = '#C0392B';
      ctx.fillRect(-78, 9, 170, 5);

      // White Upper Hull Band
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(-85, -12, 155, 7);

      // Gold Trim Line
      ctx.fillStyle = '#D4AF37';
      ctx.fillRect(-85, -5, 160, 2);

      // Superstructure & Bridge Cabin (White & Navy)
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(-25, -34, 55, 22);
      ctx.fillRect(-15, -46, 35, 12);
      ctx.fillRect(-5, -54, 20, 8);

      // Bridge Windows (Glowing Gold)
      ctx.fillStyle = '#F59E0B';
      for (let w = 0; w < 5; w++) {
        ctx.fillRect(-10 + w * 6, -42, 4, 4);
      }

      // SCI Funnel (Funnel with SCI Blue & Golden Logo)
      ctx.fillStyle = '#1E3A8A'; // Deep Navy Blue
      ctx.fillRect(5, -68, 12, 14);
      ctx.fillStyle = '#D4AF37'; // Gold Band
      ctx.fillRect(5, -64, 12, 3);

      // Smoke / Exhaust Plume
      for (let s = 0; s < 3; s++) {
        const smokeX = 11 - s * 12 - (time * 15 % 30);
        const smokeY = -72 - s * 6;
        ctx.fillStyle = `rgba(220, 230, 245, ${0.3 - s * 0.08})`;
        ctx.beginPath();
        ctx.arc(smokeX, smokeY, 4 + s * 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Bow Spray / Water Splashes (Front Water Cut)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.beginPath();
      ctx.moveTo(95, 14);
      ctx.lineTo(110, 8 + Math.sin(time * 6) * 3);
      ctx.lineTo(90, 18);
      ctx.fill();

      // Ship Name Plate "MT DESH RATNA / SCI LEGACY"
      ctx.fillStyle = '#D4AF37';
      ctx.font = 'bold 7px sans-serif';
      ctx.fillText('SCI LEGACY 65', -70, -7);

      ctx.restore();

      // Forefront Wave Highlights
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.18)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let x = 0; x <= width; x += 30) {
        const y = height * 0.88 + Math.sin(x / 60 + time * 2) * 5;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleAudioToggle = () => {
    const isNowPlaying = maritimeAudio.toggleOceanWaves();
    setIsPlayingSound(isNowPlaying);
  };

  const handleHornChime = () => {
    maritimeAudio.playShipHorn();
  };

  return (
    <div className="relative w-full overflow-hidden bg-slate-950 text-white rounded-2xl shadow-2xl border border-amber-500/20">
      {/* HTML5 Animated Canvas */}
      <canvas ref={canvasRef} className="w-full h-[440px] md:h-[480px] block cursor-pointer" onClick={handleHornChime} />

      {/* Floating Header Overlay */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3 bg-slate-950/80 backdrop-blur-md px-4 py-2 rounded-full border border-amber-500/30 text-xs text-amber-200 pointer-events-auto shadow-lg">
          <Anchor className="w-4 h-4 text-amber-400 animate-pulse" />
          <span className="font-semibold tracking-wider uppercase text-[11px]">The Shipping Corporation of India Ltd.</span>
        </div>

        {/* Audio Controls */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={handleHornChime}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/80 hover:bg-amber-950/80 text-amber-300 hover:text-amber-100 border border-amber-500/30 rounded-full text-xs transition backdrop-blur-md shadow-md"
            title="Sound Vessel Whistle"
          >
            <Compass className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
            <span className="hidden sm:inline">Vessel Horn</span>
          </button>

          <button
            onClick={handleAudioToggle}
            className={`p-2 rounded-full border transition backdrop-blur-md shadow-md ${
              isPlayingSound
                ? 'bg-amber-500 text-slate-950 border-amber-300'
                : 'bg-slate-900/80 text-amber-300 border-amber-500/30 hover:bg-amber-950/60'
            }`}
            title={isPlayingSound ? 'Mute Ocean Ambience' : 'Play Ocean Ambience'}
          >
            {isPlayingSound ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Centered Maritime Banner overlay */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center w-[92%] max-w-xl pointer-events-none">
        <div className="bg-slate-950/85 backdrop-blur-md border border-amber-500/40 p-5 rounded-2xl shadow-2xl pointer-events-auto transition hover:border-amber-400">
          <div className="text-[10px] tracking-[0.25em] text-amber-400 uppercase font-mono font-medium mb-1 flex items-center justify-center gap-2">
            <span>• 1961 – 2026 •</span>
            <span>65th FOUNDATION DAY</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-serif text-slate-100 font-bold tracking-tight mb-1 drop-shadow-sm">
            65 Years of Moving India
          </h1>
          <p className="text-xs sm:text-sm text-amber-200/90 italic font-serif mb-4">
            Now, Towards New Horizons.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => {
                maritimeAudio.playShipHorn();
                onExploreClick();
              }}
              className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold text-xs tracking-wider uppercase rounded-xl shadow-lg transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
            >
              <span>Explore Official Invitation</span>
              <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
