import React, { useState } from 'react';

const CATEGORY_FALLBACK_GRADIENTS = {
  Darjeeling: 'from-amber-700 via-amber-600 to-yellow-500',
  Assam: 'from-amber-950 via-amber-900 to-amber-800',
  'Masala Chai': 'from-amber-800 via-orange-800 to-yellow-700',
  'Kashmir Kahwa': 'from-emerald-800 via-teal-700 to-amber-600',
  Nilgiri: 'from-blue-900 via-sky-800 to-emerald-700',
  'Ayurvedic Tisane': 'from-emerald-900 via-teal-800 to-green-700',
  'Kangra Valley': 'from-green-900 via-emerald-800 to-lime-700',
  'Sikkim Temi': 'from-emerald-950 via-teal-900 to-amber-700',
};

const CATEGORY_EMOJIS = {
  Darjeeling: '🍃',
  Assam: '☕',
  'Masala Chai': '🫖',
  'Kashmir Kahwa': '✨',
  Nilgiri: '🏔️',
  'Ayurvedic Tisane': '🌿',
  'Kangra Valley': '🍵',
  'Sikkim Temi': '🌱',
};

// Verified high-res CDN fallback photos by category
const CATEGORY_BACKUP_IMAGES = {
  Darjeeling: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
  Assam: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
  'Masala Chai': 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&w=800&q=80',
  'Kashmir Kahwa': 'https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?auto=format&fit=crop&w=800&q=80',
  Nilgiri: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=800&q=80',
  'Ayurvedic Tisane': 'https://images.unsplash.com/photo-1546852199-2d8e8c4aa477?auto=format&fit=crop&w=800&q=80',
  'Kangra Valley': 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&w=800&q=80',
  'Sikkim Temi': 'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=800&q=80',
};

export function TeaImage({
  src,
  alt = 'Tea Blend',
  category = 'Darjeeling',
  className = '',
  aspectRatio = '',
}) {
  const [errorCount, setErrorCount] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const fallbackGradient = CATEGORY_FALLBACK_GRADIENTS[category] || 'from-emerald-900 to-amber-900';
  const categoryEmoji = CATEGORY_EMOJIS[category] || '🍵';
  const backupImg = CATEGORY_BACKUP_IMAGES[category] || CATEGORY_BACKUP_IMAGES['Darjeeling'];

  const handleError = () => {
    setErrorCount((prev) => prev + 1);
  };

  // If primary and backup URL fail, render rich artistic CSS Botanical Gradient Card
  if (errorCount >= 2 || (!src && !backupImg)) {
    return (
      <div
        className={`w-full h-full bg-gradient-to-br ${fallbackGradient} flex flex-col items-center justify-center p-4 text-white relative overflow-hidden select-none ${className}`}
      >
        <div className="absolute -right-4 -bottom-4 text-7xl opacity-15 rotate-12">
          {categoryEmoji}
        </div>
        <div className="text-4xl mb-1 filter drop-shadow-md">{categoryEmoji}</div>
        <div className="text-xs font-bold uppercase tracking-wider text-center drop-shadow">
          {category}
        </div>
        <div className="text-[10px] text-white/80 text-center font-medium mt-0.5 truncate max-w-[90%]">
          {alt}
        </div>
      </div>
    );
  }

  const currentSrc = errorCount === 0 ? src || backupImg : backupImg;

  return (
    <div className={`relative overflow-hidden bg-slate-100 dark:bg-slate-800 ${className}`}>
      {!loaded && (
        <div
          className={`absolute inset-0 bg-gradient-to-br ${fallbackGradient} opacity-40 animate-pulse flex items-center justify-center`}
        >
          <span className="text-2xl opacity-60">{categoryEmoji}</span>
        </div>
      )}
      <img
        src={currentSrc}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={handleError}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}
