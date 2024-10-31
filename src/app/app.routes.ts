import { Routes } from '@angular/router';
import { HomeComponent } from './feautures/home/home.component';
import { TicketsComponent } from './feautures/tickets/tickets.component';
import { RegisterComponent } from './feautures/auth/register/register.component';
import { LoginComponent } from './feautures/auth/login/login.component';
import { authGuard } from './_guards/guards/auth.guard';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [authGuard],
        children: [ 
            {path: 'tickets',component: TicketsComponent,canActivate: [authGuard]},
        ]
    },
    {path: 'register', component: RegisterComponent},
    {path: 'login', component: LoginComponent},
    {path: '**', component: HomeComponent, pathMatch: 'full'}
];
