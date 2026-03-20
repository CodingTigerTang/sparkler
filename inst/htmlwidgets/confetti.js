HTMLWidgets.widget({
  name: 'confetti',
  type: 'output',

  factory: function(el, width, height) {
    var overlayId = 'sparkler-confetti-overlay';
    var canvasId = 'sparkler-confetti-canvas';
    var myConfetti = null;
    var lastConfig = null;
    var hasPlayed = false;

    function getSlideElement() {
      return el.closest('section');
    }

    function isCurrentSlide() {
      var slide = getSlideElement();
      if (!slide) return true;

      if (window.Reveal && typeof Reveal.getCurrentSlide === 'function') {
        return Reveal.getCurrentSlide() === slide;
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

    function getOrCreateCanvas() {
      var overlay = getOrCreateOverlay();
      var canvas = document.getElementById(canvasId);

      if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = canvasId;
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.display = 'block';
        overlay.appendChild(canvas);
      }

      return canvas;
    }

    function initConfetti() {
      var canvas = getOrCreateCanvas();

      try {
        myConfetti = confetti.create(canvas, {
          resize: true,
          useWorker: true
        });
      } catch (e) {
        console.error('Confetti library missing', e);
        myConfetti = null;
      }
    }

    function refreshOverlay() {
      var overlay = getOrCreateOverlay();
      overlay.style.width = '100vw';
      overlay.style.height = '100vh';
    }

    function playConfetti() {
      if (!lastConfig || !myConfetti) return;
      if (!isCurrentSlide()) return;

      refreshOverlay();

      myConfetti({
        particleCount: lastConfig.particleCount || 100,
        spread: lastConfig.spread || 70,
        origin: lastConfig.origin || { y: 0.6 }
      });

      hasPlayed = true;
    }

    function maybePlayForCurrentSlide() {
      if (!lastConfig) return;
      if (!isCurrentSlide()) return;
      if (hasPlayed) return;

      playConfetti();
    }

    function bindRevealEvents() {
      if (window.Reveal && !el.__sparklerRevealBound) {
        el.__sparklerRevealBound = true;

        Reveal.on('ready', function() {
          hasPlayed = false;
          maybePlayForCurrentSlide();
        });

        Reveal.on('slidechanged', function(event) {
          var slide = getSlideElement();
          if (!slide) return;

          if (event.currentSlide === slide) {
            hasPlayed = false;
            maybePlayForCurrentSlide();
          }
        });

        Reveal.on('slidetransitionend', function(event) {
          var slide = getSlideElement();
          if (!slide) return;

          if (event.currentSlide === slide) {
            maybePlayForCurrentSlide();
          }
        });

        Reveal.on('resize', function() {
          refreshOverlay();
        });
      }
    }

    el.style.width = '0px';
    el.style.height = '0px';
    el.style.overflow = 'hidden';

    initConfetti();
    bindRevealEvents();
    window.addEventListener('resize', refreshOverlay);

    return {
      renderValue: function(x) {
        lastConfig = x || {};
        hasPlayed = false;

        if (!myConfetti) {
          initConfetti();
        }

        maybePlayForCurrentSlide();
      },

      resize: function(width, height) {
        refreshOverlay();
      }
    };
  }
});