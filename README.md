🧠 Role-Based Publishing Platform (RBAC + Supabase)

A production-oriented blog platform built with React and Supabase, designed around scalable frontend architecture, secure role-based access control, and clean data flow patterns.

This project focuses on real-world engineering concerns: authentication, authorization, pagination, debounced search, protected routing, and separation of UI from business logic.

🎯 Core Objectives

Implement secure Role-Based Access Control (RBAC)

Design scalable frontend architecture

Integrate Supabase as a backend service layer

Optimize UX with debounced search and controlled rendering

Maintain clean component separation and predictable state flow

🏗 Architecture Overview
Frontend

React (Functional Components + Hooks)

React Router (Protected + Role-aware routing)

Redux Toolkit (State orchestration where needed)

Tailwind CSS (Responsive UI system)

Backend (BaaS Layer)

Supabase

PostgreSQL

Auth (JWT-based session management)

Row Level Security (RLS)

Role-driven data access

REST + Realtime capabilities

🔐 Authentication & Authorization Flow

User signs up via Supabase Auth.

User metadata stored in profiles table.

Role assigned (reader, author, editor).

On login:

Authenticated via signInWithPassword

Role fetched from profiles

Redirected based on role

UI routes protected at frontend level.

Data secured via RLS at database level.

This ensures:

UI-level guard

Database-level enforcement

No reliance on frontend-only protection

👥 Role Capabilities
Reader

Browse posts

Search posts

View published content

Author

Create posts

Manage drafts

Edit own posts

Editor

Review posts

Publish or reject content

Manage moderation workflows

🔎 Search Strategy

Debounced input (500ms)

Avoids unnecessary re-renders

Reduces query frequency

Supports case-insensitive search using:

.ilike("title", `%${search}%`)

Optimized for both frontend filtering and database-level querying.

📄 Pagination Strategy

Implements range-based pagination:

.range(start, end)

Designed to:

Prevent overfetching

Maintain performance at scale

Support future infinite-scroll upgrade

🧱 Component Design Philosophy

Presentational vs Logical separation

Reusable UI components

Controlled inputs

Side effects isolated in useEffect

Avoids tight coupling between data layer and UI layer

🗄 Database Schema (Simplified)
profiles
Column	Type	Purpose
id	uuid	Auth user ID
name	text	User name
email	text	User email
role	text	Access control role
posts
Column	Type	Purpose
id	uuid	Post ID
author_id	uuid	Linked to profiles
title	text	Post title
content	text	Body
status	text	draft / published
created_at	timestamp	Sorting & pagination
🔒 Security Design

Row Level Security enabled

Role-based conditional policies

Authenticated access enforced

No direct exposure of privileged data

Server-trusted JWT verification via Supabase

This prevents:

Unauthorized dashboard access

Cross-user data leakage

Client-side role manipulation

📊 Performance Considerations

Debounced search

Controlled component rendering

Scoped database queries

Avoids fetching unnecessary fields

Prepared for indexing on searchable columns

🌍 Remote-Ready Engineering Signals

This project demonstrates:

Ownership of authentication flows

Backend integration without custom Node server

Awareness of access control models

Clean route architecture

Responsive UI design

Production-oriented thinking

Security-first data modeling

🧪 Future Enhancements

Cursor-based pagination

Supabase Storage integration

Rich text editor

Comment system with realtime updates

Optimistic UI updates

Error boundary handling

Test coverage (Jest + React Testing Library)

CI/CD integration

🚀 Running Locally
git clone <repo-url>
npm install
npm run dev

Create .env file:

VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
👨‍💻 Author

Abhishek Kumar Pandit
Frontend Engineer focused on scalable UI systems and secure backend integrations.
