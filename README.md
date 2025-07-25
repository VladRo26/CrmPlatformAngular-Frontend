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

<p align="center">
<img width="960" height="620" alt="image" src="https://github.com/user-attachments/assets/27e6094b-fede-4eb3-9a4d-42c96d3577ef" />
  <br/>
<em>Homepage for unauthenticated users</em>
</p>

  ## Homepage (Authenticated Users)

- Displays ticket preview, dashboard stats, and company info
- Uses role-based directives (*appHasRole*) to conditionally render content

<p align="center">
<img width="960" height="620" alt="image" src="https://github.com/user-attachments/assets/7bd99be3-713c-468c-9a21-a2d160a2899f" />
  <br/>
<em>Homepage for authenticated users, Fig 1</em>
</p>

<p align="center">
<img width="960" height="620" alt="image" src="https://github.com/user-attachments/assets/4f865435-4b40-47ac-8ca5-788a18ba37fa" />
  <br/>
<em>Homepage for authenticated users, Fig 2</em>
</p>

## Profile Editing Page

- Edit email, phone number, and profile photo
- Uses international phone input with live validation
- Displays confirmation prompt on unsaved changes

<p align="center">
<img width="960" height="620" alt="image" src="https://github.com/user-attachments/assets/4843a1be-b52a-4c3e-8fa1-390a358228cf" />
  <br/>
<em>Profile Editing Page</em>
</p>

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

<p align="center">
<img width="960" height="920" alt="image" src="https://github.com/user-attachments/assets/0ccaacf4-f50e-4882-971a-8f70b8ec40f0" />
  <br/>
<em>Dashboard for software company employee</em>
</p>



<img  width="960" height="920" alt="image" src="https://github.com/user-attachments/assets/06652a20-0317-4ef5-a4ac-0a4b3abf6c9d" />
<p align="center">
    <img src="https://github.com/user-attachments/assets/445e4c9b-9260-44fe-a524-9f00404bd2f9" alt="Dashboard Screenshot" width="700"/>
  <br/>
    <em>Ticket selection option from dashboard</em>
</p>


## Ticket List and Card View

- Paginated and filtered list of tickets
- Sorting by date, priority, and keyword
- Shows status, summary, and attachments

<p align="center">
<img width="960" height="620" alt="image" src="https://github.com/user-attachments/assets/d62aedb9-d124-4b9a-96c4-53844550c6d8" />
  <br/>
<em>Ticket list page</em>
</p>


---

## Ticket Detail Page

- Shows ticket metadata and all historical updates
- Includes translation functionality (LLM-based)
- Attachment overlay view and comment timeline

<p align="center">
<img width="960" height="990" alt="image" src="https://github.com/user-attachments/assets/1ab2a992-655b-45f0-9156-abf3f6829bc6" />
  <br/>
<em>Ticket detail page</em>
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
<em>Feedback creation page for software company users</em>
</p>

## User List and Profile

- Paginated list of all users with role, name, rating
- Uses SignalR for online status indicator
- Profile view includes feedback, ticket, and activity tabs

<p align="center">
<img width="960" height="620" alt="image" src="https://github.com/user-attachments/assets/c2c42f07-37d9-43b9-a053-5e22476cbc8d" />
  <br/>
<em>User list page</em>
</p>

<p align="center">
<img width="960" height="620" alt="image" src="https://github.com/user-attachments/assets/615571ff-1b98-4611-a74b-2f362f2e52d2" />
  <br/>
<em>User detail page</em>
</p>


## Companies Page

- Paginated list of all companies (software & beneficiary)
- Card view includes logo, founding date, and industry (for beneficiaries)
- Filtering and sorting by name and type

Components:
- `CompanyListComponent`
- `CompanyCardComponent`


<p align="center">
<img width="960" height="620" alt="image" src="https://github.com/user-attachments/assets/22990163-e7ec-4b99-98d1-e332f3aeb03d" />
  <br/>
<em>Company list page</em>
</p>

## Contracts Page

- Shows active contracts between software and beneficiary companies
- Cards include logos, project name, period, budget, status knob
- Beneficiaries can update progress visually via overlay
- Admins/Moderators can fully edit contract via update page

Components:
- `ContractsPreviewComponent`
- `ContractCardComponent`
- Role-based display with *appHasRole and `allowedToUpdate`


<p align="center">
<img width="960" height="620" alt="image" src="https://github.com/user-attachments/assets/350884f4-97f7-42f5-9bcd-00ae31c80240" />
  <br/>
<em>Contract list page from the perspective of beneficiary company users</em>
</p>

## Admin / Moderator Perspective

### Admin Homepage

- Access to editable image gallery via `AdminImagesComponent`
- Role-adapted navigation (no ticket or feedback sections)

<p align="center">
<img width="960" height="620" alt="image" src="https://github.com/user-attachments/assets/1c725eae-0be4-4444-abf5-efc6d8f3797a" />
  <br/>
<em>Homepage for admin users</em>
</p>

### Admin Panel Page

- Accessible from navbar via `Admin` tab
- Admins: full access to users, companies, contracts
- Moderators: can manage companies and contracts only
- Uses `ReactiveForms` and *appHasRole for dynamic tab control

Components:
- `AdminPanelComponent`
- `UserManagementComponent`
- `CreateSoftwareComponent`
- `CreateBeneficiaryComponent`
- `CreateContractsComponent`

<p align="center">
  <img width="960" height="620" alt="image" src="https://github.com/user-attachments/assets/f2c0e22e-a057-4076-acde-be316eeecc13" />

  <br/>
<em>Admin dashboard with user management section</em>
</p>

### Update Pages for Companies and Contracts

- Admins/Moderators can access update buttons on cards
- Opens pre-filled form with validation logic (dates, fields)

Update Components:
- `UpdateSoftwareComponent`
- `UpdateBeneficiaryComponent`
- `UpdateContractComponent`

<p align="center">
  <img width="960" height="620" alt="image" src="https://github.com/user-attachments/assets/2952211e-9449-4822-803c-9c6f15248822" />
  <br/>
<em>Admin dashboard with company creation form</em>
</p>

<p align="center">
  <img width="960" height="620" alt="image" src="https://github.com/user-attachments/assets/32ff01b3-eaad-49d9-af55-20e138bdb743" />
  <br/>
<em>Contract list page for admin/moderator users</em>
</p>

<p align="center">
 <img width="960" height="620" alt="image" src="https://github.com/user-attachments/assets/031546a4-d4b3-47d3-b62a-2f936baa43fc" />
  <br/>
<em>Contract update form page</em>
</p>

<p align="center">
 <img width="960" height="620" alt="image" src="https://github.com/user-attachments/assets/f0fb88a4-bfc1-450e-b918-229d2c78be28" />
  <br/>
<em>Company list page for admin/moderator users</em>
</p>

<p align="center">
 <img width="960" height="620" alt="image" src="https://github.com/user-attachments/assets/b7cec3ef-284b-44a8-b233-d169713891a0" />
  <br/>
<em>Company update form page</em>
</p>

