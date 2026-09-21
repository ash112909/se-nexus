# SE Nexus — Feature Roadmap

Organized by role, mobile-first.
Tiers: **ARA** = ARA Show demo · **V1** = full launch · **V2** = beyond launch
Status: ✓ shipped · · planned

---

## Technician
_Primary mobile user. In the field, on equipment, needs fast answers._

### Authentication & Identity
- ✓ [ARA] Login with role-based credentials
- ✓ [ARA] Role-aware shell and navigation
- [ ] [V1] Live Auth0 / SSO integration
- [ ] [V1] First-login onboarding flow
- [ ] [V1] Location and team assignment on first entry

### Home
- ✓ [ARA] Personalized welcome with location context
- ✓ [ARA] Recently updated work orders at a glance
- ✓ [ARA] Fleet news drawer
- [ ] [V2] Native mobile app shell (iOS & Android)
- [ ] [V2] Push notifications to mobile

### Work Orders
- ✓ [ARA] Work order list with status, supplier, and date filters
- ✓ [ARA] Free-text search across orders
- ✓ [ARA] Sortable columns
- ✓ [ARA] New order creation (repair, PM, stock, general)
- ✓ [ARA] Equipment auto-fill from asset number
- ✓ [ARA] Order detail — priority, due date, assignee, status
- ✓ [ARA] Status changes (active → pending → closed)
- ✓ [ARA] Parts cart attached to work order
- ✓ [ARA] Notes and activity timeline
- ✓ [ARA] Close order with confirmation
- ✓ [ARA] Archive and un-archive closed orders
- ✓ [ARA] Read-only view on archived orders
- [ ] [V1] Work order assignment notifications
- [ ] [V2] Barcode / QR scan to open machine WO history

### AI Diagnostic Assistant
- ✓ [ARA] Conversational AI chat for fault diagnosis
- ✓ [ARA] Context-aware by machine make / model / serial
- ✓ [ARA] Fault code interpretation in plain language
- ✓ [ARA] Repair steps with part number callouts
- ✓ [ARA] Confidence indicators on recommendations
- ✓ [ARA] Diagnostic session history within a work order
- ✓ [ARA] Natural language parts search
- ✓ [ARA] Push diagnostic parts directly to work order cart
- ✓ [ARA] AI quick-action entry from home
- [ ] [V1] Save and recall diagnostic sessions per work order
- [ ] [V1] Feedback on accuracy — resolved / not resolved
- [ ] [V2] Offline diagnostics in the field
- [ ] [V2] Model fine-tuning on fleet-specific fault data
- [ ] [V2] Automated PM triggering from diagnostic signal patterns

### Parts Search & Catalog
- ✓ [ARA] Search by keyword, part number, serial, make / model
- ✓ [ARA] Supplier-filtered catalog browsing
- ✓ [ARA] OEM vs. aftermarket distinction
- ✓ [ARA] Cross-reference and supersession display
- ✓ [ARA] Part detail — specs, fitment, pricing, availability
- ✓ [ARA] Local inventory indicator
- ✓ [ARA] Add to cart from search and part detail
- [ ] [V2] Barcode / QR scan to look up a part

### Cart & Ordering
- ✓ [ARA] Cart grouped by supplier
- ✓ [ARA] Line item quantity and source selection
- ✓ [ARA] OEM-only flags and mandatory cross-ref blocking
- ✓ [ARA] Order review with PO details
- ✓ [ARA] Submit for supervisor approval
- ✓ [ARA] Order history — read-only submitted records
- [ ] [V1] Order status change notifications
- [ ] [V1] Recommended parts — AI-driven "commonly replaced together" by fault type
- [ ] [V1] Proactive part recommendations during diagnostic flow
- [ ] [V1] Warranty-aware filtering on recommendations

### Manuals & Documentation
- ✓ [ARA] Search by machine, make / model
- ✓ [ARA] Filter by type (service, operator, parts)
- ✓ [ARA] Manual viewer with section navigation
- [ ] [V2] Offline manual access in the field

---

## Supervisor
_Manages a team of techs, approves spend, tracks fleet health._

### Work Orders
- ✓ [ARA] All technician work order features, plus full fleet visibility
- ✓ [ARA] Assignee column and filtering
- [ ] [V1] Work order assignment notifications
- [ ] [V1] Diagnostic session review — see what AI recommended per order

### Approvals
- ✓ [ARA] Approval queue for submitted orders
- ✓ [ARA] Approve or reject with comments
- [ ] [V1] Pending approvals email digest
- [ ] [V1] Approval cycle time visible in analytics

### Notifications
- [ ] [V1] In-app notification bell with unread count
- [ ] [V1] Alerts for order status changes and team assignment events
- [ ] [V1] Daily open WO summary email digest
- [ ] [V1] Warranty expiry flags

### Analytics
- [ ] [V1] Open vs. closed WO counts over time
- [ ] [V1] Average time-to-close by machine type and priority
- [ ] [V1] Parts spend by supplier, category, and location
- [ ] [V1] Top recurring faults by asset
- [ ] [V1] Exportable reports (CSV)
- [ ] [V2] Predictive maintenance scoring per asset
- [ ] [V2] Spend trend forecasting
- [ ] [V2] Fleet downtime cost modeling
- [ ] [V2] AI-generated supplier performance summaries

### Fleet Administration
- [ ] [V1] Asset registry — add, edit, retire equipment
- [ ] [V1] User management — invite, assign role, assign location
- [ ] [V1] Location management — branches, default suppliers
- [ ] [V1] Warranty record management per asset
- [ ] [V1] PM schedule configuration per asset type

---

## Supplier
_Receives orders, manages catalog presence, handles fulfillment._

### Portal Access
- ✓ [ARA] Supplier-facing login view
- ✓ [ARA] Order visibility for own POs
- [ ] [ARA] Basic order status updates from supplier side
- [ ] [V1] Supplier admin manages own profile, logo, and contact info
- [ ] [V1] Pricing tier and catalog visibility settings

### Content & Promotions
- ✓ [ARA] Supplier highlight carousel on fleet home (managed by SE)
- [ ] [V1] Supplier-authored product spotlights and promotions
- [ ] [V1] Time-limited promotion scheduling and expiry
- [ ] [V1] Content approval queue before surfacing to fleets

### Notifications
- [ ] [V1] Order event notifications (new PO received, status queries)
- [ ] [V2] Webhook subscriptions for order events and catalog updates

---

## Fleet Admin / SE Admin
_Configures the platform, manages tenants and users._

### Fleet Admin
- [ ] [V1] Asset registry management
- [ ] [V1] User and role management
- [ ] [V1] Location and branch configuration
- [ ] [V1] Supplier impersonation for support
- [ ] [V1] Onboarding flow configuration

### SE Admin (Multi-tenant)
- [ ] [V2] Tenant provisioning and configuration
- [ ] [V2] Global supplier catalog management across all fleets
- [ ] [V2] Pricing tier administration
- [ ] [V2] Feature flag management per tenant
- [ ] [V2] Usage and billing dashboards

---

## Platform & Integrations

### News & CMS
- ✓ [ARA] News feed by type (bulletin, safety, supplier, warranty)
- ✓ [ARA] Article detail view
- ✓ [ARA] Admin publishing interface with type tagging and publish date
- ✓ [ARA] Content on home news drawer

### ERP & RentalMan
- [ ] [V2] Asset records sync from RentalMan automatically
- [ ] [V2] WO creation triggered by RentalMan maintenance flags
- [ ] [V2] PO numbers written back on order submission
- [ ] [V2] Invoice reconciliation feed

### API & Webhooks
- [ ] [V2] Public REST API for third-party integrations
- [ ] [V2] Fleet webhook outbound — WO created, approved, closed
- [ ] [V2] Supplier webhook subscriptions

### Mobile
- [ ] [V2] Native app shell (iOS and Android)
- [ ] [V2] Offline mode — diagnostics and manuals in the field
- [ ] [V2] Push notifications
- [ ] [V2] Barcode / QR scan for parts and machines
