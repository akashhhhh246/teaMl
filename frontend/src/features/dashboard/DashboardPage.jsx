import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sun,
  Moon,
  Sparkles,
  Heart,
  History,
  Activity,
  Smile,
  Zap,
  Clock,
  Thermometer,
  ChevronRight,
} from 'lucide-react';
import { recommendationAPI, moodAPI, teasAPI } from '../../services/api';
import { useFavorites } from '../../context/FavoritesContext';
import { Badge } from '../../components/common/Badge';
import { TeaImage } from '../../components/common/TeaImage';

export function DashboardPage() {
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useFavorites();

  const [history, setHistory] = useState([]);
  const [moodLogs, setMoodLogs] = useState([]);
  const [dailyTea, setDailyTea] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mood Check-in Form State
  const [selectedMood, setSelectedMood] = useState('Calm');
  const [stress, setStress] = useState(4);
  const [energy, setEnergy] = useState(6);
  const [moodNote, setMoodNote] = useState('');
  const [moodLoggedSuccess, setMoodLoggedSuccess] = useState(false);

  const currentHour = new Date().getHours();
  const timeGreeting =
    currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const [historyRes, moodRes, featRes] = await Promise.all([
          recommendationAPI.getHistory().catch(() => ({ data: [] })),
          moodAPI.getHistory().catch(() => ({ data: [] })),
          teasAPI.getFeatured().catch(() => ({ data: [] })),
        ]);

        setHistory(historyRes.data || []);
        setMoodLogs(moodRes.data || []);

        const allFeat = featRes.data || [];
        if (allFeat.length > 0) {
          if (currentHour < 12) {
            setDailyTea(allFeat.find((t) => t.teaType === 'Assam' || t.caffeine >= 45) || allFeat[0]);
          } else if (currentHour < 18) {
            setDailyTea(allFeat.find((t) => t.teaType === 'Darjeeling' || t.teaType === 'Nilgiri') || allFeat[1]);
          } else {
            setDailyTea(allFeat.find((t) => t.teaType === 'Kashmir Kahwa' || t.teaType === 'Ayurvedic Tisane') || allFeat[2] || allFeat[0]);
          }
        }
      } catch (err) {
        console.error('Failed loading dashboard data', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [currentHour]);

  const handleLogMood = async (e) => {
    e.preventDefault();
    try {
      const res = await moodAPI.logMood({
        mood: selectedMood,
        stressLevel: stress,
        energyLevel: energy,
        note: moodNote.trim() || null,
      });

      setMoodLogs([res.data, ...moodLogs]);
      setMoodLoggedSuccess(true);
      setMoodNote('');
      setTimeout(() => setMoodLoggedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to log mood', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Welcome Hero Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-emerald-500/20 bg-gradient-to-r from-emerald-600/10 via-emerald-500/15 to-transparent relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              {currentHour < 18 ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-purple-400" />}
              <span>{timeGreeting}, Chai Connoisseur</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-sans">
              Your Personal Chai Diary & Sensory Sanctuary
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
              Track daily Ayurvedic mood check-ins, revisit past ML recommendation sessions, and steep saved Indian flushes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/quiz"
              className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 flex items-center gap-2 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>New AI Chai Quiz</span>
            </Link>
            <Link
              to="/assistant"
              className="px-5 py-3 rounded-2xl glass-card text-slate-700 dark:text-slate-200 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              AI Sommelier
            </Link>
          </div>
        </div>
      </div>

      {/* Grid: Daily Recommendation + Quick Mood Check-in */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Daily Tea Prescription Card */}
        {dailyTea && (
          <div className="lg:col-span-6 glass-card rounded-3xl p-6 sm:p-8 border border-emerald-500/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <Badge variant="amber">
                  {currentHour < 12 ? '☀️ Morning Kadak Chai' : currentHour < 18 ? '🍃 Afternoon Darjeeling' : '🌙 Evening Ayurvedic Restorative'}
                </Badge>
                <span className="text-xs text-slate-400 font-medium">Daily AI Chai Prescription</span>
              </div>

              <div className="flex gap-4 mt-2">
                <TeaImage
                  src={dailyTea.imageUrl}
                  alt={dailyTea.name}
                  category={dailyTea.teaType}
                  className="w-24 h-24 rounded-2xl flex-shrink-0 border border-white/20"
                />
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    <Link to={`/teas/${dailyTea.id}`}>{dailyTea.name}</Link>
                  </h3>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {dailyTea.origin} • {dailyTea.teaType}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300 mt-2">
                    <span className="flex items-center gap-1"><Thermometer className="w-3.5 h-3.5 text-amber-500" /> {dailyTea.steepTemperature}°C</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-emerald-500" /> {dailyTea.preparationTime}m</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 mt-4 leading-relaxed line-clamp-2">
                {dailyTea.description}
              </p>
            </div>

            <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                ₹{dailyTea.price} / 100g
              </span>
              <Link
                to={`/teas/${dailyTea.id}`}
                className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors flex items-center gap-1"
              >
                <span>Brew This Chai</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* Quick Mood Check-In Widget */}
        <div className="lg:col-span-6 glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/70 dark:border-slate-800/70">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Smile className="w-4 h-4 text-emerald-500" />
              <span>Daily Ayurvedic Mood Check-In</span>
            </h3>
            {moodLoggedSuccess && (
              <span className="text-xs font-bold text-emerald-500 animate-pulse">
                ✓ Synced to ML Profile!
              </span>
            )}
          </div>

          <form onSubmit={handleLogMood} className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {['Calm', 'Focused', 'Energetic', 'Relaxed', 'Meditative', 'Cozy'].map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => setSelectedMood(m)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedMood === m
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  <span>Stress / Vata: {stress}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={stress}
                  onChange={(e) => setStress(Number(e.target.value))}
                  className="w-full accent-rose-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  <span>Energy / Agni: {energy}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={energy}
                  onChange={(e) => setEnergy(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>
            </div>

            <input
              type="text"
              value={moodNote}
              onChange={(e) => setMoodNote(e.target.value)}
              placeholder="Add optional note (e.g. afternoon slump, monsoon rain chill)..."
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors"
            >
              Log Mood & Recalibrate Chai Match
            </button>
          </form>
        </div>
      </div>

      {/* Saved Favorites Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white font-sans flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              <span>Saved Indian Blends ({favorites.length})</span>
            </h3>
            <p className="text-xs text-slate-500">Your curated tea shelf for one-click steep timing.</p>
          </div>
          <Link to="/teas" className="text-xs font-semibold text-emerald-500 hover:underline">
            Explore All 1,050+ Terroirs &rarr;
          </Link>
        </div>

        {favorites.length === 0 ? (
          <div className="glass-card rounded-2xl p-10 text-center text-xs text-slate-400">
            No blends saved yet. Click the heart icon on any Indian tea to store it in your Chai Diary!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {favorites.map((fav) => {
              const t = fav.tea;
              if (!t) return null;
              return (
                <div key={t.id} className="glass-card rounded-2xl overflow-hidden p-4 flex flex-col justify-between group">
                  <div className="relative">
                    <TeaImage
                      src={t.imageUrl}
                      alt={t.name}
                      category={t.teaType}
                      className="w-full h-36 rounded-xl group-hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      onClick={() => toggleFavorite(t)}
                      className="absolute top-2 right-2 p-1.5 rounded-full glass-card text-rose-500 hover:scale-110 transition-transform shadow"
                    >
                      <Heart className="w-4 h-4 fill-rose-500" />
                    </button>
                  </div>

                  <div className="mt-3 space-y-1">
                    <div className="text-[10px] text-slate-400">{t.origin} • {t.teaType}</div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                      <Link to={`/teas/${t.id}`}>{t.name}</Link>
                    </h4>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">₹{t.price}</span>
                      <span className="text-[11px] text-slate-400">{t.preparationTime} mins</span>
                    </div>
                  </div>

                  <Link
                    to={`/teas/${t.id}`}
                    className="mt-3 w-full py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-center text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-emerald-600 hover:text-white transition-colors"
                  >
                    Brew Station
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
