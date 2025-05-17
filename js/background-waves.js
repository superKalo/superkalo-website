/**
 * Dynamic Particle Network Animation
 * A lightweight interactive canvas animation for the site background
 */
(function() {
  // Configuration
  const config = {
    particleCount: 1300,         // Number of particles
    particleColor: '#0074d9',  // Base color for particles
    lineColor: '#0074d9',      // Base color for connecting lines
    particleRadius: 2,         // Size of particles
    lineWidth: 1,              // Width of connecting lines
    linkDistance: 150,         // Maximum distance for particles to link
    particleSpeed: 0.1,        // Speed multiplier for particles (reduced for slower movement)
    interactiveForce: 100,    // Force strength when interacting with mouse (reduced for smoother interaction)
    pulseEffect: true,         // Enable pulsing effect
    colorful: true,            // Enable multi-color particles
    naturalMovementFactor: 0.005 // Reduced natural movement factor for smoother motion
  };

  // Create canvas element
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // Style and append canvas
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.zIndex = '-1';
  canvas.style.pointerEvents = 'none';

  let particles = [];
  let mousePosition = { x: null, y: null };
  let isVisible = true;
  let animationFrame;

  // Only add the canvas when the DOM is fully loaded
  if (document.readyState === 'complete') {
    initCanvas();
  } else {
    window.addEventListener('load', initCanvas);
  }

  function initCanvas() {
    document.body.appendChild(canvas);
    resizeCanvas();
    createParticles();
    bindEvents();
    animate();

    // Gradually fade in the animation
    canvas.style.opacity = '0';
    setTimeout(() => {
      canvas.style.transition = 'opacity 2s ease';
      canvas.style.opacity = '1';
    }, 300);
  }

  // Handle window resize and mouse movements
  function bindEvents() {
    window.addEventListener('resize', () => {
      resizeCanvas();
      createParticles();
    });

    document.addEventListener('mousemove', (e) => {
      mousePosition.x = e.clientX;
      mousePosition.y = e.clientY;
    });

    document.addEventListener('mouseout', () => {
      mousePosition.x = null;
      mousePosition.y = null;
    });

    // Pause animation when tab is not visible to save resources
    document.addEventListener('visibilitychange', () => {
      isVisible = document.visibilityState === 'visible';
      if (isVisible) {
        if (!animationFrame) animate();
      } else {
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
          animationFrame = null;
        }
      }
    });
  }

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];

    // Create particles based on screen size
    const adjustedCount = Math.floor(config.particleCount * (canvas.width * canvas.height) / (1920 * 1080));
    const particleCount = Math.max(30, Math.min(adjustedCount, 100));

    for (let i = 0; i < particleCount; i++) {
      const size = (Math.random() * 1.5 + 0.5) * config.particleRadius;

      // Generate a color if colorful is enabled
      let color;
      if (config.colorful) {
        const hue = Math.floor(Math.random() * 360);
        color = `hsl(${hue}, 80%, 60%)`;
      } else {
        color = config.particleColor;
      }

      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * config.particleSpeed,
        vy: (Math.random() - 0.5) * config.particleSpeed,
        radius: size,
        color: color,
        opacity: Math.random() * 0.5 + 0.5,
        pulseDirection: Math.random() > 0.5 ? 1 : -1,
        pulseSpeed: 0.003 + Math.random() * 0.005 // Varied and slower pulse speed for each particle
      });
    }
  }

  // Animation loop
  function animate() {
    if (!isVisible) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateParticles();
    drawParticles();
    drawConnections();

    animationFrame = requestAnimationFrame(animate);
  }

  function updateParticles() {
    const currentTime = Date.now() * 0.001;

    particles.forEach(particle => {
      // Move particles
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Bounce off edges
      if (particle.x < 0 || particle.x > canvas.width) {
        particle.vx = -particle.vx;
      }

      if (particle.y < 0 || particle.y > canvas.height) {
        particle.vy = -particle.vy;
      }

      // Add some natural movement with sin/cos (reduced factor)
      particle.vx += Math.sin(currentTime + particle.x * 0.01) * config.naturalMovementFactor;
      particle.vy += Math.cos(currentTime + particle.y * 0.01) * config.naturalMovementFactor;

      // Keep velocity within bounds
      const maxVel = config.particleSpeed * 1.5;
      particle.vx = Math.max(-maxVel, Math.min(maxVel, particle.vx));
      particle.vy = Math.max(-maxVel, Math.min(maxVel, particle.vy));

      // Pulse effect - gradually change opacity at slower rate
      if (config.pulseEffect) {
        particle.opacity += particle.pulseSpeed * particle.pulseDirection;

        if (particle.opacity >= 1) {
          particle.opacity = 1;
          particle.pulseDirection = -1;
        } else if (particle.opacity <= 0.3) {
          particle.opacity = 0.3;
          particle.pulseDirection = 1;
        }
      }

      // Mouse interaction (gentler effect)
      if (mousePosition.x !== null && mousePosition.y !== null) {
        const dx = mousePosition.x - particle.x;
        const dy = mousePosition.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) { // Increased interaction radius for smoother effect
          const force = config.interactiveForce / Math.max(100, distance * distance);
          particle.vx -= dx * force;
          particle.vy -= dy * force;
        }
      }
    });
  }

  function drawParticles() {
    particles.forEach(particle => {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.globalAlpha = particle.opacity;
      ctx.fill();
      ctx.globalAlpha = 1;
    });
  }

  function drawConnections() {
    ctx.lineWidth = config.lineWidth;

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < config.linkDistance) {
          // Calculate line opacity based on distance
          const opacity = 1 - (distance / config.linkDistance);

          // Choose color for line
          let lineColor;
          if (config.colorful) {
            // Blend the two particle colors
            const color1 = particles[i].color;
            const color2 = particles[j].color;
            lineColor = blendColors(color1, color2, 0.5);
          } else {
            lineColor = config.lineColor;
          }

          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = lineColor;
          ctx.globalAlpha = opacity * 0.5;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }
  }

  // Helper function to blend two colors
  function blendColors(color1, color2, ratio) {
    // Extract color components from hsl
    const getHSL = (color) => {
      const match = color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
      if (match) {
        return {
          h: parseInt(match[1]),
          s: parseInt(match[2]),
          l: parseInt(match[3])
        };
      }
      return { h: 200, s: 80, l: 60 }; // Default blue if parsing fails
    };

    const c1 = getHSL(color1);
    const c2 = getHSL(color2);

    // Interpolate between the two colors
    const h = Math.round(c1.h + (c2.h - c1.h) * ratio);
    const s = Math.round(c1.s + (c2.s - c1.s) * ratio);
    const l = Math.round(c1.l + (c2.l - c1.l) * ratio);

    return `hsl(${h}, ${s}%, ${l}%)`;
  }
})();