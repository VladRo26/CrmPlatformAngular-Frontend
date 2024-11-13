import { Injectable ,inject} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SoftwareCompany } from '../_models/softwarecompany';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SoftwarecompanyService {

  private http = inject(HttpClient);
  baseUrl =  environment.apiUrl;

  getSoftwareCompanies() {
    return this.http.get<SoftwareCompany[]>(this.baseUrl + 'SoftwareCompany');
  }
}
