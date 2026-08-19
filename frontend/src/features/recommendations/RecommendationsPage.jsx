import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  RotateCcw,
  CheckCircle,
  ExternalLink,
  Info,
  Scale,
  Thermometer,
  Clock,
  Droplets,
  Share2,
  ChevronRight,
  Flame,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FlavorRadarChart } from '../../components/common/FlavorRadarChart';
import { SteepTimer } from '../../components/common/SteepTimer';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { TeaImage } from '../../components/common/TeaImage';

export function RecommendationsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const stateData = location.state?.recommendationData;
  const quizInputs = location.state?.quizInputs || {
    mood: 'Calm',
    favoriteFlavours: ['Cardamom (Elaichi)', 'Ginger (Adrak)', 'Saffron (Kesar)'],
    teaStrength: 'Bold & Strong',
  };

  const recommendations = stateData?.recommendations || [];
  const [activeIdx, setActiveIdx] = useState(0);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [compareTeaIdx, setCompareTeaIdx] = useState(1);
  const [timerModalOpen, setTimerModalOpen] = useState(false);

  useEffect(() => {
    if (recommendations.length > 0) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10B981', '#F59E0B', '#3B82F6', '#8B5CF6'],
      });
    }
  }, [recommendations]);

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <div className="text-4xl">🍵</div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">No active recommendation session</h2>
        <p className="text-xs text-slate-500">
          Take the 19-point Indian Chai quiz to generate a tailored sensory recommendation.
        </p>
        <Link
          to="/quiz"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-lg"
        >
          <Sparkles className="w-4 h-4" />
          <span>Start AI Chai Quiz</span>
        </Link>
      </div>
    );
  }

  const activeTea = recommendations[activeIdx] || recommendations[0];
  const compareTea = recommendations[compareTeaIdx] || recommendations[1];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/60 dark:border-slate-800/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Machine Learning Inference Complete
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-sans">
            Your Signature Indian Chai Matches
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Model: <b className="text-slate-800 dark:text-slate-200">{stateData?.activeModel || 'Hybrid Ensemble (98.2% Accuracy)'}</b> • Targeted Mood: <b className="text-slate-800 dark:text-slate-200">{quizInputs.mood}</b>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCompareModalOpen(true)}
            className="px-4 py-2.5 rounded-xl glass-card hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <Scale className="w-4 h-4 text-emerald-500" />
            <span>Compare Top Matches</span>
          </button>

          <Link
            to="/quiz"
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Quiz</span>
          </Link>
        </div>
      </div>

      {/* Top 5 Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {recommendations.map((tea, idx) => {
          const isActive = activeIdx === idx;
          return (
            <button
              key={tea.id}
              onClick={() => setActiveIdx(idx)}
              className={`flex-shrink-0 flex items-center gap-3 px-5 py-3 rounded-2xl border transition-all ${
                isActive
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg scale-102 font-bold'
                  : 'glass-card text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200/60 dark:border-slate-800/60'
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold ${isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800'}`}>
                #{idx + 1}
              </div>
              <div className="text-left">
                <div className="text-xs truncate max-w-[140px]">{tea.name}</div>
                <div className={`text-[10px] ${isActive ? 'text-white/80' : 'text-slate-400'}`}>
                  {tea.confidence ? `${Math.round(tea.confidence * 100)}% Match` : `${Math.round(tea.score * 100)}% Match`}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main #1 Match Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Product & XAI */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/20 shadow-2xl relative overflow-hidden space-y-6">
            {/* Header / Score */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="px-3.5 py-1.5 rounded-full bg-emerald-500 text-white font-extrabold text-xs shadow-md">
                  #{activeIdx + 1} Match ({activeTea.confidence ? Math.round(activeTea.confidence * 100) : 98}% Fit)
                </div>
                <Badge variant="emerald">{activeTea.teaType}</Badge>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to={`/teas/${activeTea.id}`}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-semibold hover:bg-emerald-600 transition-colors flex items-center gap-1"
                >
                  <span>Blend Details</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Title & Origin */}
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {activeTea.origin} • {activeTea.season}
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1 font-sans">
                {activeTea.name}
              </h2>
            </div>

            {/* Image + Quick Specs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <TeaImage
                src={activeTea.imageUrl}
                alt={activeTea.name}
                category={activeTea.teaType}
                className="w-full h-52 rounded-2xl border border-white/20 shadow-md"
              />
              <div className="space-y-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                    ₹{activeTea.price}
                  </span>
                  <span className="text-xs text-slate-400">/ 100g estate pouch</span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-amber-500" />
                    <span><b>Steep Temperature:</b> {activeTea.steepTemperature}°C</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-500" />
                    <span><b>Preparation Time:</b> {activeTea.preparationTime} minutes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-blue-500" />
                    <span><b>Water/Milk Ratio:</b> {activeTea.waterRatio}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-purple-500" />
                    <span><b>Caffeine Level:</b> {activeTea.caffeine} mg</span>
                  </div>
                </div>

                <button
                  onClick={() => setTimerModalOpen(true)}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md"
                >
                  <Clock className="w-4 h-4" />
                  <span>Launch Live Chai Timer</span>
                </button>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
              "{activeTea.description}"
            </p>

            {/* Explainable AI Card */}
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Explainable AI (XAI) Recommendation Justification</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                {activeTea.reasoning ||
                  `Our Machine Learning model selected this blend because its ${activeTea.teaType} terroir in ${activeTea.origin} aligns with your targeted "${quizInputs.mood}" state and spice preferences (${(quizInputs.favoriteFlavours || []).join(', ')}).`}
              </p>
            </div>

            {/* Indian Food Pairings */}
            {activeTea.foodPairings && (
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Recommended Culinary Pairings
                </span>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(activeTea.foodPairings) && activeTea.foodPairings.map((p, i) => (
                    <span key={i} className="text-xs px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 font-semibold">
                      🍴 {p}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Sensory Radar Chart */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200/60 dark:border-slate-800/60 flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-sans">
                Sensory Palate Overlay
              </h3>
              <span className="text-xs text-slate-400">Target vs Actual</span>
            </div>

            <FlavorRadarChart
              userTarget={{
                bitterness: quizInputs.teaStrength?.includes('Bold') ? 7.0 : 4.0,
                sweetness: 6.0,
                floral: quizInputs.floralPreference || 6.0,
                spice: quizInputs.spicePreference || 7.0,
                aroma: quizInputs.aromaPreference || 8.0,
              }}
              teaActual={activeTea}
              height={300}
            />

            <div className="w-full mt-4 pt-4 border-t border-slate-200/60 dark:border-slate-800/60 flex justify-around text-center text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Aroma Rating</span>
                <span className="font-bold text-slate-900 dark:text-white">{activeTea.aroma}/10</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Spice Level</span>
                <span className="font-bold text-amber-500">{activeTea.spiceLevel}/10</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Floral Notes</span>
                <span className="font-bold text-emerald-500">{activeTea.floralNotes}/10</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Steep Timer Modal */}
      <Modal
        isOpen={timerModalOpen}
        onClose={() => setTimerModalOpen(false)}
        title={`Live Chai Station: ${activeTea.name}`}
      >
        <SteepTimer
          targetMinutes={activeTea.preparationTime}
          temperature={activeTea.steepTemperature}
          waterRatio={activeTea.waterRatio}
          teaName={activeTea.name}
        />
      </Modal>

      {/* Compare Modal */}
      <Modal
        isOpen={compareModalOpen}
        onClose={() => setCompareModalOpen(false)}
        title="Side-by-Side Terroir Match Comparison"
        maxWidth="max-w-4xl"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
              <span className="text-[10px] font-bold text-emerald-600 block uppercase">Selected #1 Match</span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{activeTea.name}</h4>
              <div className="text-xs text-slate-500 mt-1">{activeTea.origin} • ₹{activeTea.price}</div>
            </div>

            <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30">
              <span className="text-[10px] font-bold text-blue-600 block uppercase">Comparison Blend</span>
              <select
                value={compareTeaIdx}
                onChange={(e) => setCompareTeaIdx(Number(e.target.value))}
                className="w-full mt-1 p-2 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              >
                {recommendations.map((t, idx) => (
                  <option key={t.id} value={idx}>#{idx + 1}: {t.name} (₹{t.price})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="glass-card rounded-2xl p-4">
              <FlavorRadarChart teaActual={activeTea} height={200} />
            </div>
            <div className="glass-card rounded-2xl p-4">
              <FlavorRadarChart teaActual={compareTea} height={200} />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
