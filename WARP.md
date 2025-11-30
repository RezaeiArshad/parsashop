# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project overview

This repo is a simple production-oriented e‑commerce app with a Node/Express + MongoDB backend and a React + Vite + Tailwind frontend.

- Root `package.json` wires together backend and frontend build/start scripts.
- `backend/` contains the REST API (Express, Mongoose, JWT auth, Typesense search, Liara/S3 uploads).
- `frontend/` contains a React SPA (React Router, contexts for cart/auth/UI, Tailwind styling) built with Vite.
- In production, the backend serves the built frontend from `frontend/dist`.

## Commands & workflows

All commands are assumed to be run from the repo root unless otherwise noted.

### Install dependencies

- Backend deps:
  - `cd backend; npm install`
- Frontend deps:
  - `cd frontend; npm install`

> The root project has no own dependencies; installing in `backend` and `frontend` is sufficient for development.

### Development servers

- Start backend API (Express + MongoDB + Typesense + Liara):
  - `cd backend; npm run start`
  - Uses `nodemon` and `backend/server.js`.
  - Requires environment variables (see **Environment** below).
- Start frontend dev server (Vite):
  - `cd frontend; npm run dev`
  - Proxies `/api` to `http://localhost:5000` via `frontend/vite.config.js`.

Typical local dev flow:

1. Ensure MongoDB and Typesense are running and environment variables are set.
2. `cd backend; npm run start` (API on port `5000` by default).
3. `cd frontend; npm run dev` (Vite dev server, usually on `5173`).

### Production build & run

From the repo root (`package.json`):

- Build both backend/frontend dependencies and frontend bundle:
  - `npm run build`
  - Script: `cd backend && npm install && cd ../frontend && npm install && npm run build`.
- Start production server (serves API + built SPA):
  - `npm start`
  - Runs `node backend/server.js`, which:
    - Mounts API under `/api/...`.
    - Serves static files from `frontend/dist` and falls back to `index.html` for client routes.

### Tests

- No automated test runner is currently configured:
  - Root: `npm test` → prints a placeholder error.
  - Backend: `cd backend; npm test` → placeholder.
  - Frontend: no `test` script.

If you add a test framework (e.g. Vitest/Jest), also document how to run a single test here for future agents.

## Environment & external services

Several parts of the backend depend on environment variables (typically provided via `.env` and `dotenv`). Key ones inferred from the code:

- MongoDB:
  - `MONGODB_URI` – connection string used in `backend/server.js`.
- JWT auth:
  - `JWT_SECRET` – signing secret used in `backend/utils.js`.
- Typesense (full-text search for products):
  - `TYPESENSE_API_KEY`
  - `TYPESENSE_HOST` (default `localhost`)
  - `TYPESENSE_PORT` (default `8108`)
  - `TYPESENSE_PROTOCOL` (default `http`)
- Liara / S3-compatible object storage for image uploads:
  - `LIARA_ENDPOINT`
  - `LIARA_ACCESS_KEY`
  - `LIARA_SECRET_KEY`
  - `LIARA_BUCKET_NAME`

The API layer assumes these services are reachable at runtime. When running locally, ensure MongoDB and Typesense are running and Liara/S3 credentials are configured if you exercise upload routes.

## High-level backend architecture (`backend/`)

### Entry point and server setup

- `backend/server.js` is the main entry:
  - Connects to MongoDB using `mongoose.connect(MONGODB_URI)`.
  - Sets up JSON and URL-encoded body parsing.
  - Registers routers:
    - `/api/upload` → file upload to Liara via S3-compatible API.
    - `/api/seed` → database seeding for `Product` and `User`.
    - `/api/products` → product CRUD and review endpoints.
    - `/api/users` → auth and user management (signin/signup/profile/admin CRUD).
    - `/api/orders` → order creation, querying, and admin operations.
    - `/api/search` → search endpoint backed by Typesense.
  - Serves the built frontend from `frontend/dist` and uses a catch‑all route to return `index.html` for client-side routing.

### Data models (Mongoose)

- `backend/models/productmodel.js`
  - Defines a `Product` schema with:
    - Basic product fields: `name`, `slug`, `image`, `images`, `brand`, `description`, `price`, `countInStock`, `rating`, `numReviews`, `reviews`.
    - Category system tailored for Persian content via `cats`, `subsets`, and `CATEGORIES`.
    - Validation helpers to ensure `subset` and `filters` are consistent with the selected `category`.
  - This file also exports `cats` and `CATEGORIES`, which are used by the frontend to drive category and filter UI.
- `backend/models/ordermodel.js`
  - `Order` schema for cart items, shipping address, payment method/result, totals, and status flags `isPaid`/`isDelivered`.
- `backend/models/usermodel.js`
  - `User` schema with `name`, `email`, `password`, and `isAdmin` plus timestamps.

### Auth and authorization

- `backend/utils.js`
  - `generateToken(user)` uses `jsonwebtoken` and `JWT_SECRET` to create 30‑day bearer tokens.
  - `isAuth` middleware:
    - Expects `Authorization: Bearer <token>`.
    - Verifies JWT and attaches decoded user to `req.user`, otherwise returns `401`.
  - `isAdmin` middleware:
    - Requires `req.user.isAdmin === true`, otherwise returns `401`.
  - These middlewares are heavily used across `productroutes`, `orderroutes`, and `userroutes` to protect routes.

### Routes

- `backend/routes/productroutes.js`
  - Public listing and detail endpoints (`/`, `/slug/:slug`, `/:id`).
  - Admin product management under `/api/products` and `/api/products/admin` with pagination.
  - Authenticated review creation under `/:id/reviews`, enforcing 1 review per user.
- `backend/routes/orderroutes.js`
  - Order creation (`POST /api/orders`), per-user history (`GET /mine`), admin listing (`GET /`), and summary analytics (`GET /summary`).
  - Payment and delivery status updates (`PUT /:id/pay`, `PUT /:id/deliver`).
- `backend/routes/userroutes.js`
  - Admin listing and CRUD for users.
  - Authenticated profile update at `/profile`.
  - Public `POST /signin` and `POST /signup` endpoints for login and registration.
- `backend/routes/searchRoutes.js`
  - `GET /api/search` entrypoint that parses query parameters (q/category/brand/minPrice/maxPrice/pagination) and delegates to the search service.
- `backend/routes/seedroutes.js`
  - `GET /api/seed` to wipe and repopulate `Product` and `User` collections from `backend/data.js`.
- `backend/routes/uploadRoutes.js`
  - Protected `POST /api/upload` endpoint (requires `isAuth` + `isAdmin`).
  - Uses `multer` memory storage and AWS S3 client pointed at Liara to store images under a `products/` prefix.

### Search service and Typesense integration

- `backend/lib/typesense.js`
  - Initializes a singleton Typesense client using env‑driven config (host/port/apiKey/protocol).
  - Exports `checkHealth()` for simple health checks and the client as default for direct use.
- `backend/services/searchService.js`
  - `ensureProductCollection()` ensures the `products` collection with the expected schema exists.
  - `searchProducts(query, options)` builds a Typesense search query with optional filters and returns normalized `{ hits, total, page, perPage }`.
  - `indexProduct(product)` maps a MongoDB product document into the Typesense schema and upserts it by id.

### Seeding and uploads

- `backend/routes/seedroutes.js` relies on `backend/data.js` (not detailed here) to seed initial users and products.
- `backend/routes/uploadRoutes.js` hides Liara/S3 specifics behind a simple `/api/upload` endpoint that returns a Cloudinary-like response (`secure_url`, `public_id`).

## High-level frontend architecture (`frontend/`)

### Build and dev tooling

- `frontend/vite.config.js`
  - Uses `@vitejs/plugin-react` and `@tailwindcss/vite`.
  - Configures a dev-time proxy so requests to `/api` are forwarded to `http://localhost:5000`.
- Main scripts in `frontend/package.json`:
  - `npm run dev` – Vite dev server.
  - `npm run build` – production build.
  - `npm run preview` – preview built app.
  - `npm run lint` – run ESLint across the project.

### Entry point and root component tree

- `frontend/src/main.jsx`
  - Creates the React root and wraps `<App />` in several context providers:
    - `StoreProvider` – global cart and auth state (localStorage-backed).
    - `MenuProvider`, `CategoryContextProvider`, `SubsetContextProvider` – header/menu and category selection state.
    - `SearchContextProvider` – shared product search/filter state.
    - `MessageToastContextProvider` – simple toast messaging state.
- `frontend/src/App.jsx`
  - Wraps the app in `BrowserRouter`.
  - Sets RTL layout and theme wrapper.
  - Renders `Header`, `ToastContainer` and a `Routes` switch.
  - Defines public routes (home, product detail, cart, search, auth flow) and protected/admin routes using:
    - `ProtectedRoute` – wrapper enforcing authenticated access.
    - `AdminRoute` – wrapper enforcing `isAdmin` flag.
  - Renders a simple footer and `MessageToast` component.

### State management & contexts

- `frontend/src/store.jsx` (global store)
  - Provides `Store` context with a `useReducer`-managed state for `userInfo` and `cart`.
  - Persists cart and some user data to `localStorage`.
  - Handles actions like `CART_ADD_ITEM`, `CART_REMOVE_ITEM`, `CART_CLEAR`, `USER_SIGNIN`, `USER_SIGNOUT`, `SAVE_SHIPPING_ADDRESS`, `SAVE_PAYMENT_METHOD`.
- `frontend/src/contexts/menucontext.jsx`
  - `MenuProvider` tracks menu open/close state.
  - `CategoryContextProvider` and `SubsetContextProvider` manage selected high-level category and subcategory (aligned with `cats`/`CATEGORIES` from the backend).
- `frontend/src/contexts/searchContext.jsx`
  - `SearchContextProvider` maintains an array representing category/subset/filter selections shared by search UI and results.
- `frontend/src/contexts/messageScreenContext.jsx`
  - `MessageToastContextProvider` controls a simple `[isOpen, message]` tuple for toast UI.

### Screens and routing structure

Screens are organized under `frontend/src/sections/` and generally correspond 1:1 with routes in `App.jsx`:

- Lobby & product browsing: `lobby`, `productscreen`, `searchscreen`.
- Cart & checkout: `cartscreen`, `shippingaddressscreen`, `paymentmethodscreen`, `placeorderscreen`, `orderscreen`, `orderhistory`.
- Auth & profile: `signinscreen`, `signupscreen`, `profilescreen`.
- Admin: `adminscreens/` (dashboard, product list/edit, order list, user list/edit).

These screens talk to the backend via `axios` (e.g. `Lobby` hits `/api/products`) and rely on contexts/store for shared state.

## How to extend or debug

- To add or modify API endpoints, work in `backend/routes/*` and the corresponding `backend/models/*` or `backend/services/*`.
- To add new product categories or filters, adjust `cats` and `subsets` in `backend/models/productmodel.js` and ensure the frontend category/filter UI stays in sync.
- For search relevance or facet changes, update `ensureProductCollection` and `searchProducts` in `backend/services/searchService.js` and reindex products via `indexProduct`.
- For frontend features, new pages typically live under `frontend/src/sections/` and are wired into routing via `frontend/src/App.jsx`; shared state should go into the appropriate context or the global `Store`.
