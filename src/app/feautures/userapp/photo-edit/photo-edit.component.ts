import { Component, inject, input, ViewChild } from '@angular/core';
import { userApp } from '../../../_models/userapp';
import { ImageModule } from 'primeng/image';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ProgressBarModule } from 'primeng/progressbar';
import { BadgeModule } from 'primeng/badge';
import { FileUpload, FileUploadEvent, FileUploadModule } from 'primeng/fileupload';
import { MessageService, PrimeNGConfig} from 'primeng/api';
import { AccountService } from '../../../_services/account.service';
import { environment } from '../../../../environments/environment';
import { UserappService } from '../../../_services/userapp.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';


interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
  selector: 'app-photo-edit',
  standalone: true,
  imports: [ButtonModule,ImageModule,ToastModule,ProgressBarModule,BadgeModule,FileUploadModule,CommonModule],
  providers: [MessageService],
  templateUrl: './photo-edit.component.html',
  styleUrl: './photo-edit.component.css'
})
export class PhotoEditComponent {
  baseUrl = environment.apiUrl;
  userApp = input.required<userApp>();
  private accountService = inject(AccountService);
  private userAppService = inject(UserappService);

  uploadedFiles: any[] = [];

  constructor(private messageService: MessageService) {}

  onUpload(event: FileUploadEvent): void {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
  
      // Fetch the photo URL and update local storage
      this.userAppService.getPhotoUrl().subscribe({
        next: (newPhotoUrl) => {
          if (newPhotoUrl) {
            const userinfo = localStorage.getItem('userinfo');
            if (userinfo) {
              const user = JSON.parse(userinfo);
              user.photoUrl = newPhotoUrl;
              this.accountService.setCurrentUser(user);
              this.userApp().photoUrl = newPhotoUrl;
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Photo URL updated successfully!',
              });
            }
          }
        },
        error: (err) => {
          console.error('Failed to fetch photo URL:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update photo URL.',
          });
        },
      });
    }
  }

  deletePhoto() {
    this.userAppService.deletePhoto().subscribe({
      next: () => {
        const userinfo = localStorage.getItem('userinfo');
        if (userinfo) {
          const user = JSON.parse(userinfo);
          user.photoUrl = null;
          this.accountService.setCurrentUser(user);
          this.userApp().photoUrl = '';
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Photo deleted successfully!',
          });
        }
      },
      error: (err) => {
        console.error('Failed to delete photo:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete photo.',
        });
      },
    });
  }
}
