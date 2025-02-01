import { Component, inject, Injector } from '@angular/core';
import { AccountService } from '../../../_services/account.service';
import { PerformancePageComponent } from '../../performance/performance-page/performance-page.component';
import { ContractSoftwareListComponent } from '../../contracts/contract-software-list/contract-software-list.component';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { NgIf } from '@angular/common';
import { ScrollPanelModule } from 'primeng/scrollpanel';


@Component({
  selector: 'app-dasboard-user',
  standalone: true,
  imports: [PerformancePageComponent,ContractSoftwareListComponent,
    PanelModule,NgIf,ButtonModule,ScrollPanelModule],
  templateUrl: './dasboard-user.component.html',
  styleUrl: './dasboard-user.component.css'
})
export class DasboardUserComponent{
  accountService = inject(AccountService);
  userName = this.accountService.currentUser()?.userName;
  router = inject(Router);
  injector = inject(Injector);

  selectedComponent: 'performance' | 'assignTickets' = 'performance';

  setSelectedComponent(component: 'performance' | 'assignTickets') {
    this.selectedComponent = component;
  }



}
