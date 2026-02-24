import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import supabase from "../../utils/supabase";

/* ===============================
   FETCH POSTS
================================= */
export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/* ===============================
   SAVE POST (CREATE OR UPDATE)
================================= */
export const savedPost = createAsyncThunk(
  "posts/savedPost",
  async (post, { rejectWithValue }) => {
    try {
      let query;

      if (post.id) {
        // UPDATE
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
        // CREATE
        query = supabase
          .from("posts")
          .insert({
            title: post.title,
            content: post.content,
            excerpt: post.excerpt,
            status: post.status,
            created_by: post.created_by,
          })
          .select()
          .single();
      }

      const { data, error } = await query;
      if (error) throw error;

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/* ===============================
   PUBLISH POST
================================= */
export const publishPost = createAsyncThunk(
  "posts/publishPost",
  async (postId, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .update({ status: "published" })
        .eq("id", postId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/* ===============================
   DELETE POST
================================= */
export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (postId, { rejectWithValue }) => {
    try {
      const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", postId);

      if (error) throw error;
      return postId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/* ===============================
   SLICE
================================= */

const initialState = {
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
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    /* FETCH */
    builder.addCase(fetchPosts.fulfilled, (state, action) => {
      state.posts = action.payload;
      recalculateStats(state);
    });

    /* SAVE (CREATE OR UPDATE) */
    builder.addCase(savedPost.fulfilled, (state, action) => {
      const post = action.payload;

      const index = state.posts.findIndex((p) => p.id === post.id);

      if (index !== -1) {
        state.posts[index] = post;
      } else {
        state.posts.unshift(post);
      }

      recalculateStats(state);
    });

    /* PUBLISH */
    builder.addCase(publishPost.fulfilled, (state, action) => {
      const updatedPost = action.payload;

      const index = state.posts.findIndex(
        (p) => p.id === updatedPost.id
      );

      if (index !== -1) {
        state.posts[index] = updatedPost;
      }

      recalculateStats(state);
    });

    /* DELETE */
    builder.addCase(deletePost.fulfilled, (state, action) => {
      state.posts = state.posts.filter(
        (p) => p.id !== action.payload
      );

      recalculateStats(state);
    });
  },
});

/* ===============================
   HELPER FUNCTION
================================= */

function recalculateStats(state) {
  state.stats = {
    drafts: state.posts.filter((p) => p.status === "draft").length,
    review: state.posts.filter((p) => p.status === "pending").length,
    published: state.posts.filter((p) => p.status === "published").length,
    totalPosts: state.posts.length,
  };
}

export default PostSlice.reducer;