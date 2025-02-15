import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../../_services/account.service';
import { RouterModule } from '@angular/router';
import { PerformancePageBeneficiaryComponent } from '../performance/performance-page-beneficiary/performance-page-beneficiary.component';
import { PerformancePageComponent } from '../performance/performance-page/performance-page.component';
import { NgIf } from '@angular/common';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-dashboard-preview',
  standalone: true,
  templateUrl: './dashboard-preview.component.html',
  styleUrls: ['./dashboard-preview.component.css'],
  imports: [RouterModule, PerformancePageComponent, PerformancePageBeneficiaryComponent,NgIf,ButtonModule]
})

export class DashboardPreviewComponent {
  accountService = inject(AccountService);
  router = inject(Router);

  userType = this.accountService.currentUser()?.userType;
  userName = this.accountService.currentUser()?.userName || 'User';



  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}