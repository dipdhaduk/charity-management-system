# CharityHub

## Overview

CharityHub is a donation and volunteer management platform for people who want to support community campaigns and for charities coordinating fundraising and volunteer work. Donors can browse appeals, make and track donations, and view receipts. Charity organizations can manage campaigns and volunteer opportunities; volunteers can apply to opportunities; administrators can review users, charities, campaigns, and donations.

This project was built as a full-stack portfolio application to demonstrate role-based workflows across a React client, a REST API, and MongoDB.

## Features

- Browse and search campaigns by cause, status, and other supported filters.
- View campaign details, fundraising progress, organization information, and campaign updates.
- Register and sign in as a donor, charity, or volunteer. Administrator accounts are provisioned separately.
- Create and manage campaigns and post updates as a charity.
- Make donations through the donation API and Stripe payment-intent flow; view donation history and generated receipts.
- Browse volunteer opportunities, submit applications, and review application status.
- In-app notifications and role-specific dashboards.
- Administrator tools for charity verification and platform records.

## Demo Credentials & Login Accounts

Use the following test accounts to sign in directly:

| Role | User ID (Email) | Password | Dashboard URL | Account Description |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | `admin@charityhub.org` | `password123` | `/dashboard/admin` | System Administrator (audits, charity approvals) |
| **Charity** | `info@hopefoundation.org` | `password123` | `/dashboard/charity` | Hope Foundation (create & manage campaigns) |
| **Charity** | `contact@cleanwateraid.org` | `password123` | `/dashboard/charity` | Clean Water Aid (campaign & volunteer management) |
| **Donor** | `priya.sharma@example.com` | `password123` | `/dashboard/donor` | Priya Sharma (donation history & tax receipts) |
| **Donor** | `rahul.verma@example.com` | `password123` | `/dashboard/donor` | Rahul Verma (donation history & appeals) |
| **Volunteer** | `arjun.singh@example.com` | `password123` | `/dashboard/volunteer` | Arjun Singh (volunteer applications & hub) |

> **Universal Password:** `password123` *(all lowercase, no special characters, same for all accounts above)*.  
> You can also create your own account anytime on the [Join CharityHub](/register) page.

## Tech Stack

- **Frontend:** React 19, Vite, React Router, Redux Toolkit, Axios
- **Backend:** Node.js, Express 4
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT bearer tokens; `bcryptjs` password hashing
- **Payments:** Stripe SDK and Stripe React bindings
- **Styling:** Tailwind CSS 3, custom CSS variables, Lucide icons
- **Charts:** Recharts

## Project Architecture

```text
React browser app -> Express REST API -> Mongoose -> MongoDB
                              |\
                              | \-> Stripe payment intents
                              \----> Static /uploads files (if present)
```

The Vite app calls the API through Axios (`VITE_API_URL`). The Axios request interceptor attaches a stored JWT as a bearer token. Express mounts route modules under `/api`; route middleware checks authentication and roles before controllers run. Controllers read and update MongoDB through Mongoose models. The donation payment-intent endpoint also calls Stripe when configured.

## Folder Structure

```text
client/
  src/components/         Shared navigation, cards, forms, and UI
  src/context/            Authentication context
  src/dashboard/          Donor, charity, volunteer, and admin views
  src/pages/               Public and role-specific pages
  src/redux/               Redux store and authentication slice
  src/services/            Axios API and feature service modules
  src/index.css            Tailwind setup, theme tokens, global styles
  index.html               Vite HTML entry point
server/
  config/                  MongoDB connection
  controllers/             Request handling and business logic
  middleware/              JWT, role checks, and error handling
  models/                  Mongoose schemas
  routes/                  Express route definitions
  seed/                    Sample database seeder
  utils/                   JWT and receipt helpers, Stripe service
  server.js                Express app setup and API entry point
```

## Database

MongoDB is accessed through Mongoose. The models and principal relationships are:

- `User`: name, unique email, hashed password, role, profile fields, and active status.
- `Charity`: organization profile owned by a `User`, including verification state and contact details.
- `Campaign`: belongs to a charity; stores its category, goal, raised amount, image URL, location, dates, and status. A virtual field calculates capped fundraising progress.
- `Donation`: references its donor, campaign, and charity; stores amount, payment status, method, transaction ID, and date.
- `Receipt`: references a donation and stores the generated receipt number and donation summary.
- `VolunteerOpportunity`: belongs to a charity and may reference a campaign.
- `VolunteerApplication`: references a volunteer and opportunity, with a message and review status.
- `CampaignUpdate`: references a campaign and stores update content and an optional image URL.
- `Notification`: references a user and stores message, type, and read status.

Mongoose schemas define required fields, enums, defaults, and references. Passwords are selected out of normal queries, hashed before saving, and omitted from JSON serialization.

## API Endpoints

Base URL: `http://localhost:5000/api`. Private routes require `Authorization: Bearer <token>`. Charity/admin routes and admin-only routes also check the user's role.

| Method | Route | Request / parameters | Response purpose | Access |
| --- | --- | --- | --- | --- |
| `GET` | `/health` | None | Service status and timestamp | Public |
| `POST` | `/auth/register` | `name`, `email`, `password`; optional `role`, `phone`, `organizationName` | Created user, charity profile when applicable, and JWT | Public |
| `POST` | `/auth/login` | `email`, `password` | Authenticated user and JWT | Public |
| `GET` | `/auth/me` | Bearer token | Current user and charity profile when applicable | Signed in |
| `PUT` | `/auth/profile` | Profile fields such as `name`, `phone`, `avatar` | Updated user profile | Signed in |
| `GET` | `/campaigns` | Optional query: `category`, `status`, `location`, `search`, `charityId`, `featured`, `sort` | Matching campaigns with charity summary and count | Public |
| `GET` | `/campaigns/:id` | Campaign ID path parameter | Campaign, updates, and recent successful donations | Public |
| `POST` | `/campaigns` | `title`, `description`, `category`, `goalAmount`; optional image, location, dates, status | Created campaign | Charity/admin |
| `PUT` | `/campaigns/:id` | Campaign ID and fields to change | Updated campaign | Charity/admin |
| `DELETE` | `/campaigns/:id` | Campaign ID path parameter | Deletion confirmation | Charity/admin |
| `GET` | `/campaigns/:id/updates` | Campaign ID path parameter | Updates for that campaign | Public |
| `POST` | `/campaigns/:id/updates` | Campaign ID; update title/content and optional image | Created update and donor notifications | Charity/admin |
| `GET` | `/charities` | No required parameters | Charity profiles | Public |
| `GET` | `/charities/:id` | Charity ID path parameter | Charity profile and related campaigns | Public |
| `GET` | `/charities/me` | Bearer token | Current user's charity profile | Charity/admin |
| `POST` | `/charities` | Charity profile fields such as organization name, description, registration number, and contact details | Created charity profile | Charity/admin |
| `PUT` | `/charities/:id` | Charity ID and profile fields to change | Updated charity profile | Charity/admin |
| `POST` | `/donations/create-payment-intent` | `campaignId`, positive `amount` | Stripe client secret, intent ID, amount, and currency | Signed in |
| `POST` | `/donations` | `campaignId`, positive `amount`; optional `paymentMethod`, `transactionId` | Donation, receipt, and updated campaign progress | Signed in |
| `GET` | `/donations/my` | Bearer token | Current user's donation history with receipts | Signed in |
| `GET` | `/donations/:id` | Donation ID path parameter | Donation, receipt, and associated records | Signed in |
| `GET` | `/volunteers/opportunities` | Optional query parameters supported by the controller | Opportunity list and count | Public |
| `GET` | `/volunteers/opportunities/:id` | Opportunity ID path parameter | Opportunity details | Public |
| `POST` | `/volunteers/opportunities` | Opportunity fields including title, description, location, date, and optional campaign | Created opportunity | Charity/admin |
| `POST` | `/volunteers/apply` | `opportunityId`, optional application message | Created application | Signed in |
| `GET` | `/volunteers/my-applications` | Bearer token | Current user's applications | Signed in |
| `GET` | `/volunteers/charity-applications` | Bearer token | Applications for the current charity | Charity/admin |
| `PUT` | `/volunteers/applications/:id` | Application ID and review `status` | Updated application | Charity/admin |
| `GET` | `/notifications` | Bearer token | Current user's notifications and unread count | Signed in |
| `PUT` | `/notifications/:id/read` | Notification ID path parameter | Updated read state | Signed in |
| `PUT` | `/notifications/read-all` | Bearer token | Updated read state for all current user's notifications | Signed in |
| `GET` | `/users/:id` | User ID path parameter | User profile | Signed in |
| `GET` | `/admin/stats` | Bearer token | Aggregate dashboard statistics | Admin |
| `GET` | `/admin/users` | Bearer token | User records | Admin |
| `PUT` | `/admin/users/:id/status` | User ID and requested status | Updated account status | Admin |
| `GET` | `/admin/charities` | Bearer token | Charity records | Admin |
| `GET` | `/admin/charities/pending` | Bearer token | Charities awaiting review | Admin |
| `PUT` | `/admin/charities/:id/verify` | Charity ID and review status | Updated verification state | Admin |
| `GET` | `/admin/campaigns` | Bearer token | Platform campaign records | Admin |
| `GET` | `/admin/donations` | Bearer token | Donation records | Admin |
| `GET` | `/admin/volunteers` | Bearer token | Volunteer opportunities and applications | Admin |

JSON requests use the fields described above. IDs in `:id` positions are URL path parameters. The route definitions are in `server/routes/`; controllers determine response fields. Donation payment-intent creation also requires Stripe configuration.

## Authentication

Registration accepts donor, charity, and volunteer roles; the server does not permit public registration as an administrator. The `User` Mongoose pre-save hook hashes passwords with bcryptjs. Login compares the submitted password against the stored hash and returns a JWT. The client stores the token in `localStorage`; its Axios interceptor sends it as a bearer token. `protect` middleware verifies the token and attaches the current user, and `authorize` middleware limits selected routes by role. Client-side protected routes improve navigation, while server middleware enforces access.

## Image Storage

Campaigns, charity logos, user avatars, and campaign updates store image **URLs** in MongoDB fields such as `Campaign.image`, `Charity.logo`, and `User.avatar`. The seed data and fallback images use externally hosted Unsplash URLs. The frontend renders these values directly as image `src` URLs.

There is no implemented image upload API. Express exposes `server/uploads` at `/uploads` as static files if that directory exists, but the project currently has no uploads directory or route that writes files there. Images in the sample data therefore load remotely; local files would need to be placed in the served folder and their `/uploads/...` paths saved in the relevant database field.

To move to Cloudinary or S3, add a server-side upload endpoint, validate file type and size, upload with credentials held only by the server, then save the returned hosted URL in the existing image field. The frontend can continue to render the stored URL, so no schema change is needed.

## Environment Variables

Copy `server/.env.example` to `server/.env` and `client/.env.example` to `client/.env`. Keep actual `.env` files out of version control. Only variables prefixed with `VITE_` are available to browser code; never put server secrets there.

| Variable | Location | Purpose |
| --- | --- | --- |
| `PORT` | Server | API port (default `5000`) |
| `MONGO_URI` | Server | MongoDB connection string (default is local `charity_platform`) |
| `JWT_SECRET` | Server | Required secret for signing/verifying authentication tokens |
| `STRIPE_SECRET_KEY` | Server | Optional Stripe server key for payment-intent operations |
| `STRIPE_CURRENCY` | Server | Stripe payment currency (defaults to `inr`) |
| `SEED_USER_PASSWORD` | Server | Required password assigned to all accounts created by the sample seed |
| `VITE_API_URL` | Client | API base URL (defaults to `http://localhost:5000/api`) |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Client | Optional Stripe publishable key; safe for browser use |

## How to Run Locally

Prerequisites: Node.js/npm and a running MongoDB instance. Stripe keys are needed only to exercise configured Stripe payment-intent flows.

1. Clone the repository and enter the project folder.
2. Install dependencies in both `server/` and `client/` with `npm install`.
3. Copy each `.env.example` to `.env` in its respective folder. Set a unique, random `JWT_SECRET`, configure `MONGO_URI`, and choose a local `SEED_USER_PASSWORD` if you plan to seed.
4. Start MongoDB and confirm the server's connection string points to it.
5. Optionally run the sample seed from `server/` with `npm run seed` (see below).
6. Start the API from `server/` with `npm run dev` for development, or `npm start`.
7. Start the frontend from `client/` with `npm run dev`.
8. Open the Vite URL printed in the terminal (normally `http://localhost:5173`).

## Database Seed / Sample Data

`server/seed/seedData.js` creates users for supported roles plus charities, active and completed campaigns, donations, receipts, notifications, volunteer opportunities/applications, and campaign updates. Seeded users use the server-only `SEED_USER_PASSWORD` value. Their credentials are not displayed in the public interface; create local accounts using that password when you need to exercise a seeded role.

**The seed script deletes all documents in the project's collections before inserting its sample data.** Run it only against a local or disposable database, never against data you need to keep.

## Interview Questions and Short Answers

### Beginner Questions

**What problem does CharityHub solve?**

It gives donors one place to discover campaigns, follow fundraising progress, and make donations. Charities can manage campaigns and volunteer opportunities, while volunteers can apply to help.

**How does a request travel through the application?**

A React page calls a feature service, which makes an Axios request to an Express route. Middleware handles authentication and roles; a controller uses Mongoose to read or update MongoDB and returns JSON to the client.

**What does REST mean in this API?**

The API organizes operations around resources such as campaigns, donations, and volunteer opportunities. HTTP methods indicate whether a client is reading, creating, updating, or deleting a resource.

### Frontend Questions

**Why React and Vite?**

React makes it practical to reuse campaign cards, forms, navigation, and dashboards. Vite provides the local development server and production build used by this client.

**How is state managed?**

Redux Toolkit holds shared authentication state. Pages use React state for local concerns such as filters, form fields, selected campaigns, and loading feedback.

**How does data fetching work?**

Feature service modules call a shared Axios client. It uses `VITE_API_URL`, attaches the JWT from local storage when present, and turns API error responses into rejected promises for the pages to handle.

**How are forms handled?**

Forms use controlled React inputs and page/component state. Submit handlers perform basic client checks, call the matching service, and show a loading, success, or error state where implemented; server-side validation remains necessary.

**How are routes protected?**

React Router's `ProtectedRoute` redirects signed-out users and checks the current role for dashboard routes. The API repeats those checks with server middleware because client checks alone are not security controls.

### Backend Questions

**How are routes and business logic organized?**

Route modules declare HTTP paths and middleware. Controllers validate input, call Mongoose models, and send JSON responses. Shared middleware handles token verification, role checks, not-found routes, and errors.

**How are passwords secured?**

A Mongoose pre-save hook hashes passwords with bcryptjs. Login selects the otherwise-hidden password hash and compares it with the supplied password; the hash is omitted from JSON output.

**What happens after a campaign update is posted?**

The update is saved against its campaign, then notification records are created for that campaign's donors. The API returns the saved update to the client.

### Database Questions

**Why MongoDB and Mongoose here?**

MongoDB stores the application's related records as documents, and Mongoose gives the project schemas, validation, defaults, and document references. The database can be replaced later if reporting or transaction requirements call for a relational design.

**What are the main relationships?**

A charity references its owner user; campaigns reference charities; donations reference a donor, campaign, and charity; receipts reference donations. Volunteer applications reference both a volunteer and an opportunity.

**How is campaign progress calculated?**

The campaign model exposes a virtual percentage from `raisedAmount / goalAmount`, rounded and capped at 100. The stored amounts remain the source of truth.

### Authentication & Security Questions

**Where is the token stored?**

The client stores the JWT in `localStorage`, then Axios sends it as a bearer token. That is simple for this portfolio app, but an XSS issue can expose local-storage tokens; a production deployment should evaluate secure, HTTP-only cookies and CSRF controls.

**How are protected operations enforced?**

The API's `protect` middleware verifies the JWT and attaches the user. `authorize` checks the role before charity or admin operations run; frontend route guards only improve navigation.

**What would you improve before production?**

I would add rate limiting, strict origin allowlists, stronger request validation, audit logging, secure token/session handling, Stripe webhook verification, idempotent donation processing, and operational monitoring. The current donation controller should not be treated as proof of a payment until the server confirms it with Stripe.

### Image/File Handling Questions

**Where are image files stored?**

The database stores image URLs, not image bytes. The sample campaign and profile images use external Unsplash URLs; there is no implemented upload endpoint. Express serves `server/uploads` if files are put there manually.

**How would you support 100,000 images?**

I would use object storage such as S3 or Cloudinary, serve resized variants through a CDN, validate uploads on the server, and keep the returned URL or storage key in the existing image field.

### Scenario-Based Questions

**What happens if MongoDB is unavailable?**

Connection setup logs the failure and exits the API process. A deployed service should also expose health/readiness checks and restart or alert through its process manager.

**What happens if an API request fails?**

The server's error middleware returns a JSON error. Axios rejects the request with the API message; pages should show a useful error or retry state rather than presenting stale data as current.

**What happens if a user submits invalid data?**

Some forms check required fields and constraints before submitting. Controllers and Mongoose schemas also validate input; the error middleware maps common validation failures to a 400 response. Request validation could be made more consistent across endpoints.

**How would you add pagination?**

I would add validated `page` and `limit` query parameters to campaign listing, apply `skip` and `limit` in the controller, and return paging metadata with the records. The client could then request pages without changing campaign documents.

**How would you make payment retries safe?**

I would verify Stripe payment status on the server, use a stable idempotency key, store the Stripe intent ID with a unique constraint, and update campaign totals only once after confirmed payment.

**How would you scale campaign browsing?**

I would measure query performance, add indexes to common filters and sort fields, paginate results, serve image variants through a CDN, and cache public responses where freshness requirements allow it.

**How would you deploy and operate the application?**

I would host the static client and API separately, use managed MongoDB, configure environment secrets in the hosting platform, restrict CORS to the client origin, enable HTTPS, and monitor health and payment failures. I would add caching only for public data with a clear invalidation rule.

## Common Interview Follow-Ups

### If the interviewer asks WHY?

**Why this database?** Mongoose lets the project define practical validation and references over MongoDB documents without adding a large data layer.

**Why React?** The interface has repeated cards and different role-based screens, so component reuse helps keep those views consistent.

**Why JWT authentication?** The API is stateless between requests and already uses bearer-token middleware. I would reconsider HTTP-only cookies for a production browser deployment.

**Why separate routes, controllers, and models?** Each layer has a clear job: routes declare the endpoint, controllers handle the request workflow, and models define persisted data and validation.

**Why are images stored as URLs?** The existing app can render remote URLs without sending image bytes through its API. A storage service can be added later while preserving the URL field.

**What would you change if rebuilding it?** I would define API contracts and payment-state transitions first, add integration tests for role and donation flows, and implement webhook-confirmed, idempotent payments before expanding UI features.

## Project Explanation for an Interview

### 60-Second Project Explanation

“CharityHub is a full-stack donation and volunteer management app. Donors can browse campaigns, see how much each has raised, donate, and review their donation records. Charities can manage campaigns and volunteer opportunities, and volunteers can apply to help. The frontend is React with Vite and React Router; Redux Toolkit keeps authentication state, and Axios talks to an Express REST API. The API uses JWT middleware for signed-in routes and role checks for charity and admin actions. MongoDB stores users, charities, campaigns, donations, receipts, volunteer applications, updates, and notifications through Mongoose. Campaign images are stored as URLs rather than uploaded files. I built it to demonstrate how those role-based workflows connect across a practical full-stack application.”

### 2-Minute Detailed Explanation

“CharityHub brings campaign discovery, donations, and volunteer coordination into one application. A donor can browse and filter campaigns, open a campaign page with its progress and updates, and start a donation. A charity account can create campaigns and volunteer opportunities, publish campaign updates, and review applications. Admin tools cover charity verification and platform records.

The frontend uses React and Vite. React Router maps public pages and role-specific dashboards; Redux Toolkit stores shared authentication state, while page components handle local filters and forms. A small service layer calls the Express API through Axios, which attaches the JWT bearer token when the user is signed in.

The Express API groups routes by resource. Authentication middleware verifies the token, role middleware gates restricted operations, and controllers use Mongoose models to query MongoDB. The data model links users to charity profiles, campaigns to charities, donations to donors and campaigns, and receipts to donations. The `User` schema hashes passwords with bcryptjs. Campaign progress is calculated from the raised amount and goal.

Images are currently URLs in MongoDB fields; sample images are hosted externally, and there is no upload API. A future upload service could use S3 or Cloudinary and save the resulting URL without changing the schema.

The main production improvements I would prioritize are confirming donations through Stripe webhooks, making payment writes idempotent, tightening request validation and CORS, and adding pagination and integration tests around role and payment flows.”

