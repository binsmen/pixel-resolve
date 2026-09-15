import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function MatrixBackground() {
  const canvasRef = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    // Respect user's reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Matrix characters: Katakana + digits + latin symbols
    const chars = 'ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ0123456789XPQUESTLEVELUP';
    const fontSize = 14;
    const columns = Math.floor(width / fontSize);
    const drops = new Array(columns).fill(1).map(() => Math.floor(Math.random() * -50));

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    let lastDraw = Date.now();
    const frameInterval = 45; // ~22 fps for smooth low-CPU retro rain

    const render = () => {
      animationFrameId = requestAnimationFrame(render);

      const now = Date.now();
      if (now - lastDraw < frameInterval) return;
      lastDraw = now;

      // Dark mode trail fade vs Light mode trail fade
      ctx.fillStyle = isDark ? 'rgba(10, 10, 11, 0.12)' : 'rgba(244, 244, 245, 0.18)';
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Head character is slightly brighter
        if (Math.random() > 0.85) {
          ctx.fillStyle = isDark ? '#ffffff' : '#18181b';
        } else {
          ctx.fillStyle = isDark ? 'rgba(34, 197, 94, 0.65)' : 'rgba(22, 163, 74, 0.55)';
        }

        ctx.fillText(char, x, y);

        if (y > height && Math.random() > 0.985) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark]);

  return (
    <div className="matrix-canvas-container" aria-hidden="true">
      <canvas
        ref={canvasRef}
        className={`w-full h-full block ${isDark ? 'opacity-30' : 'opacity-20'}`}
      />
      <div className="matrix-vignette" />
    </div>
  );
}
