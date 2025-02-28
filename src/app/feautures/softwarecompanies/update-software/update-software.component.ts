import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SoftwareCompany } from '../../../_models/softwarecompany';
import { SoftwarecompanyService } from '../../../_services/softwarecompanies.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { provideNativeDateAdapter } from '@angular/material/core';
import { NgIf } from '@angular/common';
import { ImageModule } from 'primeng/image';

@Component({
  selector: 'app-update-software',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    NgIf,
    ImageModule
  ],
  templateUrl: './update-software.component.html',
  styleUrl: './update-software.component.css'
})
export class UpdateSoftwareComponent {
  updateForm: FormGroup = new FormGroup({});
  originalCompanyName: string = ''; // Store the original company name from the route.
  isSubmitting: boolean = false;
  company: SoftwareCompany | null = null;
  selectedFile: File | null = null;
  companyPhotoUrl: string = '';

  constructor(
    private softwareService: SoftwarecompanyService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // Expecting the company name to be passed as a route parameter named 'companyName'
    this.originalCompanyName = this.route.snapshot.paramMap.get('companyName') || '';
    this.initializeForm();
    this.loadCompany(this.originalCompanyName);
  }

  initializeForm(): void {
    this.updateForm = new FormGroup({
      name: new FormControl('', Validators.required),
      shortDescription: new FormControl(''),
      establishmentDate: new FormControl(null, Validators.required)
    });
  }

  loadCompany(companyName: string): void {
    this.softwareService.getSoftwareCompanyByName(companyName).subscribe({
      next: (company: SoftwareCompany) => {
        this.company = company;
        this.originalCompanyName = company.name || '';
        this.companyPhotoUrl = company.photoUrl || '/company.png';
        this.updateForm.patchValue({
          name: company.name,
          shortDescription: company.shortDescription,
          establishmentDate: new Date(company.establishmentDate)
        });
      },
      error: (error) => {
        this.toastr.error('Failed to load company details');
        console.error(error);
      }
    });
  }

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.companyPhotoUrl = e.target.result;
      };
      if (this.selectedFile) {
        reader.readAsDataURL(this.selectedFile);
      }
    }
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    let month = (d.getMonth() + 1).toString();
    let day = d.getDate().toString();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return `${year}-${month}-${day}`;
  }

  onSubmit(): void {
    if (this.updateForm.invalid) {
      this.updateForm.markAllAsTouched();
      return;
    }
    if (this.isSubmitting) {
      return;
    }
    this.isSubmitting = true;

    const formValue = this.updateForm.value;
    const formData = new FormData();
    formData.append('name', formValue.name);
    formData.append('shortDescription', formValue.shortDescription);
    formData.append('establishmentDate', this.formatDate(formValue.establishmentDate));
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    // Use the original company name in the URL to update the company.
    this.softwareService.updateSoftwareCompany(this.originalCompanyName, formData).subscribe({
      next: (updatedCompany: SoftwareCompany) => {
        this.toastr.success('Company updated successfully');
        this.router.navigateByUrl('/companies');
        this.isSubmitting = false;
      },
      error: (error: any) => {
        this.toastr.error('Failed to update company');
        console.error(error);
        this.isSubmitting = false;
      }
    });
  }

}
