import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Feedback } from '../_models/feedback';
import { Observable } from 'rxjs';
import { FeedbackSentiment } from '../_models/feedbacksentiment';

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

}
