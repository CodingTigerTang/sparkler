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
    el.style.pointerEvents = "none"; 
    el.style.background = "transparent"; 

    // --- 2. Create Canvas Container ---
    var container = document.createElement('div');
    container.style.width = '100%';
    container.style.height = '100%';
    el.appendChild(container);

    var fireworks;

    return {
      renderValue: function(x) {
        
        // --- FIX: ALWAYS destroy previous instance ---
        if (fireworks) {
          fireworks.stop();
          container.innerHTML = ""; // Clear the old canvas
          fireworks = null;
        }

        // Speed Logic
        var s = x.speed || 1;

        // --- 3. Initialize NEW instance with NEW settings ---
        fireworks = new Fireworks.default(container, {
          autoresize: true,
          opacity: 0.5,
          // Apply Speed
          acceleration: 1.0 + (0.05 * s), 
          friction: 0.97,
          gravity: 1.5,
          particles: 50,
          traceLength: 3,
          // Apply Speed
          traceSpeed: 10 * s, 
          explosion: 5,
          intensity: 30,
          flickering: 50,
          lineStyle: 'round',
          hue: { min: 0, max: 360 },
          // Apply Speed
          delay: { min: 30 / s, max: 60 / s }, 
          rocketsPoint: { min: 50, max: 50 }, 
          lineWidth: { explosion: { min: 1, max: 3 }, trace: { min: 1, max: 2 } },
          brightness: { min: 50, max: 80 },
          decay: { min: 0.015, max: 0.03 },
          mouse: { click: false, move: false, max: 1 }
        });

        // --- 4. Start Animation ---
        fireworks.start();

        // --- 5. Auto-Stop Mechanism ---
        if (x.duration) {
          setTimeout(function() {
            if (fireworks) { // Check if it still exists
                fireworks.stop();
            }
          }, x.duration * 1000);
        }
      },

      resize: function(width, height) {}
    };
  }
});