import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { userApp } from '../_models/userapp';
import { AccountService } from './account.service';


@Injectable({
  providedIn: 'root'
})
export class UserappService {
  private http = inject(HttpClient);
  private accountService = inject(AccountService);
  baseUrl = environment.apiUrl;
  

  getUsersapp() {
    return this.http.get<userApp[]>(this.baseUrl + 'User',this.getHttpOptions());
  }

  getUsersapp_name(username: string) {
    return this.http.get<userApp>(this.baseUrl + 'User/' + username,this.getHttpOptions());
  }

  getHttpOptions() {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.accountService.currentUser()?.token}`
      })
    }
  }
}
