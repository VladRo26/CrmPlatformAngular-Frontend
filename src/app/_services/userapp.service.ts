import { HttpClient} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { userApp } from '../_models/userapp';


@Injectable({
  providedIn: 'root'
})
export class UserappService {
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  

  getUsersapp() {
    return this.http.get<userApp[]>(this.baseUrl + 'User');
  }

  getUsersapp_username(username: string) {
    return this.http.get<userApp>(this.baseUrl + 'User/username/' + username);
  }
}
