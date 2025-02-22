import { Component } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import { UserManagementComponent } from '../user-management/user-management.component';
import { HasRoleDirective } from '../../../_directives/has-role.directive';
import { CreateBeneficiaryComponent } from '../../beneficiarycompanies/create-beneficiary/create-beneficiary.component';
import { CreateSoftwareComponent } from "../../softwarecompanies/create-software/create-software.component";
import { NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';
import { CreateContractsComponent } from '../../contracts/create-contracts/create-contracts.component';
@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [MatTabsModule, UserManagementComponent,
     HasRoleDirective, CreateBeneficiaryComponent, CreateSoftwareComponent,NgIf,CommonModule,CreateContractsComponent],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css'
})
export class AdminPanelComponent {
  companyType: 'beneficiary' | 'software' = 'beneficiary';


}
