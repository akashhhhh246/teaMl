import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  Thermometer,
  Clock,
  Droplets,
  Share2,
  Check,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  MapPin,
  Leaf,
  Utensils,
} from 'lucide-react';
import { teasAPI } from '../../services/api';
import { FlavorRadarChart } from '../../components/common/FlavorRadarChart';
import { SteepTimer } from '../../components/common/SteepTimer';
import { Badge } from '../../components/common/Badge';
import { TeaImage } from '../../components/common/TeaImage';

export function TeaDetailPage() {
  const { id } = useParams();

  const [tea, setTea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadTeaData() {
      try {
        setLoading(true);
        const teaRes = await teasAPI.getById(id);
        setTea(teaRes.data);
      } catch (err) {
        console.error('Error fetching tea details:', err);
        setError('Unable to load tea details. Please check connection.');
      } finally {
        setLoading(false);
      }
    }
    loadTeaData();
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin mx-auto mb-4" />
        <p className="text-sm font-semibold text-slate-500">Loading estate harvest profile...</p>
      </div>
    );
  }

  if (error || !tea) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="text-4xl mb-3">🍃</div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          Harvest Profile Not Found
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          This single-estate batch may have concluded its seasonal flush.
        </p>
        <Link
          to="/teas"
          className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs"
        >
          Return to Cellar
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back Button */}
      <div className="mb-6">
        <Link
          to="/teas"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-500 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Grand Chai Cellar</span>
        </Link>
      </div>

      {/* Hero Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
        {/* Left Image Gallery */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative rounded-3xl overflow-hidden glass-panel border border-emerald-500/20 shadow-2xl h-[420px]">
            <TeaImage
              src={tea.imageUrl}
              alt={tea.name}
              category={tea.teaType}
              className="w-full h-full"
            />
            <div className="absolute top-4 left-4">
              <Badge variant="emerald" size="lg">{tea.teaType}</Badge>
            </div>
          </div>
        </div>

        {/* Right Product Overview */}
        <div className="lg:col-span-7 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-emerald-500" />
              <span>{tea.origin}</span>
              <span>•</span>
              <span className="text-emerald-600 dark:text-emerald-400">{tea.season}</span>
            </div>

            <button
              onClick={handleShare}
              className="p-2 rounded-xl glass-card text-slate-500 hover:text-emerald-500 transition-colors"
              title="Share Harvest Profile"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-sans">
            {tea.name}
          </h1>

          {/* Genuine Quality & Terroir Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-500/20">
              <Leaf className="w-3.5 h-3.5 text-emerald-500" />
              <span>Single-Estate Origin</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-bold border border-amber-500/20">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
              <span>100% Hand-Picked Whole Leaf</span>
            </div>
          </div>

          {/* Price in ₹ */}
          <div className="flex items-baseline gap-2 py-2">
            <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
              ₹{tea.price}
            </span>
            <span className="text-xs text-slate-400">/ 100g single-estate pouch</span>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {tea.description}
          </p>

          {/* Sensory Tags */}
          <div className="space-y-2 pt-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Spices & Botanical Notes
            </span>
            <div className="flex flex-wrap gap-1.5">
              {Array.isArray(tea.flavorProfile) && tea.flavorProfile.map((f, i) => (
                <Badge key={i} variant="amber">{f}</Badge>
              ))}
              {Array.isArray(tea.moodTags) && tea.moodTags.map((m, i) => (
                <Badge key={i} variant="purple">Mood: {m}</Badge>
              ))}
              {Array.isArray(tea.healthBenefits) && tea.healthBenefits.map((h, i) => (
                <Badge key={i} variant="blue">{h}</Badge>
              ))}
            </div>
          </div>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
            <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 text-center">
              <Thermometer className="w-4 h-4 text-amber-500 mx-auto mb-1" />
              <span className="text-[10px] text-slate-400 block">Temperature</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white">{tea.steepTemperature}°C</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 text-center">
              <Clock className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
              <span className="text-[10px] text-slate-400 block">Steep Time</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white">{tea.preparationTime} mins</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 text-center">
              <Droplets className="w-4 h-4 text-sky-500 mx-auto mb-1" />
              <span className="text-[10px] text-slate-400 block">Brew Ratio</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white truncate">{tea.waterRatio ? tea.waterRatio.split(' ')[0] : '2.5g / 200ml'}</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 text-center">
              <Sparkles className="w-4 h-4 text-purple-500 mx-auto mb-1" />
              <span className="text-[10px] text-slate-400 block">Caffeine</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white">{tea.caffeine} mg</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sensory Radar & Live Brewing Station */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Indian Terroir Sensory Radar
            </h3>
            <span className="text-xs text-slate-400">Flavor Matrix</span>
          </div>
          <FlavorRadarChart teaActual={tea} height={280} />
        </div>

        <div>
          <SteepTimer
            targetMinutes={tea.preparationTime}
            temperature={tea.steepTemperature}
            waterRatio={tea.waterRatio}
            teaName={tea.name}
          />
        </div>
      </div>

      {/* Authentic Terroir Heritage & Botanical Quality Notes */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-slate-200/60 dark:border-slate-800/60 mb-16">
        <div className="pb-6 mb-6 border-b border-slate-200/60 dark:border-slate-800/60">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-sans">
            Botanical Heritage & Culinary Guidance
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Artisan background, harvest provenance, and authentic culinary pairings for this blend.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card rounded-2xl p-5 space-y-2">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
              <Leaf className="w-4 h-4" />
              <span>Ingredients & Processing</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {Array.isArray(tea.ingredients) && tea.ingredients.length > 0
                ? tea.ingredients.join(', ')
                : '100% Hand-Picked Camellia Sinensis Single Estate Leaves.'}
            </p>
          </div>

          <div className="glass-card rounded-2xl p-5 space-y-2">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs">
              <Utensils className="w-4 h-4" />
              <span>Culinary Pairings</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {tea.teaType === 'Assam' || tea.teaType === 'Masala Chai'
                ? 'Best paired with hot onion pakoras, crisp vegetable samosas, Irani bun maska, or butter biscuits.'
                : tea.teaType === 'Kashmir Kahwa'
                ? 'Pairs wonderfully with roasted Kashmiri walnuts, saffron phirni, dry fruits, or light nankhatai.'
                : 'Pairs delicately with light lemon biscuits, steamed vegetable momos, or mild goat cheese.'}
            </p>
          </div>

          <div className="glass-card rounded-2xl p-5 space-y-2">
            <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 font-bold text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>Storage & Preservation</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Store in an airtight, opaque tin away from direct sunlight, moisture, and strong spices to preserve delicate essential oils and aroma compounds.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
