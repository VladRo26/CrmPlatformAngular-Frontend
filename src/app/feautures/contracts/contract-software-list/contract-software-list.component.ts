import { Component, inject } from '@angular/core';
import { ContractService } from '../../../_services/contract.service';
import { Contract } from '../../../_models/contract';
import { OnInit } from '@angular/core';
import { AccountService } from '../../../_services/account.service';
import { UserappService } from '../../../_services/userapp.service';
import { userApp } from '../../../_models/userapp';
import { ContractCardComponent } from '../contract-card/contract-card.component';
import { CarouselModule } from 'primeng/carousel';
import { NgFor } from '@angular/common';
import { Router } from '@angular/router';
import {PrimeNGConfig } from "primeng/api"; 
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-contract-software-list',
  standalone: true,
  imports: [ContractCardComponent,CarouselModule,NgIf],
  templateUrl: './contract-software-list.component.html',
  styleUrl: './contract-software-list.component.css'
})
export class ContractSoftwareListComponent implements OnInit {
  private contractService = inject(ContractService);
  private accountService = inject(AccountService);
  private userappService = inject(UserappService);
  private router = inject(Router);
  loading = true;


  username = this.accountService.currentUser()?.userName;

  contracts: Contract[] = [];
  selectedContract: Contract | null = null;


  ngOnInit(): void {
    this.loadContracts();
  }

  responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 3
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 2
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1
    }
  ];

  loadContracts() {


    const username = this.username;
    this.userappService.getUsersapp_username(username ?? '').subscribe({
      next: (userApp : userApp) => {
        if (userApp.companyName) {
          this.loadContractsBySoftwareCompany(userApp.companyName);
        } else {
          console.error('User does not belong to any company.');
        }
      },
      error: (err) => {
        console.error('Error fetching user details:', err);
      }
    });
  }

  loadContractsBySoftwareCompany(softwareCompanyName: string) {
    this.contractService.getContractsBySoftwareCompanyName(softwareCompanyName).subscribe({
      next: contracts => {
        this.contracts = contracts;
        this.loading = false;
        if (this.contracts.length > 0) {
          this.selectedContract = this.contracts[0]; // Default to the first contract
        }
      },
      error: err => {
        console.error('Error fetching contracts by software company:', err);
        this.loading = false;
      }
    });
  }


  handlePageChange(event: any): void {
    const index = event.page; // PrimeNG Carousel emits an event with a `page` property
    if (this.contracts && this.contracts.length > index) {
      this.selectedContract = this.contracts[index];
    }
  }
  
  navigateToTickets(): void {
    if (this.selectedContract) {
      this.router.navigate([`/tickets/contract/${this.selectedContract.id}`]);
    } else {
      console.error('No contract selected.');
    }
  }
}


