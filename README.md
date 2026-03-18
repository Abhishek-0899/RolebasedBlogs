# 📝 Blogify — Role-Based Blog Platform
[![Live Demo](https://img.shields.io/badge/Live-Demo-green)](https://rolebased-blogs.vercel.app/)

> Blogify — Role-Based Blog Platform is a full-stack, production-minded web application built using React, Tailwind CSS, and Supabase. It demonstrates real-world engineering patterns and Role-Based Access Control (RBAC) for secure content management.

The platform supports three user roles:

- **Reader** — Browse and search published posts
- **Author** — Create, edit, and manage their own posts
- **Editor** — Publish and moderate posts from all authors

Key features include:

Authentication & Authorization — Sign up and login with Supabase Auth, profile-based roles, and role-specific routing.

Debounced Search — Efficient search functionality with 500ms delay for better UX and reduced API calls.

Responsive UI — Fully mobile-first, modern UI built with Tailwind CSS.

Data Management — Supabase as a backend with Row Level Security (RLS) and structured database schema.

Scalable Architecture — Separation of concerns with reusable components and containerized logic for maintainable code.

## Database Schema

The application uses a relational structure connecting users, posts, comments, and replies.

### Database Schema
![Database Schema](https://github.com/Abhishek-0899/RolebasedBlogs/blob/main/src/assets/Supabase.png)

The schema illustrates how users, profiles, posts, comments, and replies are connected in a relational structure.  
It reflects the backend design used to support authentication, role-based permissions, and scalable content relationships.

## 🧠 Overview

Blogify demonstrates real-world engineering patterns:

- **Secure Role-Based Access Control (RBAC)**
- **Scalable Frontend Architecture**
- **Supabase as BaaS with Row Level Security (RLS)**
- **Debounced Search & Pagination**
- **Mobile-first Tailwind CSS UI**

Ideal for showcasing frontend engineering skills, role-based architecture, and production-minded development practices.

## 🛠 Built With

| Technology | Purpose |
|------------|---------|
| **React** | Frontend UI |
| **React Router** | Routing & protected routes |
| **Supabase** | Auth, Database, Storage |
| **Tailwind CSS** | Styling |
| **JavaScript (ESNext)** | Language |
| **PostgreSQL** | Supabase DB |

---
### Signup Page
![Signup Page](https://github.com/Abhishek-0899/RolebasedBlogs/blob/main/src/assets/1.png)
![Signup Role Selection](https://github.com/Abhishek-0899/RolebasedBlogs/blob/main/src/assets/2.png)

The signup flow allows new users to register securely using Supabase Authentication.  
During registration, users can choose a role such as Reader, Author, or Editor, which determines their permissions and dashboard access inside the platform.

### Login Page
![Login Page](https://github.com/Abhishek-0899/RolebasedBlogs/blob/main/src/assets/LoginPage.png)

The login page authenticates existing users and restores their access based on the role stored in the profile table.  
After successful login, users are redirected to their respective dashboard, ensuring a role-aware experience from the start.

### Editor Dashboard
![Editor Dashboard](https://github.com/Abhishek-0899/RolebasedBlogs/blob/main/src/assets/EditorDashboard.png)

The Editor dashboard provides elevated access to review, manage, and publish posts across the platform.  
This view demonstrates RBAC in action by exposing moderation capabilities that are not available to Readers or Authors.

### Author Dashboard
![Author Dashboard](https://github.com/Abhishek-0899/RolebasedBlogs/blob/main/src/assets/AuthorDashboard.png)

The Author dashboard is designed for content creators to manage their own posts efficiently.  
Authors can create, edit, and track their content while being restricted from accessing higher-level editorial controls.

### Reader Dashboard
![Reader Dashboard](https://github.com/Abhishek-0899/RolebasedBlogs/blob/main/src/assets/Reader.png)

The Reader dashboard focuses on content consumption with a clean and simple browsing experience.  
Readers can explore published posts and search relevant content without access to content creation or moderation features.

### All Posts
![All Posts](https://github.com/Abhishek-0899/RolebasedBlogs/blob/main/src/assets/AllPosts.png)

This page displays the complete list of available posts with support for browsing and discovering content easily.  
It highlights the platform’s structured content listing, reusable UI components, and scalable post rendering approach.

### Create Post
![Create Post](https://github.com/Abhishek-0899/RolebasedBlogs/blob/main/src/assets/createPost.png)

The Create Post page enables authorized users to write and publish new blog content through a dedicated form interface.  
It showcases protected access, controlled content workflows, and a clean authoring experience within the application.

### Post Details
![Post Details](https://github.com/Abhishek-0899/RolebasedBlogs/blob/main/src/assets/postId.png)

The post details page shows the full content of an individual blog post in a dedicated view.  
It demonstrates dynamic routing, data fetching by post ID, and a structured reading experience for end users.

## 🚀 Features

### Authentication
- Email/password signup & login
- Role lookup from `profiles`
- Role-based redirection

### Roles
- **Reader** — Browse & search posts
- **Author** — Write and manage posts
- **Editor** — Moderate & publish posts

### UI/UX
- Mobile & desktop responsive
- Accessible forms
- Debounced search (500ms)
- Clean role selector dropdown

### Data Handling
- Pagination for posts
- Optimized Supabase queries

## 📦 Folder Structure

```text
src/
├── components/          # Reusable UI components
├── pages/               # Route pages (Login, SignIn, Dashboard)
├── utils/               # Supabase client & helpers
├── features/            # (Optional) Redux logic
├── assets/              # Images & static files
├── index.css            # Global styles
└── App.jsx              # Entry point

```
## ⚙️ Getting Started
### Prerequisites

Node.js >=16

NPM or Yarn

Supabase account


## Installation

```text
git clone https://github.com/Abhishek-0899/RolebasedBlogs.git
cd RolebasedBlogs
npm install

```

### Setup Environment

Create .env:

```text
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

Run
```text
npm run dev
```

## 📘 Usage

Visit /signup to register

Choose your role

Login redirects automatically based on role

## 🔒 Security

Row Level Security enabled

JWT validation via Supabase

Client-side route guards

Role enforcement at database level

## 📈 Roadmap

Cursor-based pagination

Supabase storage for images

Comments system

Realtime updates

Automated testing (Jest/RTL)

CI/CD workflow integration


## 🤝 Contributing

See CONTRIBUTING.md
 for guidelines.


## 📫 Contact

**Abhishek Kumar Pandit**  
GitHub: [Abhishek-0899](https://github.com/Abhishek-0899)


