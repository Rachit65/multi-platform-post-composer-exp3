# Multi-Platform Post Composer (Exp 3 - Secure JWT Authentication & RBAC)

A secure, stateless authentication and session management system built with **JSON Web Tokens (JWT)**, **Role-Based Access Control (RBAC)**, and **Redux Toolkit**.

---

## 🎯 Aim & Objectives

- **Aim:** Design and implement a secure authentication system using JWT for user login, session management, and role-based authorization (Admin & User).
- **Objectives:**
  - Understand stateless token-based authentication mechanisms in web architectures.
  - Implement full JWT generation, decoding, verification, and expiration handling.
  - Manage user sessions statelessly with localStorage and Redux Toolkit.
  - Implement Role-Based Access Control (RBAC) supporting **Admin** and **User** roles.
  - Provide an interactive JWT token inspector for educational analysis and tampering resilience demonstration.
- **COs Mapped:** CO1 - BT1, CO2 - BT2, CO3 - BT3

---

## 🔐 Authentication Architecture & Roles

`	ext
┌─────────────────────────────────────────────────────────────┐
│                      Client Browser                         │
│  ┌───────────────────────┐       ┌────────────────────────┐ │
│  │   Auth Form (Login)   │       │   Redux / LocalStorage │ │
│  └───────────┬───────────┘       └───────────▲────────────┘ │
│              │ Credentials                   │ Store JWT    │
│              ▼                               │              │
│  ┌───────────────────────────────────────────┴────────────┐ │
│  │              Stateless JWT Auth Engine                 │ │
│  │  Header (HS256) . Payload (Claims) . Signature (HMAC)   │ │
│  └───────────────────────────┬────────────────────────────┘ │
│                              │ Valid Token                  │
│                              ▼                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                     Protected Views                    │ │
│  │   👤 User Role: Post Composer Dashboard & Analytics    │ │
│  │   👑 Admin Role: User Management & RBAC Permissions    │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
`

### Roles & Permissions:
| Role | Demo Credentials | Permissions |
| :--- | :--- | :--- |
| 👑 **Admin** | dmin@composer.com / dmin123 | Full access: Compose posts, delete posts, user management, promote/demote roles, suspend accounts, and view live JWT Inspector. |
| 👤 **User** | user@composer.com / user123 | Standard access: Compose posts, publish across platforms, and view own session JWT Inspector. |

---

## 🚀 Key Features

1. **Stateless JWT Engine (src/utils/jwt.js):**
   - Implements standard 3-part JWT structure:
     - **Header:** Algorithm (HS256) and Type (JWT).
     - **Payload:** Claims containing user ID (sub), name, email, role, permissions, issued-at (iat), and expiration (exp).
     - **Signature:** HMAC-SHA256 integrity check.
2. **Interactive JWT Inspector (TokenInspector.jsx):**
   - Real-time color-coded breakdown: Red (Header), Purple (Payload), Blue (Signature).
   - Live session expiration countdown timer with auto-logout.
   - **Simulate Token Tampering** button demonstrating cryptographic rejection of altered tokens.
3. **Admin Control Panel (AdminPanel.jsx):**
   - Registry table of all registered users with avatar, email, assigned role, and permissions.
   - Live actions to promote/demote roles and activate/suspend user access.
4. **Protected Post Composer Dashboard:**
   - Multi-platform post composition (X, LinkedIn, Instagram, Facebook), real-time validation, and Redux Toolkit store state metrics.

---

## 🛠️ Tech Stack

- **React.js 18**
- **Redux Toolkit (@reduxjs/toolkit v2)**
- **React-Redux v9**
- **Vite**
- **Lucide React Icons**
- **CSS3 (Geist Design System)**

---

## 💻 Installation & Local Execution

1. **Navigate to the project folder:**
   `ash
   cd  post composer exp3
   `

2. **Install dependencies:**
   `ash
   npm install
   `

3. **Run the development server:**
   `ash
   npm run dev
   `

4. **Build for production:**
   `ash
   npm run build
   `

---

## 👨‍💻 Author

Rachit Saini
