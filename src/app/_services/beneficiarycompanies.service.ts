import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { BeneficiaryCompany } from '../_models/beneficiarycompany';
import { environment } from '../../environments/environment';
import { PaginatedResult } from '../_models/pagination';
import { CompanyParams } from '../_models/companyparams';

@Injectable({
  providedIn: 'root'
})
export class BeneficiarycompanyService {
  private baseUrl = environment.apiUrl;
  private http = inject(HttpClient);

  companies = signal<BeneficiaryCompany[]>([]);
  paginatedResult = signal<PaginatedResult<BeneficiaryCompany[]> | null>(null);
  companyCache = new Map<string, HttpResponse<BeneficiaryCompany[]>>();
  companyParams = signal<CompanyParams>(new CompanyParams());

  resetCompanyParams() {
    this.companyParams.set(new CompanyParams());
  }

  getBeneficiaryCompaniesPaged(paramsObj: any): Observable<HttpResponse<BeneficiaryCompany[]>> {
    let params = new HttpParams()
      .append('pageNumber', paramsObj.PageNumber)
      .append('pageSize', paramsObj.PageSize);

    if (paramsObj.CompanyName) {
      params = params.append('companyName', paramsObj.CompanyName);
    }
    if (paramsObj.OrderBy) {
      params = params.append('orderBy', paramsObj.OrderBy);
    }

    return this.http.get<BeneficiaryCompany[]>(`${this.baseUrl}beneficiarycompany/paged`, { observe: 'response', params })
      .pipe(
        tap(response => {
          this.paginatedResult.set({
            items: response.body as BeneficiaryCompany[],
            pagination: JSON.parse(response.headers.get('Pagination')!)
          });
        })
      );
  }

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
