import { Component, inject } from '@angular/core';
import { ContractService } from '../../../_services/contract.service';
import { AccountService } from '../../../_services/account.service';
import { UserappService } from '../../../_services/userapp.service';
import {NgIf, NgFor} from '@angular/common';
import { PrimeNGConfig } from 'primeng/api';
import { Contract } from '../../../_models/contract';
import { CarouselModule } from 'primeng/carousel';
import { userApp } from '../../../_models/userapp';
import { ContractCardPreviewComponent } from '../contract-card-preview/contract-card-preview.component';

@Component({
  selector: 'app-contracts-preview',
  standalone: true,
  imports: [NgIf,CarouselModule,ContractCardPreviewComponent],
  templateUrl: './contracts-preview.component.html',
  styleUrl: './contracts-preview.component.css'
})
export class ContractsPreviewComponent {
  private contractService = inject(ContractService);
  private accountService = inject(AccountService);
  private userappService = inject(UserappService);
  private primengConfig = inject(PrimeNGConfig);

  loading = true;
  contracts: Contract[] = [];
  selectedContract: Contract | null = null;
  username = this.accountService.currentUser()?.userName;

  responsiveOptions = [
    { breakpoint: '1024px', numVisible: 1, numScroll: 1 },
    { breakpoint: '768px', numVisible: 1, numScroll: 1 },
    { breakpoint: '560px', numVisible: 1, numScroll: 1 }
  ];

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.loadContracts();
  }

  loadContracts(): void {
    const username = this.username;
    if (!username) {
      console.error('No username found.');
      this.loading = false;
      return;
    }

    this.userappService.getUsersapp_username(username).subscribe({
      next: (user: userApp) => {
        if (!user.companyName) {
          console.error('User does not belong to any company.');
          this.loading = false;
          return;
        }
        // Based on the user's type, load the contracts.
        if (user.userType === 'SoftwareCompanyUser') {
          this.loadContractsBySoftwareCompany(user.companyName);
        } else if (user.userType === 'BeneficiaryCompanyUser') {
          this.loadContractsByBeneficiaryCompany(user.companyName);
        } else {
          console.error('User type not recognized.');
          this.loading = false;
        }
      },
      error: err => {
        console.error('Error fetching user details:', err);
        this.loading = false;
      }
    });
  }

  loadContractsBySoftwareCompany(companyName: string): void {
    this.contractService.getContractsBySoftwareCompanyName(companyName).subscribe({
      next: (contracts: Contract[]) => this.handleContractsResponse(contracts),
      error: err => {
        console.error('Error fetching contracts for software company:', err);
        this.loading = false;
      }
    });
  }

  loadContractsByBeneficiaryCompany(companyName: string): void {
    this.contractService.getContractsByBeneficiaryCompanyName(companyName).subscribe({
      next: (contracts: Contract[]) => this.handleContractsResponse(contracts),
      error: err => {
        console.error('Error fetching contracts for beneficiary company:', err);
        this.loading = false;
      }
    });
  }

  handleContractsResponse(contracts: Contract[]): void {
    this.contracts = contracts;
    this.loading = false;
    if (this.contracts.length > 0) {
      this.selectedContract = this.contracts[0]; // Default to first contract
    }
  }

  handlePageChange(event: any): void {
    const index = event.page;
    if (this.contracts.length > index) {
      this.selectedContract = this.contracts[index];
    }
  }

}
