import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import supabase from "../../utils/supabase";

const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.from("posts").select("*");
      if (error) throw error;
      return data || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const publishPost = createAsyncThunk(
  "posts/publishPost",
  async (postId, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .update({ status: "published" })
        .eq("id", postId)
        .select();
      // .single();

      console.log("Publish response:", { data, error });

      if (error) throw error;
      if (!data) throw new Error(" no row updated");
      return data;
    } catch (error) {
      console.error("Publish failed:", error);
      return rejectWithValue(error.message);
    }
  },
);

const savedPost = createAsyncThunk(
  "posts/savePost",
  async (post, { rejectWithValue }) => {
    let query;
    if (post.id) {
      // edit
      query = supabase
        .from("posts")
        .update({
          title: post.title,
          content: post.content,
          excerpt: post.excerpt,
          status: post.status,
        })
        .eq("id", post.id)
        .select()
        .single();
    } else {
      // create
      query = supabase
        .from("posts")
        .insert({
          title: post.title,
          content: post.content,
          excerpt: post.excerpt,
          status: post.status,
        })
        .select()
        .single();
    }

    const { data, error } = await query;
    if (error) return rejectWithValue(error.message);
    return data;
  },
);
const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (postId, { rejectWithValue }) => {
    try {
      const { error } = await supabase.from("posts").delete().eq("id", postId);
      if (error) throw error;
      return postId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export { fetchPosts, publishPost, deletePost, savedPost };

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
        const prevStatus = state.posts[index].status;
        state.posts[index] = {
          ...state.posts[index],
          title: action.payload.title,
          excerpt: action.payload.excerpt,
          content: action.payload.content,
          status: "draft",
        };
        if (prevStatus !== "draft") {
          state.stats.drafts += 1;
          if (prevStatus === "pending") state.stats.review -= 1;
          if (prevStatus === "published") state.stats.published -= 1;
        }
      } else {
        state.posts.unshift({
          id: action.payload.id,
          title: action.payload.title,
          excerpt: action.payload.excerpt,
          content: action.payload.content,
          authorId: action.payload.authorId,
          ownerRole: action.payload.ownerRole,
          date: action.payload.date,
          status: "draft",
        });
        state.stats.drafts += 1;
        state.stats.totalPosts += 1;
      }
    },
    reviewPost(state, action) {
      const index = state.posts.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        const prevStatus = state.posts[index].status;
        state.posts[index] = {
          ...state.posts[index],
          title: action.payload.title,
          excerpt: action.payload.excerpt,
          content: action.payload.content,
          status: "pending",
        };
        if (prevStatus !== "pending") {
          state.stats.review += 1;
          if (prevStatus === "draft") state.stats.drafts -= 1;
          if (prevStatus === "published") state.stats.published -= 1;
        }
      } else {
        state.posts.unshift({
          id: action.payload.id,
          title: action.payload.title,
          excerpt: action.payload.excerpt,
          content: action.payload.content,
          authorId: action.payload.authorId,
          ownerRole: action.payload.ownerRole,
          date: action.payload.date,
          status: "pending",
        });
        state.stats.review += 1;
        state.stats.totalPosts += 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPosts.fulfilled, (state, action) => {
      state.posts = action.payload;
      state.stats = {
        drafts: action.payload.filter((p) => p.status === "draft").length,
        review: action.payload.filter((p) => p.status === "pending").length,
        published: action.payload.filter((p) => p.status === "published")
          .length,
        totalPosts: action.payload.length,
      };
    });
    builder.addCase(publishPost.fulfilled, (state, action) => {
      const updatePost = action.payload[0];
      const index = state.posts.find((p) => p.id === updatePost.id);
      if (index !== -1) {
        state.posts[index] = updatePost;
        // update stats
        state.posts.published += 1;
        if (state.posts[index].status === "pending") state.stats.review -= 1;
        if (state.posts[index].status === "draft") state.stats.drafts -= 1;
      }
    });
    builder.addCase(publishPost.rejected, (state, action) => {
      console.error("Publish rejected:", action.payload);
    });
    builder.addCase(deletePost.fulfilled, (state, action) => {
      const postId = action.payload;
      const postToDelete = state.posts.find((p) => p.id === postId);
      if (postToDelete) {
        if (postToDelete.status === "draft") state.stats.drafts -= 1;
        if (postToDelete.status === "pending") state.stats.review -= 1;
        if (postToDelete.status === "published") state.stats.published -= 1;
        state.stats.totalPosts -= 1;
        state.posts = state.posts.filter((p) => p.id !== postId);
      }
    });
    builder.addCase(deletePost.rejected, (state, action) => {
      console.error("Delete rejected:", action.payload);
    });
  },
});

export const { saveDraft, reviewPost } = PostSlice.actions;
export default PostSlice.reducer;
