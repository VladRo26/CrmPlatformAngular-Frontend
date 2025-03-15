import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyphotoService {
  private baseUrl = environment.apiUrl;
  private http = inject(HttpClient);

  getCompanyPhoto(userId: number): Observable<{ photoUrl: string }> {
    return this.http.get<{ photoUrl: string }>(`${this.baseUrl}CompanyPhoto`, {
      params: { userId: userId.toString() }
    });
  }
  

}
