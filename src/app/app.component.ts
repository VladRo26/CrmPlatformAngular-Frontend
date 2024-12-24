import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from "./nav/nav.component";
import { AccountService } from './_services/account.service';
import { HomeComponent } from "./feautures/home/home.component";
import { NgxSpinnerComponent } from 'ngx-spinner';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavComponent, HomeComponent,NgxSpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  http = inject(HttpClient);
  private accountService = inject(AccountService);
  title = 'client';
  benefcompanies: any;

  ngOnInit(): void {
    this.setUser();
    this.getBenefCompanies();
  }

  setUser(){
    const user = localStorage.getItem('userinfo');
    if(!user){
      return;
    }
    this.accountService.currentUser.set(JSON.parse(user));
  }

 

  getBenefCompanies() {
    this.http.get('https://localhost:7057/api/BeneficiaryCompany').subscribe
    ({
      next: response => this.benefcompanies = response,
      error: error => console.error(error)
    });
  }
}




