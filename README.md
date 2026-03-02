# 📝 Blogify — Role-Based Blog Platform

[![License](https://img.shields.io/github/license/yourusername/blogify)](LICENSE)
[![Last Commit](https://img.shields.io/github/last-commit/yourusername/blogify)](https://github.com/yourusername/blogify)
[![Contributors](https://img.shields.io/github/contributors/yourusername/blogify)](https://github.com/yourusername/blogify/graphs/contributors)
[![Issues](https://img.shields.io/github/issues/yourusername/blogify)](https://github.com/yourusername/blogify/issues)

> A production-ready Role-Based Blog Platform built with **React** and **Supabase**, featuring secure authentication and authorization, responsive UI, debounced search, and clean architecture.

---

## 🧠 Overview

Blogify demonstrates real-world engineering patterns:

- **Secure Role-Based Access Control (RBAC)**
- **Scalable Frontend Architecture**
- **Supabase as BaaS with Row Level Security (RLS)**
- **Debounced Search & Pagination**
- **Mobile-first Tailwind CSS UI**

Ideal for showcasing remote-ready, senior-level frontend engineering skills.

---

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

---

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
git clone https://github.com/yourusername/blogify.git
cd blogify
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

### Abhishek Kumar Pandit


