import { Injectable ,inject, signal} from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { SoftwareCompany } from '../_models/softwarecompany';
import { environment } from '../../environments/environment';
import { Observable, of, tap } from 'rxjs';
import { CompanyParams } from '../_models/companyparams';
import { PaginatedResult } from '../_models/pagination';

@Injectable({
  providedIn: 'root'
})
export class SoftwarecompanyService {

  private http = inject(HttpClient);
  baseUrl =  environment.apiUrl;

  companies = signal<SoftwareCompany[]>([]);
  paginatedResult = signal<PaginatedResult<SoftwareCompany[]> | null>(null);
  companyCache = new Map<string, HttpResponse<SoftwareCompany[]>>();
  companyParams = signal<CompanyParams>(new CompanyParams());
  
  resetCompanyParams() {
    this.companyParams.set(new CompanyParams());
  }
  
  getSoftwareCompaniesPaged(paramsObj: any): Observable<HttpResponse<SoftwareCompany[]>> {
    let params = new HttpParams()
      .append('pageNumber', paramsObj.PageNumber)
      .append('pageSize', paramsObj.PageSize);
      
    if (paramsObj.CompanyName) {
      params = params.append('companyName', paramsObj.CompanyName);
    }
    if (paramsObj.OrderBy) {
      params = params.append('orderBy', paramsObj.OrderBy);
    }
    
    return this.http.get<SoftwareCompany[]>(`${this.baseUrl}SoftwareCompany/paged`, { observe: 'response', params })
      .pipe(
        tap(response => {
          this.paginatedResult.set({
            items: response.body as SoftwareCompany[],
            pagination: JSON.parse(response.headers.get('Pagination')!)
          });
        })
      );
  }

  

  getSoftwareCompanies() {
    return this.http.get<SoftwareCompany[]>(this.baseUrl + 'SoftwareCompany');
  }

  getSoftwareCompanyByUserId(userId: number): Observable<SoftwareCompany> {
    return this.http.get<SoftwareCompany>(`${this.baseUrl}SoftwareCompany/ByUserId/${userId}`);
  }

  register(formData: FormData): Observable<SoftwareCompany> {
    return this.http.post<SoftwareCompany>(`${this.baseUrl}SoftwareCompany/register`, formData);
  }

  updateSoftwareCompany(companyName: string, formData: FormData): Observable<SoftwareCompany> {
    return this.http.put<SoftwareCompany>(`${this.baseUrl}SoftwareCompany/byName/${companyName}`, formData);
  }

  getSoftwareCompanyByName(companyName: string): Observable<SoftwareCompany> {
    return this.http.get<SoftwareCompany>(`${this.baseUrl}SoftwareCompany/ByName/${companyName}`);
  }
  
  
  
}
