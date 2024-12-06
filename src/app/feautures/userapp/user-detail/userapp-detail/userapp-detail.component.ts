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

@Component({
  selector: 'app-userapp-detail',
  standalone: true,
  imports: [CardModule,ButtonModule,TabViewModule,BadgeModule,AvatarModule,ScrollPanelModule,RatingModule,FormsModule],
  templateUrl: './userapp-detail.component.html',
  styleUrl: './userapp-detail.component.css'
  })


export class UserappDetailComponent implements OnInit {
  private userappService = inject(UserappService);
  private route = inject(ActivatedRoute);
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
