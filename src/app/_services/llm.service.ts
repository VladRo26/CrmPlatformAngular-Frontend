import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LlmService {

  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;

  translateText(text: string, sourceLanguage: string, targetLanguage: string): Observable<any> {
    const params = new HttpParams()
      .set('text', text)
      .set('sourceLanguage', sourceLanguage)
      .set('targetLanguage', targetLanguage);

    return this.http.post<any>(`${this.baseUrl}llm/translate`, {}, { params });
  }

}
