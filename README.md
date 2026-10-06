# Ahenkan Football Academy — Digital Management Platform

## Overview

A comprehensive digital football academy management platform for **Ahenkan Football Academy**, located in Adeiso, Upper West Akyem, Ghana. Established in 2025, the academy develops young football players from U-8 to U-17.

This platform transforms manual academy operations into a professional digital system with complete player management, coaching tools, financial tracking, and analytics.

## Features

### Core Management
- **Player Management** — Complete CRUD with registration, profiles, search, filter, sort, and export
- **Coach Management** — Staff profiles, assignments, and licensing tracking
- **Training Management** — Session scheduling, calendar/list views, coach assignments
- **Attendance System** — Daily bulk attendance marking with statistics
- **Match Management** — Fixtures, results, and competition tracking
- **Performance Evaluation** — Technical, tactical, physical, and mental scoring (1-10)
- **Scouting Pipeline** — Prospect tracking with status workflow
- **Financial Management** — Payment tracking with multiple Ghana payment methods
- **Announcements** — Targeted communications with priority levels

### Portals
- **Admin Dashboard** — Command center with real-time statistics and charts
- **Coach Portal** — Training, attendance, and performance management
- **Player Portal** — Personal dashboard with schedule, stats, and feedback
- **Parent Portal** — Child progress monitoring and payment tracking

### Advanced Features
- **AI Coach** — Intelligent player analysis and training recommendations
- **Digital Player ID** — Professional ID cards with QR code verification
- **Reports & Analytics** — Comprehensive charts and data exports
- **Global Search** — Search across players, coaches, matches, and more
- **Notifications** — Real-time alerts and activity tracking
- **Activity Logs** — Complete audit trail of system actions

### Design
- Professional dark green + lime accent color scheme
- Fully responsive (desktop, tablet, mobile)
- Modern dashboard with sidebar navigation
- Clean data tables and cards
- Loading states and error handling
- Toast notifications

## Technology Stack

### Frontend
- **React 18** — UI framework
- **TypeScript** — Type safety
- **Vite** — Build tool
- **Tailwind CSS 4** — Styling
- **React Router 6** — Routing
- **Recharts** — Charts and data visualization
- **Lucide React** — Icons
- **QRCode.react** — QR code generation
- **React Hot Toast** — Notifications
- **date-fns** — Date handling
- **uuid** — Unique identifiers

### Data Layer
- **localStorage** — Client-side persistence (demo mode)
- Designed for easy migration to Supabase/PostgreSQL

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@ahenkan.com | (any) |
| Coach | coach@ahenkan.com | (any) |
| Player | player@ahenkan.com | (any) |
| Parent | parent@ahenkan.com | (any) |
| Scout | scout@ahenkan.com | (any) |

## Routes

### Public
- `/` — Public website with academy info
- `/login` — Authentication
- `/verify/player/:id` — QR code verification

### Protected (Dashboard)
- `/dashboard` — Admin command center
- `/players` — Player management
- `/players/register` — Player registration
- `/players/:id` — Player profile
- `/players/:id/digital-id` — Digital player card
- `/coaches` — Coach management
- `/training` — Training sessions
- `/attendance` — Attendance tracking
- `/matches` — Match management
- `/performance` — Player performance
- `/scouting` — Scouting pipeline
- `/payments` — Financial management
- `/announcements` — Academy announcements
- `/ai-coach` — AI development assistant
- `/reports` — Analytics and reports
- `/settings` — System configuration
- `/parent` — Parent portal
- `/player` — Player portal

## Database Design

The application uses a normalized data model with the following entities:

- **Users** — Authentication and role management
- **Players** — Complete player profiles
- **Coaches** — Coaching staff
- **Training Sessions** — Scheduled training
- **Attendance Records** — Daily attendance
- **Matches** — Fixtures and results
- **Performance Records** — Player evaluations
- **Scouting Prospects** — Talent pipeline
- **Payments** — Financial transactions
- **Announcements** — Communications
- **Notifications** — User alerts
- **Activity Logs** — System audit trail

## Production Deployment

### Environment Variables

For production with Supabase backend:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_AI_API_KEY=your_ai_api_key
```

### Payment Integration

The system is designed to support Ghana payment providers:
- MTN Mobile Money
- Telecel (Vodafone) Cash
- AirtelTigo Money
- Bank Transfer
- Cash

Payment provider integration requires API credentials configured via environment variables.

## Academy Information

- **Name:** Ahenkan Football Academy
- **Tagline:** Developing Ghana's Future Stars
- **Location:** Adeiso, Upper West Akyem, Ghana
- **Established:** 2025
- **Age Groups:** U-8, U-10, U-12, U-14, U-15, U-17
- **Focus:** Football development, academic excellence, character development, life skills

## License

© 2025 Ahenkan Football Academy. All rights reserved.
