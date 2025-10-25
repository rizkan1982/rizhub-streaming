// Watch History & Continue Watching Manager

const HISTORY_KEY = 'rizhub_watch_history';
const FAVORITES_KEY = 'rizhub_favorites';
const MAX_HISTORY = 50;

// Get all watch history
export function getWatchHistory() {
  try {
    const history = localStorage.getItem(HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error loading watch history:', error);
    return [];
  }
}

// Add video to watch history
export function addToHistory(video) {
  try {
    let history = getWatchHistory();
    
    // Remove if already exists (to move to top)
    history = history.filter(v => v.url !== video.url);
    
    // Add to beginning
    history.unshift({
      ...video,
      watchedAt: Date.now()
    });
    
    // Keep only MAX_HISTORY items
    history = history.slice(0, MAX_HISTORY);
    
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    return history;
  } catch (error) {
    console.error('Error adding to history:', error);
    return [];
  }
}

// Clear watch history
export function clearHistory() {
  try {
    localStorage.removeItem(HISTORY_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing history:', error);
    return false;
  }
}

// Remove single item from history
export function removeFromHistory(videoUrl) {
  try {
    let history = getWatchHistory();
    history = history.filter(v => v.url !== videoUrl);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    return history;
  } catch (error) {
    console.error('Error removing from history:', error);
    return [];
  }
}

// Get continue watching (videos with saved progress)
export function getContinueWatching() {
  try {
    const keys = Object.keys(localStorage);
    const progressKeys = keys.filter(key => key.startsWith('video_progress_'));
    
    const continueWatching = progressKeys.map(key => {
      const data = JSON.parse(localStorage.getItem(key));
      return {
        ...data,
        progressPercent: (data.currentTime / data.duration) * 100
      };
    }).filter(v => {
      // Only show if watched between 5% and 95%
      return v.progressPercent > 5 && v.progressPercent < 95;
    }).sort((a, b) => b.timestamp - a.timestamp);
    
    return continueWatching.slice(0, 10); // Max 10 items
  } catch (error) {
    console.error('Error loading continue watching:', error);
    return [];
  }
}

// Favorites management
export function getFavorites() {
  try {
    const favorites = localStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Error loading favorites:', error);
    return [];
  }
}

export function toggleFavorite(video) {
  try {
    let favorites = getFavorites();
    const index = favorites.findIndex(v => v.url === video.url);
    
    if (index !== -1) {
      // Remove from favorites
      favorites.splice(index, 1);
    } else {
      // Add to favorites
      favorites.unshift({
        ...video,
        favoritedAt: Date.now()
      });
    }
    
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    return { favorites, isFavorite: index === -1 };
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return { favorites: getFavorites(), isFavorite: false };
  }
}

export function isFavorite(videoUrl) {
  const favorites = getFavorites();
  return favorites.some(v => v.url === videoUrl);
}

// Recent searches
const RECENT_SEARCHES_KEY = 'rizhub_recent_searches';
const MAX_RECENT_SEARCHES = 10;

export function getRecentSearches() {
  try {
    const searches = localStorage.getItem(RECENT_SEARCHES_KEY);
    return searches ? JSON.parse(searches) : [];
  } catch (error) {
    return [];
  }
}

export function addRecentSearch(query) {
  if (!query || query.trim() === '') return;
  
  try {
    let searches = getRecentSearches();
    
    // Remove if already exists
    searches = searches.filter(s => s.toLowerCase() !== query.toLowerCase());
    
    // Add to beginning
    searches.unshift(query);
    
    // Keep only MAX items
    searches = searches.slice(0, MAX_RECENT_SEARCHES);
    
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
    return searches;
  } catch (error) {
    console.error('Error adding recent search:', error);
    return [];
  }
}

export function clearRecentSearches() {
  try {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
    return true;
  } catch (error) {
    return false;
  }
}

