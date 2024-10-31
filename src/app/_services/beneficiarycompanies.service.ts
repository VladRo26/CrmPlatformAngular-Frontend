import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BeneficiaryCompany } from '../_models/beneficiarycompany';

@Injectable({
  providedIn: 'root'
})
export class BeneficiarycompanyService {
  private baseUrl = 'https://localhost:7057/api/';

  constructor(private http: HttpClient) {}

  getBeneficiaryCompanies(): Observable<BeneficiaryCompany[]> {
    return this.http.get<BeneficiaryCompany[]>(`${this.baseUrl}beneficiarycompany`);
  }
}
