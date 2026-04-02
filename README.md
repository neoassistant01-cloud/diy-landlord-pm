# DIY Landlord Property Manager

A simple property management dashboard for solo landlords managing 1-5 rental properties.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** SQLite with Prisma ORM
- **Styling:** Tailwind CSS
- **Package Manager:** pnpm

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm`)

### Installation

```bash
# Install dependencies
pnpm install

# Set up database
pnpm db:push

# Start development server
pnpm dev
```

The app will be available at `http://localhost:3000` (or next available port).

### Seeding Data (Optional)

```bash
pnpm db:seed
```

## Features

- **Dashboard** - Overview of properties, tenants, maintenance requests, and revenue
- **Properties** - Add, edit, delete rental properties
- **Tenants** - Manage tenant information, lease dates, and rent status
- **Maintenance** - Track maintenance requests with priority levels
- **Payments** - Record and track rent payments

## Project Structure

```
├── app/                    # Next.js app router pages
│   ├── api/               # API routes
│   ├── components/       # Shared components
│   ├── properties/       # Property pages
│   ├── tenants/         # Tenant pages
│   ├── maintenance/     # Maintenance pages
│   └── payments/        # Payment pages
├── prisma/               # Database schema
│   └── schema.prisma
└── lib/                  # Utility libraries
    └── prisma.ts        # Prisma client
```

## Database Schema

- **Property:** address, type, units, rentAmount, status
- **Tenant:** name, email, phone, leaseStart, leaseEnd, unitAssigned, rentStatus
- **MaintenanceRequest:** description, priority, status, createdDate
- **Payment:** amount, date, method, status

## License

MIT
