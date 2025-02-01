import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Feedback } from '../_models/feedback';
import { Observable } from 'rxjs';
import { FeedbackSentiment } from '../_models/feedbacksentiment';
import { AverageFeedbackSentiment } from '../_models/averagefeedbacksentiment';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

    private http = inject(HttpClient);
    baseUrl = environment.apiUrl;

    getFeedbackByToUserId(toUserId: number): Observable<Feedback[]> {
      return this.http.get<Feedback[]>(`${this.baseUrl}feedback/to-user/${toUserId}`);
    }

    getSentimentByFeedbackId(feedbackId: number): Observable<FeedbackSentiment> {
      return this.http.get<FeedbackSentiment>(`${this.baseUrl}feedback/sentiment/${feedbackId}`);
    }

    createFeedback(username: string, ticketId: number, content: string, rating: number): Observable<Feedback> {
      const params = { username, ticketId: ticketId.toString(), content, rating: rating.toString() };
      return this.http.post<Feedback>(`${this.baseUrl}feedback`, {}, { params });
    }
    generateFeedbackForUser(username: string, ticketId: number, rating: number, userExperience: string): Observable<string> {
      const url = `${this.baseUrl}Feedback/generate-feedback`;
    
      const body = {
        username: username,
        ticketId: ticketId,
        rating: rating,
        userExperience: userExperience
      };
    
      return this.http.post<string>(url, body, { 
        headers: new HttpHeaders({
          'Content-Type': 'application/json', // Use JSON instead of text/plain
          'Accept': 'application/json'
        })
      });
    }

    getAverageSentimentByUsername(username: string): Observable<AverageFeedbackSentiment> {
      return this.http.get<AverageFeedbackSentiment>(`${this.baseUrl}feedback/sentiment/average/${username}`);
    }

    createFeedbackForBeneficiary(username: string, ticketId: number, content: string, rating: number): Observable<Feedback> {
      const params = { username, ticketId: ticketId.toString(), content, rating: rating.toString() };
      return this.http.post<Feedback>(`${this.baseUrl}feedback/software-to-beneficiary`, {}, { params });
    }
    
    checkFeedbackEligibility(username: string, ticketId: number): Observable<boolean> {
      return this.http.get<boolean>(`${this.baseUrl}feedback/check-eligibility/${username}/${ticketId}`);
    }
    
    
}
