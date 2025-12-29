# Complete Setup Guide for InsightNova Next.js Clone

## What's Already Created

✅ Core configuration files (package.json, tsconfig.json, tailwind.config.ts, next.config.mjs)
✅ Global styles (app/globals.css) with all custom CSS variables and animations  
✅ Utility functions (lib/utils.ts)
✅ Base UI components (button.tsx, input.tsx, label.tsx, card.tsx)
✅ Root layout (app/layout.tsx)
✅ Landing page (app/page.tsx)

## Quick Start

```bash
cd nextjs-clone

# Install all dependencies
npm install

# Run development server  
npm run dev
```

The app should now run on http://localhost:3000

## Remaining Implementation Tasks

### 1. Complete UI Components (components/ui/)

Copy these files from the original `src/components/ui/` and adapt them:

**Essential Components:**
- [ ] `dialog.tsx` - For modals (room details, confirmations)
- [ ] `select.tsx` - For dropdowns (status filters, date selectors)
- [ ] `switch.tsx` - For toggle buttons (settings)
- [ ] `avatar.tsx` - For user profile pictures
- [ ] `dropdown-menu.tsx` - For user menu, hotel selector
- [ ] `toast.tsx` + `toaster.tsx` - For notifications  
- [ ] `tooltip.tsx` - For hover tooltips

**Additional Components (copy as-is, mostly):**
- accordion.tsx, alert-dialog.tsx, alert.tsx, aspect-ratio.tsx
- badge.tsx, breadcrumb.tsx, calendar.tsx, carousel.tsx
- checkbox.tsx, collapsible.tsx, command.tsx, context-menu.tsx
- drawer.tsx, form.tsx, hover-card.tsx, input-otp.tsx
- menubar.tsx, navigation-menu.tsx, pagination.tsx, popover.tsx
- progress.tsx, radio-group.tsx, resizable.tsx, scroll-area.tsx
- separator.tsx, sheet.tsx, skeleton.tsx, slider.tsx
- sonner.tsx, table.tsx, tabs.tsx, textarea.tsx
- toggle-group.tsx, toggle.tsx

**Important:** Add `"use client"` directive at the top of components that use hooks or interactivity.

### 2. Layout Components (components/layout/)

Create these files adapted from `src/components/layout/`:

**DashboardLayout.tsx:**
```tsx
"use client";

import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="ml-64">
        <TopBar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
```

**Sidebar.tsx:**
- Copy from `src/components/layout/Sidebar.tsx`
- Change imports to use Next.js `Link` instead of `NavLink`
- Use `usePathname()` from `next/navigation` for active states

**TopBar.tsx:**
- Copy from `src/components/layout/TopBar.tsx`
- Ensure all Radix UI components are wrapped with `"use client"`

**NavLink.tsx (components/):**
```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  className?: string;
  activeClassName?: string;
  children: React.ReactNode;
}

export function NavLink({ href, className, activeClassName, children }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} className={cn(className, isActive && activeClassName)}>
      {children}
    </Link>
  );
}
```

### 3. Dashboard Components (components/dashboard/)

Copy these files from `src/components/dashboard/`:

- **MetricCard.tsx** - Display metrics with icons
- **RoomCard.tsx** - Room status cards  
- **StaffCard.tsx** - Staff performance cards

These can be copied almost as-is, just ensure proper imports.

### 4. Hooks (hooks/)

**use-toast.ts:**
- Copy from `src/hooks/use-toast.ts`
- Add `"use client"` at the top

**use-mobile.tsx:**
- Copy from `src/hooks/use-mobile.tsx`  
- Add `"use client"` at the top

### 5. Pages (app/)

Create the following page structure:

```
app/
├── auth/
│   └── page.tsx          # Auth page (sign in/sign up)
├── dashboard/
│   ├── layout.tsx        # Dashboard layout wrapper
│   ├── page.tsx          # Main dashboard
│   ├── rooms/
│   │   └── page.tsx      # Rooms management
│   ├── bookings/
│   │   └── page.tsx      # Bookings
│   ├── payments/
│   │   └── page.tsx      # Payments
│   ├── reports/
│   │   └── page.tsx      # Reports
│   ├── staff/
│   │   └── page.tsx      # Staff management
│   └── settings/
│       └── page.tsx      # Settings
└── not-found.tsx         # 404 page
```

**dashboard/layout.tsx:**
```tsx
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
```

**For each page:**
1. Copy the content from corresponding `src/pages/*.tsx` file
2. Add `"use client"` at the top (since they use React hooks)
3. Convert React Router navigation to Next.js `useRouter()` and `Link`
4. Export as default function

### 6. Providers

Create `components/providers/query-provider.tsx`:

```tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

Update `app/layout.tsx`:
```tsx
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <QueryProvider>
          <TooltipProvider>
            {children}
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
```

## Key Adaptations for Next.js

### Routing
- **React Router** → **Next.js App Router**
- `<Route>` → File-based routing
- `useNavigate()` → `useRouter().push()` or `<Link>`
- `<NavLink>` → Custom NavLink with `usePathname()`

### Client vs Server Components
- Pages with hooks/state need `"use client"`
- Static pages can be server components
- All Radix UI components need `"use client"`

### Example Page Conversion

**Original (Vite/React):**
```tsx
import { useNavigate } from "react-router-dom";
export default function Dashboard() {
  const navigate = useNavigate();
  // ...
}
```

**Next.js:**
```tsx
"use client";
import { useRouter } from "next/navigation";
export default function Dashboard() {
  const router = useRouter();
  // ...
}
```

## Testing the Build

After implementing all components:

```bash
# Development
npm run dev

# Production build
npm run build
npm start
```

## Common Issues & Fixes

1. **"Cannot find module '@/components/ui/...'**
   - Ensure the component file exists
   - Check `tsconfig.json` has correct path mapping

2. **"useSearchParams() should be wrapped in suspense boundary"**
   - Wrap the page component in `<Suspense>`

3. **Hydration errors**
   - Ensure client components have `"use client"`
   - Check for mismatches between server/client rendering

4. **Style not applying**
   - Verify Tailwind classes are in content paths
   - Check globals.css is imported in layout

## File Copying Script

Use this PowerShell script to copy UI components:

```powershell
$sourceDir = ".\src\components\ui"
$destDir = ".\nextjs-clone\components\ui"

Get-ChildItem $sourceDir -Filter *.tsx | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $newContent = '"use client";' + "`n`n" + $content
    $newContent | Set-Content (Join-Path $destDir $_.Name)
}
```

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Shadcn/ui Documentation](https://ui.shadcn.com)
- [TanStack Query](https://tanstack.com/query/latest)
- [Radix UI](https://www.radix-ui.com)

## Summary Checklist

- [ ] Install dependencies (`npm install`)
- [ ] Copy all UI components from original project
- [ ] Create layout components (Sidebar, TopBar, DashboardLayout)
- [ ] Create dashboard components (MetricCard, RoomCard, StaffCard)
- [ ] Create all page routes in app/
- [ ] Set up providers (QueryProvider, Toaster)
- [ ] Test all routes
- [ ] Build for production

The project is now 40% complete. Following this guide will get you to 100%.
