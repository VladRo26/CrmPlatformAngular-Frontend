import { Component, HostListener, inject, OnInit } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatGridListModule } from '@angular/material/grid-list';
import { HomeimgaesComponent } from '../homeimgaes/homeimages.component';
import { RegisterComponent } from "../auth/register/register.component";
import { RouterLink } from '@angular/router';
import { SoftwarecompaniesListComponent } from '../softwarecompanies/softwarecompanies-list/softwarecompanies-list.component';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { BeneficiarycompanyListComponent } from '../beneficiarycompanies/beneficiarycompanies-list/beneficiarycompany-list/beneficiarycompany-list.component';
import { SoftwarecompanyService } from '../../_services/softwarecompanies.service';
import { BeneficiarycompanyService } from '../../_services/beneficiarycompanies.service';
import { ChipModule } from 'primeng/chip';
import { CarouselModule, CarouselResponsiveOptions } from 'primeng/carousel';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';
import {MatButtonModule} from '@angular/material/button';
import { HasRoleDirective } from '../../_directives/has-role.directive';
import { NothasRoleDirective } from '../../_directives/nothas-role.directive';
import { ContractService } from '../../_services/contract.service';
import { NgParticlesService, NgxParticlesModule } from "@tsparticles/angular";
import { ParticlesService } from '../../_services/particles.services';
import { ButtonModule } from 'primeng/button';
import { NgIf } from '@angular/common';
import { AccountService } from '../../_services/account.service';
import { DashboardPreviewComponent } from '../dashboard-preview/dashboard-preview.component';
import { TicketPreviewComponent } from '../tickets/ticket-preview/ticket-preview.component';
import { AnimatedTextComponent } from '../animated-component/animated-component.component';
import { ViewLastStatusListComponent } from '../tickets/view-last-status-list/view-last-status-list.component';
import { AdminImagesComponent } from '../admin-images/admin-images.component';
import { ToastrService } from 'ngx-toastr';
import { ContractsPreviewComponent } from '../contracts/contracts-preview/contracts-preview.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatGridListModule, HomeimgaesComponent, RegisterComponent, RouterLink,
    SoftwarecompaniesListComponent, BeneficiarycompanyListComponent,
    ChipModule,CarouselModule,AnimateOnScrollModule,
    MatButtonModule,HasRoleDirective,NgxParticlesModule,
    ButtonModule,NgIf,DashboardPreviewComponent,TicketPreviewComponent,AnimatedTextComponent,
    ViewLastStatusListComponent,ScrollPanelModule, AdminImagesComponent, NothasRoleDirective,
    ContractsPreviewComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
id = "tsparticles";
particlesService = inject(ParticlesService);
particlesOptions = this.particlesService.particlesOptions;
accountService = inject(AccountService);
ngxParticlesService = inject(NgParticlesService);
contractService = inject(ContractService);
routerLink: any;
softwarecompanies: any[] = [];
beneficiarycompanies: any[] = [];
companiesCount: number = 0; 
contractsCount: number = 0;
toastr = inject(ToastrService);
private breakpointObserver = inject(BreakpointObserver);


gridCols: number = 2;
rowHeight: string = "0.5:1";
gutterSize: string = "16px";

responsiveOptions: CarouselResponsiveOptions[] = [
  {
    breakpoint: '1024px',
    numVisible: 3,
    numScroll: 1
  },
  {
    breakpoint: '768px',
    numVisible: 1,
    numScroll: 1
  },
  {
    breakpoint: '560px',
    numVisible: 1,
    numScroll: 1
  }
];


combinedCompanies: any[] = [];
  constructor(private softwarecompaniesService: SoftwarecompanyService, private beneficiarycompanyService: BeneficiarycompanyService) {}

  ngOnInit(): void {
    this.updateGrid(window.innerWidth);

    this.loadCompanies();
    this.particlesService.initParticles();
    this.loadContractsCount();

    const currentUser = this.accountService.currentUser();
    const roles = this.accountService.roles() || [];
    if (currentUser && !roles.some((r: string) => ['Admin', 'Moderator', 'User'].includes(r))) {
      this.toastr.warning("Your account it's not approved by moderator. Please wait for approval");
    }

  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.updateGrid(event.target.innerWidth);
  }




 updateGrid(width: number) {
  if (width < 600) {
    this.gridCols = 1; // Mobile: Single column layout
    this.rowHeight = "1:1"; // Enforce same height for all tiles
    this.gutterSize = "8px";
  } else if (width < 990) {
    this.gridCols = 1; // Tablet: Two-column layout
    this.rowHeight = "1:1"; // Same height for all tiles
    this.gutterSize = "10px";
  } else if (width < 1400) {
    this.gridCols = 2; // Tablet: Two-column layout
    this.rowHeight = "0.8:1"; // Same height for all tiles
    this.gutterSize = "8px";
  } else {
    this.gridCols = 2; // Desktop layout
    this.rowHeight = "1:1"; // Ensure uniform size
    this.gutterSize = "16px";
  }
}

loadCompanies() {
  this.softwarecompaniesService.getSoftwareCompanies().subscribe({
    next: (softwarecompanies) => {
      console.log('Software companies:', softwarecompanies);
      this.softwarecompanies = softwarecompanies;
      this.combineCompanies();
    },
    error: (err) => console.error('Error loading software companies:', err)
  });

  this.beneficiarycompanyService.getBeneficiaryCompanies().subscribe({
    next: (beneficiarycompanies) => {
      console.log('Beneficiary companies:', beneficiarycompanies);
      this.beneficiarycompanies = beneficiarycompanies;
      this.combineCompanies();
    },
    error: (err) => console.error('Error loading beneficiary companies:', err)
  });
}

combineCompanies() {
  console.log('Inside combineCompanies, software length:', this.softwarecompanies.length, 'beneficiary length:', this.beneficiarycompanies.length);
  if (this.softwarecompanies.length && this.beneficiarycompanies.length) {
    this.combinedCompanies = [...this.softwarecompanies, ...this.beneficiarycompanies];
    this.companiesCount = this.combinedCompanies.length;
    console.log('Combined companies:', this.combinedCompanies);
    console.log('Total companies count:', this.companiesCount);
  } else {
    console.log('One or both arrays are empty, not combining yet.');
  }
}

  loadContractsCount(): void {
    this.contractService.getContractCount().subscribe({
      next: (result) => {
        this.contractsCount = result.count;
      },
      error: (err) => console.error('Error fetching contract count:', err)
    });
  }
}
