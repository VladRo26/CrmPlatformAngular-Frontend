import { Component, inject, OnInit } from '@angular/core';
import { UserappService } from '../../../../_services/userapp.service';
import { ActivatedRoute } from '@angular/router';
import { userApp } from '../../../../_models/userapp';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button'; // Import the ButtonModule
import { TabViewModule } from 'primeng/tabview';
import { BadgeModule } from 'primeng/badge'; // Import BadgeModule
import { AvatarModule } from 'primeng/avatar'; // Import AvatarModule
import { ScrollPanelModule } from 'primeng/scrollpanel'; // Import ScrollPanelModule
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { FeedbackUserListComponent } from '../../../feedback/feedback-user-list/feedback-user-list.component';
import { PerformancePageComponent } from '../../../performance/performance-page/performance-page.component';
import {MatTabsModule} from '@angular/material/tabs';
import {MatIconModule} from '@angular/material/icon';
import { TimeagoModule } from 'ngx-timeago';
import { DatePipe } from '@angular/common';
import { PresenceService } from '../../../../_services/presence.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-userapp-detail',
  standalone: true,
  imports: [CardModule,ButtonModule,TabViewModule,
    BadgeModule,AvatarModule,ScrollPanelModule,
    RatingModule,FormsModule,NgIf,FeedbackUserListComponent,
    PerformancePageComponent,MatTabsModule,MatIconModule,TimeagoModule,DatePipe,CommonModule],
  templateUrl: './userapp-detail.component.html',
  styleUrl: './userapp-detail.component.css'
  })


export class UserappDetailComponent implements OnInit {
  private userappService = inject(UserappService);
  private route = inject(ActivatedRoute);
  presenceService = inject(PresenceService);
  userapp?: userApp;



  ngOnInit(): void {
    this.loadUserapp();
  }

  loadUserapp() {
    const username = this.route.snapshot.paramMap.get('username');
    if (username) {
      this.userappService.getUsersapp_username(username).subscribe({
        next: userapp => this.userapp = userapp
    })
   }
 }

}
