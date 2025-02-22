import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BeneficiaryCompany } from '../_models/beneficiarycompany';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BeneficiarycompanyService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getBeneficiaryCompanies(): Observable<BeneficiaryCompany[]> {
    return this.http.get<BeneficiaryCompany[]>(`${this.baseUrl}beneficiarycompany`);
  }

  getBeneficiaryCompanyByUsername(username: string): Observable<BeneficiaryCompany> {
    return this.http.get<BeneficiaryCompany>(`${this.baseUrl}beneficiarycompany/byusername/${username}`);
  }

  getBeneficiaryCompanyByUserId(userId: number): Observable<BeneficiaryCompany> {
    return this.http.get<BeneficiaryCompany>(`${this.baseUrl}beneficiarycompany/ByUserId/${userId}`);
  }

  register(formData: FormData): Observable<BeneficiaryCompany> {
    return this.http.post<BeneficiaryCompany>(`${this.baseUrl}beneficiarycompany/register`, formData);
  }
  
}
