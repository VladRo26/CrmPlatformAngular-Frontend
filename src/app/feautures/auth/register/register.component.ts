import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core'; // Add this import
import { MatButtonModule } from '@angular/material/button'; // Add this import
import { SoftwarecompanyService } from '../../../_services/softwarecompanies.service';
import { BeneficiarycompanyService } from '../../../_services/beneficiarycompanies.service';
import { SoftwareCompany } from '../../../_models/softwarecompany';
import { BeneficiaryCompany } from '../../../_models/beneficiarycompany';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../../_services/account.service';
import { inject } from '@angular/core';
import { NgxParticlesModule } from "@tsparticles/angular";
import { MoveDirection, OutMode, Container} from "@tsparticles/engine";
//import { loadFull } from "tsparticles"; // if you are going to use `loadFull`, install the "tsparticles" package too.
import { loadSlim } from "@tsparticles/slim"; // if you are going to use `loadSlim`, install the "@tsparticles/slim" package too.
import { NgParticlesService } from "@tsparticles/angular";
import { ParticlesService } from '../../../_services/particles.services';
import { ToastrService } from 'ngx-toastr';
import { JsonPipe } from '@angular/common';
import { NgxMaterialIntlTelInputComponent } from 'ngx-material-intl-tel-input';





@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule, // Ensure this is imported
    MatButtonModule, // Ensure this is imported
    CommonModule,
    NgxParticlesModule,
    JsonPipe,
    NgxMaterialIntlTelInputComponent
],

  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  id = "tsparticles";
  particlesService = inject(ParticlesService);
  particlesOptions = this.particlesService.particlesOptions;
  private toastr = inject(ToastrService);


  model: any = {};
  registerForm: FormGroup = new FormGroup({});
  softwareCompanies: SoftwareCompany[] = [];
  beneficiaryCompanies: BeneficiaryCompany[] = [];
  accountService = inject(AccountService);
  softwareCompanyService = inject(SoftwarecompanyService);
  beneficiaryCompanyService = inject(BeneficiarycompanyService);
  ngxParticlesService = inject(NgParticlesService);




  ngOnInit(): void {
    this.loadSoftwareCompanies();
    this.loadBeneficiaryCompanies();
    this.particlesService.initParticles();
    this.initializeForm();
  }

  initializeForm(){
    this.registerForm = new FormGroup({
      username: new FormControl('',Validators.required),
      firstName: new FormControl(),
      lastName: new FormControl(),
      email: new FormControl('',[Validators.required, Validators.email]),
      phoneNumber: new FormControl('',[Validators.required]),
      userType: new FormControl(''),
      Company: new FormControl(''),
      password: new FormControl('',[Validators.required, Validators.minLength(4), Validators.maxLength(12)]),
      confirmPassword: new FormControl('',[Validators.required,this.comparePasswords('password')]),
    });

    this.registerForm.controls['password'].valueChanges.subscribe(() => {
      this.registerForm.controls['confirmPassword'].updateValueAndValidity();
    });
  }

  comparePasswords(matchTo: string): any {
    return (control: AbstractControl) => {
      return control.value == control.parent?.get(matchTo)?.value ? null : {isMatching: true};
    }
  }

  register(){
    console.log(this.registerForm.value);
    // this.accountService.register(this.model).subscribe({
    //   next: response => {
    //     console.log(response);
    //     this.cancel();
    //   },
    //   error: error => {
    //     this.toastr.error(error.error);
    //   }
    // });
  }

  loadSoftwareCompanies(): void {
    this.softwareCompanyService.getSoftwareCompanies().subscribe(
      (companies: SoftwareCompany[]) => { // Specify the type explicitly
        this.softwareCompanies = companies;
      },
      (error: any) => { // Specify the type explicitly
        console.error('Error fetching software companies:', error);
      }
    );
  }

  loadBeneficiaryCompanies(): void {
    this.beneficiaryCompanyService.getBeneficiaryCompanies().subscribe(
      (companies: BeneficiaryCompany[]) => { // Specify the type explicitly
        this.beneficiaryCompanies = companies;
      },
      (error: any) => { // Specify the type explicitly
        console.error('Error fetching beneficiary companies:', error);
      }
    );
  }


  cancel(): void {
    console.log('Registration cancelled');
  }
}
