# Frontend Architecture & Context (`clinet/`)

This document defines the architecture, design system, routing rules, and conventions for the frontend application.

---

## 1. Tech Stack & Libraries

| Technology               | Role / Usage                                                                    |
| :----------------------- | :------------------------------------------------------------------------------ |
| **React 19**             | Core UI library (JavaScript)                                                    |
| **Vite**                 | Bundler and development server                                                  |
| **React Router (v7/v8)** | Client-side routing, nested routes, and layouts                                 |
| **TanStack Query**       | Server state synchronization, caching, and background refetching                |
| **Ant Design (`antd`)**  | Component library (tables, form controls, modals, admin layout primitives)      |
| **SCSS Modules**         | Component-scoped styling (`*.module.scss`) via `sass-embedded`                  |
| **Axios**                | HTTP client with centralized interceptors for token attachment & error handling |
| **React Hook Form**      | High-performance, unopinionated form state and validation                       |

---

## 2. Directory Structure Blueprint

```
clinet/src/
├── api/                       # API clients & query hooks
│   ├── axiosClient.js         # Base Axios instance with auth interceptors
│   ├── adminApi.js            # Endpoints for admin operations
│   └── storefrontApi.js       # Endpoints for customer storefront operations
├── assets/                    # Static assets, SVG icons, brand logos
├── components/                # Reusable UI components
│   ├── common/                # Shared buttons, loaders, modal dialogs, status badges
│   ├── admin/                 # Admin data tables, metrics cards, sidebar nav
│   └── storefront/            # Storefront navbar, product cards, cart drawer, footer
├── hooks/                     # Custom React hooks
├── layouts/                   # Nested route wrappers
│   ├── StorefrontLayout.jsx   # Top navbar + content + footer
│   └── AdminLayout.jsx        # Sidebar navigation + header + admin workspace
├── pages/                     # Top-level route pages
│   ├── storefront/            # Customer-facing views
│   │   ├── Home.jsx           # Landing / Hero / Trending
│   │   ├── Collection.jsx     # Product list with filters and sorting
│   │   ├── ProductDetail.jsx  # PDP with image gallery, variants, add-to-cart
│   │   ├── Cart.jsx           # Cart view & checkout preview
│   │   └── Auth/              # Customer Login & Register
│   └── admin/                 # Merchant-facing views
│       ├── AdminLogin.jsx     # Admin authentication
│       ├── Dashboard.jsx      # Metrics overview & analytics
│       ├── Products.jsx       # Product CRUD management
│       ├── Categories.jsx     # Category tree and CRUD
│       └── Orders.jsx         # Order fulfillment management
├── styles/                    # Global SCSS
│   ├── _variables.scss        # SCSS color palettes, spacing, breakpoints
│   ├── _mixins.scss           # Reusable flex/grid/typography mixins
│   └── index.scss             # Global resets and root CSS variables
├── App.jsx                    # Central route definitions
└── main.jsx                   # React root & TanStack QueryClientProvider
```

---

## 3. Route Map & Organization

### 3.1 Storefront Routes (Customer Domain)

- `/` — Storefront Home Page
- `/collections` or `/collections/:category` — Product Catalog & Filters
- `/product/:id` — Product Detail Page (PDP)
- `/cart` — Cart review
- `/checkout` — Checkout & payment (Protected for authenticated customers)
- `/login` — Customer Login (Implemented with `react-hook-form` & SCSS modules)
- `/register` — Customer Registration
- `/account` — Customer profile & order history (Protected)

### 3.2 Admin Routes (Admin Domain)

- `/login` — Shared login for admin and normal users; JWT role controls the destination
- `/admin/dashboard` — Analytics, sales graphs, and quick actions
- `/admin/products` — Product data table (Ant Design) with search, filter, and pagination
- `/admin/products/new` — Product creation form
- `/admin/products/edit/:id` — Product editing
- `/admin/categories` — Category management
- `/admin/orders` — Orders processing & fulfillment status
- `/admin/customers` — Customer listings

### 3.3 Implemented Authentication and Dashboard Notes

- `/login` is the shared login route for admin and normal users.
- `/register` uses the shared `Register` component with `role: "user"`.
- `/admin/register` uses the shared `Register` component with `role: "admin"`.
- `/admin/dashboard` is protected by the JWT-aware `ProtectedRoute` and is the admin landing page.
- `/admin/categories` is protected and provides category listing and creation through `GET /categories` and `POST /categories`; editing and deletion use `GET /categories/:id`, `PATCH /categories/:id`, and `DELETE /categories/:id`.
- `/admin/products` is protected and provides product listing, creation, editing, and deletion through the corresponding `/products` CRUD endpoints; product forms load category options from `GET /categories`.
- `/` is protected and is the normal authenticated storefront landing page.
- The admin dashboard currently uses local mock metrics and activity data while backend analytics endpoints are pending.
- The dashboard loads the authenticated profile from `GET /auth/user` through `axiosClient`; the response user drives the header name, role, initials, and greeting.
- The dashboard supports a revenue range selector, CSV report export, and sign-out; product/order/customer navigation is reserved for future route implementations.
- Category management lives at `src/pages/admin/categories/`; `/admin/categories` is a table-only listing page, `/admin/categories/new` is the creation form, and `/admin/categories/:categoryId/edit` is the edit form. Categories are returned in `data`, and created/updated/deleted responses are expected to follow the backend message/data contract.
- Product management lives at `src/pages/admin/products/`; `/admin/products` is a table-only listing page, `/admin/products/new` is the creation form, and `/admin/products/:productId/edit` is the edit form. Product SKU is generated by the server and is not editable in the client form. Product category selection uses category IDs from `GET /categories`.

---

## 4. Styling Conventions

1. **Scoped Styles with SCSS Modules:** Every component or page has a sibling `[Name].module.scss` file for component-specific styles to avoid global namespace collisions.
2. **Ant Design Integration:**
   - Use Ant Design (`antd`) components extensively for data-dense Admin views (e.g. `<Table />`, `<Modal />`, `<Select />`, `<DatePicker />`).
   - Apply Ant Design theme tokens via `<ConfigProvider />` in `AdminLayout.jsx`.
   - When custom animations, ambient glows, or custom brand layouts are needed, use SCSS modules alongside Ant Design.
3. **No Inline Styles for Production:** All layout and presentation rules should live in SCSS modules.

---

## 5. State Management & Data Fetching

- **Server State (TanStack Query):**
  - Queries: `useQuery({ queryKey: ['products', filters], queryFn: ... })`
  - Mutations: `useMutation({ mutationFn: ..., onSuccess: () => queryClient.invalidateQueries(...) })`
- **Client State (React Context / Hooks):**
  - Cart state (items, quantity, total)
  - Auth state (active user session, token storage)
  - UI state (drawer open/close, mobile menu open/close)

---

## 6. Daily Development Guidelines

- Use `npm run dev` to start Vite.
- Do **NOT** run `npm run build` during daily development.

## 7. Current Admin Dashboard Implementation

The admin dashboard lives at `src/pages/admin/dashboard/` and uses `index.jsx` with `dashboard.module.scss`. Its UI is split into `components/Sidebar.jsx`, `Topbar.jsx`, `StatsGrid.jsx`, `RevenueOverview.jsx`, `RecentActivity.jsx`, `TopProducts.jsx`, and `Icon.jsx`; shared mock data lives in `components/dashboardData.js`. The page owns only dashboard-level state and actions. Replace the mock data module with TanStack Query-backed API data when the admin endpoints are available.
