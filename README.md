# CrmPlatformClient – Frontend

This folder contains the client-side Angular application of the CRM platform, developed as part of the Bachelor's thesis by Turis Gavriil-Vlad, University of Bucharest, Faculty of Mathematics and Computer Science.

---

## Technologies Used

- Angular CLI (standalone components)
- PrimeNG – UI components
- Angular Material – UI components
- Bootstrap – UI components
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
# Functionalities and Visual Design
## Homepage (Unauthenticated)

- Contains animated background (tsparticles)
- Publicly visible information about the platform
- Highlights key features and company previews

<img width="960" height="620" alt="image" src="https://github.com/user-attachments/assets/27e6094b-fede-4eb3-9a4d-42c96d3577ef" />

  ## Homepage (Authenticated Users)

- Displays ticket preview, dashboard stats, and company info
- Uses role-based directives (*appHasRole*) to conditionally render content

<img width="960" height="620" alt="image" src="https://github.com/user-attachments/assets/7bd99be3-713c-468c-9a21-a2d160a2899f" />

<img width="960" height="620" alt="image" src="https://github.com/user-attachments/assets/4f865435-4b40-47ac-8ca5-788a18ba37fa" />

## Profile Editing Page

- Edit email, phone number, and profile photo
- Uses international phone input with live validation
- Displays confirmation prompt on unsaved changes

<img width="960" height="620" alt="image" src="https://github.com/user-attachments/assets/4843a1be-b52a-4c3e-8fa1-390a358228cf" />

## Dashboard

The dashboard serves as the main workspace for authenticated users, adapting its interface and content depending on the user's role.

- For **Software Company Employees**:
  - Displays a performance analytics page with ticket statistics (total, resolved/unresolved), priority distribution, and feedback sentiment.
  - Includes sections for claiming open tickets and reviewing personal feedbacks.

- For **Beneficiary Company Users**:
  - Offers access to a feedback section and a statistics page showing ticket distribution by status and project.
  - Allows rapid ticket creation.

The dashboard logic is handled by `DashboardUserComponent`, which identifies the user role through `AccountService` and dynamically loads the appropriate content:

- `PerformancePageComponent` – analytics for software company users
- `ContractSoftwareListComponent` – claimable tickets
- `FeedbackUserListComponent` – feedback visualization
- `PerformancePageBeneficiaryComponent` – stats for beneficiaries
- `CreateTicketComponent` – form to open a new ticket

<img width="960" height="920" alt="image" src="https://github.com/user-attachments/assets/0ccaacf4-f50e-4882-971a-8f70b8ec40f0" />


<img  width="960" height="920" alt="image" src="https://github.com/user-attachments/assets/06652a20-0317-4ef5-a4ac-0a4b3abf6c9d" />
<p align="center">
    <img src="https://github.com/user-attachments/assets/445e4c9b-9260-44fe-a524-9f00404bd2f9" alt="Dashboard Screenshot" width="700"/>
  <br/>
    <em>Figure: Dashboard view for authenticated users</em>
</p>


## Ticket List and Card View

- Paginated and filtered list of tickets
- Sorting by date, priority, and keyword
- Shows status, summary, and attachments

<p align="center">
<img width="979" height="752" alt="image" src="https://github.com/user-attachments/assets/d62aedb9-d124-4b9a-96c4-53844550c6d8" />
  <br/>
<em>Figure: Dashboard view for authenticated users</em>
</p>


---

## Ticket Detail Page

- Shows ticket metadata and all historical updates
- Includes translation functionality (LLM-based)
- Attachment overlay view and comment timeline

<p align="center">
<img width="960" height="620" alt="image" src="https://github.com/user-attachments/assets/1ab2a992-655b-45f0-9156-abf3f6829bc6" />
  <br/>
<em>Figure: Dashboard view for authenticated users</em>
</p>

---

## Feedback Module

- Star-based feedback for beneficiaries
- Optional prompt auto-generated via LLM
- Sentiment analysis results
- Display of received feedback for software users

<p align="center">
<img width="960" height="620" alt="image" src="https://github.com/user-attachments/assets/71ac884f-28a2-4d9c-9769-ac5e41d80c15" />
  <br/>
<em>Figure: Dashboard view for authenticated users</em>
</p>

## User List and Profile

- Paginated list of all users with role, name, rating
- Uses SignalR for online status indicator
- Profile view includes feedback, ticket, and activity tabs

<p align="center">
<img width="960" height="620" alt="image" src="https://github.com/user-attachments/assets/c2c42f07-37d9-43b9-a053-5e22476cbc8d" />
  <br/>
<em>Figure: Dashboard view for authenticated users</em>
</p>

<p align="center">
<img width="960" height="620" alt="image" src="https://github.com/user-attachments/assets/615571ff-1b98-4611-a74b-2f362f2e52d2" />
  <br/>
<em>Figure: Dashboard view for authenticated users</em>
</p>






