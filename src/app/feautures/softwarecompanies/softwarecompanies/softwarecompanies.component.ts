import { Component, OnInit} from '@angular/core';
import { SoftwareCompany } from '../../../_models/softwarecompany';
import { SoftwarecompanyService } from '../../../_services/softwarecompanies.service';

@Component({
  selector: 'app-softwarecompanies',
  standalone: true,
  imports: [],
  templateUrl: './softwarecompanies.component.html',
  styleUrl: './softwarecompanies.component.css'
})
export class SoftwarecompaniesComponent {
  softwarecompanies: SoftwareCompany[] = [];

  constructor(private softwarecompanyService: SoftwarecompanyService) { }

  ngOnInit(): void {
    this.loadSoftwareCompanies();
  }

  loadSoftwareCompanies(): void {
    this.softwarecompanyService.getSoftwareCompanies().subscribe(
      (companies: SoftwareCompany[]) => {
        this.softwarecompanies = companies;
        console.log('Software Companies:', this.softwarecompanies); // Log the companies to console
      },
      (error: any) => {
        console.error('Error fetching software companies:', error);
      }
    );
  }

}
