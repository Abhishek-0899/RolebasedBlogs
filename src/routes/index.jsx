// router/index.jsx
import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../components/layout/appLayout";
import Home from "../pages/Home";
import Login from "../pages/login";
import SignIn from "../pages/SignIn";
import RequireRole from "../components/RequireRole";
import Authorlayout from "../components/layout/Author-Layout";
import Editorlayout from "../components/layout/Editor-Layout";
import AuthorDashboard from "../pages/Author/dashboard";
import EditorDashboard from "../pages/Editor/dashboard";
import PostID from "../pages/PostIDs";
import NewPosts from "../pages/Author/newPosts";
import ManagePost from "../pages/Editor/managePost";

const router = createBrowserRouter([
  // Auth pages (without navbar)
  { path: "/login", element: <Login /> },
  { path: "/SignIn", element: <SignIn /> },
  
  // Main layout pages (with navbar)
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "Posts/:id", element: <PostID /> },
    ],
  },
  {
    path: "/author",
    element: (
      <RequireRole role="author">
        <Authorlayout />
      </RequireRole>
    ),
    children: [
      { path: "dashboard", element: <AuthorDashboard /> },
      { path: "new-posts", element: <NewPosts /> },
      { path: "new-posts/:id", element: <NewPosts /> },
      { path: "Posts", element: <ManagePost /> },
      { path: "Posts/:id", element: <PostID /> }, // ✅ dynamic post
    ],
  },
  {
    path: "/editor",
    element: (
      <RequireRole role="editor">
        <Editorlayout />
      </RequireRole>
    ),
    children: [
      { path: "dashboard", element: <EditorDashboard /> },
      { path: "new-posts", element: <NewPosts /> },
      { path: "new-posts/:id", element: <NewPosts /> },
      { path: "Posts", element: <ManagePost /> },
      { path: "Posts/:id", element: <PostID /> }, // ✅ dynamic post
    ],
  },
]);

export default router;