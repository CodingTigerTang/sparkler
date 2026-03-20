HTMLWidgets.widget({
  name: 'fireworks',
  type: 'output',

  factory: function(el, width, height) {
    var overlayId = 'sparkler-fireworks-overlay';
    var containerId = 'sparkler-fireworks-container';
    var fireworks = null;
    var stopTimer = null;
    var lastConfig = null;
    var hasPlayed = false;

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
        overlay.style.zIndex = '9999';
        overlay.style.background = 'transparent';
        document.body.appendChild(overlay);
      }

      return overlay;
    }

    function getOrCreateContainer() {
      var overlay = getOrCreateOverlay();
      var container = document.getElementById(containerId);

      if (!container) {
        container = document.createElement('div');
        container.id = containerId;
        container.style.width = '100%';
        container.style.height = '100%';
        overlay.appendChild(container);
      }

      return container;
    }

    function refreshOverlay() {
      var overlay = getOrCreateOverlay();
      overlay.style.width = '100vw';
      overlay.style.height = '100vh';
    }

    function clearStopTimer() {
      if (stopTimer) {
        clearTimeout(stopTimer);
        stopTimer = null;
      }
    }

    function stopFireworks() {
      clearStopTimer();

      if (fireworks) {
        try {
          fireworks.stop();
        } catch (e) {
          console.error('Error stopping fireworks', e);
        }
      }
    }

    function destroyFireworks() {
      stopFireworks();

      if (fireworks) {
        try {
          fireworks.stop();
          if (typeof fireworks.clear === 'function') fireworks.clear();
        } catch (e) {
          console.error('Error destroying fireworks', e);
        }
      }

      var container = document.getElementById(containerId);
      if (container) {
        container.innerHTML = '';
      }

      fireworks = null;
    }

    function initFireworks() {
      var container = getOrCreateContainer();

      destroyFireworks();

      if (
        typeof Fireworks === 'undefined' ||
        typeof Fireworks.default !== 'function'
      ) {
        console.error('Fireworks library missing or unexpected shape');
        fireworks = null;
        return;
      }

      var s = (lastConfig && lastConfig.speed) || 1;

      fireworks = new Fireworks.default(container, {
        autoresize: true,
        opacity: 0.5,
        acceleration: 1.0 + (0.05 * s),
        friction: 0.97,
        gravity: 1.5,
        particles: 50,
        traceLength: 3,
        traceSpeed: 10 * s,
        explosion: 5,
        intensity: 30,
        flickering: 50,
        lineStyle: 'round',
        hue: { min: 0, max: 360 },
        delay: { min: 30 / s, max: 60 / s },
        rocketsPoint: { min: 50, max: 50 },
        lineWidth: {
          explosion: { min: 1, max: 3 },
          trace: { min: 1, max: 2 }
        },
        brightness: { min: 50, max: 80 },
        decay: { min: 0.015, max: 0.03 },
        mouse: { click: false, move: false, max: 1 }
      });
    }

    function playFireworks() {
      if (!lastConfig) return;
      if (!isCurrentSlide()) return;

      refreshOverlay();

      if (!fireworks) {
        initFireworks();
      }

      if (!fireworks) return;

      stopFireworks();

      try {
        fireworks.start();
      } catch (e) {
        console.error('Error starting fireworks', e);
        return;
      }

      // IMPORTANT: duration from R is in seconds
      var durationSeconds = lastConfig.duration || 5;

      stopTimer = setTimeout(function() {
        stopFireworks();
      }, durationSeconds * 1000);

      hasPlayed = true;
    }

    function maybePlayForCurrentSlide() {
      if (!lastConfig) return;
      if (!isCurrentSlide()) return;
      if (hasPlayed) return;

      playFireworks();
    }

    function bindRevealEvents() {
      if (window.Reveal && !el.__sparklerFireworksRevealBound) {
        el.__sparklerFireworksRevealBound = true;

        window.Reveal.on('ready', function() {
          maybePlayForCurrentSlide();
        });

        window.Reveal.on('slidechanged', function(event) {
          var slide = getSlideElement();
          if (!slide) return;

          if (event.previousSlide === slide) {
            stopFireworks();
          }

          if (event.currentSlide === slide) {
            hasPlayed = false;
            maybePlayForCurrentSlide();
          }
        });

        window.Reveal.on('slidetransitionend', function(event) {
          var slide = getSlideElement();
          if (!slide) return;

          if (event.currentSlide === slide) {
            maybePlayForCurrentSlide();
          }
        });

        window.Reveal.on('resize', function() {
          refreshOverlay();
        });
      }
    }

    // invisible placeholder in slide body
    el.style.width = '0px';
    el.style.height = '0px';
    el.style.overflow = 'hidden';

    bindRevealEvents();
    window.addEventListener('resize', refreshOverlay);

    return {
      renderValue: function(x) {
        lastConfig = x || {};
        hasPlayed = false;

        // outside reveal.js, play immediately
        if (!window.Reveal) {
          playFireworks();
        } else {
          maybePlayForCurrentSlide();
        }
      },

      resize: function(width, height) {
        refreshOverlay();
      }
    };
  }
});