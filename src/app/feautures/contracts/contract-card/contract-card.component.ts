import { Component, inject , input, OnInit} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { RouterLinkActive } from '@angular/router'
import { Contract } from '../../../_models/contract';
import { MatButtonModule } from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { CurrencyPipe } from '@angular/common';
import { DatePipe } from '@angular/common';
import { PercentPipe } from '@angular/common';
import { KnobModule } from 'primeng/knob';
import { FormsModule } from '@angular/forms';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ContractService } from '../../../_services/contract.service';
import { AccountService } from '../../../_services/account.service';
import { User } from '../../../_models/user';
import { NgIf } from '@angular/common';
import { HasRoleDirective } from '../../../_directives/has-role.directive';
import { UserappService } from '../../../_services/userapp.service';


@Component({
  selector: 'app-contract-card',
  standalone: true,
  imports: [MatButtonModule,MatCardModule,RouterLink
    ,RouterLinkActive,CurrencyPipe,DatePipe,PercentPipe,KnobModule,FormsModule,OverlayPanelModule,NgIf,HasRoleDirective],
  templateUrl: './contract-card.component.html',
  styleUrl: './contract-card.component.css'
})
export class ContractCardComponent implements OnInit {

  ngOnInit(): void {
    // Initialize newStatus with the current contract status
    this.newStatus = this.contract().status;
    this.currentUser = this.accountService.currentUser();

    if (this.currentUser?.userType === 'BeneficiaryCompanyUser') {
      this.userAppService.getUsersapp_username(this.currentUser.userName).subscribe(userApp => {
        const companyName = userApp.companyName;
  
        if (companyName) {
          this.contractService.getContractsByBeneficiaryCompanyName(companyName).subscribe(contracts => {
            this.allowedToUpdate = contracts.some(c => c.id === this.contract().id);
          });
        }
      });
    }

  }
  contractService = inject(ContractService);
  private accountService = inject(AccountService);
  userAppService = inject(UserappService);
  currentUser: User | null = null;
  allowedToUpdate: boolean = false;
  private router = inject(Router);

  newStatus!: number;


  contract = input.required<Contract>(); 

  updateStatus(op: any): void {
    // Call the service to update the contract status
    this.contractService.updateContractStatus(this.contract().id, this.newStatus).subscribe(
      (updatedContract) => {
        // Update the local contract status with the returned value
        this.contract().status = updatedContract.status;
        // Optionally close the overlay panel
        op.hide();
      },
      (error) => {
        console.error('Error updating status', error);
      }
    );
  }


}
