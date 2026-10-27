import { create } from "zustand";

interface BookmarkStore {
  bookmarkedMovieIds: number[];
  toggleBookmark: (movieId: number) => void;
}

const storageKey = "umcine-bookmark-store";

function loadBookmarkedMovieIds(): number[] {
  try {
    const saved = localStorage.getItem(storageKey);
    const ids: unknown = saved ? JSON.parse(saved) : [];
    return Array.isArray(ids) && ids.every((id) => typeof id === "number")
      ? ids
      : [];
  } catch {
    return [];
  }
}

export const useBookmarkStore = create<BookmarkStore>((set) => ({
  bookmarkedMovieIds: loadBookmarkedMovieIds(),
  toggleBookmark: (movieId) =>
    set((state) => {
      const bookmarkedMovieIds = state.bookmarkedMovieIds.includes(movieId)
        ? state.bookmarkedMovieIds.filter((id) => id !== movieId)
        : [...state.bookmarkedMovieIds, movieId];

      if (bookmarkedMovieIds.length > 0) {
        localStorage.setItem(storageKey, JSON.stringify(bookmarkedMovieIds));
      } else {
        localStorage.removeItem(storageKey);
      }

      return { bookmarkedMovieIds };
    }),
}));
