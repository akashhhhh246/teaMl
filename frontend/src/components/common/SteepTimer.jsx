import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, Thermometer, Droplets } from 'lucide-react';

export function SteepTimer({
  targetMinutes = 3,
  temperature = 85,
  waterRatio = '2.5g / 200ml',
  teaName = 'Artisan Tea',
}) {
  const totalSeconds = targetMinutes * 60;
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    setTimeLeft(targetMinutes * 60);
    setIsRunning(false);
    setIsFinished(false);
  }, [targetMinutes]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            setIsFinished(true);
            playChime();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, timeLeft]);

  // Synthesize peaceful singing-bowl chime via Web Audio API
  const playChime = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(528, ctx.currentTime); // 528Hz Solfeggio frequency for clarity
      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3.0);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 3.0);
    } catch (e) {
      console.log('Audio chime error:', e);
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progressPercent = ((totalSeconds - timeLeft) / totalSeconds) * 100;

  return (
    <div className="glass-card rounded-2xl p-6 border border-emerald-500/20 text-center relative overflow-hidden">
      {/* Background glow when finished */}
      {isFinished && (
        <div className="absolute inset-0 bg-emerald-500/10 dark:bg-emerald-500/20 animate-pulse pointer-events-none" />
      )}

      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
          <Volume2 className="w-3.5 h-3.5" /> Interactive Brewing Station
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          {teaName}
        </span>
      </div>

      {/* Circular Progress & Clock */}
      <div className="relative w-44 h-44 mx-auto my-3 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="42"
            className="stroke-slate-200 dark:stroke-slate-800"
            strokeWidth="6"
            fill="transparent"
          />
          <circle
            cx="50"
            cy="50"
            r="42"
            className="stroke-emerald-500 transition-all duration-1000 ease-linear"
            strokeWidth="6"
            strokeDasharray={264}
            strokeDashoffset={264 - (264 * progressPercent) / 100}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-3xl font-bold font-sans tracking-tight text-slate-900 dark:text-white">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-0.5">
            {isFinished ? '✨ Ready to pour' : isRunning ? 'Infusing...' : 'Steep Time'}
          </span>
        </div>
      </div>

      {/* Brewing Parameters Bar */}
      <div className="grid grid-cols-2 gap-2 my-4 bg-slate-100/70 dark:bg-slate-800/60 rounded-xl p-2.5 text-xs text-slate-700 dark:text-slate-300">
        <div className="flex items-center justify-center gap-1.5">
          <Thermometer className="w-4 h-4 text-amber-500" />
          <span><b>{temperature}°C</b> ({Math.round((temperature * 9) / 5 + 32)}°F)</span>
        </div>
        <div className="flex items-center justify-center gap-1.5 border-l border-slate-200 dark:border-slate-700">
          <Droplets className="w-4 h-4 text-sky-500" />
          <span><b>{waterRatio}</b></span>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-center gap-3 mt-4">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all shadow-md active:scale-95 ${
            isRunning
              ? 'bg-amber-500 hover:bg-amber-600 text-white'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
          }`}
        >
          {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isRunning ? 'Pause' : timeLeft === 0 ? 'Brew Again' : 'Start Steep'}
        </button>

        <button
          onClick={() => {
            setIsRunning(false);
            setTimeLeft(totalSeconds);
            setIsFinished(false);
          }}
          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors active:scale-95"
          title="Reset Timer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
