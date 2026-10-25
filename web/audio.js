/* GYST — synthesized ambience: lofi beats, rain, fireplace, nature. No audio files. */
const Amb = (() => {
  let ctx = null, master, verb, verbIn;
  const ch = {};           // channel name -> { gain, on, vol, built }
  const NAMES = ['music', 'rain', 'fire', 'forest'];
  const LOOK = 1.2;        // seconds scheduled ahead (survives background timer throttling)
  let tickT = null, buffers = {};

  function ensure() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain(); master.gain.value = .85;
    const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 3;
    master.connect(comp); comp.connect(ctx.destination);
    verb = ctx.createConvolver(); verb.buffer = impulse(2.8);
    verbIn = ctx.createGain(); verbIn.gain.value = .28; verbIn.connect(verb); verb.connect(master);
    buffers.white = noise('white', 3); buffers.pink = noise('pink', 6); buffers.brown = noise('brown', 6);
    NAMES.forEach(n => { const g = ctx.createGain(); g.gain.value = 0; g.connect(master); ch[n] = Object.assign(ch[n] || { on: false, vol: .5 }, { gain: g, built: false }); });
    tickT = setInterval(tick, 150);
    // play one silent frame so WebKit treats the context as started by the user
    const s = ctx.createBufferSource(); s.buffer = ctx.createBuffer(1, 1, ctx.sampleRate); s.connect(ctx.destination); s.start(0);
    if (ctx.state !== 'running') ctx.resume();
  }

  function impulse(sec) {
    const len = ctx.sampleRate * sec, b = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) { const d = b.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2); }
    return b;
  }
  function noise(type, sec) {
    const len = ctx.sampleRate * sec, b = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = b.getChannelData(c); let last = 0, b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < len; i++) {
        const w = Math.random() * 2 - 1;
        if (type === 'white') d[i] = w;
        else if (type === 'brown') { last = (last + .02 * w) / 1.02; d[i] = last * 3.5; }
        else {
          b0 = .99886 * b0 + w * .0555179; b1 = .99332 * b1 + w * .0750759; b2 = .969 * b2 + w * .153852;
          b3 = .8665 * b3 + w * .3104856; b4 = .55 * b4 + w * .5329522; b5 = -.7616 * b5 - w * .016898;
          d[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * .5362) * .11; b6 = w * .115926;
        }
      }
    }
    return b;
  }
  function loop(buf, dest, gain = 1) {
    const s = ctx.createBufferSource(); s.buffer = buf; s.loop = true; s.loopStart = Math.random();
    const g = ctx.createGain(); g.gain.value = gain; s.connect(g); g.connect(dest); s.start(0, Math.random() * 2);
    return { s, g };
  }
  function filt(type, freq, q = .7) { const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q; return f; }
  function chain(...nodes) { for (let i = 0; i < nodes.length - 1; i++) nodes[i].connect(nodes[i + 1]); return nodes[0]; }
  function burst(t, dur, dest, { type = 'bandpass', f = 2000, q = 1, amp = .3, buf = 'white' } = {}) {
    const s = ctx.createBufferSource(); s.buffer = buffers[buf];
    const fl = filt(type, f, q), g = ctx.createGain();
    g.gain.setValueAtTime(amp, t); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    chain(s, fl, g, dest); s.start(t, Math.random() * 2, dur + .05);
  }
  function tone(t, freq, dur, dest, { type = 'sine', amp = .2, att = .01, end = freq } = {}) {
    const o = ctx.createOscillator(), g = ctx.createGain(); o.type = type;
    o.frequency.setValueAtTime(freq, t); if (end !== freq) o.frequency.exponentialRampToValueAtTime(end, t + dur);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(amp, t + att); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    chain(o, g, dest); o.start(t); o.stop(t + dur + .05);
    return o;
  }

  // ---------- channel builders ----------
  const B = {};
  B.rain = c => {
    const lp = filt('lowpass', 1100); chain(lp, c.gain); loop(buffers.brown, lp, .9);
    const hs = filt('highpass', 900), hl = filt('lowpass', 7500); chain(hs, hl, c.gain); loop(buffers.pink, hs, .55);
    c.next = ctx.currentTime;
  };
  B.fire = c => {
    const lp = filt('lowpass', 260); chain(lp, c.gain); loop(buffers.brown, lp, 1.1);
    const hiss = filt('bandpass', 3000, .5); chain(hiss, c.gain); loop(buffers.pink, hiss, .05);
    c.next = ctx.currentTime;
  };
  B.forest = c => {
    const bp = filt('bandpass', 500, .6); chain(bp, c.gain); loop(buffers.pink, bp, .9);
    const lfo = ctx.createOscillator(), lg = ctx.createGain(); lfo.frequency.value = .06; lg.gain.value = 260; chain(lfo, lg, bp.frequency); lfo.start();
    const rs = filt('highpass', 2500), rg = ctx.createGain(); rg.gain.value = .12; chain(rs, rg, c.gain); loop(buffers.pink, rs, 1);
    const l2 = ctx.createOscillator(), l2g = ctx.createGain(); l2.frequency.value = .11; l2g.gain.value = .1; chain(l2, l2g, rg.gain); l2.start();
    c.next = ctx.currentTime + 2;
  };
  B.music = c => {
    c.filter = filt('lowpass', 2300, .4); c.filter.connect(c.gain);
    c.send = ctx.createGain(); c.send.gain.value = .5; c.filter.connect(c.send); c.send.connect(verbIn);
    c.drums = filt('lowpass', 4200); c.drums.connect(c.gain);
    c.wob = ctx.createOscillator(); c.wobG = ctx.createGain(); c.wob.frequency.value = .35; c.wobG.gain.value = 7; chain(c.wob, c.wobG); c.wob.start();
    const vin = filt('highpass', 2500); chain(vin, c.gain); loop(buffers.pink, vin, .025);
    c.step = 0; c.next = ctx.currentTime + .1; c.bar = 0;
  };

  // ---------- lofi music ----------
  const PROG = [
    [53, 57, 60, 64, 67], [52, 55, 59, 62], [50, 53, 57, 60, 64], [48, 52, 55, 59, 62],
    [46, 50, 53, 57], [45, 48, 52, 55], [43, 46, 50, 53, 57], [48, 53, 55, 58]
  ];
  const BPM = 72, SD = 60 / BPM / 4;
  const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
  function ep(c, t, midi, dur, vel) {
    const f = mtof(midi), g = ctx.createGain();
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vel, t + .012);
    g.gain.exponentialRampToValueAtTime(vel * .35, t + .7); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    g.connect(c.filter);
    const o1 = ctx.createOscillator(); o1.type = 'sine'; o1.frequency.value = f; c.wobG.connect(o1.detune); o1.connect(g);
    const o2 = ctx.createOscillator(); o2.type = 'triangle'; o2.frequency.value = f * 2.002;
    const g2 = ctx.createGain(); g2.gain.setValueAtTime(.18, t); g2.gain.exponentialRampToValueAtTime(.001, t + .35); chain(o2, g2, g); c.wobG.connect(o2.detune);
    [o1, o2].forEach(o => { o.start(t); o.stop(t + dur + .1); });
  }
  function musicStep(c, step, t) {
    const s16 = step % 16, bar = Math.floor(step / 16) % PROG.length, chord = PROG[bar];
    const swing = (s16 % 4 === 2) ? SD * .32 : 0, tt = t + swing;
    // chords
    if (s16 === 0) chord.forEach((m, i) => ep(c, t + i * .028 + Math.random() * .01, m, SD * 15, .075));
    if (s16 === 10 && Math.random() < .5) chord.slice(-3).forEach((m, i) => ep(c, tt + i * .02, m + 12, SD * 5, .035));
    // bass
    if (s16 === 0 || (s16 === 10 && Math.random() < .7)) tone(tt, mtof(chord[0] - 12), SD * (s16 ? 5 : 8), c.filter, { amp: .2, att: .02 });
    // melody
    if (s16 % 2 === 0 && Math.random() < .14) {
      const pool = chord.map(m => m + 12).concat(chord.slice(1).map(m => m + 24));
      const n = pool[(Math.random() * pool.length) | 0];
      tone(tt, mtof(n), 1.4, c.filter, { amp: .045, att: .005 });
      tone(tt, mtof(n) * 3.01, .5, c.filter, { amp: .008, att: .005 });
    }
    // drums
    if (s16 === 0 || s16 === 10 || (s16 === 7 && Math.random() < .3)) tone(tt, 110, .32, c.drums, { amp: .55, att: .004, end: 42 });
    if (s16 === 4 || s16 === 12) { burst(tt, .2, c.drums, { f: 1700, q: .8, amp: .22 }); tone(tt, 185, .12, c.drums, { type: 'triangle', amp: .1, att: .002 }); }
    if (s16 % 2 === 0 && Math.random() < .88) burst(tt, .045, c.drums, { type: 'highpass', f: 7500, amp: (s16 % 4 ? .045 : .07) * (.7 + Math.random() * .3) });
    // vinyl pop
    if (Math.random() < .03) burst(t + Math.random() * SD, .01, c.gain, { f: 3000, q: 2, amp: .06 });
  }

  // ---------- scheduler ----------
  function tick() {
    const horizon = ctx.currentTime + LOOK;
    const m = ch.music; if (m && m.on && m.built) {
      if (m.next < ctx.currentTime) m.next = ctx.currentTime + .05;
      while (m.next < horizon) { musicStep(m, m.step, m.next); m.next += SD; m.step = (m.step + 1) % (16 * PROG.length); }
    }
    const f = ch.fire; if (f && f.on && f.built) {
      if (f.next < ctx.currentTime) f.next = ctx.currentTime;
      while (f.next < horizon) {
        const big = Math.random() < .12;
        burst(f.next, big ? .06 : .02, f.gain, { f: 1200 + Math.random() * 4000, q: 1.2, amp: big ? .5 : .12 + Math.random() * .15 });
        f.next += .03 + Math.random() * (Math.random() < .3 ? .5 : .12);
      }
    }
    const r = ch.rain; if (r && r.on && r.built) {
      if (r.next < ctx.currentTime) r.next = ctx.currentTime;
      while (r.next < horizon) {
        tone(r.next, 2000 + Math.random() * 3500, .03, r.gain, { amp: .015 + Math.random() * .02, att: .001 });
        r.next += .02 + Math.random() * .12;
      }
    }
    const fo = ch.forest; if (fo && fo.on && fo.built) {
      if (fo.next < ctx.currentTime) fo.next = ctx.currentTime + 1;
      if (fo.next < horizon) {
        const day = typeof Scene !== 'undefined' && Scene.phase !== 'night';
        if (day) {
          const base = 2400 + Math.random() * 1800, n = 2 + (Math.random() * 4 | 0);
          for (let i = 0; i < n; i++) tone(fo.next + i * .13, base * (1 + Math.random() * .2), .11, fo.gain, { amp: .035, att: .01, end: base * (.7 + Math.random() * .6) });
        } else {
          tone(fo.next, 420, .5, fo.gain, { amp: .03, att: .1, end: 380 }); tone(fo.next + .6, 400, .7, fo.gain, { amp: .025, att: .1, end: 360 });
        }
        fo.next += 4 + Math.random() * 9;
      }
    }
  }

  function apply(name) {
    const c = ch[name]; if (!ctx || !c) return;
    if (c.on && !c.built) { B[name](c); c.built = true; }
    const target = c.on ? c.vol * (name === 'music' ? .9 : name === 'forest' ? .7 : .8) : 0;
    c.gain.gain.cancelScheduledValues(ctx.currentTime);
    c.gain.gain.setTargetAtTime(target, ctx.currentTime, c.on ? .6 : .25);
    if (name === 'music' && c.on) { c.next = Math.max(c.next, ctx.currentTime + .1); }
  }

  NAMES.forEach(n => ch[n] = { on: false, vol: .5 });
  return {
    names: NAMES,
    get(name) { return ch[name]; },
    set(name, on) { ch[name].on = on; if (on) ensure(); apply(name); },
    vol(name, v) { ch[name].vol = v; apply(name); },
    restore(states) {
      for (const n of NAMES) if (states && states[n]) { ch[n].vol = states[n].vol ?? .5; ch[n].on = !!states[n].on; }
      if (NAMES.some(n => ch[n].on)) { try { ensure(); NAMES.forEach(apply); } catch (e) { } }
    },
    wake() { if (ctx && ctx.state !== 'running') ctx.resume(); if (NAMES.some(n => ch[n].on)) { ensure(); NAMES.forEach(apply); } },
    state() { return ctx ? ctx.state : 'off'; },
    anyOn() { return NAMES.some(n => ch[n].on); },
    chime() {
      ensure(); const t = ctx.currentTime + .05;
      [76, 79, 84, 88].forEach((m, i) => { tone(t + i * .18, mtof(m), 2.2, master, { amp: .12, att: .005 }); tone(t + i * .18, mtof(m) * 2.76, .8, verbIn, { amp: .03, att: .005 }); });
    },
    pop() {
      if (!ctx) return; const t = ctx.currentTime;
      tone(t, 880, .12, master, { amp: .05, att: .003, end: 1320 });
    }
  };
})();
