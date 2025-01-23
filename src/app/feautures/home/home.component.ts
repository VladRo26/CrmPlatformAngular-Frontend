import { Component, OnInit } from '@angular/core';
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
import { CarouselModule } from 'primeng/carousel';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';
import {MatButtonModule} from '@angular/material/button';
import { HasRoleDirective } from '../../_directives/has-role.directive';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatGridListModule, HomeimgaesComponent, RegisterComponent,
     RouterLink, SoftwarecompaniesListComponent, BeneficiarycompanyListComponent,
     ChipModule,CarouselModule,AnimateOnScrollModule,MatButtonModule,HasRoleDirective],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
routerLink: any;
softwarecompanies: any[] = [];
beneficiarycompanies: any[] = [];

combinedCompanies: any[] = [];
  constructor(private softwarecompaniesService: SoftwarecompanyService, private beneficiarycompanyService: BeneficiarycompanyService) {}

  ngOnInit(): void {
    this.loadCompanies();

  }
  loadCompanies() {
    this.softwarecompaniesService.getSoftwareCompanies().subscribe({
      next: (softwarecompanies) => {
        this.softwarecompanies = softwarecompanies;
        this.combineCompanies();
      },
    });

    this.beneficiarycompanyService.getBeneficiaryCompanies().subscribe({
      next: (beneficiarycompanies) => {
        this.beneficiarycompanies = beneficiarycompanies;
        this.combineCompanies();
      },
    });
  }

  combineCompanies() {
    if (this.softwarecompanies.length && this.beneficiarycompanies.length) {
      this.combinedCompanies = [...this.softwarecompanies, ...this.beneficiarycompanies];
    }
  }




}
