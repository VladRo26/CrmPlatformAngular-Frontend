import { Component, inject, OnInit } from '@angular/core';
import { UserappService } from '../../../_services/userapp.service';
import { UserappCardComponent } from '../userapp-card/userapp-card.component';
import { PageChangedEvent, PaginationModule } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-userapp-list',
  standalone: true,
  imports: [UserappCardComponent,PaginationModule],
  templateUrl: './userapp-list.component.html',
  styleUrl: './userapp-list.component.css'
})
export class UserappListComponent implements OnInit {
  userappService = inject(UserappService);
  pageNumber = 1;
  pageSize = 5;
  

  ngOnInit(): void {
    if(!this.userappService.paginatedResult())
    {
      this.loadUsersapp();
    }
  }

  loadUsersapp() {
    this.userappService.getUsersapp(this.pageNumber,this.pageSize)
  }

  pageChanged(event: PageChangedEvent): void {
    console.log('Pagination Event:', event); // Debug the emitted event structure
    const page = typeof event === 'number' ? event : event.page; // Ensure page is a number
    if (this.pageNumber !== page) {
      this.pageNumber = page;
      this.loadUsersapp();
    }
  }
  
  
}
