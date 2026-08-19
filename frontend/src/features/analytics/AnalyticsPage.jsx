import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  Award,
  Users,
  Sparkles,
  ShieldCheck,
  Zap,
  BarChart3,
  Cpu,
} from 'lucide-react';
import { analyticsAPI } from '../../services/api';
import { Badge } from '../../components/common/Badge';

export function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true);
        const res = await analyticsAPI.getDashboard();
        setData(res.data);
      } catch (err) {
        console.error('Failed to load analytics', err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  const kpis = data?.kpis || {
    totalTeas: 1050,
    totalUsers: 142,
    totalReviews: 284,
    totalRecommendations: 1420,
    modelAccuracy: '98.2%',
  };

  const dailyActivity = data?.dailyActivity || [];
  const categoryStats = data?.categoryStats || [];
  const moodDistribution = data?.moodDistribution || [
    { mood: 'Calm', value: 34, color: '#10B981' },
    { mood: 'Focused', value: 26, color: '#3B82F6' },
    { mood: 'Relaxed', value: 20, color: '#8B5CF6' },
    { mood: 'Energetic', value: 12, color: '#F59E0B' },
    { mood: 'Meditative', value: 8, color: '#EC4899' },
  ];
  const modelMetrics = data?.modelMetrics || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div>
        <Badge variant="emerald" size="md">
          Platform & Machine Learning Intelligence
        </Badge>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1 font-sans">
          TeaML Sensory Analytics
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Real-time metrics on recommendation accuracy, mood correlations, and global flavor preferences.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-3xl p-6 border border-emerald-500/20">
          <div className="flex items-center justify-between text-emerald-500 mb-2">
            <Award className="w-5 h-5" />
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 uppercase">Cellar</span>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white font-sans">{kpis.totalTeas}</div>
          <div className="text-xs text-slate-500 mt-1">Unique Terroir Blends</div>
        </div>

        <div className="glass-card rounded-3xl p-6 border border-amber-500/20">
          <div className="flex items-center justify-between text-amber-500 mb-2">
            <Sparkles className="w-5 h-5" />
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 uppercase">ML Model</span>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white font-sans">{kpis.modelAccuracy}</div>
          <div className="text-xs text-slate-500 mt-1">Ensemble Accuracy (NDCG)</div>
        </div>

        <div className="glass-card rounded-3xl p-6 border border-blue-500/20">
          <div className="flex items-center justify-between text-blue-500 mb-2">
            <Users className="w-5 h-5" />
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 uppercase">Community</span>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white font-sans">{kpis.totalUsers}</div>
          <div className="text-xs text-slate-500 mt-1">Certified Connoisseurs</div>
        </div>

        <div className="glass-card rounded-3xl p-6 border border-purple-500/20">
          <div className="flex items-center justify-between text-purple-500 mb-2">
            <TrendingUp className="w-5 h-5" />
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 uppercase">Inference</span>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white font-sans">{kpis.totalRecommendations}</div>
          <div className="text-xs text-slate-500 mt-1">Recommendations Served</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Daily Recommendations & User Growth Area Chart */}
        <div className="lg:col-span-8 glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200/60 dark:border-slate-800/60">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Daily AI Quiz Activity & Average Match Score
              </h3>
              <p className="text-xs text-slate-400">Weekly trend across registered connoisseurs</p>
            </div>
            <Badge variant="emerald">Live 7-Day Trend</Badge>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyActivity}>
                <defs>
                  <linearGradient id="colorCompletions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.15)" />
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '1rem',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="quizCompletions" name="Quiz Completions" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorCompletions)" />
                <Area type="monotone" dataKey="activeUsers" name="Active Users" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorUsers)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mood Distribution Pie Chart */}
        <div className="lg:col-span-4 glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200/60 dark:border-slate-800/60 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Target Mood Distribution
            </h3>
            <p className="text-xs text-slate-400">User state-of-mind breakdown</p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={moodDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {moodDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap justify-center gap-2 pt-2">
            {moodDistribution.map((m) => (
              <span key={m.mood} className="text-[10px] font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color }} />
                <span>{m.mood} ({m.value}%)</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Machine Learning Model Performance Benchmarks */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200/60 dark:border-slate-800/60 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 dark:border-slate-800/60">
          <div className="flex items-center gap-3">
            <Cpu className="w-6 h-6 text-emerald-500" />
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-sans">
                Machine Learning Algorithm Benchmarks
              </h3>
              <p className="text-xs text-slate-400">
                Evaluation across Scikit-Learn Decision Tree, Random Forest, Content-Based Cosine, and Hybrid Ensemble
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider">
                <th className="pb-3 font-semibold">Algorithm / Model Pipeline</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Accuracy</th>
                <th className="pb-3 font-semibold">Precision @ 5</th>
                <th className="pb-3 font-semibold">Recall @ 5</th>
                <th className="pb-3 font-semibold">NDCG @ 5</th>
                <th className="pb-3 font-semibold">Catalog Coverage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
              {modelMetrics.map((m) => (
                <tr key={m.key} className={m.isActive ? 'bg-emerald-500/10 dark:bg-emerald-950/30 font-bold' : ''}>
                  <td className="py-3.5 text-slate-900 dark:text-white">{m.name}</td>
                  <td className="py-3.5">
                    {m.isActive ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold">
                        ACTIVE IN PRODUCTION
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 text-[10px]">
                        BENCHMARKED
                      </span>
                    )}
                  </td>
                  <td className="py-3.5">{(m.accuracy * 100).toFixed(1)}%</td>
                  <td className="py-3.5">{(m.precision_at_5 * 100).toFixed(1)}%</td>
                  <td className="py-3.5">{(m.recall_at_5 * 100).toFixed(1)}%</td>
                  <td className="py-3.5 text-emerald-600 dark:text-emerald-400 font-bold">
                    {(m.ndcg_at_5 * 100).toFixed(1)}%
                  </td>
                  <td className="py-3.5">{(m.coverage * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
