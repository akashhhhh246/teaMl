import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  Star,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  LayoutGrid,
  List,
} from 'lucide-react';
import { teasAPI } from '../../services/api';
import { Badge } from '../../components/common/Badge';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { TeaImage } from '../../components/common/TeaImage';

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [teas, setTeas] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, totalCount: 0 });
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Filters State
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [teaType, setTeaType] = useState(searchParams.get('teaType') || 'All');
  const [mood, setMood] = useState(searchParams.get('mood') || 'All');
  const [sortBy, setSortBy] = useState('rating');
  const [page, setPage] = useState(1);

  const categories = [
    'All',
    'Darjeeling',
    'Assam',
    'Masala Chai',
    'Kashmir Kahwa',
    'Nilgiri',
    'Ayurvedic Tisane',
    'Kangra Valley',
    'Sikkim Temi',
  ];

  const moodOptions = [
    'All',
    'Calm',
    'Focused',
    'Relaxed',
    'Energetic',
    'Refreshed',
    'Meditative',
    'Cozy',
    'Uplifted',
    'Soothing',
  ];

  useEffect(() => {
    async function fetchTeas() {
      try {
        setLoading(true);
        const params = {
          page,
          limit: 12,
          sortBy,
          sortOrder: 'desc',
        };

        if (search) params.search = search;
        if (teaType !== 'All') params.teaType = teaType;
        if (mood !== 'All') params.mood = mood;

        const res = await teasAPI.getTeas(params);
        setTeas(res.data || []);
        setMeta(res.meta || { page: 1, totalPages: 1, totalCount: res.data?.length || 0 });
      } catch (err) {
        console.error('Failed to load tea catalog', err);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      fetchTeas();
    }, 200);

    return () => clearTimeout(timer);
  }, [search, teaType, mood, sortBy, page]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/60 dark:border-slate-800/60">
        <div>
          <Badge variant="emerald" size="md">
            The Grand Indian Chai Cellar
          </Badge>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1 font-sans">
            Explore 1,050+ Indian Terroir Blends
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Single-estate Darjeeling flushes, robust Upper Assam chais, Nilgiri frost leaves, and Himalayan Ayurvedic tisanes.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by estate, spice, mood..."
              className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button
            onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
            className="p-2.5 rounded-xl glass-card hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <SlidersHorizontal className="w-4 h-4 text-emerald-500" />
            <span className="hidden sm:inline">Filters</span>
          </button>

          {/* Grid / List toggle */}
          <div className="flex items-center glass-card p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-emerald-500 text-white' : 'text-slate-500'}`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-emerald-500 text-white' : 'text-slate-500'}`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setTeaType(cat);
              setPage(1);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex-shrink-0 transition-all ${
              teaType === cat
                ? 'bg-emerald-600 text-white shadow-md'
                : 'glass-card text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Filter Drawer */}
      {filterDrawerOpen && (
        <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Target Mood</label>
            <select
              value={mood}
              onChange={(e) => {
                setMood(e.target.value);
                setPage(1);
              }}
              className="w-full p-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white"
            >
              {moodOptions.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Sort Blends By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full p-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white"
            >
              <option value="rating">Top Rated by Connoisseurs</option>
              <option value="price">Price (₹ High to Low)</option>
              <option value="reviews">Most Reviewed</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearch('');
                setTeaType('All');
                setMood('All');
                setSortBy('rating');
              }}
              className="w-full py-2 rounded-xl text-xs font-semibold text-rose-500 border border-rose-200 dark:border-rose-900 hover:bg-rose-50 dark:hover:bg-rose-950/40"
            >
              Reset All Filters
            </button>
          </div>
        </div>
      )}

      {/* Teas Catalog Grid */}
      {loading ? (
        <LoadingSkeleton count={8} />
      ) : teas.length === 0 ? (
        <div className="glass-panel rounded-3xl p-16 text-center space-y-3">
          <div className="text-4xl">🍃</div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Indian blends match your filters</h3>
          <p className="text-xs text-slate-500">Try broadening your search or resetting category filters.</p>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
          {teas.map((tea) => {
            return (
              <div
                key={tea.id}
                className={`glass-card rounded-3xl overflow-hidden border border-slate-200/60 dark:border-slate-800/60 flex flex-col justify-between group hover:border-emerald-500/50 hover:shadow-xl transition-all duration-300 ${
                  viewMode === 'list' ? 'sm:flex-row p-4 gap-6' : 'p-4'
                }`}
              >
                {/* Image Section */}
                <div className={`relative overflow-hidden rounded-2xl ${viewMode === 'list' ? 'sm:w-56 h-40 flex-shrink-0' : 'h-48'}`}>
                  <TeaImage
                    src={tea.imageUrl}
                    alt={tea.name}
                    category={tea.teaType}
                    className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <Badge variant="emerald">{tea.teaType}</Badge>
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 flex flex-col justify-between mt-3 space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>{tea.origin}</span>
                      <div className="flex items-center gap-1 text-amber-400 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{tea.rating.toFixed(2)}</span>
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1 group-hover:text-emerald-500 transition-colors line-clamp-1">
                      <Link to={`/teas/${tea.id}`}>{tea.name}</Link>
                    </h3>

                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {tea.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                        ₹{tea.price}
                      </span>
                      <span className="text-[10px] text-slate-400"> / 100g</span>
                    </div>

                    <Link
                      to={`/teas/${tea.id}`}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-semibold hover:bg-emerald-600 transition-colors"
                    >
                      View Blend
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="p-2 rounded-xl glass-card disabled:opacity-30 text-slate-700 dark:text-slate-300"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 px-4">
            Page {meta.page} of {meta.totalPages} ({meta.totalCount} Indian Blends)
          </span>
          <button
            disabled={page >= meta.totalPages}
            onClick={() => setPage(page + 1)}
            className="p-2 rounded-xl glass-card disabled:opacity-30 text-slate-700 dark:text-slate-300"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
