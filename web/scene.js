/* GYST — soft background: drifting blush blobs, optional sparkles and rain on the window. */
const Scene = (() => {
  const bg = document.getElementById('scene'), fx = document.getElementById('fx');
  const b = bg.getContext('2d'), f = fx.getContext('2d');
  let W = 0, H = 0, dpr = 1, sparkles = true, rain = false, t0 = performance.now();
  let motes = [], drops = [];

  const BLOBS = [
    { c: [246, 206, 214], x: .18, y: .22, r: .55, sx: .031, sy: .023 },
    { c: [236, 214, 196], x: .82, y: .18, r: .5, sx: .021, sy: .033 },
    { c: [250, 220, 228], x: .7, y: .85, r: .6, sx: .027, sy: .019 },
    { c: [240, 226, 210], x: .25, y: .9, r: .45, sx: .017, sy: .029 },
  ];
  const LABELS = [[5, 'late night'], [12, 'matcha morning'], [17, 'afternoon'], [20, 'golden hour'], [24, 'wind-down']];

  function resize() {
    dpr = Math.min(2, window.devicePixelRatio || 1); W = innerWidth; H = innerHeight;
    for (const c of [bg, fx]) { c.width = W * dpr; c.height = H * dpr; }
    b.setTransform(dpr, 0, 0, dpr, 0, 0); f.setTransform(dpr, 0, 0, dpr, 0, 0);
    motes = Array.from({ length: Math.round(W * H / 38000) }, mote);
  }
  function mote() { return { x: Math.random() * W, y: Math.random() * H, r: 1 + Math.random() * 2.4, s: .08 + Math.random() * .22, p: Math.random() * 6.3, star: Math.random() < .28 }; }

  function drawBg(t) {
    b.fillStyle = '#faf5f0'; b.fillRect(0, 0, W, H);
    const m = Math.max(W, H);
    for (const o of BLOBS) {
      const x = (o.x + Math.sin(t * o.sx) * .06) * W, y = (o.y + Math.cos(t * o.sy) * .06) * H, r = o.r * m;
      const g = b.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, `rgba(${o.c},.85)`); g.addColorStop(1, `rgba(${o.c},0)`);
      b.fillStyle = g; b.fillRect(0, 0, W, H);
    }
  }
  function star(x, y, r) {
    f.beginPath(); f.moveTo(x, y - r * 2.2);
    f.quadraticCurveTo(x, y, x + r * 2.2, y); f.quadraticCurveTo(x, y, x, y + r * 2.2);
    f.quadraticCurveTo(x, y, x - r * 2.2, y); f.quadraticCurveTo(x, y, x, y - r * 2.2); f.fill();
  }
  function drawFx(t) {
    f.clearRect(0, 0, W, H);
    if (sparkles) for (const p of motes) {
      p.y -= p.s; p.x += Math.sin(t * .4 + p.p) * .12;
      if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
      const a = .35 + .35 * Math.sin(t * 1.3 + p.p);
      f.fillStyle = p.star ? `rgba(222,140,160,${a})` : `rgba(201,160,130,${a * .7})`;
      if (p.star) star(p.x, p.y, p.r); else { f.beginPath(); f.arc(p.x, p.y, p.r, 0, 7); f.fill(); }
    }
    if (rain) {
      if (drops.length < W / 6) for (let i = 0; i < 4; i++) drops.push({ x: Math.random() * W, y: -20, v: 7 + Math.random() * 6, l: 10 + Math.random() * 16 });
      f.strokeStyle = 'rgba(150,120,130,.28)'; f.lineWidth = 1;
      f.beginPath();
      for (const d of drops) { d.y += d.v; d.x -= d.v * .12; f.moveTo(d.x, d.y); f.lineTo(d.x + d.l * .12, d.y - d.l); }
      f.stroke();
      drops = drops.filter(d => d.y < H + 20);
    }
  }
  function frame(now) {
    const t = (now - t0) / 1000;
    drawBg(t); drawFx(t);
    requestAnimationFrame(frame);
  }
  addEventListener('resize', resize);
  resize(); requestAnimationFrame(frame);

  return {
    setSparkles(v) { sparkles = v; },
    setRain(v) { rain = v; if (!v) drops = []; },
    label() { const h = new Date().getHours(); return LABELS.find(([e]) => h < e)[1]; }
  };
})();
