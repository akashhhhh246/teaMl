import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  Thermometer,
  Clock,
  Droplets,
  Share2,
  Check,
  Sparkles,
  ThumbsUp,
  MessageSquarePlus,
  ArrowLeft,
  ChevronRight,
} from 'lucide-react';
import { teasAPI, reviewsAPI } from '../../services/api';
import { FlavorRadarChart } from '../../components/common/FlavorRadarChart';
import { SteepTimer } from '../../components/common/SteepTimer';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { TeaImage } from '../../components/common/TeaImage';

export function TeaDetailPage() {
  const { id } = useParams();

  const [tea, setTea] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  // Review Submission Modal State (Frictionless open access)
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewerName, setReviewerName] = useState('Chai Connoisseur');
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    async function loadTeaDetails() {
      try {
        setLoading(true);
        const res = await teasAPI.getTeaById(id);
        setTea(res.data);
        setReviews(res.data.reviews || []);
      } catch (err) {
        console.error('Error fetching tea:', err);
        setError('Blend not found in Indian cellar.');
      } finally {
        setLoading(false);
      }
    }
    loadTeaDetails();
  }, [id]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleUpvoteReview = async (reviewId) => {
    try {
      await reviewsAPI.upvote(reviewId);
      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, upvotes: r.upvotes + 1 } : r))
      );
    } catch (err) {
      console.error('Failed to upvote review', err);
    }
  };

  const handlePostReview = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmittingReview(true);
      const res = await reviewsAPI.create({
        teaId: id,
        rating: newRating,
        title: newTitle.trim() || null,
        comment: newComment.trim(),
      });

      setReviews([res.data, ...reviews]);
      setReviewModalOpen(false);
      setNewTitle('');
      setNewComment('');
      setNewRating(5);
    } catch (err) {
      alert(err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 animate-pulse space-y-8">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 w-48 rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
          <div className="space-y-4">
            <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
            <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !tea) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="text-4xl">🍵</div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Blend not found</h2>
        <p className="text-xs text-slate-500">The tea record could not be retrieved from the cellar.</p>
        <Link to="/teas" className="inline-block px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold">
          Back to Indian Catalog
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
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {tea.origin} • {tea.season}
            </span>
            <button
              onClick={handleShare}
              className="p-2 rounded-xl glass-card text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Share Blend"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-sans">
            {tea.name}
          </h1>

          {/* Rating & Reviews Bar */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(tea.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-700'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white">{tea.rating.toFixed(2)}</span>
            <span className="text-xs text-slate-400">({reviews.length} verified tasting reviews)</span>
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
              <span className="text-xs font-bold text-slate-900 dark:text-white truncate">{tea.waterRatio.split(' ')[0]}</span>
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

      {/* Verified Reviews Section (Frictionless - No login required) */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-slate-200/60 dark:border-slate-800/60 mb-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-200/60 dark:border-slate-800/60">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-sans">
              Verified Tasting Notes & Connoisseur Reviews
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Tasting notes from tea masters and daily chai drinkers across India.
            </p>
          </div>

          <button
            onClick={() => setReviewModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Write Tasting Review</span>
          </button>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="py-10 text-center text-xs text-slate-400">
              No tasting notes yet. Be the first reviewer for this Indian blend!
            </div>
          ) : (
            reviews.map((r) => (
              <div
                key={r.id}
                className="glass-card rounded-2xl p-5 border border-slate-200/50 dark:border-slate-800/50 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={r.user?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${r.user?.name || 'reviewer'}`}
                      alt={r.user?.name}
                      className="w-9 h-9 rounded-full object-cover border border-emerald-500/30"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>{r.user?.name || 'Chai Connoisseur'}</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-600">
                          VERIFIED
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {new Date(r.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>

                {r.title && (
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {r.title}
                  </h4>
                )}

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  "{r.comment}"
                </p>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => handleUpvoteReview(r.id)}
                    className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 hover:text-emerald-500 transition-colors"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Helpful ({r.upvotes})</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Review Submission Modal */}
      <Modal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        title="Submit Tasting Review"
      >
        <form onSubmit={handlePostReview} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
              Your Name / Handle
            </label>
            <input
              type="text"
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              placeholder="e.g. Ananya B."
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
              Rating (1 to 5 Stars)
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setNewRating(star)}
                  className="p-1 text-amber-400 hover:scale-125 transition-transform"
                >
                  <Star className={`w-6 h-6 ${star <= newRating ? 'fill-amber-400' : 'text-slate-300'}`} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
              Headline
            </label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Exquisite cardamom aroma and velvety finish"
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
              Tasting Notes & Impression
            </label>
            <textarea
              rows={4}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Describe the aroma, steep ratio, ginger warmth, or how you paired it..."
              required
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setReviewModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingReview}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-md hover:bg-emerald-700 disabled:opacity-50"
            >
              {submittingReview ? 'Submitting...' : 'Post Review'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
