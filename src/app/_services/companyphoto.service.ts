import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompanyphotoService {
  private http = inject(HttpClient);
  baseUrl = 'https://localhost:7057/api/';

  getCompanyPhoto(userId: number): Observable<{ photoUrl: string }> {
    return this.http.get<{ photoUrl: string }>(`${this.baseUrl}CompanyPhoto`, {
      params: { userId: userId.toString() }
    });
  }
  

}
