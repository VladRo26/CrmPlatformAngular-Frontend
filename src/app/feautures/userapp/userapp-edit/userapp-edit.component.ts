import { Component, Host, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { userApp } from '../../../_models/userapp';
import { AccountService } from '../../../_services/account.service';
import { UserappService } from '../../../_services/userapp.service';
import { TabViewModule } from 'primeng/tabview';
import { CardModule } from 'primeng/card';
import { RatingModule } from 'primeng/rating';
import { FormControl, FormGroup, FormsModule, NgForm } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge'; // Import BadgeModule
import { AvatarModule } from 'primeng/avatar'; // Import AvatarModule
import { ScrollPanelModule } from 'primeng/scrollpanel'; // Import ScrollPanelModule
import { InputOtpModule } from 'primeng/inputotp';
import { ToastrService } from 'ngx-toastr';
import { jwtDecode } from 'jwt-decode';
import { PhotoEditComponent } from "../photo-edit/photo-edit.component";
import { MatTabsModule } from '@angular/material/tabs';
import { NgxMaterialIntlTelInputComponent } from 'ngx-material-intl-tel-input';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Validators } from '@angular/forms'; // Import Validators

@Component({
  selector: 'app-userapp-edit',
  standalone: true,
  imports: [TabViewModule, CardModule, RatingModule, FormsModule,
     ButtonModule, BadgeModule, AvatarModule, 
     ScrollPanelModule, InputOtpModule
     , PhotoEditComponent,MatTabsModule,
     NgxMaterialIntlTelInputComponent,ReactiveFormsModule,NgIf],
  templateUrl: './userapp-edit.component.html',
  styleUrl: './userapp-edit.component.css'
})
export class UserappEditComponent implements OnInit {
  userapp?: userApp;
  userForm!: FormGroup; 

  initialPhoneNumber: string = ''; 
  initialEmail: string = '';

  private accountService = inject(AccountService);
  private userAppService = inject(UserappService);
  private toastr = inject(ToastrService);

  ngOnInit(): void {
    this.loadUserApp();
  }

  loadUserApp() {
    const user = this.accountService.currentUser();
    if (!user) return;

    this.userAppService.getUsersapp_username(user.userName).subscribe({
      next: (userApp) => {
        this.userapp = userApp;
        this.initForm(); // Initialize form after data is loaded
      }
    });
  }

  markPhoneDirty(): void {
    this.userForm.get('phoneNumber')!.markAsDirty();
  }

  onPhoneNumberChange(event: any): void {
    // Check if event has a target property (i.e. it's a DOM event)
    const value: string = event && event.target && event.target.value ? event.target.value : event;
    const trimmedValue = value ? value.replace(/\s+/g, '') : '';
    if (trimmedValue !== this.initialPhoneNumber) {
      this.userForm.get('phoneNumber')!.markAsDirty();
    }
  }
  
  

  initForm() {
    const trimmedPhoneNumber = this.userapp?.phoneNumber
      ? this.userapp.phoneNumber.replace(/\s+/g, '')
      : '';
  
    this.userForm = new FormGroup({
      phoneNumber: new FormControl(trimmedPhoneNumber, {
        validators: [Validators.required],
        updateOn: 'change'
      }),
      email: new FormControl(this.userapp?.email || '', {
        validators: [Validators.email],
        updateOn: 'change'
      })
    });
  
    this.initialPhoneNumber = trimmedPhoneNumber;
    this.initialEmail = this.userapp?.email || '';
  
    // Optional: subscribe to valueChanges to log or mark as dirty
    this.userForm.get('phoneNumber')!.valueChanges.subscribe(value => {
      const newVal = value ? value.replace(/\s+/g, '') : '';
      if (newVal !== this.initialPhoneNumber) {
        this.userForm.get('phoneNumber')!.markAsDirty();
      }
    });
  
    // Ensure the form starts as pristine.
    setTimeout(() => {
      this.userForm.markAsPristine();
    });
  }
  
  


  isFormDirty(): boolean {
    if (!this.userForm) return false;
    
    // Get the current values
    const currentPhoneNumber = this.userForm.get('phoneNumber')?.value || '';
    const currentEmail = this.userForm.get('email')?.value || '';
  
    // Remove extra spaces from the phone number to compare with the initial value
    const normalizedCurrentPhone = currentPhoneNumber.replace(/\s+/g, '');
    
    // Compare directly with the initial values
    const phoneChanged = normalizedCurrentPhone !== this.initialPhoneNumber;
    const emailChanged = currentEmail !== this.initialEmail;
  
    console.log('Initial phone:', this.initialPhoneNumber, 'Current phone:', normalizedCurrentPhone);
    console.log('Initial email:', this.initialEmail, 'Current email:', currentEmail);
    
    return phoneChanged || emailChanged;
  }
  
  
    
  

  updateUserApp() {
    if (!this.userapp) return;
  
    const trimmedPhoneNumber = this.userForm.value.phoneNumber.replace(/\s+/g, '');
    const originalPhoneNumber = this.initialPhoneNumber; // ✅ Use stored initial value
  
    // ✅ Only update if there is an actual change
    if (trimmedPhoneNumber !== originalPhoneNumber || this.userForm.value.email !== this.initialEmail) {
      this.userapp.phoneNumber = trimmedPhoneNumber;
      this.userapp.email = this.userForm.value.email;
  
      this.userAppService.updateUserapp(this.userapp).subscribe({
        next: () => {
          this.toastr.success('Updated Successfully');
  
          // ✅ Update stored initial values to prevent false dirty states
          this.initialPhoneNumber = trimmedPhoneNumber;
          if (this.userapp) {
            this.initialEmail = this.userapp.email;
          }
  
          this.userForm.markAsPristine(); // ✅ Reset form state after save
        }
      });
    } else {
      console.log("No changes detected, skipping update.");
    }
  }
  
  
}