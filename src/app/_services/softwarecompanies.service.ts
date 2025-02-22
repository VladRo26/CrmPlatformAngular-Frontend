import { Injectable ,inject} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SoftwareCompany } from '../_models/softwarecompany';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SoftwarecompanyService {

  private http = inject(HttpClient);
  baseUrl =  environment.apiUrl;

  getSoftwareCompanies() {
    return this.http.get<SoftwareCompany[]>(this.baseUrl + 'SoftwareCompany');
  }

  getSoftwareCompanyByUserId(userId: number): Observable<SoftwareCompany> {
    return this.http.get<SoftwareCompany>(`${this.baseUrl}SoftwareCompany/ByUserId/${userId}`);
  }

  register(formData: FormData): Observable<SoftwareCompany> {
    return this.http.post<SoftwareCompany>(`${this.baseUrl}SoftwareCompany/register`, formData);
  }
  
}
