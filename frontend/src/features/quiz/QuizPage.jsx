import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
} from 'lucide-react';
import { recommendationAPI } from '../../services/api';
import { FlavorRadarChart } from '../../components/common/FlavorRadarChart';
import { Badge } from '../../components/common/Badge';

export function QuizPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 19 Data Points State (India Edition)
  const [formData, setFormData] = useState({
    // Stage 1: Demographics & Lifestyle
    age: 26,
    country: 'India',
    climate: 'Monsoon / Humid',
    teaFrequency: 'Daily (2-3 cups Kadak Chai)',

    // Stage 2: Taste Profile
    favoriteFlavours: ['Cardamom (Elaichi)', 'Ginger (Adrak)', 'Saffron (Kesar)'],
    teaStrength: 'Bold & Strong',
    sugarPreference: 'Slightly Sweet (or Jaggery/Gur)',
    milkPreference: 'Rich Milk Tea (Kadak Chai)',
    spicePreference: 7,
    floralPreference: 5,
    aromaPreference: 9,

    // Stage 3: Mind & Wellness
    mood: 'Calm',
    stressLevel: 5,
    sleepQuality: 'Average',
    healthGoals: ['Stress Relief', 'Immunity Support', 'Digestive Aid'],

    // Stage 4: Habits & Budget
    budget: 'Premium Single-Estate (₹500 - ₹1,200)',
    teaBrands: 'Indian Artisan Estates (Makaibari, Halmari, Temi)',
    caffeineTolerance: 'Moderate Caffeine',
    preparationStyle: 'Simmered Stove-top Pot (Kadak Chai)',

    // ML Engine Choice
    modelOverride: 'hybrid',
  });

  const totalSteps = 5;

  const toggleArrayItem = (field, item) => {
    setFormData((prev) => {
      const current = prev[field] || [];
      if (current.includes(item)) {
        return { ...prev, [field]: current.filter((x) => x !== item) };
      } else {
        return { ...prev, [field]: [...current, item] };
      }
    });
  };

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await recommendationAPI.predict(formData);
      navigate('/recommendations', {
        state: {
          recommendationData: result.data,
          quizInputs: formData,
        },
      });
    } catch (err) {
      console.error('Quiz prediction error:', err);
      setError(err.message || 'Failed to generate recommendations. Please try again.');
      setLoading(false);
    }
  };

  const flavorOptions = [
    'Cardamom (Elaichi)', 'Ginger (Adrak)', 'Saffron (Kesar)', 'Tulsi',
    'Assam Malt', 'Darjeeling Muscatel', 'Cinnamon (Dalchini)', 'Clove (Laung)',
    'Fennel (Saunf)', 'Rose Petals (Gulab)', 'Citrus Zest', 'Honey', 'Nutty Almond'
  ];

  const healthGoalOptions = [
    'Stress Relief & Calming', 'Immunity Fortification (Kadha)', 'Digestive Fire & Gut Health',
    'Morning Energy & Alertness', 'Restful Sleep (Ayurvedic)', 'Skin Glow & Radiance',
    'Monsoon Cold & Cough Defense', 'Joint & Anti-inflammatory'
  ];

  const moodOptions = [
    'Calm', 'Focused', 'Relaxed', 'Energetic', 'Refreshed',
    'Meditative', 'Cozy', 'Uplifted', 'Soothing', 'Creative'
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header & Stepper */}
      <div className="text-center mb-10">
        <Badge variant="emerald" size="md">
          19-Point Indian Sensory Profiling
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2 font-sans">
          AI Chai & Terroir Recommendation Quiz
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-md mx-auto">
          Calibrate your spice palate, milk preference, state of mind, and regional terroirs across India.
        </p>

        {/* Progress Bar */}
        <div className="mt-8 max-w-xl mx-auto">
          <div className="flex justify-between text-xs font-semibold text-slate-500 mb-2">
            <span>Stage {step} of {totalSteps}</span>
            <span className="text-emerald-500 font-bold">{Math.round((step / totalSteps) * 100)}% Completed</span>
          </div>
          <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 rounded-full"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-sm">
          {error}
        </div>
      )}

      {/* Main Wizard Form Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 shadow-2xl border border-white/20 dark:border-white/10 relative overflow-hidden">
        {loading ? (
          <div className="py-20 text-center space-y-6 animate-fade-in">
            <div className="relative w-20 h-20 mx-auto">
              <div className="w-20 h-20 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
              <span className="absolute inset-0 flex items-center justify-center text-3xl">🍵</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Evaluating Indian Terroirs & ML Models...
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Matching your 19 sensory targets across 1,050 Darjeeling, Assam, Nilgiri, Kashmir, and Ayurvedic blends.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* STAGE 1: Demographics & Indian Climate */}
            {step === 1 && (
              <div className="space-y-8 animate-fade-in">
                <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-4">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>🇮🇳</span> Stage 1: Climate & Daily Chai Habits
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Your local season and daily routine guide ideal ginger warmth, caffeine, and milk density.
                  </p>
                </div>

                {/* Age & Region */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
                      Age: <span className="text-emerald-500 font-bold">{formData.age}</span>
                    </label>
                    <input
                      type="range"
                      min="18"
                      max="85"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                      className="w-full accent-emerald-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                      <span>18 yrs</span>
                      <span>85 yrs</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
                      Your Indian Region / City
                    </label>
                    <select
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    >
                      {['North India (Delhi / Punjab / UP)', 'West India (Mumbai / Gujarat / Pune)', 'South India (Bangalore / Chennai / Kerala)', 'East India (Kolkata / Assam / Bengal)', 'Central / North-East India', 'International'].map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Climate */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-3">
                    Current Weather / Climate Zone
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: 'Monsoon / Humid', icon: '🌧️', desc: 'Rainy & Damp (Craving Adrak)' },
                      { label: 'Sub-Tropical Warm', icon: '☀️', desc: 'Warm & Sunny' },
                      { label: 'Himalayan / Cold', icon: '❄️', desc: 'Crisp & Chilly (Need Kesar)' },
                      { label: 'Deccan Semi-Arid', icon: '🍃', desc: 'Pleasant & Breezy' },
                    ].map((c) => (
                      <button
                        type="button"
                        key={c.label}
                        onClick={() => setFormData({ ...formData, climate: c.label })}
                        className={`p-3.5 rounded-2xl text-left border transition-all ${
                          formData.climate === c.label
                            ? 'bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold shadow-sm'
                            : 'bg-slate-100/70 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        <div className="text-xl mb-1">{c.icon}</div>
                        <div className="text-xs font-bold">{c.label}</div>
                        <div className="text-[10px] text-slate-400">{c.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Frequency */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-3">
                    Chai & Tea Drinking Frequency
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      'Daily (3+ cups Kadak Chai)',
                      'Daily (1-2 cups Morning & Evening)',
                      'A few times a week',
                      'Afternoon specialty drinker',
                      'New to artisanal leaf',
                    ].map((f) => (
                      <button
                        type="button"
                        key={f}
                        onClick={() => setFormData({ ...formData, teaFrequency: f })}
                        className={`px-4 py-3 rounded-2xl text-xs font-semibold text-left border transition-all ${
                          formData.teaFrequency === f
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                            : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STAGE 2: Taste, Spices & Milk Style */}
            {step === 2 && (
              <div className="space-y-8 animate-fade-in">
                <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-4">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>🌶️</span> Stage 2: Spices, Milk Style & Taste Targets
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Select your preferred Indian spices (Elaichi, Adrak, Kesar, Tulsi) and liquor strength.
                  </p>
                </div>

                {/* Favorite Flavours */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
                    Preferred Spices & Flavor Notes (Select all you enjoy)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {flavorOptions.map((flavor) => {
                      const isSelected = formData.favoriteFlavours.includes(flavor);
                      return (
                        <button
                          type="button"
                          key={flavor}
                          onClick={() => toggleArrayItem('favoriteFlavours', flavor)}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                            isSelected
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm scale-105'
                              : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                          }`}
                        >
                          {isSelected ? '✓ ' : '+ '} {flavor}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Strength, Sugar & Milk */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
                      Strength & Body
                    </label>
                    <select
                      value={formData.teaStrength}
                      onChange={(e) => setFormData({ ...formData, teaStrength: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white"
                    >
                      {['Light & Delicate (First Flush)', 'Medium Balanced', 'Bold & Strong (Kadak)', 'Extra Robust CTC'].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
                      Sweetener
                    </label>
                    <select
                      value={formData.sugarPreference}
                      onChange={(e) => setFormData({ ...formData, sugarPreference: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white"
                    >
                      {['No Sugar / Pure Leaf', 'Slightly Sweet (or Jaggery/Gur)', 'Moderately Sweetened', 'Rich & Sweet'].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
                      Milk Preference
                    </label>
                    <select
                      value={formData.milkPreference}
                      onChange={(e) => setFormData({ ...formData, milkPreference: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white"
                    >
                      {[
                        'Rich Milk Tea (Kadak Chai)',
                        'Light Splash of Milk',
                        'Clear Black / Green / Kahwa (No Milk)',
                        'Oat / Almond Milk',
                      ].map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Sliders */}
                <div className="space-y-4 pt-2">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      <span>Spice Intensity (Elaichi, Adrak, Dalchini, Laung)</span>
                      <span className="text-amber-500 font-bold">{formData.spicePreference}/10</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={formData.spicePreference}
                      onChange={(e) => setFormData({ ...formData, spicePreference: Number(e.target.value) })}
                      className="w-full accent-amber-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      <span>Floral & Muscatel Bouquet</span>
                      <span className="text-emerald-500 font-bold">{formData.floralPreference}/10</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={formData.floralPreference}
                      onChange={(e) => setFormData({ ...formData, floralPreference: Number(e.target.value) })}
                      className="w-full accent-emerald-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STAGE 3: State of Mind & Ayurvedic Goals */}
            {step === 3 && (
              <div className="space-y-8 animate-fade-in">
                <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-4">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>🌿</span> Stage 3: State of Mind & Ayurvedic Wellness
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Match with adaptogens (Ashwagandha, Tulsi, Curcumin, Mulethi) tailored to your energy and stress.
                  </p>
                </div>

                {/* Mood Selection */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-3">
                    Desired State of Mind
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                    {moodOptions.map((m) => (
                      <button
                        type="button"
                        key={m}
                        onClick={() => setFormData({ ...formData, mood: m })}
                        className={`p-3 rounded-2xl text-xs font-bold border text-center transition-all ${
                          formData.mood === m
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-md scale-105'
                            : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stress Level & Sleep */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      <span>Stress Level</span>
                      <span className="text-rose-500 font-bold">{formData.stressLevel}/10</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={formData.stressLevel}
                      onChange={(e) => setFormData({ ...formData, stressLevel: Number(e.target.value) })}
                      className="w-full accent-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
                      Sleep Quality
                    </label>
                    <select
                      value={formData.sleepQuality}
                      onChange={(e) => setFormData({ ...formData, sleepQuality: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white"
                    >
                      {[
                        'Deep & Restful',
                        'Average',
                        'Restless / Hard to fall asleep',
                        'Insomnia (Need Ashwagandha/Chamomile)',
                      ].map((sq) => (
                        <option key={sq} value={sq}>{sq}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Health Goals */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
                    Ayurvedic Health Goals (Select 1 to 4)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {healthGoalOptions.map((goal) => {
                      const isSelected = formData.healthGoals.includes(goal);
                      return (
                        <button
                          type="button"
                          key={goal}
                          onClick={() => toggleArrayItem('healthGoals', goal)}
                          className={`px-4 py-2.5 rounded-xl text-xs font-semibold text-left border flex items-center justify-between transition-all ${
                            isSelected
                              ? 'bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold'
                              : 'bg-slate-100/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                          }`}
                        >
                          <span>{goal}</span>
                          {isSelected && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STAGE 4: Caffeine & INR Budget */}
            {step === 4 && (
              <div className="space-y-8 animate-fade-in">
                <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-4">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>💰</span> Stage 4: Caffeine & Budget (₹ INR)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Configure caffeine tolerance and preferred price tier per 100g.
                  </p>
                </div>

                {/* Caffeine Tolerance */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-3">
                    Caffeine Tolerance
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { label: 'Zero Caffeine (Herbal/Tisane only)', desc: 'Ayurvedic Tulsi & Ashwagandha nightcaps' },
                      { label: 'Low Caffeine', desc: 'Gentle Kashmiri Kahwa & Nilgiri white teas' },
                      { label: 'Moderate Caffeine', desc: 'Darjeeling First Flush & Kangra greens' },
                      { label: 'High Caffeine / Need Maximum Energy', desc: 'Upper Assam Kadak Chai & Orthodox Gold' },
                    ].map((c) => (
                      <button
                        type="button"
                        key={c.label}
                        onClick={() => setFormData({ ...formData, caffeineTolerance: c.label })}
                        className={`p-3.5 rounded-2xl text-left border transition-all ${
                          formData.caffeineTolerance === c.label
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                            : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        <div className="text-xs font-bold">{c.label}</div>
                        <div className={`text-[10px] mt-0.5 ${formData.caffeineTolerance === c.label ? 'text-white/80' : 'text-slate-400'}`}>
                          {c.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preparation Style */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-3">
                    Brewing Style
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {[
                      'Simmered Stove-top Pot (Kadak Chai)',
                      'Teapot Infuser (Darjeeling / Whole Leaf)',
                      'Samovar Simmer (Kashmiri Kahwa)',
                      'Clay Kulhad Boiling',
                      'Quick Tea Bags / Pyramids',
                    ].map((p) => (
                      <button
                        type="button"
                        key={p}
                        onClick={() => setFormData({ ...formData, preparationStyle: p })}
                        className={`p-3 rounded-2xl text-xs font-semibold text-left border transition-all ${
                          formData.preparationStyle === p
                            ? 'bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold'
                            : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Budget in ₹ (INR) */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-3">
                    Budget per 100g (₹ INR)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { label: 'Everyday Daily Chai (₹200 - ₹500)', desc: 'Accessible Assam & Masala CTC' },
                      { label: 'Premium Single-Estate (₹500 - ₹1,200)', desc: 'Darjeeling flushes & Nilgiri frost' },
                      { label: 'Rare Heritage Flush (₹1,200 - ₹3,000+)', desc: 'Kashmir Saffron & Castleton Muscatel' },
                    ].map((b) => (
                      <button
                        type="button"
                        key={b.label}
                        onClick={() => setFormData({ ...formData, budget: b.label })}
                        className={`p-3.5 rounded-2xl text-left border transition-all ${
                          formData.budget === b.label
                            ? 'bg-amber-500/10 border-amber-500 text-amber-700 dark:text-amber-300 font-bold'
                            : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        <div className="text-xs font-bold">{b.label}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{b.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STAGE 5: Preview & Generate */}
            {step === 5 && (
              <div className="space-y-8 animate-fade-in">
                <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-4">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>✨</span> Stage 5: Target Palate Blueprint & ML Match
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Review your sensory targets before running the Machine Learning recommendation pipeline.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    <div className="glass-card rounded-2xl p-4 space-y-3">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Profile Summary
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        <Badge variant="emerald">Mood: {formData.mood}</Badge>
                        <Badge variant="amber">Spice: {formData.spicePreference}/10</Badge>
                        <Badge variant="blue">Body: {formData.teaStrength}</Badge>
                        <Badge variant="purple">Climate: {formData.climate.split(' ')[0]}</Badge>
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">
                        <b>Spices:</b> {formData.favoriteFlavours.join(', ')}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">
                        <b>Health Goals:</b> {formData.healthGoals.join(', ')}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
                        ML Recommendation Pipeline
                      </label>
                      <select
                        value={formData.modelOverride}
                        onChange={(e) => setFormData({ ...formData, modelOverride: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 focus:outline-none"
                      >
                        <option value="hybrid">🌟 Hybrid AI Ensemble (Recommended - 98.2% Accuracy)</option>
                        <option value="random_forest">🌲 Random Forest Multi-Target Regressor</option>
                        <option value="content_based">🎯 Content-Based TF-IDF Cosine Similarity</option>
                        <option value="decision_tree">🌿 Decision Tree Lifestyle Classifier</option>
                      </select>
                    </div>
                  </div>

                  <div className="glass-card rounded-3xl p-4 flex flex-col items-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Indian Sensory Blueprint
                    </span>
                    <FlavorRadarChart
                      userTarget={{
                        bitterness: formData.teaStrength.includes('Bold') ? 7.0 : 4.0,
                        sweetness: 6.0,
                        floral: formData.floralPreference,
                        spice: formData.spicePreference,
                        aroma: formData.aromaPreference,
                      }}
                      teaActual={{
                        bitterness: 5.0,
                        sweetness: 6.0,
                        floral: formData.floralPreference,
                        spice: formData.spicePreference,
                        aroma: formData.aromaPreference,
                      }}
                      height={230}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Footer */}
            <div className="flex items-center justify-between pt-8 mt-8 border-t border-slate-200/60 dark:border-slate-800/60">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
              ) : (
                <div />
              )}

              {step < totalSteps ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-3 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 active:scale-95 transition-all flex items-center gap-2"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-8 py-3.5 rounded-2xl text-sm font-extrabold bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white shadow-xl shadow-emerald-600/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Indian Chai Match</span>
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
