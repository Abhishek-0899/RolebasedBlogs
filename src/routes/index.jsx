import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../components/layout/appLayout";
import Home from "../pages/Home";
import Login from "../pages/login";
import SignIn from "../pages/SignIn";
import RequireAuth from "../components/RequireAuth";
import RequireRole from "../components/RequireRole";

import Authorlayout from "../components/layout/Author-Layout";
import Editorlayout from "../components/layout/Editor-Layout";

import AuthorDashboard from "../pages/Author/dashboard";
import EditorDashboard from "../pages/Editor/dashboard";
import PostID from "../pages/PostIDs";
import NewPosts from "../pages/Author/newPosts";
import ManagePost from "../pages/Editor/managePost";

const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/signin", element: <SignIn /> },

  {
    element: (
      <RequireAuth>
        <AppLayout />
      </RequireAuth>
    ),
    children: [
      { path: "/", element: <Home /> },
      { path: "posts/:id", element: <PostID /> },
    ],
  },

  {
    path: "/author",
    element: (
      <RequireAuth>
        <RequireRole role="author">
          <Authorlayout />
        </RequireRole>
      </RequireAuth>
    ),
    children: [
      { path: "dashboard", element: <AuthorDashboard /> },
      { path: "new-posts", element: <NewPosts /> },
      { path: "new-posts/:id", element: <NewPosts /> },
      { path: "posts", element: <ManagePost /> },
      { path: "posts/:id", element: <PostID /> },
    ],
  },

  {
    path: "/editor",
    element: (
      <RequireAuth>
        <RequireRole role="editor">
          <Editorlayout />
        </RequireRole>
      </RequireAuth>
    ),
    children: [
      { path: "dashboard", element: <EditorDashboard /> },
      { path: "new-posts", element: <NewPosts /> },
      { path: "new-posts/:id", element: <NewPosts /> },
      { path: "posts", element: <ManagePost /> },
      { path: "posts/:id", element: <PostID /> },
    ],
  },
]);

export default router;