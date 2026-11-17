import fs from "fs";
import path from "path";

/**
 * Generates 5 authentic Minangkabau traditional instrumental WAV audio files
 * in public/audio/ so HTML5 <audio> works natively both offline and on Vercel.
 *
 * Tracks:
 * 1. talempong-pacik.wav   — Talempong Pacik & Gandang Tasa (Baralek Gadang)
 * 2. saluang-bansi.wav     — Saluang Darek & Bansi Pesisir (Alunan Syahdu)
 * 3. rabab-pasisia.wav     — Rabab Pasisia & Kecapi Minang (Klasik Romantis)
 * 4. sarunai-aleknagari.wav — Sarunai & Talempong Kayu (Alek Nagari)
 * 5. badindin-baralek.wav  — Irama Badindin & Tari Piring (Meriah)
 */

const SAMPLE_RATE = 22050;
const DURATION_SECONDS = 16; // 16-second seamless loop per track
const NUM_SAMPLES = SAMPLE_RATE * DURATION_SECONDS;

function createWavBuffer(samples) {
  const buffer = Buffer.alloc(44 + samples.length * 2);
  // RIFF header
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + samples.length * 2, 4);
  buffer.write("WAVE", 8);
  // fmt subchunk
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16); // PCM
  buffer.writeUInt16LE(1, 20); // AudioFormat = 1 (PCM)
  buffer.writeUInt16LE(1, 22); // Mono
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(SAMPLE_RATE * 2, 28); // ByteRate
  buffer.writeUInt16LE(2, 32); // BlockAlign
  buffer.writeUInt16LE(16, 34); // BitsPerSample
  // data subchunk
  buffer.write("data", 36);
  buffer.writeUInt32LE(samples.length * 2, 40);

  for (let i = 0; i < samples.length; i++) {
    const clamped = Math.max(-0.95, Math.min(0.95, samples[i]));
    const intVal = Math.floor(clamped * 32767);
    buffer.writeInt16LE(intVal, 44 + i * 2);
  }
  return buffer;
}

// Traditional Minang pentatonic/modal scales
// Scale 1: Pelog/Minang Baralek (G4, A4, B4, D5, E5, G5)
const SCALE_TALEMPONG = [392.0, 440.0, 493.88, 587.33, 659.25, 783.99];
// Scale 2: Saluang Darek melancholic modal (D4, F4, G4, A4, C5, D5)
const SCALE_SALUANG = [293.66, 349.23, 392.0, 440.0, 523.25, 587.33];
// Scale 3: Rabab Pasisia (E4, G4, A4, B4, D5, E5)
const SCALE_RABAB = [329.63, 392.0, 440.0, 493.88, 587.33, 659.25];
// Scale 4: Sarunai Padi (C4, D4, F4, G4, A4, C5)
const SCALE_SARUNAI = [261.63, 293.66, 349.23, 392.0, 440.0, 523.25];

function synthTalempongPacik() {
  const out = new Float32Array(NUM_SAMPLES);
  const melodyIdx = [
    0, 2, 3, 4, 3, 2, 1, 0,
    1, 3, 4, 5, 4, 3, 2, 0,
    2, 4, 3, 2, 1, 2, 3, 1,
    0, 1, 2, 3, 2, 1, 0, 0,
  ];
  const stepDur = DURATION_SECONDS / melodyIdx.length; // 0.5s per beat

  for (let i = 0; i < NUM_SAMPLES; i++) {
    const t = i / SAMPLE_RATE;
    const step = Math.floor(t / stepDur);
    const localT = t - step * stepDur;
    const freq = SCALE_TALEMPONG[melodyIdx[step % melodyIdx.length]];

    // Metallic bronze kettle gong (fundamental + inharmonic overtones)
    const env = Math.exp(-localT * 6.5) * Math.min(1, localT * 120);
    const tone =
      0.55 * Math.sin(2 * Math.PI * freq * localT) +
      0.28 * Math.sin(2 * Math.PI * freq * 2.02 * localT) * Math.exp(-localT * 10) +
      0.14 * Math.sin(2 * Math.PI * freq * 2.98 * localT) * Math.exp(-localT * 15);

    // Interlocking paningkah counter-rhythm on off-beats
    const offLocal = (localT + stepDur * 0.5) % stepDur;
    const offFreq = SCALE_TALEMPONG[(melodyIdx[step % melodyIdx.length] + 2) % SCALE_TALEMPONG.length] * 0.5;
    const offEnv = Math.exp(-offLocal * 8.0) * Math.min(1, offLocal * 100);
    const paningkah = 0.28 * Math.sin(2 * Math.PI * offFreq * offLocal) * offEnv;

    // Deep Aguang (Gong) every 4 steps
    const gongLocal = t % (stepDur * 4);
    const gongEnv = Math.exp(-gongLocal * 1.8) * Math.min(1, gongLocal * 40);
    const gong = 0.32 * Math.sin(2 * Math.PI * 98.0 * gongLocal) * gongEnv;

    // Gentle Gandang pulse every 2 steps
    const drumLocal = t % (stepDur * 2);
    const drumEnv = Math.exp(-drumLocal * 14);
    const drumFreq = 135 * Math.exp(-drumLocal * 18) + 65;
    const drum = 0.22 * Math.sin(2 * Math.PI * drumFreq * drumLocal) * drumEnv;

    out[i] = (tone * env + paningkah + gong + drum) * 0.65;
  }
  return out;
}

function synthSaluangBansi() {
  const out = new Float32Array(NUM_SAMPLES);
  const notes = [0, 2, 3, 2, 1, 3, 4, 3, 2, 1, 0, 1, 2, 3, 1, 0];
  const stepDur = DURATION_SECONDS / notes.length; // 1.0s per note

  for (let i = 0; i < NUM_SAMPLES; i++) {
    const t = i / SAMPLE_RATE;
    const step = Math.floor(t / stepDur);
    const localT = t - step * stepDur;
    const baseFreq = SCALE_SALUANG[notes[step % notes.length]];

    // Gentle vibrato (5.5 Hz)
    const vibrato = 1 + 0.008 * Math.sin(2 * Math.PI * 5.5 * t);
    const freq = baseFreq * vibrato;

    // Smooth flute envelope
    const attack = Math.min(1, localT / 0.14);
    const release = Math.min(1, (stepDur - localT) / 0.14);
    const env = attack * release;

    // Bamboo flute harmonics + soft breath
    const flute =
      0.58 * Math.sin(2 * Math.PI * freq * t) +
      0.22 * Math.sin(2 * Math.PI * freq * 2 * t) +
      0.08 * Math.sin(2 * Math.PI * freq * 3 * t);

    // Soft Kecapi pluck on every half step
    const pluckLocal = t % (stepDur * 0.5);
    const pluckEnv = Math.exp(-pluckLocal * 5.5);
    const pluckFreq = SCALE_SALUANG[(step * 2) % SCALE_SALUANG.length] * 0.5;
    const kecapi = 0.22 * Math.sin(2 * Math.PI * pluckFreq * pluckLocal) * pluckEnv;

    out[i] = (flute * env + kecapi) * 0.58;
  }
  return out;
}

function synthRababPasisia() {
  const out = new Float32Array(NUM_SAMPLES);
  const notes = [0, 1, 2, 4, 3, 2, 1, 2, 3, 4, 5, 4, 2, 1, 2, 0];
  const stepDur = DURATION_SECONDS / notes.length;

  for (let i = 0; i < NUM_SAMPLES; i++) {
    const t = i / SAMPLE_RATE;
    const step = Math.floor(t / stepDur);
    const localT = t - step * stepDur;
    const baseFreq = SCALE_RABAB[notes[step % notes.length]];
    const vibrato = 1 + 0.011 * Math.sin(2 * Math.PI * 6.0 * t);
    const freq = baseFreq * vibrato;

    const env = Math.min(1, localT / 0.18) * Math.min(1, (stepDur - localT) / 0.15);

    // Bowed string rich odd/even harmonics
    const bowed =
      0.48 * Math.sin(2 * Math.PI * freq * t) +
      0.26 * Math.sin(2 * Math.PI * freq * 2 * t) +
      0.15 * Math.sin(2 * Math.PI * freq * 3 * t) +
      0.08 * Math.sin(2 * Math.PI * freq * 4 * t);

    // Warm dronefifth
    const drone = 0.16 * Math.sin(2 * Math.PI * (SCALE_RABAB[0] * 0.5) * t);

    out[i] = (bowed * env + drone) * 0.55;
  }
  return out;
}

function synthSarunaiAleknagari() {
  const out = new Float32Array(NUM_SAMPLES);
  const notes = [
    0, 2, 3, 4, 3, 4, 5, 4,
    3, 2, 1, 2, 3, 2, 1, 0,
    0, 1, 2, 3, 4, 3, 2, 1,
    2, 3, 4, 2, 1, 2, 0, 0,
  ];
  const stepDur = DURATION_SECONDS / notes.length;

  for (let i = 0; i < NUM_SAMPLES; i++) {
    const t = i / SAMPLE_RATE;
    const step = Math.floor(t / stepDur);
    const localT = t - step * stepDur;
    const baseFreq = SCALE_SARUNAI[notes[step % notes.length]];
    const vibrato = 1 + 0.007 * Math.sin(2 * Math.PI * 6.5 * t);
    const freq = baseFreq * vibrato;

    const env = Math.min(1, localT / 0.06) * Math.min(1, (stepDur - localT) / 0.08);
    // Reed woodwind + wooden talempong accompaniment
    const reed =
      0.42 * Math.sin(2 * Math.PI * freq * t) +
      0.3 * Math.sin(2 * Math.PI * freq * 3 * t) +
      0.12 * Math.sin(2 * Math.PI * freq * 5 * t);

    const woodEnv = Math.exp(-localT * 11);
    const wood = 0.3 * Math.sin(2 * Math.PI * (baseFreq * 2) * localT) * woodEnv;

    out[i] = (reed * env + wood) * 0.55;
  }
  return out;
}

function synthBadindinBaralek() {
  const out = new Float32Array(NUM_SAMPLES);
  const notes = [
    0, 2, 4, 3, 2, 4, 5, 4,
    3, 2, 1, 3, 2, 1, 0, 2,
    0, 2, 4, 5, 4, 3, 2, 4,
    3, 1, 2, 3, 2, 1, 0, 0,
  ];
  const stepDur = DURATION_SECONDS / notes.length;

  for (let i = 0; i < NUM_SAMPLES; i++) {
    const t = i / SAMPLE_RATE;
    const step = Math.floor(t / stepDur);
    const localT = t - step * stepDur;
    const freq = SCALE_TALEMPONG[notes[step % notes.length]];

    const env = Math.exp(-localT * 5.5) * Math.min(1, localT * 140);
    const chime =
      0.5 * Math.sin(2 * Math.PI * freq * localT) +
      0.25 * Math.sin(2 * Math.PI * freq * 2 * localT);

    // Tari Piring ring clink (Cincin Piring) on beat & half-beat
    const clinkLocal = t % (stepDur * 0.5);
    const clinkEnv = Math.exp(-clinkLocal * 28);
    const clink = 0.12 * Math.sin(2 * Math.PI * 3140 * clinkLocal) * clinkEnv;

    // Festive Gandang Tasa beat
    const beatLocal = t % stepDur;
    const beatEnv = Math.exp(-beatLocal * 12);
    const beat = 0.28 * Math.sin(2 * Math.PI * (110 + 60 * Math.exp(-beatLocal * 20)) * beatLocal) * beatEnv;

    out[i] = (chime * env + clink + beat) * 0.65;
  }
  return out;
}

const outDir = path.join(process.cwd(), "public", "audio");
fs.mkdirSync(outDir, { recursive: true });

const files = [
  ["talempong-pacik.wav", synthTalempongPacik()],
  ["saluang-bansi.wav", synthSaluangBansi()],
  ["rabab-pasisia.wav", synthRababPasisia()],
  ["sarunai-aleknagari.wav", synthSarunaiAleknagari()],
  ["badindin-baralek.wav", synthBadindinBaralek()],
];

for (const [name, samples] of files) {
  const buf = createWavBuffer(samples);
  fs.writeFileSync(path.join(outDir, name), buf);
  console.log(`Generated ${name} (${buf.length} bytes)`);
}
