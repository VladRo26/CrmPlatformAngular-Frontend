import { Component, inject, Injector } from '@angular/core';
import { AccountService } from '../../../_services/account.service';
import { PerformancePageComponent } from '../../performance/performance-page/performance-page.component';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { NgIf } from '@angular/common';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { PerformancePageBeneficiaryComponent } from '../../performance/performance-page-beneficiary/performance-page-beneficiary.component';
import { UserappService } from '../../../_services/userapp.service';
import { userApp } from '../../../_models/userapp';
import { OnInit } from '@angular/core';
import { FeedbackUserListComponent } from '../../feedback/feedback-user-list/feedback-user-list.component';
import { ContractSoftwareListComponent} from '../../contracts/contract-software-list/contract-software-list.component';
import { CreateTicketComponent } from '../../tickets/create-ticket/create-ticket.component';
@Component({
  selector: 'app-dasboard-user',
  standalone: true,
  imports: [PerformancePageComponent, ContractSoftwareListComponent,
    PanelModule, NgIf, ButtonModule, ScrollPanelModule,
     PerformancePageBeneficiaryComponent,FeedbackUserListComponent,CreateTicketComponent],
  templateUrl: './dasboard-user.component.html',
  styleUrl: './dasboard-user.component.css'
})
export class DasboardUserComponent implements OnInit {
  userApp: userApp | undefined; // ✅ Store the full user object
  userName: string | undefined;
  userId: number | undefined; // ✅ Store the user ID
  accountService = inject(AccountService);
  router = inject(Router);
  injector = inject(Injector);
  userappService = inject(UserappService);


  userType: string | undefined;
  selectedComponent: 'performance' | 'assignTickets' | 'statistics' | 'feedback' | 'createTicket';


  constructor() {
    this.userName = this.accountService.currentUser()?.userName;
    this.userType = this.accountService.currentUser()?.userType;

    if (this.userType === 'BeneficiaryCompanyUser') {
      this.selectedComponent = 'statistics';
    } else {
      this.selectedComponent = 'performance';
    }
  }

  ngOnInit(): void {
    if (this.userName) {
      this.userappService.getUsersapp_username(this.userName).subscribe({
        next: (user) => {
          this.userApp = user;
          this.userId = user.id; 
        },
        error: (err) => {
          console.error('Failed to fetch user details:', err);
        }
      });
    }
  }

  setSelectedComponent(component: 'performance' | 'assignTickets' | 'statistics' | 'feedback' | 'createTicket') {
    console.log("Switching component to:", component);
    this.selectedComponent = component;
  }
  


}
