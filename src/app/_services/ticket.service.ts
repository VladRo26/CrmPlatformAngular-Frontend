import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Ticket } from '../_models/ticket';
import { Observable } from 'rxjs';
import { TicketStatusHistory } from '../_models/ticketstatushistory';
import { CreateTicket } from '../_models/createticket';

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

    getTicketsByUserName(username: string): Observable<Ticket[]> {
      const url = `${this.baseUrl}Ticket/ByUserName/${username}`;
      return this.http.get<Ticket[]>(url);
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
