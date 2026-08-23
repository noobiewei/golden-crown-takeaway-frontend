// Synthesizes a short two-tone chime with the Web Audio API — no external
// audio file needed, works the same everywhere.
export function playNewOrderChime() {
  const ctx = new AudioContext();
  const now = ctx.currentTime;

  [880, 1108.73].forEach((frequency, i) => {
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.frequency.value = frequency;
    const start = now + i * 0.15;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.25, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25);

    oscillator.start(start);
    oscillator.stop(start + 0.25);
  });
}
