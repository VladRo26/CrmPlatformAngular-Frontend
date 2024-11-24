import { Injectable,inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Contract } from '../_models/contract';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContractService {

  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;

  getContracts() {
    return this.http.get<Contract[]>(this.baseUrl + 'Contract');
  }
}
