import { Routes } from '@angular/router';
import { HomeComponent } from './feautures/home/home.component';
import { RegisterComponent } from './feautures/auth/register/register.component';
import { LoginComponent } from './feautures/auth/login/login.component';
import { authGuard } from './_guards/guards/auth.guard';
import { ErrorTestingComponent } from './errors/error-testing/error-testing.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { UserappListComponent } from './feautures/userapp/userapp-list/userapp-list.component';
import { UserappDetailComponent } from './feautures/userapp/user-detail/userapp-detail/userapp-detail.component';
import { ContractListComponent } from './feautures/contracts/contract-list/contract-list.component';
import { UserappEditComponent } from './feautures/userapp/userapp-edit/userapp-edit.component';
import { unsavedChangesGuard } from './_guards/guards/unsaved-changes.guard';
import { TicketsUserListComponent } from './feautures/tickets/tickets-user-list/tickets-user-list.component';
import { TicketDetailComponent } from './feautures/tickets/ticket-detail/ticket-detail.component';
import { CreateFeedbackComponent } from './feautures/feedback/create-feedback/create-feedback.component';
import { benefuserGuard } from './_guards/guards/benefuser.guard';
import { softuserGuard } from './_guards/guards/softuser.guard';
import { CreateTicketComponent } from './feautures/tickets/create-ticket/create-ticket.component';
import { ContractSoftwareListComponent } from './feautures/contracts/contract-software-list/contract-software-list.component';
import { TicketsCompanyListComponent } from './feautures/tickets/tickets-company-list/tickets-company-list.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [authGuard],
        children: [ 
            {path: 'createFeedback', component: CreateFeedbackComponent, canActivate: [benefuserGuard]}, 
            {path: 'createTicket', component: CreateTicketComponent, canActivate: [benefuserGuard]},
            {path: 'myTickets', component:TicketsUserListComponent},
            { path: 'tickets/:id', component: TicketDetailComponent },
            {path: 'usersApp', component: UserappListComponent},
            {path: 'userApp/edit', component: UserappEditComponent, canDeactivate: [unsavedChangesGuard]},
            {path: 'usersApp/:username', component: UserappDetailComponent},
            {path:  'contracts', component: ContractListComponent},
            {path:'contractssoft', component:ContractSoftwareListComponent},
            {path: 'tickets/contract/:id',component: TicketsCompanyListComponent},
       
        ]
    },
    {path: 'register', component: RegisterComponent},
    {path: 'login', component: LoginComponent},
    {path: 'error', component: ErrorTestingComponent},
    {path: 'not-found', component: NotFoundComponent},
    {path: 'server-error', component: ServerErrorComponent},
    {path: '**', component: HomeComponent, pathMatch: 'full'},

];
