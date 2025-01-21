import { Injectable,inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Contract } from '../_models/contract';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContractService {

  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;

  getContracts() {
    return this.http.get<Contract[]>(this.baseUrl + 'Contract');
  }

  getContractsByBeneficiaryCompanyName(beneficiaryCompanyName: string): Observable<Contract[]> {
    const url = `${this.baseUrl}Contract/by-beneficiary?beneficiaryCompanyName=${encodeURIComponent(beneficiaryCompanyName)}`;
    return this.http.get<Contract[]>(url);
  }

  getContractsBySoftwareCompanyName(softwareCompanyName: string): Observable<Contract[]> {
    const url = `${this.baseUrl}Contract/by-software?softwareCompanyName=${encodeURIComponent(softwareCompanyName)}`;
    return this.http.get<Contract[]>(url);
  }
}
