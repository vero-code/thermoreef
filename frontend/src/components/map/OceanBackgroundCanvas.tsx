import { useEffect, useRef, useState } from 'react';
import type { OceanBackgroundCanvasProps } from './types';
import { OCEAN_SPECIMEN } from '../../constants';

export function OceanBackgroundCanvas({
  bgImageUrl = OCEAN_SPECIMEN.bgImageUrl,
  tintRgba = OCEAN_SPECIMEN.tintRgba,
}: OceanBackgroundCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgWrapperRef = useRef<HTMLDivElement | null>(null);
  const turbulenceRef = useRef<SVGFETurbulenceElement | null>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 });
  const animFrameRef = useRef<number | null>(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  // Parallax tracking on mouse move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX / window.innerWidth;
      mouseRef.current.targetY = e.clientY / window.innerHeight;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Reset loaded state on image switch to trigger smooth crossfade
  useEffect(() => {
    setImgLoaded(false);
  }, [bgImageUrl]);

  // Living marine snow particles, oceanic caustics, and water undulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // 52 Drifting marine snow & bioluminescent calcification spores
    const particleCount = 52;
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.8 + 0.6,
      alpha: Math.random() * 0.45 + 0.15,
      speedY: Math.random() * 0.22 + 0.08,
      swaySpeed: Math.random() * 0.0012 + 0.0006,
      swayOffset: Math.random() * Math.PI * 2,
      gold: Math.random() > 0.65,
    }));

    const startTime = performance.now();

    const render = (time: number) => {
      // Smooth mouse lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.035;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.035;

      const elapsed = (time - startTime) * 0.00025;

      // Update SVG turbulence displacement frequency directly via DOM ref for 60fps zero React re-renders
      if (turbulenceRef.current) {
        const freqX = 0.0075 + Math.sin(elapsed * 1.2) * 0.002;
        const freqY = 0.0065 + Math.cos(elapsed * 0.9) * 0.002;
        turbulenceRef.current.setAttribute('baseFrequency', `${freqX.toFixed(5)} ${freqY.toFixed(5)}`);
      }

      // Parallax translation on background image container
      if (imgWrapperRef.current) {
        const offsetX = (mouseRef.current.x - 0.5) * -18;
        const offsetY = (mouseRef.current.y - 0.5) * -18;
        imgWrapperRef.current.style.transform = `scale(1.08) translate3d(${offsetX.toFixed(2)}px, ${offsetY.toFixed(2)}px, 0)`;
      }

      ctx.clearRect(0, 0, width, height);

      // Subtle dynamic water caustics radial glow following mouse
      const lightX = width * (0.42 + (mouseRef.current.x - 0.5) * 0.16);
      const lightY = height * (0.42 + (mouseRef.current.y - 0.5) * 0.16);
      const grad = ctx.createRadialGradient(
        lightX,
        lightY,
        width * 0.04,
        width * 0.5,
        height * 0.5,
        width * 0.82
      );
      grad.addColorStop(0, 'rgba(56, 189, 248, 0.10)');
      grad.addColorStop(0.35, 'rgba(212, 175, 55, 0.05)');
      grad.addColorStop(0.75, 'rgba(7, 18, 25, 0.35)');
      grad.addColorStop(1, 'rgba(3, 6, 10, 0.80)');

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Render drifting marine snow particles
      particles.forEach((p) => {
        p.y -= p.speedY;
        p.x += Math.sin(elapsed * 3.5 + p.swayOffset) * 0.45;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.gold
          ? `rgba(212, 175, 55, ${p.alpha * 0.85})`
          : `rgba(255, 255, 255, ${p.alpha * 0.75})`;
        ctx.fill();
      });

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="ocean-bg-layer" aria-hidden="true">
      {/* SVG filter for organic underwater ripple displacement */}
      <svg className="ocean-undulation-svg" aria-hidden="true">
        <filter id="coral-undulation-filter" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence
            ref={turbulenceRef}
            type="fractalNoise"
            baseFrequency="0.0075 0.0065"
            numOctaves={2}
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={12}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

      {/* Deep Ocean Fallback Gradient */}
      <div className="ocean-bg-fallback" />

      {/* Background Coral Image with Parallax & Undulation Filter */}
      <div
        ref={imgWrapperRef}
        className="ocean-bg-img-wrapper"
        style={{ filter: 'url(#coral-undulation-filter)' }}
      >
        <img
          key={bgImageUrl}
          src={bgImageUrl}
          alt=""
          referrerPolicy="no-referrer"
          onLoad={() => setImgLoaded(true)}
          className={`ocean-bg-image ${imgLoaded ? 'loaded' : ''}`}
        />
      </div>

      {/* Luxury Vignette and Tint */}
      <div className="ocean-bg-tint" style={{ backgroundColor: tintRgba }} />
      <div className="ocean-bg-vignette" />

      {/* Floating Canvas Particles */}
      <canvas ref={canvasRef} className="ocean-bg-canvas" />
    </div>
  );
}
