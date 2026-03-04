# ShipWise

ShipWise is a logistics and shipment management system designed to streamline operations for administrators, staff, and managers through a web and mobile platform.

---

## Overview

ShipWise provides a centralized system to manage shipments, users, and operational workflows with role-based access control.

The system consists of:

- Web Application (Admin & Staff)
- Mobile Application (Managers)
- Backend powered by Supabase
- PostgreSQL Database

---

## Technology Stack

### Backend
- Supabase (Backend-as-a-Service)
- Supabase Authentication
- Supabase REST API

### Database
- PostgreSQL (Supabase)

### Web Application
- React.js
- JavaScript
- CSS
- Supabase Client SDK

### Mobile Application
- React Native
- Expo
- Supabase Client SDK

---

## Features

- Role-based authentication (Admin, Staff, Manager)
- Shipment management
- Task tracking
- Secure login and authorization
- Real-time database integration
- Mobile access for managers

---

## Architecture

Frontend (React.js Web App, React Native Mobile App)  
↓  
Supabase Backend  
↓  
PostgreSQL Database  

---

## Environment Variables

The web frontend requires access to a Supabase project. Configure the following
in a `.env.local` (or `.env`) file at the workspace root. The code checks both
`NEXT_PUBLIC_` and `VITE_` prefixes for convenience:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiI...
```

If these values are missing the app throws an error during initialization, and
fallback sample data will be used for shipments/carriers so the UI renders with
placeholder entries.


