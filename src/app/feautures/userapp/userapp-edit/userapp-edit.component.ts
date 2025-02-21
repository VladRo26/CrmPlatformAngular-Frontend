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
  userForm!: FormGroup; // ✅ Reactive form for phone number

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

  initForm() {
    const trimmedPhoneNumber = this.userapp?.phoneNumber ? this.userapp.phoneNumber.replace(/\s+/g, '') : '';
  
    this.userForm = new FormGroup({
      phoneNumber: new FormControl(trimmedPhoneNumber, [Validators.required]), // ✅ Ensure phone number is required
      email: new FormControl(this.userapp?.email || '', [Validators.email]), // ✅ Validate email format
    });
  
    // ✅ Store initial values for accurate comparison
    this.initialPhoneNumber = trimmedPhoneNumber;
    this.initialEmail = this.userapp?.email || '';
  
    setTimeout(() => {
      this.userForm.markAsPristine(); // ✅ Ensures Angular doesn't mark the form dirty on load
    });
  }


  
    isFormDirty(): boolean {
      if (!this.userForm) return false; // ✅ Prevent errors if form hasn't loaded yet
    
      const currentPhoneNumber = this.userForm.value.phoneNumber.replace(/\s+/g, '');
      const currentEmail = this.userForm.value.email;
    
      // ✅ Check if form is dirty and phone number is valid
      return (
        (currentPhoneNumber !== this.initialPhoneNumber || currentEmail !== this.initialEmail) &&
        this.userForm.get('phoneNumber')!.valid // ✅ Ensure phone number is valid
      );
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