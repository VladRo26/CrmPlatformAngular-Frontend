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

  getContractByTicketId(ticketId: number): Observable<Contract> {
    return this.http.get<Contract>(`${this.baseUrl}Contract/by-ticket/${ticketId}`);
  }

  getContractCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.baseUrl}Contract/count`);
  }

  createContract(formData: FormData): Observable<Contract> {
    return this.http.post<Contract>(`${this.baseUrl}Contract/create-contract`, formData);
  }

  updateContractStatus(contractId: number, status: number): Observable<Contract> {
    return this.http.put<Contract>(`${this.baseUrl}Contract/${contractId}/status`, { status });
  }

  // New method to update the full contract using FormData
  updateContract(contractId: number, formData: FormData): Observable<Contract> {
    return this.http.put<Contract>(`${this.baseUrl}Contract/${contractId}`, formData);
  }

  getContractById(contractId: number): Observable<Contract> {
    return this.http.get<Contract>(`${this.baseUrl}Contract/${contractId}`);
  }
  
}
