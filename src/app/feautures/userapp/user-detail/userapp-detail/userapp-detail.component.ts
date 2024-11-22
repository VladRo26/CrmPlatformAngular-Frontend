import { Component, inject, OnInit } from '@angular/core';
import { UserappService } from '../../../../_services/userapp.service';
import { ActivatedRoute } from '@angular/router';
import { userApp } from '../../../../_models/userapp';

@Component({
  selector: 'app-userapp-detail',
  standalone: true,
  imports: [],
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
