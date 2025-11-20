HTMLWidgets.widget({

  name: 'fireworks',

  type: 'output',

  factory: function(el, width, height) {

    // --- 1. Force Full Screen Overlay ---
    el.style.position = "fixed";
    el.style.top = "0";
    el.style.left = "0";
    el.style.width = "100%";
    el.style.height = "100%";
    el.style.zIndex = "9999";      
    el.style.pointerEvents = "none"; // Clicks pass through
    el.style.background = "transparent"; 

    // --- 2. Create Canvas Container ---
    // The library needs a container to append its canvas to
    var container = document.createElement('div');
    container.style.width = '100%';
    container.style.height = '100%';
    el.appendChild(container);

    var fireworks;

    return {
      renderValue: function(x) {
        
        // --- 3. Initialize (if not already running) ---
        if (!fireworks) {
           // "Fireworks" is the global object from the library
           fireworks = new Fireworks.default(container, {
            autoresize: true,
            opacity: 0.5,
            acceleration: 1.05,
            friction: 0.97,
            gravity: 1.5,
            particles: 50,
            traceLength: 3,
            traceSpeed: 10,
            explosion: 5,
            intensity: 30,
            flickering: 50,
            lineStyle: 'round',
            hue: { min: 0, max: 360 },
            delay: { min: 30, max: 60 },
            rocketsPoint: { min: 50, max: 50 }, // Center emmision
            lineWidth: { explosion: { min: 1, max: 3 }, trace: { min: 1, max: 2 } },
            brightness: { min: 50, max: 80 },
            decay: { min: 0.015, max: 0.03 },
            mouse: { click: false, move: false, max: 1 }
          });
        }

        // --- 4. Start Animation ---
        fireworks.start();

        // --- 5. Auto-Stop Mechanism ---
        // Unlike confetti, fireworks go forever. We MUST stop them.
        if (x.duration) {
          setTimeout(function() {
            fireworks.stop();
            // Optional: Clear the canvas pixels so it's perfectly clean
            fireworks.clear();
          }, x.duration * 1000);
        }
      },

      resize: function(width, height) {
        // Handled by autoresize: true
      }
    };
  }
});