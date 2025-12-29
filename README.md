# InsightNova PMS - Next.js Clone

This is a Next.js 14 (App Router) clone of the InsightNova Hotel Property Management System, converted from the original Vite + React implementation.

## Project Structure

```
nextjs-clone/
├── app/                    # Next.js app directory (pages and layouts)
│   ├── (auth)/            # Auth pages group
│   ├── (dashboard)/       # Dashboard pages group  
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   └── globals.css        # Global styles
├── components/
│   ├── ui/                # Shadcn UI components
│   ├── layout/            # Layout components (Sidebar, TopBar, etc.)
│   ├── dashboard/         # Dashboard-specific components
│   └── NavLink.tsx        # Navigation link component
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
└── public/                # Static assets
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui (Radix UI primitives)
- **State Management**: TanStack Query
- **Charts**: Recharts
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod

## Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Key Features

- **Landing Page**: Hero section with feature showcase
- **Authentication**: Multi-step onboarding with sign-in/sign-up
- **Dashboard**: Real-time metrics, charts, room occupancy grid
- **Rooms Management**: Search, filter, and manage hotel rooms
- **Bookings**: Reservation management
- **Payments**: Transaction tracking
- **Reports**: Analytics and insights
- **Staff Management**: Employee performance tracking
- **Settings**: Configuration and preferences

## Design System

The project uses a custom dark theme with:
- **Primary Color**: Teal (168, 70%, 50%)
- **Secondary Color**: Orange (37, 91%, 55%)
- **Glass morphism effects** for cards and panels
- **Custom animations** (fade-in, slide-up, float, pulse-glow)
- **Responsive design** with mobile-first approach

## Development Notes

### Differences from Original Vite Version

1. **Routing**: Uses Next.js App Router instead of React Router
   - File-based routing
   - Server and Client Components
   - Route groups for organization

2. **Data Fetching**: Can leverage Server Components
   - Initial data can be fetched on server
   - Client components for interactivity

3. **Image Optimization**: Use Next.js `<Image>` component

4. **API Routes**: Can add API routes in `app/api/`

### Component Adaptation

- **NavLink**: Adapted to use Next.js `<Link>` with `usePathname`
- **Layout Components**: DashboardLayout uses client components
- **Forms**: Remain client-side with React Hook Form

## Remaining Implementation

To complete the clone, you need to:

1. **Create all UI components** in `components/ui/`:
   - input.tsx, label.tsx, card.tsx, dialog.tsx
   - select.tsx, switch.tsx, avatar.tsx, dropdown-menu.tsx
   - toast.tsx, toaster.tsx, tooltip.tsx
   - And others from the original project

2. **Create layout components** in `components/layout/`:
   - Sidebar.tsx
   - TopBar.tsx
   - DashboardLayout.tsx

3. **Create dashboard components** in `components/dashboard/`:
   - MetricCard.tsx
   - RoomCard.tsx
   - StaffCard.tsx

4. **Create all pages** in `app/`:
   - page.tsx (Landing)
   - (auth)/signin/page.tsx
   - (dashboard)/dashboard/page.tsx
   - (dashboard)/rooms/page.tsx
   - (dashboard)/bookings/page.tsx
   - etc.

5. **Create providers** in `components/providers/`:
   - QueryProvider.tsx for TanStack Query

6. **Create hooks** in `hooks/`:
   - use-toast.ts
   - use-mobile.tsx

## License

This is a clone for educational purposes.

## Original Project

Based on the InsightNova PMS Vite/React implementation.
