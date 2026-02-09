import { configureStore } from "@reduxjs/toolkit";
import postReducers from "../features/posts/postSlice";

export const store  = configureStore({
reducer : {
    posts : postReducers
}
})