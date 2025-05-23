import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateHomeImage } from '../_models/createhomeimage';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);

  getUserwithRole(){
    return this.http.get<any>(`${this.baseUrl}admin/GetUserWithRoles`);
  }

  editRoles(username: string, roles: string[]): Observable<string[]> {
    const rolesString = roles.join(','); // Convert roles array to a comma-separated string
    return this.http.post<string[]>(
      `${this.baseUrl}admin/EditRoles/${username}`, // Include the username in the URL path
      {}, // Empty body for the PUT request
      { params: { roles: rolesString } } // Pass roles as query params
    );
  }

  deleteUser(username: string) {
    return this.http.delete(`${this.baseUrl}User/username/${username}`);
  }

  uploadHomeImage(formData: FormData): Observable<CreateHomeImage> {
    return this.http.post<CreateHomeImage>(`${this.baseUrl}HomeImage/upload`, formData);
  }
  
  
}
