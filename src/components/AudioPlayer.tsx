import { useState, useRef, useEffect } from "react";
import { Music, Volume2, VolumeX, Sparkles } from "lucide-react";

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const filtersRef = useRef<BiquadFilterNode[]>([]);

  // Simple, luxurious ambient sound generator using Web Audio API
  const startAmbientSynth = () => {
    try {
      // Create audio context
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      // Master Gain
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume, ctx.currentTime);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      // Create a lush, low-pass filtered drone
      const baseNotes = [110, 165, 220, 330]; // A luxury A-minor chord pad (A2, E3, A3, E4)
      baseNotes.forEach((frequency, idx) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        // Soft triangle wave for a smooth meditative tone
        osc.type = "triangle";
        osc.frequency.setValueAtTime(frequency, ctx.currentTime);

        // Slow subtle pitch modulation (vibrato) for organic warmth
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.value = 0.15 + idx * 0.05;
        lfoGain.gain.value = 1.2;
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start();

        // Low pass filter to keep it extremely deep, soft, and unobtrusive
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(320 + idx * 80, ctx.currentTime);
        filter.Q.value = 1;

        // Animate the filter frequency over time to create an ocean-wave sweeping effect
        const sweepFilter = () => {
          if (ctx.state === "closed") return;
          const now = ctx.currentTime;
          filter.frequency.exponentialRampToValueAtTime(
            220 + Math.random() * 240,
            now + 8 + Math.random() * 8
          );
          setTimeout(sweepFilter, 12000 + Math.random() * 6000);
        };
        setTimeout(sweepFilter, 2000);

        // Set low gain so it's a gentle whisper
        oscGain.gain.setValueAtTime(0.04, ctx.currentTime);

        // Wave-like breathing gain automation
        const breathGain = () => {
          if (ctx.state === "closed") return;
          const now = ctx.currentTime;
          const nextVal = 0.02 + Math.random() * 0.05;
          oscGain.gain.linearRampToValueAtTime(nextVal, now + 4 + Math.random() * 4);
          setTimeout(breathGain, 7000 + Math.random() * 4000);
        };
        setTimeout(breathGain, 1000);

        // Connections
        osc.connect(filter);
        filter.connect(oscGain);
        oscGain.connect(masterGain);

        osc.start();

        oscillatorsRef.current.push(osc);
        filtersRef.current.push(filter);
      });

      setIsPlaying(true);
    } catch (e) {
      console.error("Failed to initialize custom luxury synth player:", e);
    }
  };

  const stopAmbientSynth = () => {
    oscillatorsRef.current.forEach((osc) => {
      try {
        osc.stop();
      } catch (err) {}
    });
    oscillatorsRef.current = [];
    filtersRef.current = [];

    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    setIsPlaying(false);
  };

  const togglePlayback = () => {
    if (isPlaying) {
      stopAmbientSynth();
    } else {
      startAmbientSynth();
    }
  };

  // Sync volume slider changes to audio context
  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.linearRampToValueAtTime(volume, audioCtxRef.current.currentTime + 0.1);
    }
  }, [volume]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      oscillatorsRef.current.forEach((osc) => {
        try {
          osc.stop();
        } catch (err) {}
      });
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  return (
    <div
      id="customAudioController"
      className="flex items-center gap-3 rounded-full border border-neutral-800 bg-neutral-950/75 p-2 px-4 shadow-xl backdrop-blur-md transition-all duration-300 hover:border-amber-500/50"
    >
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes soundwave {
          0%, 100% { height: 3px; }
          50% { height: 14px; }
        }
        .wave-bar {
          display: inline-block;
          width: 2px;
          background-color: #f59e0b;
          border-radius: 1px;
          animation: soundwave 1.2s ease-in-out infinite;
        }
        .wave-bar:nth-child(1) { animation-delay: 0.1s; }
        .wave-bar:nth-child(2) { animation-delay: 0.3s; }
        .wave-bar:nth-child(3) { animation-delay: 0.6s; }
        .wave-bar:nth-child(4) { animation-delay: 0.2s; }
        .wave-bar:nth-child(5) { animation-delay: 0.4s; }
      `}} />
      <button
        onClick={togglePlayback}
        className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 ${
          isPlaying ? "bg-amber-500 text-neutral-950 shadow-lg shadow-amber-500/20" : "bg-neutral-900 text-amber-500/80 hover:bg-neutral-800"
        }`}
        title={isPlaying ? "Mute Colombo Lounge drone" : "Play Colombo Lounge drone"}
      >
        {isPlaying ? <Music className="h-4 w-4 animate-spin" style={{ animationDuration: "12s" }} /> : <VolumeX className="h-4 w-4" />}
      </button>

      {isPlaying && (
        <div className="flex items-center gap-2 animate-fade-in">
          {/* Pulsing soundwave */}
          <div className="flex items-end gap-0.5 h-4 px-1 flex-none">
            <div className="wave-bar" />
            <div className="wave-bar" />
            <div className="wave-bar" />
            <div className="wave-bar" />
            <div className="wave-bar" />
          </div>
          
          <Volume2 className="h-3 w-3 text-neutral-400" />
          <input
            type="range"
            min="0"
            max="0.8"
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="h-1 w-16 cursor-pointer appearance-none rounded-lg bg-neutral-800 accent-amber-500 outline-none"
          />
          <span className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider text-amber-500">
            <Sparkles className="h-2 w-2 animate-pulse" /> Colombo Lounge
          </span>
        </div>
      )}
      {!isPlaying && (
        <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-400">
          Soundtrack Offline
        </span>
      )}
    </div>
  );
}
