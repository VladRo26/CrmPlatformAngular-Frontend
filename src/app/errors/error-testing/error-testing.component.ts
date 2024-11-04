import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor,NgIf } from '@angular/common';

@Component({
  selector: 'app-error-testing',
  standalone: true,
  imports: [NgFor,NgIf],
  templateUrl: './error-testing.component.html',
  styleUrl: './error-testing.component.css'
})
export class ErrorTestingComponent {
  baseUrl = 'https://localhost:7057/api/';
  private http = inject(HttpClient);
  validationErrors: string[] = [];

  get400Error() {
    this.http.get(this.baseUrl + 'TestError/badrequest').subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      });
  }

  get401Error() {
    this.http.get(this.baseUrl + 'TestError/auth').subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      });
  }

  get404Error() {
    this.http.get(this.baseUrl + 'TestError/notfound').subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      });
  }

  get500Error() {
    this.http.get(this.baseUrl + 'TestError/servererror').subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      });
  }

  get401ValidationError() {
    this.http.post(this.baseUrl + 'account/register', {}).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
        this.validationErrors = error;
      });
  }
}
