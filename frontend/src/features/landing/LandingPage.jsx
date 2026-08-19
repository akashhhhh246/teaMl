import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Compass,
  ArrowRight,
  ShieldCheck,
  Star,
  Award,
  Thermometer,
  ChevronDown,
  Droplets,
  Heart,
} from 'lucide-react';
import { Badge } from '../../components/common/Badge';

export function LandingPage() {
  const [simMood, setSimMood] = useState('Calm');
  const [simStrength, setSimStrength] = useState('Medium Balanced');
  const [simFloral, setSimFloral] = useState(7);
  const [simSpice, setSimSpice] = useState(3);
  const [openFaq, setOpenFaq] = useState(null);

  const getSimMatch = () => {
    if (simSpice >= 6) {
      return {
        name: 'Royal Kashmiri Saffron Almond Kahwa',
        type: 'Kashmir Kahwa',
        origin: 'Kashmir (Pampore Valley)',
        match: 99,
        flavor: 'Saffron (Kesar), Cardamom, Almonds',
        temp: 85,
        time: 4,
        price: 899,
        desc: 'A divine simmer of Kashmiri green tea, pure Pampore saffron strands, cinnamon, and slivered almonds.',
      };
    }
    if (simStrength === 'Bold & Strong' || simStrength === 'Extra Robust') {
      return {
        name: 'Upper Assam Halmari Golden Tips CTC',
        type: 'Assam',
        origin: 'Upper Assam (Brahmaputra)',
        match: 98,
        flavor: 'Rich Malt, Dark Cocoa, Molasses',
        temp: 98,
        time: 5,
        price: 450,
        desc: 'Bold mahogany liquor with intense natural malt. The quintessential morning Kadak Chai.',
      };
    }
    if (simFloral >= 6) {
      return {
        name: 'Makaibari Bio-Dynamic First Flush Spring Gold',
        type: 'Darjeeling',
        origin: 'Darjeeling (Kurseong)',
        match: 97,
        flavor: 'Muscatel, Green Apple, Honeysuckle',
        temp: 85,
        time: 3,
        price: 1650,
        desc: 'The celebrated Champagne of Teas. Plucked in early spring mist from high Himalayan slopes.',
      };
    }
    return {
      name: 'Nilgiri Frost Tea Blue Mountain Reserve',
      type: 'Nilgiri',
      origin: 'Nilgiri (Coonoor Highlands)',
      match: 96,
      flavor: 'Bright Citrus, Crisp Plum, Floral Honey',
      temp: 90,
      time: 4,
      price: 650,
      desc: 'Plucked during winter frost in the Blue Mountains, yielding an exquisitely crisp floral liqueur.',
    };
  };

  const currentMatch = getSimMatch();

  const faqs = [
    {
      q: 'How does TeaML recommend the perfect tea for my taste?',
      a: 'TeaML evaluates your unique taste preferences—including preferred spice notes, body strength, milk style, daily routine, and wellness goals—and cross-references them against our curated library of over 1,050 single-estate Indian harvests (Darjeeling, Assam, Nilgiri, Kashmir, Kangra, and Sikkim).',
    },
    {
      q: 'Why are tea origins and flushes important?',
      a: 'Just like fine wine, tea develops distinct terroir characteristics depending on soil elevation, seasonal rainfall, and harvest flushes. A First Flush Darjeeling yields delicate spring muscatel notes, while an Upper Assam CTC offers robust maltiness ideal for spiced milk chai.',
    },
    {
      q: 'Can I discover herbal and caffeine-free blends for evening relaxation?',
      a: 'Yes! We feature traditional Ayurvedic restorative tisanes (Tulsi, Ashwagandha, Brahmi, Shankhpushpi), warming monsoon ginger kadhas, and soothing saffron-infused Kashmiri Kahwas.',
    },
    {
      q: 'What brewing guides are provided for each blend?',
      a: 'Every tea profile includes precise steep temperatures, optimal infusion times, water-to-milk ratios, and culinary pairing recommendations like samosas, bun maska, and butter biscuits.',
    },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Background Gradient Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none gradient-tea-hero -z-10" />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-24 lg:pb-32 text-center">
        {/* Glowing Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse-subtle">
          <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
          <span>Curated Tea Experiences</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans max-w-4xl mx-auto leading-tight">
          Where Botanical Heritage Meets{' '}
          <span className="text-gradient-emerald">Personalized Taste</span>.
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          From legendary Darjeeling flushes and malty Assam Kadak chais to Himalayan saffron Kahwa and restorative Ayurvedic elixirs. Discover your signature blend, one cup at a time.
        </p>

        {/* Hero CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/quiz"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-xl shadow-emerald-600/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2.5"
          >
            <Sparkles className="w-5 h-5" />
            <span>Discover My Perfect Cup</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/teas"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl glass-card text-slate-800 dark:text-slate-100 font-semibold text-base hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
          >
            <Compass className="w-5 h-5 text-amber-500" />
            <span>Explore 1,050+ Indian Terroirs</span>
          </Link>
        </div>

        {/* Consumer Trust Badges */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
          <div className="glass-card rounded-2xl p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">Sensory Precision</div>
              <div className="text-xs text-slate-500">Tailored Palate Matching</div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">1,050+ Terroirs</div>
              <div className="text-xs text-slate-500">Single-Estate Gardens</div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">Taste Insights</div>
              <div className="text-xs text-slate-500">Transparent Flavor Notes</div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Thermometer className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">Brew Station</div>
              <div className="text-xs text-slate-500">Precision Steep Guidance</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Taste Matcher Simulator */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-emerald-500/20 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            {/* Left Controls */}
            <div className="w-full lg:w-1/2 space-y-6">
              <div>
                <Badge variant="emerald" size="md">
                  Interactive Taste Matcher
                </Badge>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2 font-sans">
                  Experience Personalized Blend Discovery
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                  Adjust your state of mind, strength, and spice targets below to preview how our sensory profiling selects your ideal Indian harvest.
                </p>
              </div>

              {/* Mood Buttons */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Target State of Mind
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Calm', 'Focused', 'Energetic', 'Relaxed', 'Meditative'].map((m) => (
                    <button
                      key={m}
                      onClick={() => setSimMood(m)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        simMood === m
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Strength Preference */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Chai Body & Strength
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Light & Delicate', 'Medium Balanced', 'Bold & Strong', 'Extra Robust'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSimStrength(s)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        simStrength === s
                          ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-transparent'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sliders */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Floral Intensity</span>
                    <span className="text-emerald-500">{simFloral}/10</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={simFloral}
                    onChange={(e) => setSimFloral(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Spice / Elaichi-Adrak</span>
                    <span className="text-amber-500">{simSpice}/10</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={simSpice}
                    onChange={(e) => setSimSpice(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Right Live Prediction Card */}
            <div className="w-full lg:w-1/2">
              <div className="glass-card rounded-3xl p-6 sm:p-8 border border-emerald-500/30 bg-white/90 dark:bg-slate-900/90 shadow-xl relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      Curated Palate Match
                    </span>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-emerald-500 text-white font-bold text-xs">
                    {currentMatch.match}% Match
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {currentMatch.name}
                </h3>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {currentMatch.origin} • {currentMatch.type}
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 my-4 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                  "{currentMatch.desc}"
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs mb-6">
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800">
                    <span className="text-slate-400 block text-[10px]">Flavor Profile</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{currentMatch.flavor}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800">
                    <span className="text-slate-400 block text-[10px]">Price / 100g</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">₹{currentMatch.price}</span>
                  </div>
                </div>

                <Link
                  to="/quiz"
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-95 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Take the Full Taste Quiz</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Verified Connoisseurs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <Badge variant="amber" size="md">
            Connoisseur Reviews
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2 font-sans">
            Praised Across Darjeeling, Assam & Nilgiris
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Dr. Ananya Banerjee',
              title: 'Ayurvedic Botanist, Pune',
              quote: 'TeaML brings remarkable nuance to traditional herbal infusions. The Tulsi-Ashwagandha recommendations for evening relaxation are truly exceptional.',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
            },
            {
              name: 'Vikramaditya Roy',
              title: 'Tea Estate Specialist, Upper Assam',
              quote: 'The accuracy with which it captures Assam orthodox malty liquor and Kadak chai brewing ratios is remarkable. A delight for any tea connoisseur.',
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
            },
            {
              name: 'Meenakshi Iyer',
              title: 'Tea Taster, Coonoor, Nilgiris',
              quote: 'I use TeaML to time my single-estate Darjeeling flushes and Nilgiri frost teas. It captures terroir notes with extraordinary precision.',
              avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
            },
          ].map((t, idx) => (
            <div key={idx} className="glass-card rounded-3xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex text-amber-400 gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed mb-6">
                  "{t.quote}"
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-emerald-500/40" />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">{t.name}</div>
                  <div className="text-[11px] text-slate-500">{t.title}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Consumer FAQ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <Badge variant="emerald" size="md">
            Common Questions
          </Badge>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2 font-sans">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="glass-card rounded-2xl p-5 border border-slate-200/60 dark:border-slate-800/60"
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full flex items-center justify-between text-left font-bold text-sm text-slate-900 dark:text-white"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-emerald-500 transition-transform ${
                    openFaq === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openFaq === index && (
                <p className="mt-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-2 border-t border-slate-100 dark:border-slate-800/60">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
