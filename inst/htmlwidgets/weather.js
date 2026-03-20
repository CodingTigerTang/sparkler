HTMLWidgets.widget({
  name: 'weather',
  type: 'output',

  factory: function(el, width, height) {
    var inlineCanvas = document.createElement('canvas');
    var inlineCtx = inlineCanvas.getContext('2d');
    var overlayId = 'sparkler-weather-overlay';
    var overlayCanvasId = 'sparkler-weather-canvas';

    var ctx = inlineCtx;
    var canvas = inlineCanvas;
    var animationId = null;
    var particles = [];
    var w, h;
    var lastConfig = null;
    var hasStarted = false;

    el.appendChild(inlineCanvas);

    function getSlideElement() {
      return el.closest('section');
    }

    function isCurrentSlide() {
      var slide = getSlideElement();
      if (!slide) return true;

      if (window.Reveal && typeof window.Reveal.getCurrentSlide === 'function') {
        return window.Reveal.getCurrentSlide() === slide;
      }

      return true;
    }

    function getOrCreateOverlay() {
      var overlay = document.getElementById(overlayId);

      if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = overlayId;
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.pointerEvents = 'none';
        overlay.style.zIndex = '9998';
        overlay.style.background = 'transparent';
        document.body.appendChild(overlay);
      }

      return overlay;
    }

    function getOrCreateOverlayCanvas() {
      var overlay = getOrCreateOverlay();
      var existing = document.getElementById(overlayCanvasId);

      if (!existing) {
        existing = document.createElement('canvas');
        existing.id = overlayCanvasId;
        existing.style.width = '100%';
        existing.style.height = '100%';
        existing.style.display = 'block';
        overlay.appendChild(existing);
      }

      return existing;
    }

    function useCanvasForMode(fullscreen) {
      if (fullscreen) {
        canvas = getOrCreateOverlayCanvas();
        ctx = canvas.getContext('2d');

        inlineCanvas.style.display = 'none';
        el.style.width = '0px';
        el.style.height = '0px';
        el.style.overflow = 'hidden';
        el.style.background = 'transparent';
        el.style.position = 'relative';
      } else {
        canvas = inlineCanvas;
        ctx = inlineCtx;

        inlineCanvas.style.display = 'block';
        el.style.position = 'relative';
        el.style.background = '#222';
        el.style.width = '';
        el.style.height = '';
        el.style.overflow = '';
      }
    }

    function resize() {
      if (!canvas) return;

      var isFullscreen = lastConfig && lastConfig.fullscreen;

      if (isFullscreen) {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
      } else {
        w = canvas.width = el.offsetWidth || window.innerWidth;
        h = canvas.height = el.offsetHeight || window.innerHeight;
      }
    }

    function stopAnimation() {
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    }

    function createParticle(type, speedMult) {
      var sm = speedMult || 1;

      if (type === 'snow') {
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 4 + 1,
          d: Math.random() * 50,
          s: (Math.random() * 1 + 0.5) * sm,
          type: 'snow'
        };
      } else if (type === 'meteor') {
        return {
          x: Math.random() * w + 200,
          y: Math.random() * -h,
          l: Math.random() * 100 + 80,
          s: (Math.random() * 5 + 8) * sm,
          type: 'meteor'
        };
      } else if (type === 'rain') {
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          l: Math.random() * 15 + 10,
          s: (Math.random() * 5 + 15) * sm,
          type: 'rain'
        };
      }
    }

    function draw(type) {
      ctx.clearRect(0, 0, w, h);

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        ctx.beginPath();

        if (p.type === 'snow') {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.moveTo(p.x, p.y);
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true);
          ctx.fill();

          p.d += 0.01;
          p.y += p.s;
          p.x += Math.sin(p.d) * 0.5;

          if (p.y > h) {
            p.y = -10;
            p.x = Math.random() * w;
          }
        } else if (p.type === 'meteor') {
          var grd = ctx.createLinearGradient(p.x, p.y, p.x + p.l, p.y - p.l);
          grd.addColorStop(0, 'rgba(255, 255, 255, 1)');
          grd.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.strokeStyle = grd;
          ctx.lineCap = 'round';
          ctx.lineWidth = 2;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.l, p.y - p.l);
          ctx.stroke();

          p.x -= p.s;
          p.y += p.s;

          if (p.y > h + 200 || p.x < -200) {
            p.x = Math.random() * w + 200;
            p.y = -200;
          }
        } else if (p.type === 'rain') {
          ctx.strokeStyle = 'rgba(174, 194, 224, 0.6)';
          ctx.lineWidth = 1.5;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x, p.y + p.l);
          ctx.stroke();

          p.y += p.s;

          if (p.y > h) {
            p.y = -20;
            p.x = Math.random() * w;
          }
        }
      }

      animationId = requestAnimationFrame(function() {
        draw(type);
      });
    }

    function startWeather() {
      if (!lastConfig) return;
      if (window.Reveal && !isCurrentSlide()) return;

      stopAnimation();
      useCanvasForMode(lastConfig.fullscreen);
      resize();
      particles = [];

      if (lastConfig.type === 'none') {
        ctx.clearRect(0, 0, w, h);
        hasStarted = true;
        return;
      }

      var densityMult = lastConfig.density || 1;
      var speedMult = lastConfig.speed || 1;

      var count = 100;
      if (lastConfig.type === 'meteor') count = 6;
      if (lastConfig.type === 'rain') count = 500;

      count = Math.floor(count * densityMult);

      for (var i = 0; i < count; i++) {
        particles.push(createParticle(lastConfig.type, speedMult));
      }

      draw(lastConfig.type);
      hasStarted = true;
    }

    function maybeStartForCurrentSlide() {
      if (!lastConfig) return;
      if (hasStarted && (!window.Reveal || isCurrentSlide())) return;
      if (window.Reveal && !isCurrentSlide()) return;

      startWeather();
    }

    function stopIfLeavingSlide() {
      if (window.Reveal && lastConfig && lastConfig.fullscreen) {
        stopAnimation();
        var overlayCanvas = document.getElementById(overlayCanvasId);
        if (overlayCanvas) {
          var overlayCtx = overlayCanvas.getContext('2d');
          overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
        }
      } else {
        stopAnimation();
      }
    }

    function bindRevealEvents() {
      if (window.Reveal && !el.__sparklerWeatherRevealBound) {
        el.__sparklerWeatherRevealBound = true;

        window.Reveal.on('ready', function() {
          hasStarted = false;
          maybeStartForCurrentSlide();
        });

        window.Reveal.on('slidechanged', function(event) {
          var slide = getSlideElement();
          if (!slide) return;

          if (event.previousSlide === slide) {
            stopIfLeavingSlide();
          }

          if (event.currentSlide === slide) {
            hasStarted = false;
            maybeStartForCurrentSlide();
          }
        });

        window.Reveal.on('slidetransitionend', function(event) {
          var slide = getSlideElement();
          if (!slide) return;

          if (event.currentSlide === slide) {
            maybeStartForCurrentSlide();
          }
        });

        window.Reveal.on('resize', function() {
          resize();
        });
      }
    }

    window.addEventListener('resize', resize);
    bindRevealEvents();

    return {
      renderValue: function(x) {
        lastConfig = x || {};
        hasStarted = false;

        if (!window.Reveal) {
          startWeather();
        } else {
          maybeStartForCurrentSlide();
        }
      },

      resize: function(width, height) {
        resize();
      }
    };
  }
});