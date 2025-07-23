# CrmPlatformClient – Frontend

This folder contains the client-side Angular application of the CRM platform, developed as part of the Bachelor's thesis by Turis Gavriil-Vlad, University of Bucharest, Faculty of Mathematics and Computer Science.

---

## Technologies Used

- Angular CLI (standalone components)
- PrimeNG – UI components
- Angular Material – dialogs and forms
- Bootstrap – layout and responsiveness
- SignalR – for real-time user presence
- ngx-material-intl-tel-input – international phone input
- Reactive Forms – for complex form logic and validation
- HTTPS support via mkcert (development environment)

---

## Application Architecture

```
src/app/
├── features/                  # Core modules (auth, home, dashboard, tickets, feedback, etc.)
│   └── auth/
│   └── dashboard/
│   └── tickets/
│   └── feedback/
├── _services/                 # HTTP services (AccountService, TicketService, etc.)
├── _interceptors/             # JWT handling, global error interceptors
├── _directives/               # Role-based rendering directives (hasRole, notHasRole)
├── models/                    # Interfaces for API DTOs
├── environments/              # Environment configurations
```

The project is modular and uses lazy loading with role-based guards.

---

## Authentication and Role Logic

- JWT-based login and secure token storage
- Roles are embedded in the token
- Conditional rendering based on roles using custom Angular directives
- Navigation structure adapts based on role

Roles:
- Admin
- Moderator
- SoftwareCompanyUser
- BeneficiaryCompanyUser

---
