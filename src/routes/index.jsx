import React from "react";
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
import CreatePost from "../pages/Editor/createPost";
const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <Home /> },
      {
        path: "/login",
        element: <Login />,
      },
      { path: "/SignIn", element: <SignIn /> },
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
      // { path: "/maganePost", element: <ManagePost /> },
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
      { path: "newPost", element: <CreatePost /> },
    ],
  },
]);

export default router;
