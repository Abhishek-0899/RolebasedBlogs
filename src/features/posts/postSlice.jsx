import { createSlice } from "@reduxjs/toolkit";

const initialStatsData = {
  posts: [],
  stats: {
    drafts: 0,
    review: 0,
    published: 0,
    totalPosts: 0,
  },
};

const PostSlice = createSlice({
  name: "posts",
  initialState: initialStatsData,
  reducers: {
    saveDraft(state, action) {
      const index = state.posts.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.posts[index] = {
          ...state.posts[index],
          ...action.payload,
          status: "draft",
        };
        const prevStatus = state.posts[index].status;
        if (prevStatus !== "draft") {
          state.stats.drafts += 1;
          if (prevStatus === "pending") state.stats.review -= 1;
        }
      } else {
        state.posts.unshift({ ...action.payload, status: "draft" });
        state.stats.drafts += 1;
        state.stats.totalPosts += 1;
      }
    },
    reviewPost(state, action) {
      const index = state.posts.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.posts[index] = {
          ...state.posts[index],
          ...action.payload,
          status: "pending",
        };
        const prevStatus = state.posts[index].status;
        if (prevStatus !== "pending") {
          state.stats.review += 1;
          if (prevStatus === "draft") state.stats.drafts -= 1;
        }
      } else {
        state.posts.unshift({ ...action.payload, status: "pending" });
        state.stats.review += 1;
        state.stats.totalPosts += 1;
      }
    },
    publishPost(state, action) {
      const postId = action.payload;
      const post = state.posts.find((p) => p.id === postId);
      if (!post || post.status !== "pending") return;

      post.status = "published";
      state.stats.review -= 1;
      state.stats.published += 1;
    },
    deletePost(state, action) {
      const postId = action.payload;
      const postToDelete = state.posts.find((p) => p.id === postId);
      if (!postToDelete) return;
      if (postToDelete.status === "draft") state.stats.drafts -= 1;
      if (postToDelete.status === "pending") state.stats.review -= 1;
      if (postToDelete.status === "published") state.stats.published -= 1;
      state.stats.totalPosts -= 1;
      state.posts = state.posts.filter((p) => p.id !== postId);
    },
  },
});

export const { saveDraft, reviewPost, publishPost, deletePost } =
  PostSlice.actions;
export default PostSlice.reducer;
