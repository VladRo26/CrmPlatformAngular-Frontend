import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  http = inject(HttpClient);
  title = 'client';
  benefcompanies: any;



  ngOnInit(): void {
    this.http.get('https://localhost:7057/api/BeneficiaryCompanies').subscribe
    ({
      next: response => this.benefcompanies = response,
      error: error => console.error(error)
    });
  }
}




