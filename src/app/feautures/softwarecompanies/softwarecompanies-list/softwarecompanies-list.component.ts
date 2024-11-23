import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { SoftwarecompanyService } from '../../../_services/softwarecompanies.service';
import { ChipModule } from 'primeng/chip';
import { CarouselModule } from 'primeng/carousel';

@Component({
  selector: 'app-softwarecompanies-list',
  standalone: true,
  imports: [ChipModule,CarouselModule], // Import the ScrollPanelModule
  templateUrl: './softwarecompanies-list.component.html',
  styleUrls: ['./softwarecompanies-list.component.css'],
})
export class SoftwarecompaniesListComponent implements OnInit {
  softwarecompanies: any[] = [];

  constructor(private softwarecompaniesService: SoftwarecompanyService) {}

  ngOnInit(): void {
    this.loadSoftwarecompanies();
  }


  loadSoftwarecompanies() {
    this.softwarecompaniesService.getSoftwareCompanies().subscribe({
      next: (softwarecompanies) => (this.softwarecompanies = softwarecompanies),
    });
  }
  
}
