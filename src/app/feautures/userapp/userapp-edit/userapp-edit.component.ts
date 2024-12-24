import { Component, Host, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { userApp } from '../../../_models/userapp';
import { AccountService } from '../../../_services/account.service';
import { UserappService } from '../../../_services/userapp.service';
import { TabViewModule } from 'primeng/tabview';
import { CardModule } from 'primeng/card';
import { RatingModule } from 'primeng/rating';
import { FormsModule, NgForm } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge'; // Import BadgeModule
import { AvatarModule } from 'primeng/avatar'; // Import AvatarModule
import { ScrollPanelModule } from 'primeng/scrollpanel'; // Import ScrollPanelModule
import { InputOtpModule } from 'primeng/inputotp';
import { ToastrService } from 'ngx-toastr';
import { jwtDecode } from 'jwt-decode';






@Component({
  selector: 'app-userapp-edit',
  standalone: true,
  imports: [TabViewModule,CardModule,RatingModule,FormsModule,ButtonModule,BadgeModule,AvatarModule,ScrollPanelModule,InputOtpModule],
  templateUrl: './userapp-edit.component.html',
  styleUrl: './userapp-edit.component.css'
})
export class UserappEditComponent implements OnInit {
  @ViewChild('editForm') editForm?: NgForm;
  @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
    if(this.editForm?.dirty){
      $event.returnValue = true;
    }
  }
  userapp?: userApp;
  private accountService = inject(AccountService);
  private userAppService = inject(UserappService);
  private toastr = inject(ToastrService);


  ngOnInit(): void {
    this.loadUserApp();
  }

  loadUserApp() {
   const user = this.accountService.currentUser();
   if(!user)
   {
    return;
   }
   this.userAppService.getUsersapp_username(user.userName).subscribe({
     next: userApp => this.userapp = userApp
   });
  }

  updateUserApp() {
    this.userAppService.updateUserapp(this.editForm?.value).subscribe({
      next: () => {
        this.toastr.success('Updated Successfully');
        this.editForm?.reset(this.userapp);
      }
    });
  }
  
}
