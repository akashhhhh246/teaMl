import React, { createContext, useContext, useState, useEffect } from 'react';
import { favoritesAPI } from '../services/api';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadFavorites();
    } else {
      setFavorites([]);
      setFavoriteIds(new Set());
    }
  }, [user]);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const res = await favoritesAPI.getMyFavorites();
      setFavorites(res.data || []);
      setFavoriteIds(new Set((res.data || []).map(f => f.teaId || f.tea?.id)));
    } catch (err) {
      console.error('Failed to load favorites', err);
    } finally {
      setLoading(false);
    }
  };

  const isFavorited = (teaId) => favoriteIds.has(teaId);

  const toggleFavorite = async (tea) => {
    const teaId = tea.id || tea.teaId;
    const currentlyFav = favoriteIds.has(teaId);

    // Optimistic Update
    setFavoriteIds(prev => {
      const next = new Set(prev);
      if (currentlyFav) next.delete(teaId);
      else next.add(teaId);
      return next;
    });

    try {
      if (currentlyFav) {
        await favoritesAPI.removeFavorite(teaId);
        setFavorites(prev => prev.filter(f => (f.teaId || f.tea?.id) !== teaId));
      } else {
        await favoritesAPI.addFavorite(teaId);
        setFavorites(prev => [{ tea, teaId, createdAt: new Date().toISOString() }, ...prev]);
      }
    } catch (err) {
      // Revert on error
      console.error('Failed to toggle favorite', err);
      loadFavorites();
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, favoriteIds, isFavorited, toggleFavorite, loading, refreshFavorites: loadFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
