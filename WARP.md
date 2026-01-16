# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Commands

### Development
```powershell
npm run dev        # Start development server on http://localhost:3000
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
```

### Database (Prisma)
```powershell
npx prisma generate              # Generate Prisma client
npx prisma db push               # Push schema changes to database
npx prisma studio                # Open Prisma Studio GUI
npx prisma migrate dev           # Create and apply migrations
```

## Architecture Overview

### Project Type
Next.js 14 Hotel Property Management System using App Router architecture. This is a **conversion from a Vite + React application** to Next.js, maintaining the same visual design and functionality while leveraging Next.js features.

### Core Architecture Patterns

**1. Route Groups for Organization**
- `app/(auth)/` - Authentication pages (signin)
- `app/(dashboard)/` - All dashboard pages share a common layout
- Routes use file-based routing with nested layouts

**2. Client/Server Component Strategy**
- Most components require `"use client"` directive due to interactivity requirements
- All Radix UI components are client components
- Pages with hooks, state, or event handlers must be client components
- Layout components (Sidebar, TopBar, DashboardLayout) are client components

**3. Custom Navigation System**
- `NavLink` component wraps Next.js `<Link>` with `usePathname()` for active states
- Used throughout Sidebar for route highlighting
- Pattern: `activeClassName` prop applies styles when pathname matches href

**4. Glass Morphism Design System**
- Dark theme with teal primary (168, 70%, 50%) and orange secondary (37, 91%, 55%)
- Custom CSS utilities in `app/globals.css`: `.glass-card`, `.glass-card-hover`, `.glow-primary`, `.shadow-glow-primary`
- All colors use HSL CSS variables for theming
- Custom animations: `animate-fade-in`, `animate-slide-up`, `animate-scale-in`, `animate-pulse-glow`, `animate-float`

### Key Directory Structure

```
app/
├── (auth)/              # Auth route group
│   └── page.tsx         # Combined signin/signup
├── (dashboard)/         # Dashboard route group  
│   ├── layout.tsx       # Wraps with DashboardLayout
│   ├── page.tsx         # Main dashboard with charts
│   ├── rooms/           # Room management
│   ├── bookings/        # Booking management
│   ├── payments/        # Payment tracking
│   ├── reports/         # Analytics reports
│   ├── staff/           # Staff management
│   ├── settings/        # Configuration
│   └── help/            # Help section
├── api/                 # API routes
├── layout.tsx           # Root layout with providers
└── globals.css          # All styles, animations, CSS variables

components/
├── ui/                  # Shadcn/ui components (50+ files)
├── layout/              # Layout components
│   ├── Sidebar.tsx      # Left navigation with NavLink
│   ├── TopBar.tsx       # Header with hotel selector, search, notifications
│   └── DashboardLayout.tsx  # Combines Sidebar + TopBar
├── dashboard/           # Domain components
│   ├── MetricCard.tsx   # Metric display with trends
│   ├── RoomCard.tsx     # Room status visualization
│   └── StaffCard.tsx    # Staff performance cards
├── providers/           # React context providers
│   └── query-provider.tsx  # TanStack Query setup
└── NavLink.tsx          # Next.js navigation with active states

prisma/
└── schema.prisma        # Database schema (SQLite)
    - User, UserSession, Hotel, Room, Folio, Transaction models
    - Role-based access control
    - Multi-hotel support with subscription tiers
```

### Data Flow Architecture

**1. State Management**
- TanStack Query for server state (configured in `query-provider.tsx`)
- Local component state with `useState` for UI state
- No global state management library (Redux/Zustand) currently used

**2. Database Schema (Prisma + SQLite)**
- Multi-tenant: Hotels have many Users, Rooms, Folios
- User roles: `manager`, `staff`, `owner`, `admin`
- Room lifecycle: `available` → `occupied` → `cleaning` → `maintenance`
- Folio tracks guest stays with associated Transactions
- Payment types: `cash`, `opay`, `palmpay`, `bank`

**3. Component Communication**
- Props drilling for simple cases
- Context providers wrapped in root layout
- Custom hooks in `hooks/`: `use-toast.ts`, `use-mobile.tsx`

### Styling System

**Theme Tokens** (in `app/globals.css`):
- Uses HSL values via CSS variables
- `--primary: 168 70% 50%` (Teal)
- `--secondary: 37 91% 55%` (Orange)
- `--glass` and `--glass-border` for glass morphism effects
- Sidebar has dedicated color tokens (`--sidebar-*`)

**Tailwind Extensions** (in `tailwind.config.ts`):
- Custom colors mapped to CSS variables
- Custom animations (shimmer, pulse)
- Custom gradient backgrounds
- Border radius system: `lg`, `md`, `sm`, `2xl`, `3xl`

**Utility Classes**:
- `.glass-card` - Glass morphism card base
- `.glass-card-hover` - Interactive glass card with transitions
- `.text-gradient-primary` / `.text-gradient-secondary` - Gradient text
- `.glow-*` and `.shadow-glow-*` - Shadow glow effects

## Development Guidelines

### Adding New Pages
1. Create in appropriate route group: `app/(dashboard)/newpage/page.tsx`
2. Add `"use client"` if using hooks or interactivity
3. Page automatically inherits dashboard layout from `app/(dashboard)/layout.tsx`
4. Add route to Sidebar navigation in `components/layout/Sidebar.tsx`

### Adding UI Components
- All Shadcn/ui components are in `components/ui/`
- Must include `"use client"` for interactive components
- Use `cn()` utility from `lib/utils.ts` for class merging
- Follow existing variant patterns using `class-variance-authority`

### Working with Navigation
- Always use `NavLink` component for dashboard navigation
- Use `useRouter()` from `next/navigation` for programmatic navigation
- Use `usePathname()` to get current route
- Never use React Router APIs (`useNavigate`, `<Route>`, etc.)

### Chart Implementation
- Uses Recharts library
- Common pattern: Wrap in `ResponsiveContainer` with fixed height
- Customize tooltips with card-themed background
- Use chart color tokens: `hsl(var(--chart-1))` through `hsl(var(--chart-5))`

### Form Handling
- React Hook Form + Zod for validation
- Use Shadcn/ui form components from `components/ui/form.tsx`
- Validation schemas defined with Zod

### Database Operations
- Prisma Client for all database interactions
- Generate client after schema changes: `npx prisma generate`
- Database file: `prisma/dev.db` (SQLite)
- Run migrations: `npx prisma migrate dev`

## Important Patterns

### Layout Composition
The dashboard uses a fixed sidebar layout:
```tsx
// DashboardLayout.tsx pattern
<div className="min-h-screen">
  <Sidebar />              {/* Fixed left, w-64 */}
  <div className="ml-64">  {/* Main content offset */}
    <TopBar />             {/* Sticky top header */}
    <main className="p-6">{children}</main>
  </div>
</div>
```

### Active Navigation State
```tsx
// NavLink component pattern
const pathname = usePathname();
const isActive = pathname === href;
// Applies activeClassName when route matches
```

### Metric Cards with Trends
```tsx
// MetricCard accepts change object
change={{ value: 12.3, type: "increase" | "decrease" }}
variant="primary" | "default" | "warning" | "success"
```

### Room Status Visualization
- Room grid displays floor-organized room cards
- Status types: `occupied`, `available`, `reserved`, `cleaning`, `maintenance`
- Color-coded by status using theme colors

## Project Context

### Conversion Notes
- Migrated from Vite + React Router to Next.js App Router
- Maintained 100% visual design parity with original
- File-based routing replaces React Router configuration
- All navigation updated to use Next.js Link and navigation hooks

### Current State
- Core infrastructure complete (config, styles, utilities)
- All UI components implemented (50+ Shadcn/ui components)
- Layout system complete (Sidebar, TopBar, DashboardLayout)
- Dashboard pages implemented with charts and visualizations
- Prisma schema defined for database operations

### Multi-Hotel Support
- Users belong to Hotels via `hotel_id`
- Hotel selector in TopBar allows switching properties
- Room and Folio data scoped by hotel_id
- Subscription tiers: `standalone`, `add_on`

## Path Aliases
- `@/*` maps to root directory (configured in `tsconfig.json`)
- Use absolute imports: `import { Button } from "@/components/ui/button"`
