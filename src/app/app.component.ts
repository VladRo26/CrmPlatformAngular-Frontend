import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavComponent } from "./nav/nav.component";
import { AccountService } from './_services/account.service';
import { HomeComponent } from "./feautures/home/home.component";
import { NgxSpinnerComponent } from 'ngx-spinner';
import { PresenceService } from './_services/presence.service';
import { LoadingService } from './_services/loading.service';
import { NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';
import { LoadingOverlayComponent } from './feautures/loading-overlay/loading-overlay.component';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavComponent, HomeComponent,NgxSpinnerComponent,NgIf,CommonModule,LoadingOverlayComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',

})
export class AppComponent implements OnInit {
  http = inject(HttpClient);
  private accountService = inject(AccountService);
  private presenceService = inject(PresenceService);
  router = inject(Router);
  loadingService = inject(LoadingService);
  title = 'client';
  benefcompanies: any;
  disableSpinner: boolean = false;


  ngOnInit(): void {
    this.setUser();
    this.getBenefCompanies();
    this.checkRouteForSpinner();

  }

  checkRouteForSpinner(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      console.log('NavigationEnd event URL:', event.urlAfterRedirects);
      // Adjust the condition below if your route path is different.
      if (event.urlAfterRedirects.toLowerCase().includes('mytickets')) {
        console.log('Detected "myTickets" in URL – disabling spinner overlay.');
        this.disableSpinner = true;
      } else {
        console.log('Spinner overlay enabled.');
        this.disableSpinner = false;
      }
    });
  }

  setUser(){
    const user = localStorage.getItem('userinfo');
    if (user) {
      const parsedUser = JSON.parse(user);
      // Set the current user in the account service
      this.accountService.currentUser.set(parsedUser);
      // Re-establish the SignalR connection
      this.presenceService.createHubConnection(parsedUser);
    }
  }

 

  getBenefCompanies() {
    this.http.get('https://localhost:7057/api/BeneficiaryCompany').subscribe
    ({
      next: response => this.benefcompanies = response,
      error: error => console.error(error)
    });
  }
}




