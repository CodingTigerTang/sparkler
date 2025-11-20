HTMLWidgets.widget({

  name: 'confetti',

  type: 'output',

  factory: function(el, width, height) {

    // --- NEW: Force Full Screen Overlay ---
    el.style.position = "fixed";   // Stuck to the window
    el.style.top = "0";
    el.style.left = "0";
    el.style.width = "100%";       // Full width
    el.style.height = "100%";      // Full height
    el.style.zIndex = "9999";      // On top of everything
    el.style.pointerEvents = "none"; // Let clicks pass THROUGH the confetti
    el.style.background = "transparent"; 
    // --------------------------------------

    // Create the canvas inside this full-screen overlay
    var canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    el.appendChild(canvas);

    // Initialize Library
    var myConfetti;
    try {
      myConfetti = confetti.create(canvas, {
        resize: true,
        useWorker: true
      });
    } catch (e) {
      console.error("Confetti library missing", e);
      return {};
    }

    return {
      renderValue: function(x) {
        // Fire the confetti!
        myConfetti({
          particleCount: x.particleCount || 100,
          spread: x.spread || 70,
          origin: { y: 0.6 }
        });
      },

      resize: function(width, height) {
        // No resize logic needed for fixed overlay
      }
    };
  }
});