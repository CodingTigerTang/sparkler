HTMLWidgets.widget({

  name: 'weather',

  type: 'output',

  factory: function(el, width, height) {

    var canvas = document.createElement('canvas');
    el.appendChild(canvas);
    var ctx = canvas.getContext('2d');
    
    var animationId;
    var particles = [];
    var w, h;

    // --- RESIZE LOGIC ---
    function resize() {
      var isFixed = el.style.position === 'fixed';
      if (isFixed) {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
      } else {
        w = canvas.width = el.offsetWidth || window.innerWidth;
        h = canvas.height = el.offsetHeight || window.innerHeight;
      }
    }
    window.addEventListener('resize', resize);

    // --- PHYSICS ENGINE ---
    function createParticle(type, speedMult) {
      // Ensure speed multiplier exists
      var sm = speedMult || 1;

      if (type === 'snow') {
        return {
          x: Math.random() * w,
          y: Math.random() * h, 
          r: Math.random() * 4 + 1, 
          d: Math.random() * 50, 
          // Base speed (0.5 to 1.5) * Multiplier
          s: (Math.random() * 1 + 0.5) * sm, 
          type: 'snow'
        };
      } else if (type === 'meteor') {
         return {
          x: Math.random() * w + 200, 
          y: Math.random() * -h, 
          l: Math.random() * 100 + 80, 
          // Base speed (8 to 13) * Multiplier
          s: (Math.random() * 5 + 8) * sm,    
          type: 'meteor'
        };
      } else if (type === 'rain') {
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          l: Math.random() * 15 + 10, 
          // Base speed (15 to 20) * Multiplier
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
          ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
          ctx.moveTo(p.x, p.y);
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true);
          ctx.fill();
          p.d += 0.01; 
          p.y += p.s; 
          p.x += Math.sin(p.d) * 0.5;
          if (p.y > h) { p.y = -10; p.x = Math.random() * w; }

        } else if (p.type === 'meteor') {
          var grd = ctx.createLinearGradient(p.x, p.y, p.x + p.l, p.y - p.l);
          grd.addColorStop(0, "rgba(255, 255, 255, 1)");
          grd.addColorStop(1, "rgba(255, 255, 255, 0)");
          ctx.strokeStyle = grd;
          ctx.lineCap = "round";
          ctx.lineWidth = 2;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.l, p.y - p.l);
          ctx.stroke();
          p.x -= p.s; p.y += p.s;
          if (p.y > h + 200 || p.x < -200) {
            p.x = Math.random() * w + 200; p.y = -200;
          }

        } else if (p.type === 'rain') {
          ctx.strokeStyle = "rgba(174, 194, 224, 0.6)";
          ctx.lineWidth = 1.5;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x, p.y + p.l); 
          ctx.stroke();
          p.y += p.s; 
          if (p.y > h) { p.y = -20; p.x = Math.random() * w; }
        }
      }
      animationId = requestAnimationFrame(function() { draw(type); });
    }

    return {
      renderValue: function(x) {
        // --- Layout ---
        if (x.fullscreen) {
           el.style.position = "fixed";
           el.style.top = "0"; el.style.left = "0";
           el.style.width = "100%"; el.style.height = "100%";
           el.style.zIndex = "9998";
           el.style.pointerEvents = "none";
           el.style.background = "transparent";
        } else {
           el.style.position = "relative";
           el.style.background = "#222";
        }
        resize();

        if (animationId) cancelAnimationFrame(animationId);
        particles = []; 

        if (x.type === "none") {
          ctx.clearRect(0, 0, w, h);
          return;
        }

        // --- CONTROL LOGIC ---
        var densityMult = x.density || 1;
        var speedMult = x.speed || 1;

        // Base Counts
        var count = 100; 
        if (x.type === 'meteor') count = 6; 
        if (x.type === 'rain') count = 500;

        // Apply Multiplier
        count = Math.floor(count * densityMult);

        for (var i = 0; i < count; i++) {
          particles.push(createParticle(x.type, speedMult));
        }
        
        draw(x.type);
      },
      resize: function(width, height) { resize(); }
    };
  }
});