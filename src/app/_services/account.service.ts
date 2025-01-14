import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../_models/user';
import { map } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  currentUser = signal< User | null >(null);

  login(formData: FormData) {
    return this.http.post<User>(`${this.baseUrl}account/login`, formData).pipe(
      map(user => {
        if (user) {
          this.setCurrentUser(user);
        }
      })
    )
  }

  register(formData: FormData) {
    return this.http.post<User>(`${this.baseUrl}account/register`, formData).pipe(
      map(user => {
        if (user) {
          this.setCurrentUser(user);
        }
        return user;
      })
    );
  }
  
  

  setCurrentUser(user: User) {
    localStorage.setItem('userinfo', JSON.stringify(user));
    this.currentUser.set(user);
  }


  logout() {
    localStorage.removeItem('userinfo');
    this.currentUser.set(null);
  }
}
