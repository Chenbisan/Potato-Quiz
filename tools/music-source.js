// Potato Quiz music source — NOT loaded by the game.
// The game plays music/lounge.m4a and music/gameshow.m4a. They were made from this generator (the game's built-in
// music up to 4.1.2): render one pass of each pattern in an OfflineAudioContext (voices -> 3.2 kHz lowpass, hats
// straight out), fold the tails that ring past the end back onto the start so it loops seamlessly, normalize to -1 dB,
// and save [last 1 s of the loop] + loop + [first 1 s of the loop] (44.1 kHz mono). Then encode:
//   afconvert -f m4af -d aac -b 96000 -q 127 lounge.wav lounge.m4a
// Loop lengths: lounge 256 eighth notes at 84 bpm (4,032,000 samples), gameshow 64 eighth notes at 116 bpm (729,931 samples).
// In index.html, MUSIC_STYLES[style].gain = 1 / the normalize factor, so playback matches the old level.
// Helpers expect globals audioCtx and audioBus = { musicIn: <lowpass node>, music: <output node> }.

// Background music is composed on the fly (no audio files): a few soft synth voices on a step sequencer.
// Plays on the host only, never on a player's phone.
const midi = n => 440 * 2 ** ((n - 69) / 12);
function mNote(n, t, dur, { type = 'sine', vol = .1, attack = .01 } = {}) {
  const o = audioCtx.createOscillator(), g = audioCtx.createGain();
  o.type = type; o.frequency.value = midi(n);
  g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + attack); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
  o.connect(g); g.connect(audioBus.musicIn); o.start(t); o.stop(t + dur + .05);
}
function mKeys(n, t, dur, vol) { mNote(n, t, dur, { vol, attack: .012 }); mNote(n + 12, t, dur * .6, { vol: vol * .25, attack: .008 }); } // electric-piano-ish
let noiseBuf = null;
function mHat(t, vol = .025) {
  noiseBuf ??= (() => { const b = audioCtx.createBuffer(1, audioCtx.sampleRate * .1, audioCtx.sampleRate), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; return b; })();
  const src = audioCtx.createBufferSource(), hp = audioCtx.createBiquadFilter(), g = audioCtx.createGain();
  src.buffer = noiseBuf; hp.type = 'highpass'; hp.frequency.value = 7000;
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + .05);
  src.connect(hp); hp.connect(g); g.connect(audioBus.music); src.start(t); src.stop(t + .06); // skips the lowpass so it stays crisp
}
function mKick(t, vol = .22) {
  const o = audioCtx.createOscillator(), g = audioCtx.createGain();
  o.frequency.setValueAtTime(120, t); o.frequency.exponentialRampToValueAtTime(45, t + .15);
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + .2);
  o.connect(g); g.connect(audioBus.musicIn); o.start(t); o.stop(t + .25);
}
const seeded = n => { const x = Math.sin(n * 12.9898) * 43758.5453; return x - Math.floor(x); }; // same "random" melody every loop
const MUSIC_STYLES = {
  // mellow elevator jazz: ii–V turnarounds, soft keys, walking-ish bass, brushed hats, a wandering vibraphone
  lounge: { name: '🛗 Lounge', bpm: 84, bars: [
      { c: [57, 60, 64, 65], b: 41 }, { c: [55, 59, 62, 64], b: 40 }, { c: [53, 57, 60, 62], b: 38 }, { c: [53, 55, 59, 62], b: 43 },
      { c: [52, 55, 59, 60], b: 36 }, { c: [55, 57, 61, 64], b: 45 }, { c: [53, 57, 60, 62], b: 38 }, { c: [53, 55, 59, 62], b: 43 }],
    play(step, t, e) { // e = one eighth note in seconds
      const bar = this.bars[Math.floor(step / 8) % this.bars.length], i = step % 8;
      if (i === 0) bar.c.forEach(n => mKeys(n, t, e * 7.5, .035));
      if (i === 5) bar.c.slice(1).forEach(n => mKeys(n, t, e * 2, .022));
      if (i % 2 === 0) mNote(bar.b + (i === 4 ? 7 : i === 6 ? 12 : i === 2 ? 4 : 0), t, e * 1.8, { type: 'triangle', vol: .16, attack: .02 });
      if (i % 2 === 1) mHat(t, .014);
      if ([2, 3, 6].includes(i) && seeded(step) > .45) mNote(bar.c[Math.floor(seeded(step + 7) * 4)] + 12, t, e * 3, { type: 'triangle', vol: .05, attack: .005 });
    } },
  // upbeat game-show: I–vi–IV–V, bouncy bass, off-beat piano stabs, bell arpeggios, light kick
  gameshow: { name: '🎤 Game show', bpm: 116, bars: [
      { c: [60, 64, 67], b: 36 }, { c: [57, 60, 64], b: 45 }, { c: [53, 57, 60], b: 41 }, { c: [55, 59, 62], b: 43 }],
    play(step, t, e) {
      const bar = this.bars[Math.floor(step / 8) % this.bars.length], i = step % 8;
      if (i % 2 === 0) mNote(bar.b + (i % 4 === 2 ? 12 : 0), t, e * .9, { type: 'triangle', vol: .17, attack: .01 });
      if (i % 2 === 1) { bar.c.forEach(n => mKeys(n, t, e * .7, .03)); mHat(t, .018); }
      if (i === 0 || i === 4) mKick(t, .16);
      const arp = [...bar.c, bar.c[0] + 12]; if (Math.floor(step / 32) % 2 === 1) mNote(arp[i % 4] + 12, t, e * 1.2, { type: 'sine', vol: .045, attack: .004 });
    } },
};
