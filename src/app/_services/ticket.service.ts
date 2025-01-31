import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Ticket } from '../_models/ticket';
import { catchError, map, Observable, of } from 'rxjs';
import { TicketStatusHistory } from '../_models/ticketstatushistory';
import { CreateTicket } from '../_models/createticket';
import { PaginatedResult } from '../_models/pagination';
import { TicketParams } from '../_models/ticketparams';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  
    private http = inject(HttpClient);
    baseUrl =  environment.apiUrl;
    paginatedResult = signal<PaginatedResult<Ticket[]> | null>(null);
    ticketParams = signal<TicketParams>(new TicketParams());
    ticketCache = new Map();

    getTicketsByHandlerUsername(username: string): Observable<Ticket[]> {
      const url = `${this.baseUrl}Ticket/ByHandlerUsername/${username}`;
      return this.http.get<Ticket[]>(url);
    }

    generateSummary(ticketId: number): Observable<{ ticketId: number; summary: string }> {
      const url = `${this.baseUrl}Ticket/GenerateSummary/${ticketId}`;
  
      return this.http.post<{ ticketId: number; summary: string }>(url, null);
    }

    getTicketHistoryById(ticketId: number): Observable<TicketStatusHistory[]> {
      const url = `${this.baseUrl}Ticket/GetHistoryByTicketId/${ticketId}`;
      return this.http.get<TicketStatusHistory[]>(url);
    }

    getTicketById(ticketId: number): Observable<Ticket> {
      const url = `${this.baseUrl}Ticket/${ticketId}`;
      return this.http.get<Ticket>(url);
    }

    translateDescription(
      ticketId: number,
      sourceLanguage: string,
      targetLanguage: string
    ): Observable<{ ticketId: number; sourceLanguage: string; targetLanguage: string; translation: string }> {
      const url = `${this.baseUrl}Ticket/TranslateDescription/${ticketId}`;
      return this.http.post<{ ticketId: number; sourceLanguage: string; targetLanguage: string; translation: string }>(
        url,
        null,
        {
          params: {
            sourceLanguage,
            targetLanguage,
          },
        }
      );
    }

    getTicketPerformance(username: string): Observable<{
      username: string;
      totalTickets: number;
      resolvedTickets: number;
      unresolvedTickets: number;
      ticketsByPriority: { [key: string]: number };
    }> {
      const url = `${this.baseUrl}Ticket/TicketPerformance/${username}`;
      return this.http.get<{
        username: string;
        totalTickets: number;
        resolvedTickets: number;
        unresolvedTickets: number;
        ticketsByPriority: { [key: string]: number };
      }>(url);
    }

    getTicketsByCompany(companyName: string): Observable<Ticket[]> {
      const url = `${this.baseUrl}Ticket/ByCompany/${companyName}`;
      return this.http.get<Ticket[]>(url);
    }

    // In ticket.service.ts
getTicketsByUserName(): Observable<PaginatedResult<Ticket[]>> {
  const cacheKey = Object.values(this.ticketParams()).join('-');
  const cachedResponse = this.ticketCache.get(cacheKey);
  if (cachedResponse) {
    return of(cachedResponse);
  }

  let params = this.setPaginationHeader(this.ticketParams().pageNumber, this.ticketParams().pageSize);

  if (this.ticketParams().username) {
    params = params.append('username', this.ticketParams().username ?? '');
  }
  if (this.ticketParams().status) {
    params = params.append('status', this.ticketParams().status ?? '');
  }
  if (this.ticketParams().priority) {
    params = params.append('priority', this.ticketParams().priority ?? '');
  }
  if (this.ticketParams().title) {
    params = params.append('title', this.ticketParams().title ?? '');
  }
  if (this.ticketParams().orderBy) {
    params = params.append('orderBy', this.ticketParams().orderBy ?? '');
  }
  // NEW: Append sortDirection
  if (this.ticketParams().sortDirection) {
    params = params.append('sortDirection', this.ticketParams().sortDirection ?? '');
  }

  return this.http.get<Ticket[]>(`${this.baseUrl}Ticket/ByUserName`, { observe: 'response', params }).pipe(
    map(response => {
      const paginatedResult: PaginatedResult<Ticket[]> = {
        items: response.body ?? [],
        pagination: JSON.parse(response.headers.get('Pagination') ?? '{}')
      };
      this.ticketCache.set(cacheKey, paginatedResult);
      return paginatedResult;
    }),
    catchError(error => {
      console.error('Error fetching tickets:', error);
      return of({ items: [], pagination: undefined });
    })
  );
}

  private setPaginationHeader(pageNumber: number, pageSize: number) {
    let params = new HttpParams();
    params = params.append('pageNumber', pageNumber);
    params = params.append('pageSize', pageSize);
    return params;
  }
    

    getFeedbackTicketsByUserName(username: string): Observable<Ticket[]> {
      const url = `${this.baseUrl}Ticket/FeedbackByUserName/${username}`;
      return this.http.get<Ticket[]>(url);
    }

    createTicket(createTicketDto: CreateTicket): Observable<Ticket> {
      const url = `${this.baseUrl}Ticket/CreateTicket`;
      return this.http.post<Ticket>(url, createTicketDto);
    }

    getTicketsByContractId(contractId: number): Observable<Ticket[]> {
      const url = `${this.baseUrl}Ticket/ByContract/${contractId}`;
      return this.http.get<Ticket[]>(url);
    }

    takeOverTicket(ticketId: number, handlerId: number): Observable<any> {
      const url = `${this.baseUrl}Ticket/TakeOver/${ticketId}`;
      return this.http.put(url, null, { params: { handlerId } });
    }
    
    addTicketStatusHistory(ticketId: number, statusHistory: TicketStatusHistory): Observable<{ message: string }> {
      const url = `${this.baseUrl}Ticket/AddStatusHistory?ticketId=${ticketId}`;
      return this.http.post<{ message: string }>(url, statusHistory);
    }

    updateTicketTranslation(
      ticketId: number,
      language: string,
      languageCode: string,
      countryCode: string
    ): Observable<{ message: string }> {
      const url = `${this.baseUrl}Ticket/UpdateTicketTranslation/${ticketId}`;
      const body = {
        language,
        languageCode,
        countryCode,
      };
      return this.http.put<{ message: string }>(url, body);
    }  

    updateTDescription(updateDto: { id: number; tDescription: string }): Observable<{ message: string }> {
      const url = `${this.baseUrl}Ticket/UpdateTDescription`;
      return this.http.put<{ message: string }>(url, updateDto, {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    
       
  

}
