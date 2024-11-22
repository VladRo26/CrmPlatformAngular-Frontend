import { Component, inject, OnInit } from '@angular/core';
import { UserappService } from '../../../_services/userapp.service';
import { userApp } from '../../../_models/userapp';
import { UserappCardComponent } from '../userapp-card/userapp-card.component';

@Component({
  selector: 'app-userapp-list',
  standalone: true,
  imports: [UserappCardComponent],
  templateUrl: './userapp-list.component.html',
  styleUrl: './userapp-list.component.css'
})
export class UserappListComponent implements OnInit {
  private userappService = inject(UserappService);
  usersapp: userApp[] = [];

  ngOnInit(): void {
    this.loadUsersapp();
  }

  loadUsersapp() {
    this.userappService.getUsersapp().subscribe({
      next: usersapp => this.usersapp = usersapp
    })
  }

}
