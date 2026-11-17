import { MusicTrackId } from "@/types/wedding";

export const TRACK_WAV_MAP: Record<Exclude<MusicTrackId, "custom">, string> = {
  "urang-minang-baralek": "/audio/urang-minang-baralek-gadang.m4a",
  "talempong-baralek": "/audio/talempong-pacik.wav",
  "saluang-bansi": "/audio/saluang-bansi.wav",
  "rabab-pasisia": "/audio/rabab-pasisia.wav",
  "sarunai-aleknagari": "/audio/sarunai-aleknagari.wav",
  "badindin-baralek": "/audio/badindin-baralek.wav",
  "minang-romantis": "/audio/saluang-bansi.wav",
};

/**
 * Plays authentic Minangkabau traditional instrument tracks from local WAV files
 * (/audio/*.wav) with an automatic Web Audio API pentatonic synthesizer fallback.
 */
export class MinangAudioPlayer {
  private audioCtx: AudioContext | null = null;
  private htmlAudio: HTMLAudioElement | null = null;
  private timer: ReturnType<typeof setInterval> | null = null;
  private step = 0;
  private playing = false;
  private activeTrack: MusicTrackId = "urang-minang-baralek";
  private customUrl = "";

  private readonly melodies: Record<Exclude<MusicTrackId, "custom">, number[]> = {
    "urang-minang-baralek": [
      392.0, 440.0, 523.25, 587.33, 523.25, 440.0, 392.0, 329.63,
      392.0, 523.25, 659.25, 587.33, 523.25, 440.0, 392.0, 293.66,
    ],
    "talempong-baralek": [
      392.0, 440.0, 523.25, 587.33, 523.25, 440.0, 392.0, 329.63,
      392.0, 523.25, 659.25, 587.33, 523.25, 440.0, 392.0, 293.66,
    ],
    "saluang-bansi": [
      293.66, 349.23, 392.0, 440.0, 523.25, 440.0, 392.0, 349.23,
      293.66, 392.0, 440.0, 392.0, 349.23, 293.66, 261.63, 293.66,
    ],
    "rabab-pasisia": [
      329.63, 392.0, 440.0, 493.88, 587.33, 493.88, 440.0, 392.0,
      329.63, 440.0, 493.88, 587.33, 659.25, 587.33, 440.0, 329.63,
    ],
    "sarunai-aleknagari": [
      261.63, 293.66, 349.23, 392.0, 440.0, 523.25, 440.0, 392.0,
      349.23, 293.66, 349.23, 392.0, 440.0, 392.0, 293.66, 261.63,
    ],
    "badindin-baralek": [
      392.0, 493.88, 587.33, 659.25, 587.33, 493.88, 587.33, 783.99,
      659.25, 587.33, 493.88, 440.0, 493.88, 587.33, 440.0, 392.0,
    ],
    "minang-romantis": [
      261.63, 329.63, 392.0, 523.25, 440.0, 392.0, 329.63, 293.66,
      261.63, 392.0, 440.0, 523.25, 587.33, 523.25, 440.0, 392.0,
    ],
  };

  public configure(trackId: MusicTrackId, customAudioUrl: string) {
    const changed =
      this.activeTrack !== trackId || this.customUrl !== customAudioUrl;
    this.activeTrack = trackId;
    this.customUrl = customAudioUrl;
    if (changed && this.playing) {
      this.stop();
      this.play();
    }
  }

  public isPlaying() {
    return this.playing;
  }

  public getActiveTrack() {
    return this.activeTrack;
  }

  public play() {
    if (this.playing) return;
    this.playing = true;

    const audioSrc =
      this.activeTrack === "custom"
        ? this.customUrl
        : TRACK_WAV_MAP[this.activeTrack] || "/audio/talempong-pacik.wav";

    if (audioSrc && typeof window !== "undefined") {
      try {
        this.htmlAudio = new Audio(audioSrc);
        this.htmlAudio.loop = true;
        this.htmlAudio.volume = 0.55;
        void this.htmlAudio.play().catch(() => {
          this.startSynth();
        });
        return;
      } catch {
        this.startSynth();
        return;
      }
    }

    this.startSynth();
  }

  private startSynth() {
    if (typeof window === "undefined") return;
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return;

    if (!this.audioCtx) {
      this.audioCtx = new AudioCtx();
    }
    if (this.audioCtx.state === "suspended") {
      void this.audioCtx.resume();
    }

    const playNote = () => {
      if (!this.audioCtx || !this.playing) return;
      const trackKey =
        this.activeTrack === "custom" ? "talempong-baralek" : this.activeTrack;
      const seq = this.melodies[trackKey] || this.melodies["talempong-baralek"];
      const freq = seq[this.step % seq.length];
      this.step += 1;

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const harmonic = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      if (trackKey === "saluang-bansi" || trackKey === "rabab-pasisia") {
        osc.type = "sine";
        harmonic.type = "triangle";
        osc.frequency.setValueAtTime(freq, now);
        harmonic.frequency.setValueAtTime(freq * 2, now);
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.055, now + 0.16);
        gain.gain.exponentialRampToValueAtTime(0.0008, now + 1.05);
      } else {
        osc.type = "triangle";
        harmonic.type = "sine";
        osc.frequency.setValueAtTime(freq, now);
        harmonic.frequency.setValueAtTime(freq * 2.01, now);
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.06, now + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0006, now + 1.15);
      }

      const harmGain = this.audioCtx.createGain();
      harmGain.gain.value = 0.24;

      osc.connect(gain);
      harmonic.connect(harmGain);
      harmGain.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      harmonic.start(now);
      osc.stop(now + 1.2);
      harmonic.stop(now + 1.2);
    };

    playNote();
    const intervalMs = this.activeTrack === "saluang-bansi" ? 900 : 620;
    this.timer = setInterval(playNote, intervalMs);
  }

  public stop() {
    this.playing = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if (this.htmlAudio) {
      this.htmlAudio.pause();
      this.htmlAudio = null;
    }
  }

  public toggle(): boolean {
    if (this.playing) {
      this.stop();
    } else {
      this.play();
    }
    return this.playing;
  }
}

export const MUSIC_TRACK_OPTIONS: {
  id: MusicTrackId;
  label: string;
  instrumentTag: string;
  subtitle: string;
}[] = [
  {
    id: "urang-minang-baralek",
    label: "Urang Minang Baralek Gadang (Randy Chow ft. Yeyen Zymra)",
    instrumentTag: "Lagu Utama Baralek Gadang",
    subtitle: "Lagu pernikahan adat Minang asli (Sarai Sarumpun Official)",
  },
  {
    id: "talempong-baralek",
    label: "Talempong Pacik & Gandang Tasa",
    instrumentTag: "Ansambel Baralek Gadang",
    subtitle: "Tabuhan talempong kuningan interlocking, aguang & gandang penyambut pengantin",
  },
  {
    id: "saluang-bansi",
    label: "Saluang Darek & Bansi Pesisir",
    instrumentTag: "Suling Bambu Talang & Kecapi",
    subtitle: "Tiupan saluang 4 lubang & bansi 7 lubang yang syahdu khas ranah Minang",
  },
  {
    id: "rabab-pasisia",
    label: "Rabab Pasisia & Kaba Malam",
    instrumentTag: "Biola Tradisional Minang",
    subtitle: "Gesekan rabab klasik yang hangat dan romantis pengiring malam bainai",
  },
  {
    id: "sarunai-aleknagari",
    label: "Sarunai Padi & Talempong Kayu",
    instrumentTag: "Alek Nagari Tradisional",
    subtitle: "Alunan sarunai daun padi berpadu ketukan talempong kayu kampung halaman",
  },
  {
    id: "badindin-baralek",
    label: "Irama Badindin & Denting Tari Piring",
    instrumentTag: "Perayaan Resepsi Meriah",
    subtitle: "Ritme ceria bertempo hidup dengan aksen denting cincin piring adat Minang",
  },
  {
    id: "custom",
    label: "Audio Kustom (Upload MP3 / URL)",
    instrumentTag: "File Pilihan Sendiri",
    subtitle: "Gunakan rekaman atau lagu MP3 pilihan Anda sendiri",
  },
];
