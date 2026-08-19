import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Plus,
  Trash2,
  Edit,
  RotateCcw,
  Download,
  Award,
  Search,
  Check,
  Cpu,
} from 'lucide-react';
import { adminAPI, teasAPI, recommendationAPI } from '../../services/api';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { TeaImage } from '../../components/common/TeaImage';

export function AdminPage() {
  const [activeTab, setActiveTab] = useState('inventory');
  const [teas, setTeas] = useState([]);
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Retrain state
  const [retraining, setRetraining] = useState(false);
  const [retrainResult, setRetrainResult] = useState(null);

  // Add/Edit Tea Modal
  const [teaModalOpen, setTeaModalOpen] = useState(false);
  const [editingTea, setEditingTea] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    origin: 'Darjeeling (Makaibari)',
    teaType: 'Darjeeling',
    ingredients: '100% Hand-Picked First Flush Leaves',
    flavorProfile: ['Muscatel', 'Floral', 'Green Apple'],
    bitterness: 2.5,
    sweetness: 7.0,
    floralNotes: 8.5,
    spiceLevel: 1.0,
    aroma: 9.0,
    caffeine: 45,
    calories: 0,
    preparationTime: 3,
    steepTemperature: 85,
    waterRatio: '2.5g per 200ml',
    healthBenefits: ['High Antioxidants', 'Mental Focus'],
    moodTags: ['Calm', 'Focused'],
    season: 'First Flush Spring',
    price: 1450,
    description: '',
    foodPairings: ['Butter Biscuits', 'Nankhatai'],
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [teasRes, modelsRes] = await Promise.all([
        teasAPI.getTeas({ limit: 50, search }),
        recommendationAPI.compareModels(),
      ]);

      setTeas(teasRes.data || []);
      setModels(modelsRes.data || []);
    } catch (err) {
      console.error('Failed loading admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search]);

  const handleRetrain = async () => {
    try {
      setRetraining(true);
      setRetrainResult(null);
      const res = await recommendationAPI.retrain();
      setRetrainResult(res.data);
      const modelsRes = await recommendationAPI.compareModels();
      setModels(modelsRes.data || []);
    } catch (err) {
      console.error('Retraining error', err);
    } finally {
      setRetraining(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingTea(null);
    setFormData({
      name: '',
      origin: 'Darjeeling (Makaibari)',
      teaType: 'Darjeeling',
      ingredients: '100% Hand-Picked First Flush Leaves',
      flavorProfile: ['Muscatel', 'Floral', 'Green Apple'],
      bitterness: 2.5,
      sweetness: 7.0,
      floralNotes: 8.5,
      spiceLevel: 1.0,
      aroma: 9.0,
      caffeine: 45,
      calories: 0,
      preparationTime: 3,
      steepTemperature: 85,
      waterRatio: '2.5g per 200ml',
      healthBenefits: ['High Antioxidants', 'Mental Focus'],
      moodTags: ['Calm', 'Focused'],
      season: 'First Flush Spring',
      price: 1450,
      description: 'Exquisite single-estate harvest plucked during spring Himalayan mist.',
      foodPairings: ['Butter Biscuits', 'Nankhatai'],
      imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    });
    setTeaModalOpen(true);
  };

  const handleOpenEditModal = (t) => {
    setEditingTea(t);
    setFormData({
      ...t,
      flavorProfile: Array.isArray(t.flavorProfile) ? t.flavorProfile : [],
      healthBenefits: Array.isArray(t.healthBenefits) ? t.healthBenefits : [],
      moodTags: Array.isArray(t.moodTags) ? t.moodTags : [],
      foodPairings: Array.isArray(t.foodPairings) ? t.foodPairings : [],
    });
    setTeaModalOpen(true);
  };

  const handleSaveTea = async (e) => {
    e.preventDefault();
    try {
      if (editingTea) {
        await teasAPI.updateTea(editingTea.id, formData);
      } else {
        await teasAPI.createTea(formData);
      }
      setTeaModalOpen(false);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed saving tea blend');
    }
  };

  const handleDeleteTea = async (teaId) => {
    if (!confirm('Are you sure you want to delete this blend from the Indian cellar?')) return;
    try {
      await teasAPI.deleteTea(teaId);
      setTeas(teas.filter((t) => t.id !== teaId));
    } catch (err) {
      alert(err.message || 'Failed to delete tea');
    }
  };

  const handleExportJSON = async () => {
    try {
      const res = await adminAPI.exportData();
      const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `teaml_india_dataset_${Date.now()}.json`;
      a.click();
    } catch (err) {
      alert('Export failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/60 dark:border-slate-800/60">
        <div>
          <Badge variant="emerald" size="md">
            Indian Chai Cellar Management & ML Controls
          </Badge>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1 font-sans">
            Cellar Manager & Retraining Suite
          </h1>
          <p className="text-xs text-slate-500">
            Manage Indian estate harvests, update flavor profiles, and trigger ML ensemble retraining.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportJSON}
            className="px-4 py-2 rounded-xl text-xs font-semibold glass-card hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Cellar (JSON)</span>
          </button>
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Indian Harvest</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
        {[
          { key: 'inventory', label: 'Indian Terroir Inventory (1,050+)', icon: Award },
          { key: 'ml', label: 'ML Retraining & Benchmarks', icon: Cpu },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'glass-card text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Tea Inventory CRUD */}
      {activeTab === 'inventory' && (
        <div className="space-y-4 animate-fade-in">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search inventory by estate, origin, spice..."
              className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
            />
          </div>

          <div className="glass-panel rounded-3xl overflow-hidden border border-slate-200/60 dark:border-slate-800/60">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-900/50">
                    <th className="p-4 font-semibold">Indian Blend</th>
                    <th className="p-4 font-semibold">Terroir Region</th>
                    <th className="p-4 font-semibold">Category</th>
                    <th className="p-4 font-semibold">Sensory Balance</th>
                    <th className="p-4 font-semibold">Price / 100g</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                  {teas.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="p-4 flex items-center gap-3">
                        <TeaImage
                          src={t.imageUrl}
                          alt={t.name}
                          category={t.teaType}
                          className="w-10 h-10 rounded-xl flex-shrink-0"
                        />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">{t.name}</div>
                          <div className="text-[10px] text-slate-400">{t.id}</div>
                        </div>
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-300">{t.origin}</td>
                      <td className="p-4"><Badge variant="emerald">{t.teaType}</Badge></td>
                      <td className="p-4 text-[11px]">
                        Spice: {t.spiceLevel} • Floral: {t.floralNotes} • Sweet: {t.sweetness}
                      </td>
                      <td className="p-4 font-bold text-emerald-600 dark:text-emerald-400">₹{t.price}</td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(t)}
                          className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTea(t.id)}
                          className="p-1.5 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-950/50 text-rose-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ML Retraining */}
      {activeTab === 'ml' && (
        <div className="space-y-6 animate-fade-in">
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Automated Model Retraining
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white font-sans">
                Retrain All 4 Recommendation Models
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-xl">
                Re-evaluates Random Forest multi-target trees and TF-IDF matrices across the 1,050+ Indian harvest catalog.
              </p>
            </div>

            <button
              onClick={handleRetrain}
              disabled={retraining}
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-95 disabled:opacity-50"
            >
              <RotateCcw className={`w-4 h-4 ${retraining ? 'animate-spin' : ''}`} />
              <span>{retraining ? 'Retraining Ensemble...' : 'Trigger Model Retrain'}</span>
            </button>
          </div>

          {retrainResult && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500" />
              <span>
                Retraining complete! Best model selected: <b>{retrainResult.activeModel}</b>
              </span>
            </div>
          )}

          {/* Model Comparison Table */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-200/60 dark:border-slate-800/60">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
              Current Benchmark Leaderboard
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Model</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold">Accuracy</th>
                    <th className="pb-3 font-semibold">NDCG @ 5</th>
                    <th className="pb-3 font-semibold">Coverage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {models.map((m) => (
                    <tr key={m.key} className={m.isActive ? 'bg-emerald-500/10 font-bold' : ''}>
                      <td className="py-3 text-slate-900 dark:text-white">{m.name}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${m.isActive ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                          {m.isActive ? 'ACTIVE' : 'STANDBY'}
                        </span>
                      </td>
                      <td className="py-3">{(m.accuracy * 100).toFixed(1)}%</td>
                      <td className="py-3 text-emerald-600 dark:text-emerald-400">{(m.ndcg_at_5 * 100).toFixed(1)}%</td>
                      <td className="py-3">{(m.coverage * 100).toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Tea Modal */}
      <Modal
        isOpen={teaModalOpen}
        onClose={() => setTeaModalOpen(false)}
        title={editingTea ? `Edit Harvest: ${editingTea.name}` : 'Add New Indian Harvest to Cellar'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSaveTea} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Blend Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Category</label>
              <select
                value={formData.teaType}
                onChange={(e) => setFormData({ ...formData, teaType: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              >
                {['Darjeeling', 'Assam', 'Masala Chai', 'Kashmir Kahwa', 'Nilgiri', 'Ayurvedic Tisane', 'Kangra Valley', 'Sikkim Temi'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Terroir / Region</label>
              <input
                type="text"
                value={formData.origin}
                onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                required
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Price / 100g (₹)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                required
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setTeaModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow hover:bg-emerald-700"
            >
              Save Harvest
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
