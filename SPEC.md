# DIY Landlord Property Manager - Specification

## Project Overview
- **Project Name:** DIY Landlord PM
- **Type:** Web Application (Next.js 14)
- **Core Functionality:** Property management dashboard for solo landlords to manage properties, tenants, maintenance requests, and payments
- **Target Users:** Cory H (Athletic Director) - solo DIY landlords managing 1-5 rental properties

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Database:** SQLite with Prisma ORM
- **Styling:** Tailwind CSS
- **Package Manager:** pnpm

## Database Schema

### Property
| Field | Type | Description |
|-------|------|-------------|
| id | String (cuid) | Primary key |
| address | String | Property address |
| type | String | Property type (single-family, multi-family, condo, townhouse) |
| units | Int | Number of units |
| rentAmount | Float | Monthly rent per unit |
| status | String | Status (active, vacant, maintenance) |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

### Tenant
| Field | Type | Description |
|-------|------|-------------|
| id | String (cuid) | Primary key |
| name | String | Tenant full name |
| email | String | Tenant email |
| phone | String | Tenant phone |
| leaseStart | Date | Lease start date |
| leaseEnd | Date | Lease end date |
| unitAssigned | String | Unit number/identifier |
| rentStatus | String | Status (paid, pending, overdue) |
| propertyId | String | Foreign key to Property |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

### MaintenanceRequest
| Field | Type | Description |
|-------|------|-------------|
| id | String (cuid) | Primary key |
| propertyId | String | Foreign key to Property |
| description | String | Issue description |
| priority | String | Priority (low, medium, high, urgent) |
| status | String | Status (open, in-progress, completed, cancelled) |
| createdDate | Date | Request date |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

### Payment
| Field | Type | Description |
|-------|------|-------------|
| id | String (cuid) | Primary key |
| tenantId | String | Foreign key to Tenant |
| amount | Float | Payment amount |
| date | Date | Payment date |
| method | String | Method (cash, check, bank-transfer, credit-card) |
| status | String | Status (paid, pending, overdue) |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

## UI/UX Specification

### Layout Structure
- **Sidebar:** Fixed left sidebar (240px) with navigation
- **Main Content:** Flexible content area with padding (24px)
- **Header:** Simple header with app title and current date
- **Responsive:** Collapsible sidebar on mobile (<768px)

### Color Palette
- **Primary:** #1e3a5f (Deep Navy)
- **Secondary:** #3b82f6 (Blue)
- **Accent:** #10b981 (Emerald Green)
- **Background:** #f8fafc (Light Gray)
- **Surface:** #ffffff (White)
- **Text Primary:** #1e293b (Dark Slate)
- **Text Secondary:** #64748b (Slate)
- **Success:** #22c55e (Green)
- **Warning:** #f59e0b (Amber)
- **Danger:** #ef4444 (Red)

### Typography
- **Font Family:** Inter (sans-serif)
- **Headings:** 
  - H1: 28px, font-weight 700
  - H2: 22px, font-weight 600
  - H3: 18px, font-weight 600
- **Body:** 14px, font-weight 400
- **Small:** 12px, font-weight 400

### Spacing System
- **Base unit:** 4px
- **Common spacing:** 8px, 12px, 16px, 24px, 32px

### Components

#### Cards
- Background: white
- Border radius: 12px
- Shadow: 0 1px 3px rgba(0,0,0,0.1)
- Padding: 20px

#### Buttons
- Primary: bg-blue-600, text-white, hover:bg-blue-700
- Secondary: bg-gray-100, text-gray-700, hover:bg-gray-200
- Danger: bg-red-600, text-white, hover:bg-red-700
- Border radius: 8px
- Padding: 10px 16px

#### Form Inputs
- Border: 1px solid #e2e8f0
- Border radius: 8px
- Padding: 10px 12px
- Focus: ring-2 ring-blue-500

#### Tables
- Header: bg-gray-50, font-weight 600
- Rows: border-b border-gray-100
- Hover: bg-gray-50

#### Status Badges
- Active/Vacant/Paid: green background
- Pending: amber background
- Overdue/Maintenance: red background
- Border radius: 9999px (pill)
- Padding: 4px 12px

### Pages & Routes

#### 1. Dashboard (/)
- **Stats Cards:** Total properties, total tenants, open maintenance, monthly revenue
- **Recent Activity:** Quick list of recent items
- **Quick Actions:** Add property, add tenant buttons

#### 2. Properties (/properties)
- **List View:** Table with all properties
- **Actions:** Add, Edit, Delete
- **Columns:** Address, Type, Units, Rent, Status, Actions

#### 3. Property Form (/properties/new, /properties/[id]/edit)
- **Fields:** All Property fields
- **Validation:** Required fields marked

#### 4. Tenants (/tenants)
- **List View:** Table with all tenants
- **Actions:** Add, Edit, Delete
- **Columns:** Name, Email, Phone, Property, Unit, Lease Dates, Rent Status, Actions

#### 5. Tenant Form (/tenants/new, /tenants/[id]/edit)
- **Fields:** All Tenant fields
- **Validation:** Required fields marked

#### 6. Maintenance (/maintenance)
- **List View:** Table with all requests
- **Actions:** Add, Edit, Delete
- **Columns:** Property, Description, Priority, Status, Created Date, Actions

#### 7. Maintenance Form (/maintenance/new, /maintenance/[id]/edit)
- **Fields:** All MaintenanceRequest fields
- **Validation:** Required fields marked

#### 8. Payments (/payments)
- **List View:** Table with all payments
- **Actions:** Add, Edit, Delete
- **Columns:** Tenant, Amount, Date, Method, Status, Actions

#### 9. Payment Form (/payments/new, /payments/[id]/edit)
- **Fields:** All Payment fields
- **Validation:** Required fields marked

## API Routes

### Properties
- GET /api/properties - List all properties
- GET /api/properties/[id] - Get single property
- POST /api/properties - Create property
- PUT /api/properties/[id] - Update property
- DELETE /api/properties/[id] - Delete property

### Tenants
- GET /api/tenants - List all tenants
- GET /api/tenants/[id] - Get single tenant
- POST /api/tenants - Create tenant
- PUT /api/tenants/[id] - Update tenant
- DELETE /api/tenants/[id] - Delete tenant

### Maintenance
- GET /api/maintenance - List all requests
- GET /api/maintenance/[id] - Get single request
- POST /api/maintenance - Create request
- PUT /api/maintenance/[id] - Update request
- DELETE /api/maintenance/[id] - Delete request

### Payments
- GET /api/payments - List all payments
- GET /api/payments/[id] - Get single payment
- POST /api/payments - Create payment
- PUT /api/payments/[id] - Update payment
- DELETE /api/payments/[id] - Delete payment

## Acceptance Criteria

### Build
- [ ] `pnpm build` completes without errors
- [ ] No TypeScript errors
- [ ] No lint errors

### Functionality
- [ ] Dashboard displays accurate stats
- [ ] Can create, read, update, delete properties
- [ ] Can create, read, update, delete tenants
- [ ] Can create, read, update, delete maintenance requests
- [ ] Can create, read, update, delete payments
- [ ] Forms validate required fields

### UI/UX
- [ ] Clean, professional appearance
- [ ] Responsive layout works on mobile
- [ ] Navigation is intuitive
- [ ] Status badges display correctly

### Performance
- [ ] App starts on localhost:3000
- [ ] Pages load without errors
- [ ] Database operations work correctly

## Target User Context
Cory H is a busy Athletic Director with 1-5 rental properties. The app should be:
- Simple and intuitive
- Quick to add/view/update data
- No unnecessary complexity
- Clean visual hierarchy
