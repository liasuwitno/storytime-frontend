import { useBookmarkService } from "~/composables/services/useBookmarkService";

interface BookmarkState {
  bookmarkedStories: Array<{ story_id: string; user_id: string }>;
  loadingStates: { [key: string]: boolean };
}

export const useBookmarkStore = defineStore("bookmark", {
  state: (): BookmarkState => ({
    bookmarkedStories: [],
    loadingStates: {},
  }),

  getters: {
    getBookmarkedStories: (state) => state.bookmarkedStories,
    isBookmarked: (state) => (storyId: string) => {
      return state.bookmarkedStories.some(
        (story) => story.story_id === storyId
      );
    },
  },

  actions: {
    setLoadingState(storyId: string, loading: boolean) {
      this.loadingStates[storyId] = loading;
    },

    isLoading(storyId: string): boolean {
      return this.loadingStates[storyId] || false;
    },

    initializeBookmarks(stories: any[]) {
      this.bookmarkedStories = [...stories, ...this.bookmarkedStories];
    },

    setResetBookmarks() {
      this.bookmarkedStories = [];
    },

    async toggleBookmark(payload: { story_id: string; user_id: string }) {
      const { addBookmark } = useBookmarkService();

      try {
        this.setLoadingState(payload.story_id, true);
        const isCurrentlyBookmarked = this.isBookmarked(payload.story_id);

        const response = await addBookmark({
          story_id: payload.story_id,
          user_id: payload.user_id,
        });

        if (response.status === "success") {
          if (isCurrentlyBookmarked) {
            this.bookmarkedStories = this.bookmarkedStories.filter(
              (story) => story.story_id !== payload.story_id
            );
          } else {
            this.bookmarkedStories.push(payload);
          }
        }

        // if (response.status !== "success") {
        //   if (isCurrentlyBookmarked) {
        //     this.bookmarkedStories.push(payload);
        //   } else {
        //     this.bookmarkedStories = this.bookmarkedStories.filter(
        //       (story) => story.story_id !== payload.story_id
        //     );
        //   }
        // }
      } catch (error) {
        console.error("[BOOKMARK_ERROR]:", error);
        throw error;
      } finally {
        this.setLoadingState(payload.story_id, false);
      }
    },
  },
});
