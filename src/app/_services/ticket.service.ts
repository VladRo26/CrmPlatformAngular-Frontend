import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Ticket } from '../_models/ticket';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  
    private http = inject(HttpClient);
    baseUrl =  environment.apiUrl;

    getTicketsByHandlerUsername(username: string): Observable<Ticket[]> {
      const url = `${this.baseUrl}Ticket/ByHandlerUsername/${username}`;
      return this.http.get<Ticket[]>(url);
    }
}
