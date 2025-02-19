import { useBookmarkStore } from "~/stores/bookmark";
import type { StoryResponse } from "./services/useStoryService";
export const useBookmark = () => {
  const bookmarkStore = useBookmarkStore();
  const pendingBookmarks = ref<Set<string>>(new Set());

  const { showToast } = useCustomToastify();

  const removeBookmarkedStory = (storyId: string, stories: StoryResponse[]) => {
    const storyIndex = stories.findIndex((story) => story.story_id === storyId);
    if (storyIndex !== -1) {
      stories.splice(storyIndex, 1);
    }
  };

  const toggleOptimisticBookmark = (story: StoryResponse, authorId: string) => {
    const isCurrentlyBookmarked = bookmarkStore.isBookmarked(story.story_id);
    bookmarkStore.toggleBookmark({
      story_id: story.story_id,
      user_id: authorId,
    });

    if (isCurrentlyBookmarked) {
      showToast("✅ Successfully removed story to bookmarks", {
        autoClose: 2000,
        position: "top-center",
      });
    } else {
      showToast("✅ Successfully added story to bookmarks", {
        autoClose: 2000,
        position: "top-center",
      });
    }

    return !isCurrentlyBookmarked;
  };

  const handleBookmarkError = (storyId: string) => {
    pendingBookmarks.value.delete(storyId);
  };

  return {
    pendingBookmarks,
    toggleOptimisticBookmark,
    handleBookmarkError,
    removeBookmarkedStory,
    isBookmarked: (storyId: string) => bookmarkStore.isBookmarked(storyId),
  };
};
