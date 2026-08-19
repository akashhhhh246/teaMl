import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-200/60 dark:border-slate-800/60 bg-white/40 dark:bg-slate-950/40 backdrop-blur-md mt-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                <span className="text-xl">🍵</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white font-sans">
                    Tea<span className="text-emerald-500">ML</span>
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                    India 🇮🇳
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 tracking-wide font-medium">
                  Curated Tea Experiences.
                </span>
              </div>
            </Link>

            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              Helping you discover teas you'll truly enjoy, one cup at a time. Curating handcrafted harvests from single-estate Darjeeling gardens, bold Upper Assam valleys, fragrant Nilgiri peaks, and Himalayan wellness botanicals.
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pt-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              <span>Darjeeling • Assam • Nilgiris • Kangra • Kashmir • Sikkim</span>
            </div>
          </div>

          {/* Col 2: Explore Teas */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Explore Teas
            </h3>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/teas?teaType=Darjeeling" className="hover:text-emerald-500 transition-colors">
                  Darjeeling Spring Flushes
                </Link>
              </li>
              <li>
                <Link to="/teas?teaType=Assam" className="hover:text-emerald-500 transition-colors">
                  Upper Assam Malty Breakfast
                </Link>
              </li>
              <li>
                <Link to="/teas?teaType=Kashmir%20Kahwa" className="hover:text-emerald-500 transition-colors">
                  Kashmiri Saffron Almond Kahwa
                </Link>
              </li>
              <li>
                <Link to="/teas?teaType=Nilgiri" className="hover:text-emerald-500 transition-colors">
                  Nilgiri Frost Blue Mountain
                </Link>
              </li>
              <li>
                <Link to="/teas?teaType=Kangra%20Valley" className="hover:text-emerald-500 transition-colors">
                  Kangra Valley Greens
                </Link>
              </li>
              <li>
                <Link to="/teas?teaType=Ayurvedic%20Tisane" className="hover:text-emerald-500 transition-colors">
                  Restorative Ayurvedic Tisanes
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Tea Guide */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Tea Guide
            </h3>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/quiz" className="hover:text-emerald-500 transition-colors">
                  Find Your Ideal Profile
                </Link>
              </li>
              <li>
                <Link to="/teas" className="hover:text-emerald-500 transition-colors">
                  The Art of Water Temperature
                </Link>
              </li>
              <li>
                <Link to="/teas" className="hover:text-emerald-500 transition-colors">
                  Loose Leaf vs. Whole Leaf
                </Link>
              </li>
              <li>
                <Link to="/teas" className="hover:text-emerald-500 transition-colors">
                  First Flush vs. Second Flush
                </Link>
              </li>
              <li>
                <Link to="/teas" className="hover:text-emerald-500 transition-colors">
                  Culinary Tea Pairings
                </Link>
              </li>
              <li>
                <Link to="/teas" className="hover:text-emerald-500 transition-colors">
                  Preserving Harvest Freshness
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Tea Origins & About TeaML */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Tea Origins
            </h3>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <span className="text-slate-700 dark:text-slate-300 font-medium">Darjeeling</span>
                <span className="text-slate-400 text-[11px] block">West Bengal Himalayas</span>
              </li>
              <li>
                <span className="text-slate-700 dark:text-slate-300 font-medium">Brahmaputra Valley</span>
                <span className="text-slate-400 text-[11px] block">Upper Assam</span>
              </li>
              <li>
                <span className="text-slate-700 dark:text-slate-300 font-medium">Nilgiri Blue Mountains</span>
                <span className="text-slate-400 text-[11px] block">Tamil Nadu Highlands</span>
              </li>
              <li>
                <span className="text-slate-700 dark:text-slate-300 font-medium">Kangra Valley</span>
                <span className="text-slate-400 text-[11px] block">Himachal Pradesh</span>
              </li>
              <li>
                <span className="text-slate-700 dark:text-slate-300 font-medium">Temi Tea Estate</span>
                <span className="text-slate-400 text-[11px] block">South Sikkim</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Clean Centered Message & Subtle Legal Disclaimer */}
        <div className="pt-8 border-t border-slate-200/60 dark:border-slate-800/60 space-y-4 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
            <span>Curated with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>for tea lovers across India and beyond.</span>
          </div>

          {/* Elegant Legal Disclaimer */}
          <div className="pt-1">
            <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed max-w-3xl mx-auto">
              Disclaimer: TeaML is an independent educational and portfolio project. Tea names, tea estates, gardens, brands, logos, trademarks, and images belong to their respective owners. Any references are used solely for educational, informational, and demonstration purposes. TeaML does not claim ownership of third-party intellectual property and is not affiliated with, endorsed by, or sponsored by any tea estate, tea company, or brand.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
