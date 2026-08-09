// Ambient starfield background. Draws slowly drifting, twinkling stars
// behind the page content. Respects prefers-reduced-motion.
(function () {
  var canvas = document.getElementById('starfield');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var stars = [];
  var width, height;
  var STAR_COUNT_DENSITY = 0.00012; // stars per px^2, tuned for a calm sky

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    var count = Math.round(width * height * STAR_COUNT_DENSITY);
    stars = [];
    for (var i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.2 + 0.3,
        baseAlpha: Math.random() * 0.5 + 0.35,
        twinkleSpeed: Math.random() * 0.015 + 0.004,
        phase: Math.random() * Math.PI * 2,
        drift: Math.random() * 0.02 + 0.005,
        hue: Math.random() < 0.15 ? 'accent' : 'white'
      });
    }
  }

  function draw(time) {
    ctx.clearRect(0, 0, width, height);
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      var alpha = reduceMotion
        ? s.baseAlpha
        : s.baseAlpha + Math.sin(time * s.twinkleSpeed + s.phase) * 0.3;
      alpha = Math.max(0, Math.min(1, alpha));

      if (!reduceMotion) {
        s.y += s.drift * 0.15;
        if (s.y > height) s.y = 0;
      }

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.hue === 'accent'
        ? 'rgba(0, 247, 255, ' + (alpha * 0.9) + ')'
        : 'rgba(255, 255, 255, ' + alpha + ')';
      ctx.fill();
    }

    if (!reduceMotion) {
      requestAnimationFrame(draw);
    }
  }

  window.addEventListener('resize', resize);
  resize();

  if (reduceMotion) {
    draw(0);
  } else {
    requestAnimationFrame(draw);
  }
})();
