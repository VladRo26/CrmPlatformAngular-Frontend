import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { SoftwarecompanyService } from '../../../_services/softwarecompanies.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SoftwareCompany } from '../../../_models/softwarecompany';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-create-software',
  standalone: true,
  imports: [ReactiveFormsModule,FormsModule,NgIf],
  templateUrl: './create-software.component.html',
  styleUrl: './create-software.component.css'
})
export class CreateSoftwareComponent {
  registerForm: FormGroup = new FormGroup({});

  constructor(
    private softwareCompanyService: SoftwarecompanyService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  pastDateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null; // Let required validator handle empty case
    }
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate > today ? { futureDate: true } : null;
  }

  initializeForm() {
    this.registerForm = new FormGroup({
      name: new FormControl('', Validators.required),
      shortDescription: new FormControl('', Validators.required),
      activityDomain: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      establishmentDate: new FormControl('', [Validators.required, this.pastDateValidator]),
      file: new FormControl(null) // Optional photo
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files && input.files.length > 0) {
      const file = input.files[0];
      this.registerForm.patchValue({ file });
    }
  }

  removeFile(): void {
    this.registerForm.patchValue({ file: null });
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  register() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
  
    // Prepare FormData
    const formData = new FormData();
    Object.keys(this.registerForm.value).forEach((key: string) => {
      formData.append(key, this.registerForm.get(key)?.value);
    });
  
    this.softwareCompanyService.register(formData).subscribe({
      next: (response: SoftwareCompany) => {
        this.toastr.success('Company registered successfully');
        this.router.navigateByUrl('/home');
      },
      error: (error: any) => {
        this.toastr.error('Registration failed');
        console.error(error);
      }
    });
  }

}
