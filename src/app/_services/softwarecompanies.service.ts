import { Injectable ,inject} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SoftwareCompany } from '../_models/softwarecompany';

@Injectable({
  providedIn: 'root'
})
export class SoftwarecompanyService {

  private http = inject(HttpClient);
  baseUrl = 'https://localhost:7057/api/';

  getSoftwareCompanies() {
    return this.http.get<SoftwareCompany[]>(this.baseUrl + 'SoftwareCompany');
  }
}
