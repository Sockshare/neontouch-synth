/* NIGHT CITY CYBERDECK v9 // 10-Feature Cyberpunk DJ Console, Procedural Song Generator & Kaleidoscope Neon Synth */
(function () {
  'use strict';

  const $ = (id) => document.getElementById(id);

  // VM-Turbo Raster Settings (70% fewer software CPU pixels + zero Remote Desktop lag)
  const RENDER_SCALE = 0.55;
  const FRAME_BUDGET_MS = 22;

  // 10 Authentic Cyberpunk Neon Colors & Darksynth Timbres
  const FINGER_COLORS = [
    { code: 'C1',  name: 'BladeLead',  timbre: 'blade',    primary: '#00f5ff', secondary: '#38bdf8', rgb: [0, 245, 255]   },
    { code: 'C2',  name: 'Supersaw',   timbre: 'supersaw', primary: '#ff1cf7', secondary: '#fb7185', rgb: [255, 28, 247]  },
    { code: 'C3',  name: 'Acid303',    timbre: 'acid',     primary: '#00ff95', secondary: '#a3e635', rgb: [0, 255, 149]   },
    { code: 'C4',  name: 'ReeseBass',  timbre: 'reese',    primary: '#ff0055', secondary: '#ff4d00', rgb: [255, 0, 85]    },
    { code: 'C5',  name: 'CyberStab',  timbre: 'stab',     primary: '#fcee0a', secondary: '#ff9900', rgb: [252, 238, 10]  },
    { code: 'C6',  name: 'DarkChoir',  timbre: 'choir',    primary: '#a855f7', secondary: '#818cf8', rgb: [168, 85, 247]  },
    { code: 'C7',  name: '808Slam',    timbre: 'sub808',   primary: '#ff4d00', secondary: '#fcee0a', rgb: [255, 77, 0]    },
    { code: 'C8',  name: 'NightPluck', timbre: 'pluck',    primary: '#38bdf8', secondary: '#c084fc', rgb: [56, 189, 248]  },
    { code: 'C9',  name: 'LaserZap',   timbre: 'laser',    primary: '#e879f9', secondary: '#00f5ff', rgb: [232, 121, 249] },
    { code: 'C10', name: 'RainChime',  timbre: 'chime',    primary: '#67e8f9', secondary: '#a855f7', rgb: [103, 232, 249] },
  ];

  // Dark Cyberpunk Minor / Phrygian Scale (Zero Wrong Notes!)
  const CYBER_SCALE = [0, 2, 3, 5, 7, 8, 10, 12, 14, 15, 17, 19, 20, 24];
  const NOTE_NAMES = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];

  const CODENAME_PREFIXES = ['ARASAKA', 'BLACKWALL', 'SANDEVISTAN', 'MAELSTROM', 'CHROME', 'NIGHT_CITY', 'KANG_TAO', 'NETRUNNER', 'RONIN', 'MILITECH'];
  const CODENAME_SUFFIXES = ['PROTOCOL', 'OVERDRIVE', 'BREACH', 'PHANTOM', 'DRIFT', 'VOLTAGE', 'SYNAPSE', 'VORTEX', 'ECLIPSE', 'ZERO'];

  const CYBER_BEATS = {
    nightcity: {
      label: 'NIGHT_CITY // 2077',
      bpm: 104,
      rootMidi: 50, // D
      k: [1,0,0,0, 0,0,1,0, 1,0,0,0, 0,0,0,0],
      s: [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
      h: [1,0,1,0, 1,0,1,1, 1,0,1,0, 1,0,1,1],
      o: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,1,0],
      b: [0, 0, 12, 0, 0, 0, 3, 0, 0, 0, 12, 0, 8, 7, 5, 3],
    },
    outrun: {
      label: 'OUTRUN_CHASE // HWY',
      bpm: 124,
      rootMidi: 48, // C
      k: [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0],
      s: [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
      h: [1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1],
      o: [0,0,1,0, 0,0,1,0, 0,0,1,0, 0,0,1,0],
      b: [0, 0, 12, 0, 0, 0, 12, 0, 8, 8, 20, 8, 10, 10, 7, 7],
    },
    industrial: {
      label: 'BOSS_FIGHT // MECH',
      bpm: 98,
      rootMidi: 49, // C#
      k: [1,0,0,1, 0,0,0,0, 1,0,1,0, 0,0,0,0],
      s: [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,1],
      h: [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,1,1,1],
      o: [0,0,0,1, 0,0,0,0, 0,0,0,1, 0,0,0,0],
      b: [0, -1, 0, 1, 0, -1, 12, -1, 0, -1, 0, 1, 8, -1, 7, 1],
    },
    bladerunner: {
      label: 'NEON_RAIN // 2049',
      bpm: 88,
      rootMidi: 50, // D
      k: [1,0,0,0, 0,0,0,0, 1,0,0,1, 0,0,0,0],
      s: [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
      h: [1,0,0,1, 1,0,1,0, 1,0,0,1, 1,0,1,0],
      o: [0,0,0,0, 0,0,0,1, 0,0,0,0, 0,0,1,0],
      b: [0, -1, -1, 0, -1, -1, 12, -1, 8, -1, -1, 8, -1, -1, 10, -1],
    },
    generated: {
      label: 'CYBER_SEED // AI',
      bpm: 112,
      rootMidi: 50,
      k: [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0],
      s: [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
      h: [1,0,1,1, 1,0,1,0, 1,0,1,1, 1,0,1,1],
      o: [0,0,0,0, 0,0,1,0, 0,0,0,0, 0,0,1,0],
      b: [0, 0, 12, 0, 3, 0, 7, 0, 8, 8, 12, 8, 10, 7, 5, 3],
    },
  };

  const DARK_PROGRESSION = [
    [0, 7, 12, 15],
    [-4, 3, 8, 12],
    [-7, 0, 5, 10],
    [-5, 2, 7, 13],
  ];

  let activeArpSteps = [
    { x: 0.08, y: 0.42, c: 0 }, { x: 0.22, y: 0.35, c: 7 }, { x: 0.38, y: 0.26, c: 1 }, { x: 0.22, y: 0.35, c: 7 },
    { x: 0.54, y: 0.22, c: 4 }, { x: 0.38, y: 0.26, c: 1 }, { x: 0.68, y: 0.18, c: 0 }, { x: 0.38, y: 0.26, c: 7 },
    { x: 0.08, y: 0.42, c: 2 }, { x: 0.24, y: 0.34, c: 7 }, { x: 0.44, y: 0.28, c: 1 }, { x: 0.24, y: 0.34, c: 7 },
    { x: 0.60, y: 0.20, c: 8 }, { x: 0.44, y: 0.28, c: 2 }, { x: 0.30, y: 0.32, c: 4 }, { x: 0.16, y: 0.38, c: 7 },
  ];

  // Physical Keyboard 3-Row Matrix
  const KEY_ROWS = [
    { keys: 'qwertyuiop', yFrac: 0.18 },
    { keys: 'asdfghjkl;', yFrac: 0.50 },
    { keys: 'zxcvbnm,./', yFrac: 0.80 },
  ];
  const KEY_MAP = new Map();
  KEY_ROWS.forEach((row) => {
    for (let col = 0; col < row.keys.length; col++) {
      KEY_MAP.set(row.keys[col], { xFrac: (col + 0.5) / 10, yFrac: row.yFrac, colorIdx: col });
    }
  });

  // Pre-bake 64x64 radial neon orb sprites once at startup
  const GLOW_SPRITES = FINGER_COLORS.map((fc) => {
    const sc = document.createElement('canvas');
    sc.width = 64;
    sc.height = 64;
    const sctx = sc.getContext('2d');
    const g = sctx.createRadialGradient(32, 32, 2, 32, 32, 30);
    const [r, gr, b] = fc.rgb;
    g.addColorStop(0, 'rgba(255, 255, 255, 0.96)');
    g.addColorStop(0.2, `rgba(${r}, ${gr}, ${b}, 0.88)`);
    g.addColorStop(0.55, `rgba(${r}, ${gr}, ${b}, 0.26)`);
    g.addColorStop(1, `rgba(${r}, ${gr}, ${b}, 0)`);
    sctx.fillStyle = g;
    sctx.fillRect(0, 0, 64, 64);
    return sc;
  });

  const state = {
    audioCtx: null,
    deckABus: null,        // Deck A = Drums & Perc
    deckBBus: null,        // Deck B = Bass, Synths, Chords, Riffs
    gritDrive: null,
    gritGain: null,
    masterFilter: null,
    compressor: null,
    analyser: null,
    fftData: new Uint8Array(32),
    skylinePeaks: new Float32Array(32),
    delayInput: null,
    noiseBuffer: null,
    lfoGain: null,
    mediaDest: null,
    mediaRecorder: null,
    recChunks: [],

    // Synth & Kaleidoscope Modes
    touchBrushCount: 1,
    mirrorMode: 1,         // 1 = Off, 2 = 2X Twin Mirror, 4 = 4X Mandala Lasers!
    colorMode: 'rainbow',
    colorCursor: 0,
    spreadPx: 66,

    // DJ Console & Stems
    beatStyle: 'nightcity',
    bpm: 106,
    drumsOn: false,
    bassOn: false,
    padOn: false,
    arpOn: false,
    activeScene: null,
    customStepHits: new Array(16).fill(false), // Interactive 16-step extra hits!
    chordNodes: null,
    barIndex: 0,
    clockStep: 0,
    clockTimer: null,

    // Turntables & Kaoss FX
    jogAngleA: 0,
    jogAngleB: 0,
    pitchBendFactor: 1.0,
    stutterTimer: null,
    buildTimer: null,

    // 2 Wait-for-Touch Riff Loopers
    slots: [
      { status: 'empty', steps: Array.from({ length: 16 }, () => []), recTicks: 0 },
      { status: 'empty', steps: Array.from({ length: 16 }, () => []), recTicks: 0 },
    ],

    // Stage & Visuals
    viewW: 960,
    viewH: 480,
    animActive: false,
    lastFrameMs: 0,
    lastCursorX: 450,
    lastCursorY: 240,
    wheelTimer: null,
    wheelX: 0,
    wheelY: 0,

    fingers: new Map(),
    trails: [],
    tapRings: [],
    reticles: [],          // Cyberpunk diamond/hex target reticles!
    sparks: [],
    noteFloats: [],
    hudBannerFlash: null,  // Big holographic canvas callout for Vocoder / Drops!
    bgPulse: 0,
  };

  // Build Interactive 16-Step Neon Matrix Cells
  const matrixEl = $('step-matrix');
  matrixEl.innerHTML = Array.from({ length: 16 }, (_, i) =>
    `<button type="button" class="step-cell" id="scell-${i}" data-step="${i}" title="Step ${i + 1} — Click to toggle custom Cyber Synth hit!"></button>`
  ).join('');

  function refreshStepMatrixCells(playStep) {
    const beat = CYBER_BEATS[state.beatStyle] || CYBER_BEATS.nightcity;
    for (let i = 0; i < 16; i++) {
      const cell = $(`scell-${i}`);
      cell.className = 'step-cell';
      if (state.customStepHits[i]) cell.classList.add('has-custom');
      else if (beat.s[i]) cell.classList.add('has-snare');
      else if (beat.k[i]) cell.classList.add('has-kick');
      if (playStep === i) cell.classList.add('playhead');
    }
  }
  refreshStepMatrixCells(-1);

  matrixEl.addEventListener('click', (e) => {
    const cell = e.target.closest('.step-cell');
    if (!cell) return;
    ensureAudio();
    const idx = parseInt(cell.dataset.step, 10);
    state.customStepHits[idx] = !state.customStepHits[idx];
    if (state.customStepHits[idx] && !state.drumsOn) {
      state.drumsOn = true;
      refreshAllUi();
      syncClock();
    }
    refreshStepMatrixCells(state.clockStep);
  });

  function wakeRenderer() {
    if (!state.animActive) {
      state.animActive = true;
      requestAnimationFrame(renderLoop);
    }
  }

  function pickNextColor(offset) {
    const off = offset || 0;
    if (state.colorMode !== 'rainbow') {
      return (parseInt(state.colorMode, 10) + off) % 10;
    }
    const cIdx = (state.colorCursor + off) % 10;
    if (off === 0) state.colorCursor = (state.colorCursor + 1) % 10;
    return cIdx;
  }

  // -------------------------------------------------------------------------
  // Dual-Deck Web Audio Engine + FFT Skyline Analyser + Mix Exporter
  // -------------------------------------------------------------------------
  function makeDistortionCurve(amount) {
    const n = 512;
    const curve = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const x = (i * 2) / n - 1;
      curve[i] = ((3 + amount) * x * 20 * (Math.PI / 180)) / (Math.PI + amount * Math.abs(x));
    }
    return curve;
  }

  function ensureAudio() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    if (!state.audioCtx) {
      const ctx = new AC({ latencyHint: 'interactive' });
      state.audioCtx = ctx;

      const deckA = ctx.createGain(); // Drums
      const deckB = ctx.createGain(); // Bass, Chords, Synths
      deckA.gain.setValueAtTime(1.0, ctx.currentTime);
      deckB.gain.setValueAtTime(1.0, ctx.currentTime);

      const mixIn = ctx.createGain();
      mixIn.gain.setValueAtTime(0.95, ctx.currentTime);
      deckA.connect(mixIn);
      deckB.connect(mixIn);

      // Cyberpunk Analog Grit Bus -> Deck B
      const shaper = ctx.createWaveShaper();
      shaper.curve = makeDistortionCurve(30);
      shaper.oversample = 'none';
      const gritGain = ctx.createGain();
      gritGain.gain.setValueAtTime(0.78, ctx.currentTime);
      shaper.connect(gritGain);
      gritGain.connect(deckB);

      const masterFilter = ctx.createBiquadFilter();
      masterFilter.type = 'lowpass';
      masterFilter.frequency.setValueAtTime(20000, ctx.currentTime);
      masterFilter.Q.setValueAtTime(1.4, ctx.currentTime);

      const comp = ctx.createDynamicsCompressor();
      comp.threshold.setValueAtTime(-13, ctx.currentTime);
      comp.knee.setValueAtTime(14, ctx.currentTime);
      comp.ratio.setValueAtTime(7, ctx.currentTime);
      comp.attack.setValueAtTime(0.002, ctx.currentTime);
      comp.release.setValueAtTime(0.16, ctx.currentTime);

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64; // 32 crisp skyline bars, 0.01ms read cost!
      analyser.smoothingTimeConstant = 0.72;

      mixIn.connect(masterFilter);
      masterFilter.connect(comp);
      comp.connect(analyser);
      analyser.connect(ctx.destination);

      // Internal Synth Audio Exporter Bus (Zero Mic/Camera!)
      if (ctx.createMediaStreamDestination) {
        state.mediaDest = ctx.createMediaStreamDestination();
        comp.connect(state.mediaDest);
      }

      // Stereo Blade-Runner Space Delay
      const delay = ctx.createDelay(0.6);
      delay.delayTime.setValueAtTime(0.27, ctx.currentTime);
      const fb = ctx.createGain();
      fb.gain.setValueAtTime(0.32, ctx.currentTime);
      const damp = ctx.createBiquadFilter();
      damp.type = 'lowpass';
      damp.frequency.setValueAtTime(2200, ctx.currentTime);
      const wet = ctx.createGain();
      wet.gain.setValueAtTime(0.24, ctx.currentTime);

      delay.connect(damp);
      damp.connect(fb);
      fb.connect(delay);
      delay.connect(wet);
      wet.connect(deckB);

      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(5.5, ctx.currentTime);
      lfoGain.gain.setValueAtTime(0, ctx.currentTime);
      lfo.connect(lfoGain);
      lfo.start();

      // White Noise Buffer for Snares, Hats & Turntable Vinyl Scratches!
      const len = Math.floor(ctx.sampleRate * 0.28);
      const nBuf = ctx.createBuffer(1, len, ctx.sampleRate);
      const ch = nBuf.getChannelData(0);
      for (let i = 0; i < len; i++) ch[i] = Math.random() * 2 - 1;

      state.deckABus = deckA;
      state.deckBBus = deckB;
      state.gritDrive = shaper;
      state.gritGain = gritGain;
      state.masterFilter = masterFilter;
      state.compressor = comp;
      state.analyser = analyser;
      state.delayInput = delay;
      state.lfoGain = lfoGain;
      state.noiseBuffer = nBuf;
    }
    if (state.audioCtx.state === 'suspended') {
      state.audioCtx.resume();
    }
    return state.audioCtx;
  }

  function currentRootMidi() {
    const b = CYBER_BEATS[state.beatStyle];
    return b ? b.rootMidi : 50;
  }

  function midiToFreq(m) {
    return 440 * Math.pow(2, (m - 69) / 12) * state.pitchBendFactor;
  }

  function mapPositionToMusic(x, y) {
    const w = Math.max(1, state.viewW);
    const h = Math.max(1, state.viewH);
    const xNorm = Math.max(0, Math.min(0.999, x / w));
    const yNorm = Math.max(0, Math.min(1, y / h));

    const col = Math.floor(xNorm * CYBER_SCALE.length);
    const semi = CYBER_SCALE[col];
    let octaveShift = 0;
    if (yNorm < 0.333) octaveShift = 12;
    else if (yNorm > 0.666) octaveShift = -12;

    const midi = currentRootMidi() + semi + octaveShift;
    const freq = midiToFreq(midi);
    const noteLabel = NOTE_NAMES[((midi % 12) + 12) % 12] + (Math.floor(midi / 12) - 1);
    const cutoff = 420 * Math.pow(13, 1 - yNorm);
    const pan = (xNorm - 0.5) * 1.4;

    return { freq, midi, noteLabel, cutoff, pan, col, xNorm, yNorm };
  }

  // -------------------------------------------------------------------------
  // 10 Authentic Cyberpunk Color Synthesizers
  // -------------------------------------------------------------------------
  function playColorTapSound(noteInfo, colorIdx, polyCount, gainScale) {
    const ctx = ensureAudio();
    if (!ctx) return;
    const now = ctx.currentTime;
    const fc = FINGER_COLORS[colorIdx % 10];
    const timbre = fc.timbre;
    const gMul = (gainScale || 1.0) / Math.sqrt(Math.max(1, polyCount));

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const osc2Gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    const amp = ctx.createGain();

    let dur = 0.44;
    let peak = 0.22 * gMul;
    let useGrit = false;

    switch (timbre) {
      case 'blade':
        osc1.type = 'sawtooth'; osc2.type = 'sawtooth';
        osc1.frequency.setValueAtTime(noteInfo.freq * 0.996, now);
        osc2.frequency.setValueAtTime(noteInfo.freq * 1.005, now);
        osc2Gain.gain.setValueAtTime(0.8, now);
        filter.frequency.setValueAtTime(280, now);
        filter.frequency.exponentialRampToValueAtTime(Math.min(6800, noteInfo.cutoff * 1.6), now + 0.07);
        filter.frequency.exponentialRampToValueAtTime(520, now + 0.56);
        filter.Q.setValueAtTime(3.2, now);
        dur = 0.58;
        break;
      case 'supersaw':
        osc1.type = 'sawtooth'; osc2.type = 'sawtooth';
        osc1.frequency.setValueAtTime(noteInfo.freq * 0.992, now);
        osc2.frequency.setValueAtTime(noteInfo.freq * 1.009, now);
        osc2Gain.gain.setValueAtTime(0.85, now);
        filter.frequency.setValueAtTime(Math.min(8800, noteInfo.cutoff * 1.9), now);
        filter.frequency.exponentialRampToValueAtTime(Math.max(350, noteInfo.cutoff * 0.5), now + 0.42);
        filter.Q.setValueAtTime(3.6, now);
        dur = 0.45;
        break;
      case 'acid':
        osc1.type = 'sawtooth'; osc2.type = 'square';
        osc1.frequency.setValueAtTime(noteInfo.freq, now);
        osc2.frequency.setValueAtTime(noteInfo.freq * 0.5, now);
        osc2Gain.gain.setValueAtTime(0.3, now);
        filter.frequency.setValueAtTime(Math.min(9200, noteInfo.cutoff * 2.6), now);
        filter.frequency.exponentialRampToValueAtTime(Math.max(170, noteInfo.cutoff * 0.22), now + 0.26);
        filter.Q.setValueAtTime(12.0, now);
        useGrit = true;
        dur = 0.34;
        break;
      case 'reese':
        osc1.type = 'sawtooth'; osc2.type = 'sawtooth';
        osc1.frequency.setValueAtTime(noteInfo.freq * 0.496, now);
        osc2.frequency.setValueAtTime(noteInfo.freq * 0.505, now);
        osc2Gain.gain.setValueAtTime(0.95, now);
        filter.frequency.setValueAtTime(Math.min(2800, noteInfo.cutoff), now);
        filter.frequency.exponentialRampToValueAtTime(180, now + 0.5);
        filter.Q.setValueAtTime(5.5, now);
        useGrit = true;
        peak = 0.25 * gMul;
        dur = 0.52;
        break;
      case 'stab':
        osc1.type = 'sawtooth'; osc2.type = 'square';
        osc1.frequency.setValueAtTime(noteInfo.freq, now);
        osc2.frequency.setValueAtTime(noteInfo.freq * 1.498, now);
        osc2Gain.gain.setValueAtTime(0.65, now);
        filter.frequency.setValueAtTime(Math.min(7500, noteInfo.cutoff * 2.0), now);
        filter.frequency.exponentialRampToValueAtTime(260, now + 0.28);
        filter.Q.setValueAtTime(4.8, now);
        useGrit = true;
        dur = 0.32;
        break;
      case 'choir':
        osc1.type = 'triangle'; osc2.type = 'sawtooth';
        osc1.frequency.setValueAtTime(noteInfo.freq, now);
        osc2.frequency.setValueAtTime(noteInfo.freq * 2.002, now);
        osc2Gain.gain.setValueAtTime(0.28, now);
        filter.frequency.setValueAtTime(Math.min(3800, noteInfo.cutoff * 1.1), now);
        dur = 0.64;
        break;
      case 'sub808':
        osc1.type = 'sine'; osc2.type = 'sawtooth';
        osc1.frequency.setValueAtTime(noteInfo.freq * 1.9, now);
        osc1.frequency.exponentialRampToValueAtTime(Math.max(40, noteInfo.freq * 0.5), now + 0.085);
        osc2.frequency.setValueAtTime(noteInfo.freq * 0.5, now);
        osc2Gain.gain.setValueAtTime(0.32, now);
        filter.frequency.setValueAtTime(1400, now);
        useGrit = true;
        peak = 0.26 * gMul;
        dur = 0.46;
        break;
      case 'pluck':
        osc1.type = 'square'; osc2.type = 'sawtooth';
        osc1.frequency.setValueAtTime(noteInfo.freq, now);
        osc2.frequency.setValueAtTime(noteInfo.freq * 1.004, now);
        osc2Gain.gain.setValueAtTime(0.5, now);
        filter.frequency.setValueAtTime(Math.min(8000, noteInfo.cutoff * 1.8), now);
        filter.frequency.exponentialRampToValueAtTime(280, now + 0.3);
        dur = 0.36;
        break;
      case 'laser':
        osc1.type = 'sawtooth'; osc2.type = 'square';
        osc1.frequency.setValueAtTime(Math.min(5500, noteInfo.freq * 2.4), now);
        osc1.frequency.exponentialRampToValueAtTime(noteInfo.freq, now + 0.09);
        osc2.frequency.setValueAtTime(noteInfo.freq * 1.498, now);
        osc2Gain.gain.setValueAtTime(0.35, now);
        filter.frequency.setValueAtTime(Math.min(9000, noteInfo.cutoff * 2.0), now);
        filter.Q.setValueAtTime(5.2, now);
        dur = 0.36;
        break;
      case 'chime':
      default:
        osc1.type = 'sine'; osc2.type = 'triangle';
        osc1.frequency.setValueAtTime(noteInfo.freq, now);
        osc2.frequency.setValueAtTime(noteInfo.freq * 2.996, now);
        osc2Gain.gain.setValueAtTime(0.35, now);
        filter.frequency.setValueAtTime(Math.min(9200, noteInfo.cutoff * 1.9), now);
        dur = 0.54;
        break;
    }

    const atk = timbre === 'blade' || timbre === 'choir' ? 0.026 : 0.006;
    amp.gain.setValueAtTime(0.0006, now);
    amp.gain.linearRampToValueAtTime(Math.min(0.24, peak), now + atk);
    amp.gain.exponentialRampToValueAtTime(0.0005, now + dur);

    osc1.connect(filter);
    osc2.connect(osc2Gain);
    osc2Gain.connect(filter);
    filter.connect(amp);

    const dest = useGrit ? state.gritDrive : state.deckBBus;
    if (ctx.createStereoPanner) {
      const panner = ctx.createStereoPanner();
      panner.pan.setValueAtTime(Math.max(-0.88, Math.min(0.88, noteInfo.pan)), now);
      amp.connect(panner);
      panner.connect(dest);
      panner.connect(state.delayInput);
    } else {
      amp.connect(dest);
      amp.connect(state.delayInput);
    }

    osc1.start(now); osc2.start(now);
    osc1.stop(now + dur + 0.03); osc2.stop(now + dur + 0.03);

    // Kaleidoscope Stereo Harmony Bonus!
    if (state.mirrorMode >= 2 && (gainScale || 1) >= 0.7) {
      playSubHarmony(noteInfo.freq * 1.4983, 0.05 * gMul, -noteInfo.pan);
    }
  }

  function playSubHarmony(freq, vol, panVal) {
    const ctx = ensureAudio();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const flt = ctx.createBiquadFilter();
    const g = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(Math.max(40, Math.min(8000, freq)), now);
    flt.type = 'lowpass';
    flt.frequency.setValueAtTime(2400, now);
    g.gain.setValueAtTime(0.0004, now);
    g.gain.linearRampToValueAtTime(Math.min(0.09, vol), now + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0004, now + 0.28);
    osc.connect(flt);
    flt.connect(g);
    if (ctx.createStereoPanner) {
      const p = ctx.createStereoPanner();
      p.pan.setValueAtTime(Math.max(-0.9, Math.min(0.9, panVal || 0)), now);
      g.connect(p);
      p.connect(state.deckBBus);
    } else {
      g.connect(state.deckBBus);
    }
    osc.start(now);
    osc.stop(now + 0.29);
  }

  function createColorLineVoice(noteInfo, colorIdx) {
    const ctx = ensureAudio();
    if (!ctx) return null;
    const now = ctx.currentTime;
    const timbre = FINGER_COLORS[colorIdx % 10].timbre;
    const gritty = (timbre === 'reese' || timbre === 'acid' || timbre === 'stab');

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const osc2Gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;

    osc1.type = 'sawtooth';
    osc2.type = timbre === 'acid' || timbre === 'stab' ? 'square' : 'sawtooth';
    osc1.frequency.setValueAtTime(timbre === 'reese' ? noteInfo.freq * 0.5 : noteInfo.freq, now);
    osc2.frequency.setValueAtTime(noteInfo.freq * 1.4983, now);
    osc2Gain.gain.setValueAtTime(0.42, now);

    state.lfoGain.connect(osc1.frequency);
    state.lfoGain.connect(osc2.frequency);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(noteInfo.cutoff, now);
    filter.Q.setValueAtTime(timbre === 'acid' ? 9.5 : 4.2, now);

    const amp = Math.min(0.14, 0.21 / Math.sqrt(Math.max(1, state.fingers.size)));
    gain.gain.setValueAtTime(0.0005, now);
    gain.gain.setTargetAtTime(amp, now, 0.03);

    osc1.connect(filter);
    osc2.connect(osc2Gain);
    osc2Gain.connect(filter);
    filter.connect(gain);

    const dest = gritty ? state.gritDrive : state.deckBBus;
    if (panner) {
      panner.pan.setValueAtTime(Math.max(-0.85, Math.min(0.85, noteInfo.pan)), now);
      gain.connect(panner);
      panner.connect(dest);
      panner.connect(state.delayInput);
    } else {
      gain.connect(dest);
      gain.connect(state.delayInput);
    }

    osc1.start(now); osc2.start(now);
    return { osc1, osc2, filter, gain, panner, isReese: timbre === 'reese', lastAudioTs: 0 };
  }

  function updateColorLineVoice(voice, noteInfo, speedPx, nowMs) {
    if (!voice || !state.audioCtx) return;
    if (nowMs - voice.lastAudioTs < 24) return;
    voice.lastAudioTs = nowMs;

    const now = state.audioCtx.currentTime;
    const baseF = voice.isReese ? noteInfo.freq * 0.5 : noteInfo.freq;
    voice.osc1.frequency.setTargetAtTime(baseF, now, 0.026);
    voice.osc2.frequency.setTargetAtTime(noteInfo.freq * 1.4983, now, 0.026);
    const velBoost = Math.min(2.8, 1 + speedPx / 24);
    voice.filter.frequency.setTargetAtTime(Math.min(8800, noteInfo.cutoff * velBoost), now, 0.03);
    if (voice.panner) {
      voice.panner.pan.setTargetAtTime(Math.max(-0.85, Math.min(0.85, noteInfo.pan)), now, 0.04);
    }
  }

  function stopColorLineVoice(voice) {
    if (!voice || !state.audioCtx) return;
    const now = state.audioCtx.currentTime;
    try {
      voice.gain.gain.cancelScheduledValues(now);
      voice.gain.gain.setTargetAtTime(0.0001, now, 0.05);
      setTimeout(() => {
        try {
          voice.osc1.stop(); voice.osc2.stop();
          voice.osc1.disconnect(); voice.osc2.disconnect(); voice.gain.disconnect();
        } catch (_) {}
      }, 220);
    } catch (_) {}
  }

  // -------------------------------------------------------------------------
  // Deck A Drums, Deck B Gritty Bass, Vinyl Scratch & Robotic Cyber-Vocoder!
  // -------------------------------------------------------------------------
  function triggerCyberKick(power) {
    const ctx = ensureAudio();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const click = ctx.createOscillator();
    const g = ctx.createGain();
    const cg = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(165 * state.pitchBendFactor, now);
    osc.frequency.exponentialRampToValueAtTime(38 * state.pitchBendFactor, now + 0.12);
    g.gain.setValueAtTime(0.35 * (power || 1), now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

    click.type = 'triangle';
    click.frequency.setValueAtTime(920, now);
    click.frequency.exponentialRampToValueAtTime(90, now + 0.025);
    cg.gain.setValueAtTime(0.14 * (power || 1), now);
    cg.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    osc.connect(g); g.connect(state.deckABus);
    click.connect(cg); cg.connect(state.deckABus);

    osc.start(now); click.start(now);
    osc.stop(now + 0.25); click.stop(now + 0.035);
    state.bgPulse = Math.max(state.bgPulse, 0.95);
    wakeRenderer();
  }

  function triggerCyberSnare(vol) {
    const ctx = ensureAudio();
    if (!ctx || !state.noiseBuffer) return;
    const now = ctx.currentTime;

    const src = ctx.createBufferSource();
    src.buffer = state.noiseBuffer;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.setValueAtTime(2100 * state.pitchBendFactor, now);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.22 * (vol || 1), now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.19);
    src.connect(bp); bp.connect(g);
    g.connect(state.deckABus);
    src.start(now); src.stop(now + 0.2);

    const body = ctx.createOscillator();
    const bg = ctx.createGain();
    body.type = 'triangle';
    body.frequency.setValueAtTime(210 * state.pitchBendFactor, now);
    body.frequency.exponentialRampToValueAtTime(96, now + 0.09);
    bg.gain.setValueAtTime(0.16 * (vol || 1), now);
    bg.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    body.connect(bg); bg.connect(state.deckABus);
    body.start(now); body.stop(now + 0.11);
  }

  function triggerCyberHat(open) {
    const ctx = ensureAudio();
    if (!ctx || !state.noiseBuffer) return;
    const now = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = state.noiseBuffer;
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.setValueAtTime(7800, now);
    const g = ctx.createGain();
    const dur = open ? 0.14 : 0.038;
    g.gain.setValueAtTime(open ? 0.09 : 0.055, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + dur);
    src.connect(hp); hp.connect(g); g.connect(state.deckABus);
    src.start(now); src.stop(now + dur + 0.01);
  }

  function triggerGrittyCyberBass(semiOffset) {
    const ctx = ensureAudio();
    if (!ctx || semiOffset < 0) return;
    const now = ctx.currentTime;
    const freq = midiToFreq(currentRootMidi() - 12 + semiOffset);

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const flt = ctx.createBiquadFilter();
    const g = ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'square';
    osc1.frequency.setValueAtTime(freq, now);
    osc2.frequency.setValueAtTime(freq * 0.501, now);

    flt.type = 'lowpass';
    flt.frequency.setValueAtTime(1480, now);
    flt.frequency.exponentialRampToValueAtTime(155, now + 0.14);
    flt.Q.setValueAtTime(5.8, now);

    g.gain.setValueAtTime(0.19, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.17);

    osc1.connect(flt); osc2.connect(flt);
    flt.connect(g); g.connect(state.gritDrive);

    osc1.start(now); osc2.start(now);
    osc1.stop(now + 0.18); osc2.stop(now + 0.18);
  }

  // DJ Vinyl Scratch Synthesizer (Triggered when spinning Holo-Turntable A!)
  function triggerVinylScratch(velocity) {
    const ctx = ensureAudio();
    if (!ctx || !state.noiseBuffer) return;
    const now = ctx.currentTime;
    const spd = Math.min(3.0, Math.max(0.4, Math.abs(velocity) * 0.06));

    const chirp = ctx.createOscillator();
    const flt = ctx.createBiquadFilter();
    const g = ctx.createGain();
    chirp.type = 'sawtooth';
    chirp.frequency.setValueAtTime(velocity > 0 ? 180 : 680, now);
    chirp.frequency.exponentialRampToValueAtTime(velocity > 0 ? 780 * spd : 150, now + 0.075);

    flt.type = 'bandpass';
    flt.frequency.setValueAtTime(1400 * spd, now);
    flt.Q.setValueAtTime(4.5, now);

    g.gain.setValueAtTime(0.16, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.085);

    chirp.connect(flt); flt.connect(g); g.connect(state.deckABus);
    chirp.start(now); chirp.stop(now + 0.09);
  }

  // Feature #6: Robotic Cyber-Vocoder Voice + Formant Synth Chord Burst!
  function triggerCyberVocoder(phrase) {
    const ctx = ensureAudio();
    if (!ctx) return;
    const now = ctx.currentTime;

    // 1. Holographic Canvas HUD Flash
    state.hudBannerFlash = { text: `// ${phrase} //`, life: 1.0, color: '#fcee0a' };
    state.bgPulse = 1.25;
    wakeRenderer();

    // 2. Robotic Daft-Punk / Netrunner Formant Synth Chord Burst (Always audible!)
    const rootF = midiToFreq(currentRootMidi());
    const syllables = phrase.split(' ').length + 1;
    for (let s = 0; s < syllables; s++) {
      const t0 = now + s * 0.13;
      const oscA = ctx.createOscillator();
      const oscB = ctx.createOscillator();
      const formant = ctx.createBiquadFilter();
      const vg = ctx.createGain();

      oscA.type = 'sawtooth';
      oscB.type = 'square';
      oscA.frequency.setValueAtTime(rootF * 0.5, t0);
      oscB.frequency.setValueAtTime(rootF * (s % 2 === 0 ? 1.0 : 1.189), t0);

      formant.type = 'bandpass';
      formant.frequency.setValueAtTime(650 + (s * 420) % 1400, t0);
      formant.frequency.exponentialRampToValueAtTime(1650 - (s * 250) % 900, t0 + 0.1);
      formant.Q.setValueAtTime(7.5, t0);

      vg.gain.setValueAtTime(0.001, t0);
      vg.gain.linearRampToValueAtTime(0.2, t0 + 0.015);
      vg.gain.exponentialRampToValueAtTime(0.001, t0 + 0.12);

      oscA.connect(formant); oscB.connect(formant);
      formant.connect(vg); vg.connect(state.gritDrive);
      oscA.start(t0); oscB.start(t0);
      oscA.stop(t0 + 0.125); oscB.stop(t0 + 0.125);
    }

    // 3. Layer Browser SpeechSynthesis Deep Cyborg Voice if available
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(phrase);
        u.pitch = 0.15;
        u.rate = 0.92;
        u.volume = 0.9;
        window.speechSynthesis.speak(u);
      } catch (_) {}
    }
  }

  // Dark Dystopian Chord Pads
  function stopDarkPads() {
    if (!state.chordNodes || !state.audioCtx) {
      state.chordNodes = null;
      return;
    }
    const old = state.chordNodes;
    state.chordNodes = null;
    const now = state.audioCtx.currentTime;
    try {
      old.master.gain.cancelScheduledValues(now);
      old.master.gain.setTargetAtTime(0.0001, now, 0.09);
      setTimeout(() => {
        old.oscs.forEach((o) => { try { o.stop(); o.disconnect(); } catch (_) {} });
        try { old.master.disconnect(); } catch (_) {}
      }, 340);
    } catch (_) {}
  }

  function updateOrStartDarkPads() {
    if (!state.padOn) {
      stopDarkPads();
      return;
    }
    const ctx = ensureAudio();
    if (!ctx) return;
    const semis = DARK_PROGRESSION[state.barIndex % DARK_PROGRESSION.length];
    const root = currentRootMidi();
    const now = ctx.currentTime;

    if (!state.chordNodes) {
      const flt = ctx.createBiquadFilter();
      flt.type = 'lowpass';
      flt.frequency.setValueAtTime(1350, now);
      flt.Q.setValueAtTime(2.2, now);

      const master = ctx.createGain();
      master.gain.setValueAtTime(0.0005, now);
      master.gain.setTargetAtTime(0.11, now, 0.16);
      flt.connect(master);
      master.connect(state.deckBBus);
      master.connect(state.delayInput);

      const oscs = semis.map((s, i) => {
        const o = ctx.createOscillator();
        o.type = i < 2 ? 'sawtooth' : 'triangle';
        o.frequency.setValueAtTime(midiToFreq(root + s) * (i % 2 === 0 ? 0.997 : 1.003), now);
        const og = ctx.createGain();
        og.gain.setValueAtTime(0.28, now);
        o.connect(og); og.connect(flt);
        o.start(now);
        return o;
      });
      state.chordNodes = { oscs, master, flt };
    } else {
      state.chordNodes.oscs.forEach((o, i) => {
        o.frequency.setTargetAtTime(midiToFreq(root + semis[i]), now, 0.08);
      });
    }
    wakeRenderer();
  }

  // -------------------------------------------------------------------------
  // Feature #2: 1-Tap Procedural "Cyber-Seed" AI Track Generator!
  // -------------------------------------------------------------------------
  function generateProceduralCyberSong() {
    ensureAudio();
    const pfx = CODENAME_PREFIXES[Math.floor(Math.random() * CODENAME_PREFIXES.length)];
    const sfx = CODENAME_SUFFIXES[Math.floor(Math.random() * CODENAME_SUFFIXES.length)];
    const bpm = 96 + Math.floor(Math.random() * 34); // 96..129 BPM
    const roots = [46, 48, 49, 50, 51, 53]; // Bb, C, C#, D, Eb, F dark keys
    const rootMidi = roots[Math.floor(Math.random() * roots.length)];

    // Generate Punchy Cyberpunk Kick, Snare, Hats & Gritty Bass
    const k = [1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0];
    if (bpm >= 114) { k[4] = 1; k[12] = 1; } // Four-on-the-floor Outrun/Club
    else { k[6] = Math.random() > 0.4 ? 1 : 0; k[10] = Math.random() > 0.5 ? 1 : 0; k[3] = Math.random() > 0.65 ? 1 : 0; }

    const s = [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0, Math.random() > 0.6 ? 1 : 0];
    const h = Array.from({ length: 16 }, (_, i) => (i % 2 === 0 || Math.random() > 0.55 ? 1 : 0));
    const o = Array.from({ length: 16 }, (_, i) => (i === 6 || i === 14 ? 1 : 0));

    const bassChoices = [0, 0, 0, 12, 3, 5, 7, 8, 10];
    const b = Array.from({ length: 16 }, (_, i) => {
      if (i === 0 || i === 8) return 0;
      if (Math.random() < 0.22) return -1;
      return bassChoices[Math.floor(Math.random() * bassChoices.length)];
    });

    CYBER_BEATS.generated = {
      label: `${pfx}_${sfx}`,
      bpm,
      rootMidi,
      k, s, h, o, b,
    };

    // Generate Fresh Multi-Color 16-Step Neon Arp Riff!
    activeArpSteps = Array.from({ length: 16 }, (_, i) => {
      if (i % 2 === 1 && Math.random() < 0.35) return null;
      return {
        x: 0.08 + Math.random() * 0.84,
        y: 0.16 + Math.random() * 0.38,
        c: Math.floor(Math.random() * 10),
      };
    });

    state.beatStyle = 'generated';
    $('beat-style-select').value = 'generated';
    state.bpm = bpm;
    $('slider-bpm').value = String(bpm);
    $('lbl-bpm').textContent = `${bpm} BPM`;
    $('track-codename').textContent = `${pfx}_${sfx} // ${bpm} BPM`;

    state.drumsOn = true;
    state.bassOn = true;
    state.padOn = true;
    state.arpOn = true;
    state.activeScene = 'drop';

    updateOrStartDarkPads();
    triggerCyberVocoder(`${pfx} ${sfx}`);
    refreshStepMatrixCells(state.clockStep);
    refreshAllUi();
    syncClock();
  }

  $('btn-gen-song').addEventListener('click', generateProceduralCyberSong);

  // -------------------------------------------------------------------------
  // Feature #8: 4-Stage Song Scene Arranger (Intro -> Groove -> Build -> Drop!)
  // -------------------------------------------------------------------------
  function launchSongScene(scene) {
    ensureAudio();
    if (state.buildTimer) {
      clearInterval(state.buildTimer);
      state.buildTimer = null;
    }
    state.activeScene = scene;
    const now = state.audioCtx.currentTime;
    state.masterFilter.frequency.cancelScheduledValues(now);
    state.masterFilter.frequency.setTargetAtTime(20000, now, 0.08);

    if (scene === 'intro') {
      state.drumsOn = false;
      state.bassOn = false;
      state.padOn = true;
      state.arpOn = true;
      updateOrStartDarkPads();
      state.hudBannerFlash = { text: 'SCENE 1 // NEON RAIN INTRO', life: 1.0, color: '#00f5ff' };
    } else if (scene === 'groove') {
      state.drumsOn = true;
      state.bassOn = true;
      state.padOn = true;
      state.arpOn = false;
      updateOrStartDarkPads();
      state.hudBannerFlash = { text: 'SCENE 2 // STREET GROOVE', life: 1.0, color: '#00ff95' };
    } else if (scene === 'build') {
      state.drumsOn = true;
      state.bassOn = false;
      state.padOn = true;
      state.arpOn = true;
      updateOrStartDarkPads();
      // Rising filter tension + accelerating snare roll into Automatic Overdrive Drop!
      state.masterFilter.frequency.setValueAtTime(360, now);
      state.masterFilter.frequency.exponentialRampToValueAtTime(18000, now + 2.4);
      state.hudBannerFlash = { text: 'SCENE 3 // TENSION RISING...', life: 1.0, color: '#fcee0a' };
      let hits = 0;
      state.buildTimer = setInterval(() => {
        hits += 1;
        triggerCyberSnare(0.5 + hits * 0.06);
        if (hits >= 12) {
          clearInterval(state.buildTimer);
          state.buildTimer = null;
          launchSongScene('drop');
        }
      }, 190);
    } else if (scene === 'drop') {
      state.drumsOn = true;
      state.bassOn = true;
      state.padOn = true;
      state.arpOn = true;
      updateOrStartDarkPads();
      triggerCyberKick(1.8);
      state.bgPulse = 1.6;
      state.hudBannerFlash = { text: 'SCENE 4 // OVERDRIVE DROP!!', life: 1.0, color: '#ff0055' };
      for (let s = 0; s < 10; s++) {
        const x = (state.viewW * (s + 0.5)) / 10;
        const y = state.viewH * (0.28 + (s % 3) * 0.16);
        spawnTapCircles(x, y, FINGER_COLORS[s], 1.15, true);
        playColorTapSound(mapPositionToMusic(x, y), s, 10, 0.9);
      }
    }

    refreshAllUi();
    syncClock();
    wakeRenderer();
  }

  document.querySelectorAll('.scene-btn[data-scene]').forEach((btn) => {
    btn.addEventListener('click', () => launchSongScene(btn.dataset.scene));
  });

  $('btn-master-stop').addEventListener('click', () => {
    if (state.buildTimer) { clearInterval(state.buildTimer); state.buildTimer = null; }
    state.drumsOn = false;
    state.bassOn = false;
    state.padOn = false;
    state.arpOn = false;
    state.activeScene = null;
    stopDarkPads();
    refreshStepMatrixCells(-1);
    refreshAllUi();
    syncClock();
  });

  // -------------------------------------------------------------------------
  // Master 16-Step Clock & Turntable Spin
  // -------------------------------------------------------------------------
  function needsClock() {
    const anySlot = state.slots.some((s) => s.status === 'recording' || s.status === 'playing');
    const anyCustom = state.customStepHits.some(Boolean);
    return Boolean(state.drumsOn || state.bassOn || state.padOn || state.arpOn || anySlot || anyCustom);
  }

  function syncClock() {
    if (state.clockTimer) {
      clearInterval(state.clockTimer);
      state.clockTimer = null;
    }
    if (!needsClock()) return;
    const stepMs = Math.round((60000 / state.bpm) / 4);
    state.clockTimer = setInterval(tickStep, stepMs);
  }

  function tickStep() {
    const step = state.clockStep % 16;
    if (step === 0) {
      state.barIndex += 1;
      if (state.padOn) updateOrStartDarkPads();
    }

    refreshStepMatrixCells(step);

    // Spin Holo-Turntables!
    if (state.drumsOn) {
      state.jogAngleA = (state.jogAngleA + 22) % 360;
      $('jog-ring-a').style.transform = `rotate(${state.jogAngleA}deg)`;
    }
    if (state.bassOn || state.arpOn || state.padOn) {
      state.jogAngleB = (state.jogAngleB + 22) % 360;
      $('jog-ring-b').style.transform = `rotate(${state.jogAngleB}deg)`;
    }

    const beat = CYBER_BEATS[state.beatStyle] || CYBER_BEATS.nightcity;

    if (state.drumsOn) {
      if (beat.k[step]) triggerCyberKick(1.0);
      if (beat.s[step]) triggerCyberSnare(1.0);
      if (beat.o[step]) triggerCyberHat(true);
      else if (beat.h[step]) triggerCyberHat(false);
    }

    // Interactive 16-Step Custom Grid Accents!
    if (state.customStepHits[step]) {
      const gx = ((step + 0.5) / 16) * state.viewW;
      const gy = state.viewH * 0.34;
      playColorTapSound(mapPositionToMusic(gx, gy), step % 10, 2, 0.8);
      spawnTapCircles(gx, gy, FINGER_COLORS[step % 10], 0.55, false);
      wakeRenderer();
    }

    if (state.bassOn && beat.b[step] >= 0) {
      triggerGrittyCyberBass(beat.b[step]);
    }

    if (state.arpOn && activeArpSteps[step]) {
      const a = activeArpSteps[step];
      const ax = a.x * state.viewW;
      const ay = a.y * state.viewH;
      playColorTapSound(mapPositionToMusic(ax, ay), a.c, 2, 0.66);
      spawnTapCircles(ax, ay, FINGER_COLORS[a.c], 0.5, false);
      wakeRenderer();
    }

    let slotChanged = false;
    state.slots.forEach((slot) => {
      if (slot.status === 'playing') {
        const notes = slot.steps[step];
        for (let i = 0; i < notes.length; i++) {
          const ev = notes[i];
          const lx = ev.xNorm * state.viewW;
          const ly = ev.yNorm * state.viewH;
          playColorTapSound(mapPositionToMusic(lx, ly), ev.colorIdx, notes.length, 0.85);
          spawnTapCircles(lx, ly, FINGER_COLORS[ev.colorIdx], 0.65, true);
          wakeRenderer();
        }
      } else if (slot.status === 'recording') {
        slot.recTicks -= 1;
        slotChanged = true;
        if (slot.recTicks <= 0) {
          const hasAny = slot.steps.some((b) => b.length > 0);
          slot.status = hasAny ? 'playing' : 'empty';
        }
      }
    });

    if (slotChanged) {
      refreshAllUi();
      syncClock();
    }

    state.clockStep = (state.clockStep + 1) % 16;
  }

  // -------------------------------------------------------------------------
  // Feature #1 & #4: Interactive Turntable Scratching, Crossfader & Kaoss Glitch FX
  // -------------------------------------------------------------------------
  function bindTurntableJog(jogEl, ringEl, isDeckA) {
    let dragging = false;
    let prevY = 0;
    jogEl.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      ensureAudio();
      dragging = true;
      prevY = e.clientY;
      try { jogEl.setPointerCapture(e.pointerId); } catch (_) {}
    });
    jogEl.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const dy = prevY - e.clientY;
      prevY = e.clientY;
      if (Math.abs(dy) < 2) return;
      if (isDeckA) {
        state.jogAngleA = (state.jogAngleA + dy * 4) % 360;
        ringEl.style.transform = `rotate(${state.jogAngleA}deg)`;
        triggerVinylScratch(dy);
      } else {
        state.jogAngleB = (state.jogAngleB + dy * 4) % 360;
        ringEl.style.transform = `rotate(${state.jogAngleB}deg)`;
        state.pitchBendFactor = Math.max(0.65, Math.min(1.45, 1.0 + dy * 0.015));
      }
    });
    const endJog = () => {
      dragging = false;
      state.pitchBendFactor = 1.0;
    };
    jogEl.addEventListener('pointerup', endJog);
    jogEl.addEventListener('pointercancel', endJog);
  }
  bindTurntableJog($('jog-a'), $('jog-ring-a'), true);
  bindTurntableJog($('jog-b'), $('jog-ring-b'), false);

  $('slider-xfade').addEventListener('input', (e) => {
    ensureAudio();
    const v = parseInt(e.target.value, 10) / 100; // -1 (Deck A) .. +1 (Deck B)
    const now = state.audioCtx.currentTime;
    const gainA = v <= 0 ? 1.0 : Math.cos((v * Math.PI) * 0.5);
    const gainB = v >= 0 ? 1.0 : Math.cos((-v * Math.PI) * 0.5);
    state.deckABus.gain.setTargetAtTime(gainA, now, 0.02);
    state.deckBBus.gain.setTargetAtTime(gainB, now, 0.02);
  });

  $('beat-style-select').addEventListener('change', (e) => {
    ensureAudio();
    state.beatStyle = e.target.value;
    const b = CYBER_BEATS[state.beatStyle];
    if (b) {
      state.bpm = b.bpm;
      $('slider-bpm').value = String(state.bpm);
      $('lbl-bpm').textContent = `${state.bpm} BPM`;
      $('track-codename').textContent = b.label;
    }
    if (!state.drumsOn) {
      state.drumsOn = true;
      state.bassOn = true;
    }
    refreshStepMatrixCells(state.clockStep);
    refreshAllUi();
    syncClock();
  });

  $('slider-bpm').addEventListener('input', (e) => {
    state.bpm = parseInt(e.target.value, 10) || 106;
    $('lbl-bpm').textContent = `${state.bpm} BPM`;
    syncClock();
  });

  // Hold-to-Engage Kaoss Glitch FX Buttons!
  document.querySelectorAll('.kaoss-btn').forEach((btn) => {
    const fx = btn.dataset.fx;
    const engage = (e) => {
      e.preventDefault();
      const ctx = ensureAudio();
      if (!ctx) return;
      btn.classList.add('engaged');
      const now = ctx.currentTime;

      if (fx === 'stutter') {
        if (state.stutterTimer) clearInterval(state.stutterTimer);
        state.stutterTimer = setInterval(() => {
          triggerCyberSnare(0.75);
          triggerCyberKick(0.7);
          state.bgPulse = 1.1;
          wakeRenderer();
        }, 68);
      } else if (fx === 'tapestop') {
        state.pitchBendFactor = 0.52;
        state.masterFilter.frequency.setTargetAtTime(380, now, 0.12);
      } else if (fx === 'overdrive') {
        state.gritGain.gain.setTargetAtTime(1.65, now, 0.03);
        state.masterFilter.Q.setTargetAtTime(7.5, now, 0.03);
        state.masterFilter.frequency.setTargetAtTime(3200, now, 0.04);
      } else if (fx === 'muffle') {
        state.masterFilter.frequency.setTargetAtTime(260, now, 0.04);
        state.masterFilter.Q.setTargetAtTime(4.2, now, 0.04);
      }
    };

    const release = () => {
      btn.classList.remove('engaged');
      if (state.stutterTimer && fx === 'stutter') {
        clearInterval(state.stutterTimer);
        state.stutterTimer = null;
      }
      if (!state.audioCtx) return;
      const now = state.audioCtx.currentTime;
      state.pitchBendFactor = 1.0;
      state.gritGain.gain.setTargetAtTime(0.78, now, 0.04);
      state.masterFilter.frequency.setTargetAtTime(20000, now, 0.04);
      state.masterFilter.Q.setTargetAtTime(1.4, now, 0.04);
    };

    btn.addEventListener('pointerdown', engage);
    btn.addEventListener('pointerup', release);
    btn.addEventListener('pointerleave', release);
    btn.addEventListener('pointercancel', release);
  });

  // Cyber Vocoder Buttons
  document.querySelectorAll('.vox-btn[data-vox]').forEach((btn) => {
    btn.addEventListener('click', () => triggerCyberVocoder(btn.dataset.vox));
  });

  $('btn-vox-drop').addEventListener('click', () => {
    triggerCyberVocoder('DROP THE BASS');
    launchSongScene('drop');
  });

  // Stems & Riff Loopers
  $('btn-stem-drums').addEventListener('click', () => { ensureAudio(); state.drumsOn = !state.drumsOn; refreshAllUi(); syncClock(); });
  $('btn-stem-bass').addEventListener('click', () => { ensureAudio(); state.bassOn = !state.bassOn; refreshAllUi(); syncClock(); });
  $('btn-stem-pad').addEventListener('click', () => { ensureAudio(); state.padOn = !state.padOn; updateOrStartDarkPads(); refreshAllUi(); syncClock(); });
  $('btn-stem-arp').addEventListener('click', () => { ensureAudio(); state.arpOn = !state.arpOn; refreshAllUi(); syncClock(); });

  document.querySelectorAll('.riff-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      ensureAudio();
      const idx = parseInt(btn.dataset.slot, 10);
      const slot = state.slots[idx];
      if (slot.status === 'empty') {
        if (!state.drumsOn) { state.drumsOn = true; state.bassOn = true; }
        slot.steps = Array.from({ length: 16 }, () => []);
        slot.status = 'waiting';
      } else if (slot.status === 'waiting' || slot.status === 'recording') {
        slot.status = slot.steps.some((b) => b.length > 0) ? 'playing' : 'empty';
      } else if (slot.status === 'playing') {
        slot.status = 'muted';
      } else if (slot.status === 'muted') {
        slot.status = 'playing';
      }
      refreshAllUi();
      syncClock();
    });
  });

  $('btn-clear-layers').addEventListener('click', () => {
    state.slots.forEach((slot) => {
      slot.status = 'empty';
      slot.steps = Array.from({ length: 16 }, () => []);
      slot.recTicks = 0;
    });
    state.customStepHits.fill(false);
    refreshStepMatrixCells(state.clockStep);
    refreshAllUi();
    syncClock();
  });

  // Feature #7: Kaleidoscope Laser Mirror Button
  $('btn-kaleidoscope').addEventListener('click', () => {
    state.mirrorMode = state.mirrorMode === 1 ? 2 : (state.mirrorMode === 2 ? 4 : 1);
    const btn = $('btn-kaleidoscope');
    btn.classList.toggle('active', state.mirrorMode > 1);
    btn.innerHTML = state.mirrorMode === 1
      ? '&#128302; Mirror Lasers: OFF'
      : (state.mirrorMode === 2 ? '&#128302; Mirror Lasers: 2X TWIN' : '&#128302; Mirror Lasers: 4X MANDALA');
  });

  // Feature #10: Internal Synth Audio Mix Exporter (.webm download!)
  $('btn-export-mix').addEventListener('click', () => {
    ensureAudio();
    const btn = $('btn-export-mix');
    if (!state.mediaRecorder || state.mediaRecorder.state === 'inactive') {
      if (!state.mediaDest || typeof MediaRecorder === 'undefined') return;
      state.recChunks = [];
      const mr = new MediaRecorder(state.mediaDest.stream);
      mr.ondataavailable = (ev) => { if (ev.data && ev.data.size > 0) state.recChunks.push(ev.data); };
      mr.onstop = () => {
        const blob = new Blob(state.recChunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `NightCity_CyberMix_${Date.now()}.webm`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 5000);
      };
      mr.start();
      state.mediaRecorder = mr;
      btn.classList.add('recording');
      btn.innerHTML = '&#9209; Save Mix (.webm)';
    } else {
      state.mediaRecorder.stop();
      btn.classList.remove('recording');
      btn.innerHTML = '&#9210; Rec Audio Mix';
    }
  });

  document.querySelectorAll('.num-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      ensureAudio();
      state.touchBrushCount = parseInt(btn.dataset.count, 10);
      document.querySelectorAll('.num-btn').forEach((b) => {
        b.classList.toggle('active', parseInt(b.dataset.count, 10) === state.touchBrushCount);
      });
    });
  });

  $('color-mode-select').addEventListener('change', (e) => {
    ensureAudio();
    state.colorMode = e.target.value;
    if (state.colorMode !== 'rainbow') {
      const idx = parseInt(state.colorMode, 10);
      const demo = mapPositionToMusic(state.viewW * 0.5, state.viewH * 0.42);
      playColorTapSound(demo, idx, 1, 0.9);
      spawnTapCircles(state.viewW * 0.5, state.viewH * 0.42, FINGER_COLORS[idx], 0.95, true);
      wakeRenderer();
    }
  });

  function refreshAllUi() {
    $('btn-stem-drums').classList.toggle('active', state.drumsOn);
    $('btn-stem-bass').classList.toggle('active', state.bassOn);
    $('btn-stem-pad').classList.toggle('active', state.padOn);
    $('btn-stem-arp').classList.toggle('active', state.arpOn);

    document.querySelectorAll('.scene-btn[data-scene]').forEach((b) => {
      b.classList.toggle('active', b.dataset.scene === state.activeScene);
    });

    let waitingIdx = -1;
    let recIdx = -1;
    state.slots.forEach((slot, idx) => {
      const btn = $(`layer-${idx}`);
      btn.classList.remove('waiting', 'recording', 'playing', 'muted');
      if (slot.status === 'empty') btn.innerHTML = `&#128308; Rec Riff ${idx + 1}`;
      else if (slot.status === 'waiting') { btn.classList.add('waiting'); btn.innerHTML = `&#128070; Tap Stage...`; waitingIdx = idx; }
      else if (slot.status === 'recording') {
        btn.classList.add('recording');
        btn.innerHTML = `&#128308; Rec ${Math.round(((16 - slot.recTicks) / 16) * 100)}%`;
        recIdx = idx;
      } else if (slot.status === 'playing') { btn.classList.add('playing'); btn.innerHTML = `&#128266; Riff ${idx + 1} ON`; }
      else if (slot.status === 'muted') { btn.classList.add('muted'); btn.innerHTML = `&#128263; Riff ${idx + 1} Off`; }
    });

    const banner = $('rec-banner');
    if (waitingIdx >= 0) {
      banner.classList.remove('hidden');
      $('rec-banner-text').innerHTML = `&#128070; <strong>Riff ${waitingIdx + 1} Armed:</strong> Tap or drag on the neon stage whenever you're ready!`;
      $('rec-progress-fill').style.width = '8%';
    } else if (recIdx >= 0) {
      banner.classList.remove('hidden');
      const pct = Math.min(100, Math.round(((16 - state.slots[recIdx].recTicks) / 16) * 100));
      $('rec-banner-text').innerHTML = `&#128308; <strong>Recording Riff ${recIdx + 1} into Cyberdeck...</strong> Keep tapping or dragging!`;
      $('rec-progress-fill').style.width = `${pct}%`;
    } else {
      banner.classList.add('hidden');
    }

    const stems = [];
    if (state.drumsOn) stems.push('Drums');
    if (state.bassOn) stems.push('Grit Bass');
    if (state.padOn) stems.push('Dark Pad');
    if (state.arpOn) stems.push('Neon Arp');
    $('hud-status').textContent = stems.length
      ? `Active: ${stems.join(' + ')} • Spin Turntables, Hold Glitch FX, or Touch Stage to Solo!`
      : `Tap "Generate Cyber Song" or pick a Song Scene — then touch & drag anywhere!`;
  }

  function captureIntoRiffIfArmed(xNorm, yNorm, colorIdx) {
    let started = false;
    state.slots.forEach((slot) => {
      if (slot.status === 'waiting') {
        slot.status = 'recording';
        slot.recTicks = 16;
        started = true;
      }
    });
    if (started) { refreshAllUi(); syncClock(); }
    const step = state.clockStep % 16;
    state.slots.forEach((slot) => {
      if (slot.status === 'recording' && slot.steps[step].length < 3) {
        slot.steps[step].push({ xNorm, yNorm, colorIdx });
      }
    });
  }

  // -------------------------------------------------------------------------
  // Ephemeral Stage, Chromatic Reticles, Kaleidoscope & Multi-Touch Engine
  // -------------------------------------------------------------------------
  const stageWrap = $('stage-wrap');
  const canvas = $('synth-canvas');
  const c = canvas.getContext('2d', { alpha: false, desynchronized: true });

  function resizeCanvas() {
    state.viewW = stageWrap.clientWidth || window.innerWidth;
    state.viewH = stageWrap.clientHeight || (window.innerHeight - 190);
    canvas.width = Math.max(320, Math.round(state.viewW * RENDER_SCALE));
    canvas.height = Math.max(180, Math.round(state.viewH * RENDER_SCALE));
    c.setTransform(RENDER_SCALE, 0, 0, RENDER_SCALE, 0, 0);
    wakeRenderer();
  }
  window.addEventListener('resize', resizeCanvas);
  setTimeout(resizeCanvas, 20);

  function pushShockwaveAt(x, y, pal, m, withReticle) {
    if (state.tapRings.length < 56) {
      state.tapRings.push(
        { x, y, r: 5 * m,  maxR: 52 * m,  speed: 3.4 * m, color: '#ffffff',     width: 2.4 },
        { x, y, r: 9 * m,  maxR: 102 * m, speed: 4.8 * m, color: pal.primary,   width: 3.6 },
        { x, y, r: 14 * m, maxR: 148 * m, speed: 6.2 * m, color: pal.secondary, width: 1.9 }
      );
    }
    if (withReticle && state.reticles.length < 24) {
      state.reticles.push({ x, y, size: 12 * m, maxSize: 74 * m, color: pal.primary, angle: 0 });
    }
    const cnt = Math.min(6, Math.round(5 * m));
    for (let i = 0; i < cnt && state.sparks.length < 90; i++) {
      const ang = (Math.PI * 2 * i) / cnt + Math.random() * 0.35;
      const spd = (2.2 + Math.random() * 3.4) * m;
      state.sparks.push({
        x, y,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        life: 1.0,
        color: i % 2 === 0 ? pal.primary : pal.secondary,
        size: 2.7,
      });
    }
  }

  function spawnTapCircles(x, y, pal, mul, withReticle) {
    const m = mul || 1.0;
    pushShockwaveAt(x, y, pal, m, withReticle);
    if (state.mirrorMode >= 2) {
      const mx = state.viewW - x;
      const pal2 = FINGER_COLORS[(FINGER_COLORS.indexOf(pal) + 3) % 10] || FINGER_COLORS[1];
      pushShockwaveAt(mx, y, pal2, m * 0.85, withReticle);
      if (state.mirrorMode === 4) {
        const my = state.viewH - y;
        const pal3 = FINGER_COLORS[(FINGER_COLORS.indexOf(pal) + 5) % 10] || FINGER_COLORS[4];
        const pal4 = FINGER_COLORS[(FINGER_COLORS.indexOf(pal) + 7) % 10] || FINGER_COLORS[2];
        pushShockwaveAt(x, my, pal3, m * 0.85, false);
        pushShockwaveAt(mx, my, pal4, m * 0.85, false);
      }
    }
  }

  function reclaimOldestIfFull() {
    if (state.fingers.size < 10) return true;
    for (const [oldId, oldF] of state.fingers.entries()) {
      if (oldF.releaseTimer) {
        clearTimeout(oldF.releaseTimer);
        finalizeFingerUp(oldId);
        return true;
      }
    }
    return false;
  }

  function onFingerDown(id, rawX, rawY, forcedColorIdx, silent) {
    if (state.fingers.has(id)) return;
    if (!reclaimOldestIfFull()) return;

    const colorIdx = typeof forcedColorIdx === 'number' ? (forcedColorIdx % 10) : pickNextColor(0);
    const pal = FINGER_COLORS[colorIdx];
    const x = Math.max(8, Math.min(state.viewW - 8, rawX));
    const y = Math.max(8, Math.min(state.viewH - 8, rawY));
    const nowMs = performance.now();
    const noteInfo = mapPositionToMusic(x, y);

    const trail = { colorIdx, pal, points: [{ x, y, t: nowMs }], active: true };
    state.trails.push(trail);

    state.fingers.set(id, {
      id, colorIdx, pal,
      startX: x, startY: y,
      x, y,
      isLine: false,
      trail,
      voice: null,
      noteInfo,
      lastCol: noteInfo.col,
      releaseTimer: null,
    });

    spawnTapCircles(x, y, pal, 0.96, true);
    if (state.noteFloats.length < 24) {
      state.noteFloats.push({ x, y: y - 16, text: `${pal.name} · ${noteInfo.noteLabel}`, color: pal.primary, life: 1.0 });
    }
    if (!silent) {
      playColorTapSound(noteInfo, colorIdx, state.fingers.size, 1.0);
    }

    captureIntoRiffIfArmed(x / Math.max(1, state.viewW), y / Math.max(1, state.viewH), colorIdx);
    wakeRenderer();
  }

  function onFingerMove(id, rawX, rawY) {
    const f = state.fingers.get(id);
    if (!f) return;

    const x = Math.max(6, Math.min(state.viewW - 6, rawX));
    const y = Math.max(6, Math.min(state.viewH - 6, rawY));
    const stepDist = Math.hypot(x - f.x, y - f.y);
    if (stepDist < 5.5) return;

    const nowMs = performance.now();
    const noteInfo = mapPositionToMusic(x, y);
    f.x = x;
    f.y = y;
    f.noteInfo = noteInfo;

    // Feature #9: Fast Drag Velocity Shifts Color Along Rainbow Plasma Trail!
    if (state.colorMode === 'rainbow' && stepDist > 26) {
      f.colorIdx = (f.colorIdx + 1) % 10;
      f.pal = FINGER_COLORS[f.colorIdx];
      f.trail.pal = f.pal;
      f.trail.colorIdx = f.colorIdx;
    }

    f.trail.points.push({ x, y, t: nowMs });
    if (f.trail.points.length > 28) f.trail.points.shift();

    if (!f.isLine && Math.hypot(x - f.startX, y - f.startY) > 12) {
      f.isLine = true;
      f.voice = createColorLineVoice(noteInfo, f.colorIdx);
    }

    if (f.isLine && f.voice) {
      updateColorLineVoice(f.voice, noteInfo, stepDist, nowMs);
      if (noteInfo.col !== f.lastCol) {
        f.lastCol = noteInfo.col;
        spawnTapCircles(x, y, f.pal, 0.42, false);
        captureIntoRiffIfArmed(x / Math.max(1, state.viewW), y / Math.max(1, state.viewH), f.colorIdx);
      }
    }

    if (f.trail.points.length % 3 === 0 && state.sparks.length < 90) {
      state.sparks.push({
        x, y,
        vx: (Math.random() - 0.5) * 2.2,
        vy: (Math.random() - 0.5) * 2.2,
        life: 0.78,
        color: f.pal.primary,
        size: 2.5,
      });
    }
    wakeRenderer();
  }

  function finalizeFingerUp(id) {
    const f = state.fingers.get(id);
    if (!f) return;
    if (f.releaseTimer) {
      clearTimeout(f.releaseTimer);
      f.releaseTimer = null;
    }
    f.trail.active = false;
    if (f.voice) {
      stopColorLineVoice(f.voice);
      f.voice = null;
    }
    state.fingers.delete(id);
    wakeRenderer();
  }

  function onFingerUp(id, briefHold) {
    const f = state.fingers.get(id);
    if (!f) return;
    if (briefHold) {
      if (f.releaseTimer) clearTimeout(f.releaseTimer);
      f.releaseTimer = setTimeout(() => finalizeFingerUp(id), 1250);
      wakeRenderer();
      return;
    }
    finalizeFingerUp(id);
  }

  function computeBrushPoint(baseX, baseY, idx, total, phaseSec) {
    if (total <= 1) return { x: baseX, y: baseY };
    const centered = idx - (total - 1) * 0.5;
    const spread = Math.min(state.spreadPx, (state.viewW * 0.72) / Math.max(1, total));
    const waveX = Math.sin(phaseSec * 3.4 + idx * 1.15) * 10;
    const archY = Math.abs(centered) * 14 + Math.cos(phaseSec * 3.0 + idx * 0.9) * 12;
    return {
      x: baseX + centered * spread + waveX,
      y: baseY + (idx % 2 === 0 ? -archY * 0.45 : archY * 0.65),
    };
  }

  let activeStrokePrefix = null;
  let activeStrokeCount = 1;

  stageWrap.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    ensureAudio();
    try { stageWrap.setPointerCapture(e.pointerId); } catch (_) {}

    const rect = stageWrap.getBoundingClientRect();
    const bx = e.clientX - rect.left;
    const by = e.clientY - rect.top;
    state.lastCursorX = bx;
    state.lastCursorY = by;

    const count = e.button === 2 ? Math.max(2, state.touchBrushCount) : state.touchBrushCount;
    activeStrokeCount = count;
    activeStrokePrefix = `vm_${Date.now()}_${e.pointerId}_`;
    const phase = performance.now() * 0.001;
    const baseColor = pickNextColor(0);

    for (let k = 0; k < count; k++) {
      const pt = computeBrushPoint(bx, by, k, count, phase);
      const cIdx = state.colorMode === 'rainbow' ? (baseColor + k) % 10 : parseInt(state.colorMode, 10);
      onFingerDown(activeStrokePrefix + k, pt.x, pt.y, cIdx, k > 3);
      if (k > 3) {
        const f = state.fingers.get(activeStrokePrefix + k);
        if (f) setTimeout(() => playColorTapSound(f.noteInfo, cIdx, count, 0.85), k * 18);
      }
    }
  });

  stageWrap.addEventListener('pointermove', (e) => {
    const rect = stageWrap.getBoundingClientRect();
    const bx = e.clientX - rect.left;
    const by = e.clientY - rect.top;
    state.lastCursorX = bx;
    state.lastCursorY = by;

    if (!activeStrokePrefix) return;
    const phase = performance.now() * 0.001;
    for (let k = 0; k < activeStrokeCount; k++) {
      const pt = computeBrushPoint(bx, by, k, activeStrokeCount, phase);
      onFingerMove(activeStrokePrefix + k, pt.x, pt.y);
    }
  });

  function endVmPointer() {
    if (!activeStrokePrefix) return;
    const prefix = activeStrokePrefix;
    const count = activeStrokeCount;
    activeStrokePrefix = null;
    for (let k = 0; k < count; k++) {
      onFingerUp(prefix + k, count === 1);
    }
  }
  stageWrap.addEventListener('pointerup', endVmPointer);
  stageWrap.addEventListener('pointercancel', endVmPointer);
  stageWrap.addEventListener('contextmenu', (e) => e.preventDefault());

  stageWrap.addEventListener('wheel', (e) => {
    e.preventDefault();
    ensureAudio();
    const rect = stageWrap.getBoundingClientRect();
    const cx = e.clientX ? e.clientX - rect.left : state.lastCursorX;
    const cy = e.clientY ? e.clientY - rect.top : state.lastCursorY;

    if (!state.fingers.has('crd2_a')) {
      state.wheelX = cx;
      state.wheelY = cy;
      const cA = pickNextColor(0);
      onFingerDown('crd2_a', cx - 42, cy, cA, false);
      onFingerDown('crd2_b', cx + 42, cy, (cA + 1) % 10, false);
    } else {
      state.wheelX = Math.max(40, Math.min(state.viewW - 40, state.wheelX - e.deltaX * 0.65));
      state.wheelY = Math.max(30, Math.min(state.viewH - 30, state.wheelY - e.deltaY * 0.65));
      const t = performance.now() * 0.004;
      const sep = 44 + Math.sin(t) * 18;
      onFingerMove('crd2_a', state.wheelX - sep, state.wheelY + Math.cos(t) * 12);
      onFingerMove('crd2_b', state.wheelX + sep, state.wheelY - Math.cos(t) * 12);
    }

    if (state.wheelTimer) clearTimeout(state.wheelTimer);
    state.wheelTimer = setTimeout(() => {
      finalizeFingerUp('crd2_a');
      finalizeFingerUp('crd2_b');
    }, 260);
  }, { passive: false });

  window.addEventListener('keydown', (e) => {
    if (e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.target && (e.target.tagName === 'SELECT' || e.target.tagName === 'INPUT')) return;
    const k = e.key.toLowerCase();
    const mapped = KEY_MAP.get(k);
    if (!mapped) return;
    e.preventDefault();
    ensureAudio();
    const cIdx = state.colorMode === 'rainbow' ? mapped.colorIdx : parseInt(state.colorMode, 10);
    onFingerDown('key_' + k, mapped.xFrac * state.viewW, mapped.yFrac * state.viewH, cIdx, false);
  });

  window.addEventListener('keyup', (e) => {
    const k = e.key.toLowerCase();
    if (KEY_MAP.has(k)) finalizeFingerUp('key_' + k);
  });

  // -------------------------------------------------------------------------
  // VM-Turbo Renderer: Skyline FFT + Kaleidoscope Lasers + Cyber Reticles!
  // -------------------------------------------------------------------------
  function strokeTransformedPath(pts, flipX, flipY, w, h) {
    if (pts.length < 2) return;
    const tx = (px) => (flipX ? w - px : px);
    const ty = (py) => (flipY ? h - py : py);
    c.beginPath();
    c.moveTo(tx(pts[0].x), ty(pts[0].y));
    for (let i = 1; i < pts.length - 1; i++) {
      const mx = (tx(pts[i].x) + tx(pts[i + 1].x)) * 0.5;
      const my = (ty(pts[i].y) + ty(pts[i + 1].y)) * 0.5;
      c.quadraticCurveTo(tx(pts[i].x), ty(pts[i].y), mx, my);
    }
    c.lineTo(tx(pts[pts.length - 1].x), ty(pts[pts.length - 1].y));
    c.stroke();
  }

  function renderLoop(nowMs) {
    if (nowMs - state.lastFrameMs < FRAME_BUDGET_MS) {
      requestAnimationFrame(renderLoop);
      return;
    }
    state.lastFrameMs = nowMs;

    const w = state.viewW;
    const h = state.viewH;
    const fadeMs = 1350;

    c.globalCompositeOperation = 'source-over';
    c.globalAlpha = 1;
    c.fillStyle = '#03040a';
    c.fillRect(0, 0, w, h);

    if (state.bgPulse > 0.02) state.bgPulse *= 0.84;
    else state.bgPulse = 0;

    if (state.bgPulse > 0.02) {
      c.fillStyle = `rgba(255, 0, 85, ${0.048 * state.bgPulse})`;
      c.fillRect(0, 0, w, h);
    }

    // Cyberpunk Perspective Grid Columns
    const cols = CYBER_SCALE.length;
    c.strokeStyle = `rgba(252, 238, 10, ${0.04 + state.bgPulse * 0.08})`;
    c.lineWidth = 1;
    c.beginPath();
    for (let i = 1; i < cols; i++) {
      const gx = (w * i) / cols;
      c.moveTo(gx, 0);
      c.lineTo(gx, h);
    }
    c.stroke();

    // Feature #3: Live 32-Bar Rainbow Neon Night-City Audio Spectrum Skyline!
    let fftEnergy = 0;
    if (state.analyser) {
      state.analyser.getByteFrequencyData(state.fftData);
      const bins = 28;
      const barW = w / bins;
      for (let i = 0; i < bins; i++) {
        const val = state.fftData[i] / 255;
        fftEnergy += val;
        const barH = val * (h * 0.34);
        if (barH > state.skylinePeaks[i]) state.skylinePeaks[i] = barH;
        else state.skylinePeaks[i] = Math.max(0, state.skylinePeaks[i] - 2.2);

        const pal = FINGER_COLORS[i % 10];
        const bx = i * barW + 2;
        const bw = Math.max(3, barW - 4);

        if (barH > 2) {
          c.globalAlpha = 0.28 + val * 0.42;
          c.fillStyle = pal.primary;
          c.fillRect(bx, h - barH, bw, barH);
        }
        if (state.skylinePeaks[i] > 3) {
          c.globalAlpha = 0.9;
          c.fillStyle = '#fcee0a';
          c.fillRect(bx, h - state.skylinePeaks[i] - 3, bw, 2.5);
        }
      }
    }

    const activeArr = Array.from(state.fingers.values());
    const colW = w / cols;
    for (let i = 0; i < activeArr.length; i++) {
      const f = activeArr[i];
      c.fillStyle = f.pal.primary;
      c.globalAlpha = 0.065;
      c.fillRect(f.noteInfo.col * colW, 0, colW, h);
    }

    c.globalCompositeOperation = 'lighter';
    c.lineCap = 'round';
    c.lineJoin = 'round';

    // Constellation Laser Web
    if (activeArr.length >= 2) {
      c.lineWidth = 1.6;
      for (let i = 0; i < activeArr.length; i++) {
        for (let j = i + 1; j < activeArr.length; j++) {
          c.globalAlpha = 0.28;
          c.strokeStyle = activeArr[i].pal.primary;
          c.beginPath();
          c.moveTo(activeArr[i].x, activeArr[i].y);
          c.lineTo(activeArr[j].x, activeArr[j].y);
          c.stroke();
        }
      }
    }

    // Ephemeral Neon Ribbons (+ Kaleidoscope 2X / 4X Symmetrical Lasers!)
    for (let i = state.trails.length - 1; i >= 0; i--) {
      const tr = state.trails[i];
      const pts = tr.points;
      while (pts.length > 0 && nowMs - pts[0].t > fadeMs) pts.shift();
      if (pts.length === 0) {
        if (!tr.active) state.trails.splice(i, 1);
        continue;
      }

      const life = Math.max(0.05, 1 - (nowMs - pts[pts.length - 1].t) / fadeMs);
      if (pts.length === 1) {
        const sprite = GLOW_SPRITES[tr.colorIdx];
        c.globalAlpha = life;
        const sz = 46 * life + 10;
        c.drawImage(sprite, pts[0].x - sz * 0.5, pts[0].y - sz * 0.5, sz, sz);
        continue;
      }

      const mirrors = state.mirrorMode === 4
        ? [[false, false, 0], [true, false, 3], [false, true, 5], [true, true, 7]]
        : (state.mirrorMode === 2 ? [[false, false, 0], [true, false, 3]] : [[false, false, 0]]);

      for (let m = 0; m < mirrors.length; m++) {
        const [fx, fy, cOff] = mirrors[m];
        const mPal = FINGER_COLORS[(tr.colorIdx + cOff) % 10];
        c.strokeStyle = mPal.primary;
        c.globalAlpha = (m === 0 ? 0.65 : 0.48) * life;
        c.lineWidth = (m === 0 ? 11 : 8) * life + 2;
        strokeTransformedPath(pts, fx, fy, w, h);

        c.strokeStyle = '#ffffff';
        c.globalAlpha = (m === 0 ? 0.84 : 0.6) * life;
        c.lineWidth = 2.4 * life + 0.5;
        strokeTransformedPath(pts, fx, fy, w, h);
      }
    }

    // Concentric Neon Tap Shockwaves
    for (let i = state.tapRings.length - 1; i >= 0; i--) {
      const r = state.tapRings[i];
      r.r += r.speed;
      const prog = r.r / r.maxR;
      if (prog >= 1) {
        state.tapRings.splice(i, 1);
        continue;
      }
      const life = 1 - prog;
      c.strokeStyle = r.color;
      c.globalAlpha = life * 0.86;
      c.lineWidth = Math.max(1.2, r.width * life * 1.4);
      c.beginPath();
      c.arc(r.x, r.y, r.r, 0, Math.PI * 2);
      c.stroke();
    }

    // Feature #9: Rotating Cyberpunk Diamond Target Reticles!
    for (let i = state.reticles.length - 1; i >= 0; i--) {
      const rt = state.reticles[i];
      rt.size += 3.2;
      rt.angle += 0.08;
      const prog = rt.size / rt.maxSize;
      if (prog >= 1) {
        state.reticles.splice(i, 1);
        continue;
      }
      c.save();
      c.translate(rt.x, rt.y);
      c.rotate(rt.angle + Math.PI * 0.25);
      c.strokeStyle = rt.color;
      c.globalAlpha = (1 - prog) * 0.85;
      c.lineWidth = 2.0;
      c.strokeRect(-rt.size * 0.5, -rt.size * 0.5, rt.size, rt.size);
      c.restore();
    }

    // Active Fingertip Neon Orbs
    c.font = 'bold 11px ui-monospace, monospace';
    for (let i = 0; i < activeArr.length; i++) {
      const f = activeArr[i];
      const sprite = GLOW_SPRITES[f.colorIdx];
      c.globalAlpha = f.releaseTimer ? 0.65 : 0.96;
      c.drawImage(sprite, f.x - 35, f.y - 35, 70, 70);

      c.strokeStyle = f.pal.primary;
      c.lineWidth = 2.2;
      c.beginPath();
      c.arc(f.x, f.y, f.isLine ? 22 : 16, 0, Math.PI * 2);
      c.stroke();

      c.fillStyle = f.pal.primary;
      c.fillText(`${f.pal.name}`, f.x + 22, f.y + 4);
    }

    // Ephemeral Sparks
    for (let i = state.sparks.length - 1; i >= 0; i--) {
      const sp = state.sparks[i];
      sp.x += sp.vx;
      sp.y += sp.vy;
      sp.life -= 0.048;
      if (sp.life <= 0) {
        state.sparks.splice(i, 1);
        continue;
      }
      c.globalAlpha = sp.life;
      c.fillStyle = sp.color;
      c.fillRect(sp.x - sp.size * 0.5, sp.y - sp.size * 0.5, sp.size, sp.size);
    }

    // Floating Note Callouts
    for (let i = state.noteFloats.length - 1; i >= 0; i--) {
      const nf = state.noteFloats[i];
      nf.y -= 1.2;
      nf.life -= 0.032;
      if (nf.life <= 0) {
        state.noteFloats.splice(i, 1);
        continue;
      }
      c.globalAlpha = nf.life;
      c.fillStyle = nf.color;
      c.fillText(nf.text, nf.x - 16, nf.y);
    }

    // Holographic Center-Stage Cyberpunk Callout Banner (Vocoder / Scene Drops!)
    if (state.hudBannerFlash) {
      const hb = state.hudBannerFlash;
      hb.life -= 0.028;
      if (hb.life <= 0) {
        state.hudBannerFlash = null;
      } else {
        c.globalAlpha = hb.life;
        c.fillStyle = hb.color;
        c.font = '900 24px ui-monospace, monospace';
        c.textAlign = 'center';
        c.fillText(hb.text, w * 0.5, h * 0.48);
        c.textAlign = 'start';
      }
    }

    const deckRunning = needsClock() || fftEnergy > 0.05;
    const stillBusy =
      deckRunning ||
      state.fingers.size > 0 ||
      state.trails.length > 0 ||
      state.tapRings.length > 0 ||
      state.reticles.length > 0 ||
      state.sparks.length > 0 ||
      state.noteFloats.length > 0 ||
      state.hudBannerFlash !== null ||
      state.bgPulse > 0.02;

    if (stillBusy) {
      requestAnimationFrame(renderLoop);
    } else {
      state.animActive = false;
    }
  }

  wakeRenderer();
})();
