# ShipWise

ShipWise is a **multi-tenant logistics management platform** that allows organizations to manage shipments, goods, carriers, and internal operations with secure role-based access control.

---

##  Features

*  Authentication (Supabase + Google OAuth)
*  Multi-tenant organization system
*  Role-Based Access Control (RBAC)
*  Shipments, goods, and carrier management
*  Incident tracking system
*  Organization onboarding (request → approval flow)
*  Notification system (queued dispatch)

---

##  How It Works

1. **User Login**

   * Users sign in using Google or email/password

2. **Request Access**

   * Users submit an organization request (company + industry)

3. **Approval Flow**

   * Superadmin reviews request
   * If approved:

     * Organization is created
     * User becomes HR admin
   * If rejected:

     * Request is marked as rejected

---

##  Roles

* **Superadmin** → full platform control
* **HR** → manages organization data and users
* **Manager / Staff** → operational access (shipments, goods, etc.)

---

##  Tech Stack

* Next.js
* Supabase (Auth + PostgreSQL)
* TypeScript
* TailwindCSS

---

##  Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run locally

```bash
npm run dev
```

---

##  Project Status

* ✅ Authentication system completed
* ✅ RBAC system implemented
* ✅ Organization onboarding flow working
* 🚧 Notification email integration in progress

---

##  Architecture

* `/pages` → frontend routes + API routes
* `/contexts` → auth & session handling
* `/lib/rbac` → permissions system
* Supabase → database + auth + RLS security


