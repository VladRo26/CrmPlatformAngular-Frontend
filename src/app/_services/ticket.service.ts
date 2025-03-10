import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Ticket } from '../_models/ticket';
import { catchError, map, Observable, of } from 'rxjs';
import { TicketStatusHistory } from '../_models/ticketstatushistory';
import { CreateTicket } from '../_models/createticket';
import { PaginatedResult } from '../_models/pagination';
import { TicketParams } from '../_models/ticketparams';
import { TicketContractsParams } from '../_models/ticketcontractsparams';

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

  const headers = new HttpHeaders({ skipSpinner: 'true' });


  return this.http.get<Ticket[]>(`${this.baseUrl}Ticket/ByUserName`, {headers, observe: 'response', params }).pipe(
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

    getTicketsByContractId(contractId: number, paramsObj: TicketContractsParams): Observable<PaginatedResult<Ticket[]>> {
      const url = `${this.baseUrl}Ticket/ByContract/${contractId}`;
      let params = new HttpParams()
        .append('pageNumber', paramsObj.pageNumber.toString())
        .append('pageSize', paramsObj.pageSize.toString());
      
      if (paramsObj.sortBy) {
        params = params.append('sortBy', paramsObj.sortBy);
      }
      if (paramsObj.sortDirection) {
        params = params.append('sortDirection', paramsObj.sortDirection);
      }
      if (paramsObj.handlerUsername) {
        params = params.append('handlerUsername', paramsObj.handlerUsername);
      }
      
      return this.http.get<Ticket[]>(url, { observe: 'response', params }).pipe(
        map(response => {
          const paginatedResult: PaginatedResult<Ticket[]> = {
            items: response.body ?? [],
            pagination: JSON.parse(response.headers.get('Pagination') ?? '{}')
          };
          return paginatedResult;
        }),
        catchError(error => {
          console.error('Error fetching tickets by contract:', error);
          return of({ items: [], pagination: undefined });
        })
      );
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


    getTicketsGroupedBySoftwareCompany(username: string): Observable<any[]> {
      const url = `${this.baseUrl}Ticket/GroupedTicketsBySoftwareCompany/${username}`; // ✅ Correct API Path
      return this.http.get<any[]>(url);
    }

    getTicketsGroupedByBeneficiaryCompany(username: string): Observable<any[]> {
      const url = `${this.baseUrl}Ticket/GroupedTicketsByBeneficiaryCompany/${username}`;
      return this.http.get<any[]>(url); // ✅ Now API returns a direct array
  }
  
    getTicketsGroupedByContract(username: string): Observable<any[]> {
      const url = `${this.baseUrl}Ticket/GroupedTicketsByContract/${username}`;
      return this.http.get<any[]>(url);
    }
    
    
    getTicketsGroupedByUserStatus(username: string): Observable<any[]> {
      const url = `${this.baseUrl}Ticket/GroupedTicketsByUserStatus/${username}`;
      return this.http.get<any[]>(url);
    }

    getLastTicketStatusHistoryByUser(username: string, count: number): Observable<TicketStatusHistory[]> {
      const url = `${this.baseUrl}Ticket/LastStatusHistoryByUser`;
      let params = new HttpParams()
        .append('username', username)
        .append('count', count.toString());
      return this.http.get<TicketStatusHistory[]>(url, { params });
    }

    markStatusAsSeen(markSeenDto: { message: string; updatedAt: Date; updatedByUsername: string }) {
      return this.http.put(`${this.baseUrl}Ticket/MarkAsSeen`, markSeenDto);
    }

    checkFeedbackEligibility(username: string, ticketId: number): Observable<boolean> {
      return this.http.get<boolean>(`${this.baseUrl}feedback/check-eligibility/${username}/${ticketId}`);
    }
    
    
    
  
}
