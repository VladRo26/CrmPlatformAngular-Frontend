import { HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { userApp } from '../_models/userapp';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { PaginatedResult } from '../_models/pagination';
import { UserParams } from '../_models/userparams';


@Injectable({
  providedIn: 'root'
})
export class UserappService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;
  usersApp = signal<userApp[]>([]);
  paginatedResult = signal<PaginatedResult<userApp[]> | null>(null);
  userAppCache = new Map();
  userParams = signal<UserParams>(new UserParams());

  resetUserParams() {
    this.userParams.set(new UserParams());
  }
 
  getUsersapp() {
    const response = this.userAppCache.get(Object.values(this.userParams()).join('-'));

    if(response){
      return this.setResponse(response);

    }
    let params = this.setPaginationHeader(this.userParams().pageNumber, this.userParams().pageSize);

    if (this.userParams().companyName) {
      params = params.append('companyName', this.userParams().companyName ?? '');
    }

    if (this.userParams().name) {
      params = params.append('name', this.userParams().name ?? '');
    }

    if (this.userParams().rating) {
      params = params.append('rating', this.userParams().rating ?? 2);
    }

    if (this.userParams().userType) {
      params = params.append('userType', this.userParams().userType ?? '');
    }

    if (this.userParams().orderBy) {
      params = params.append('orderBy', this.userParams().orderBy ?? '');
    }

    return this.http.get<userApp[]>(this.baseUrl + 'User',{observe: 'response',params}).subscribe({
      next: response => {
        this.setResponse(response);
        this.userAppCache.set(Object.values(UserParams).join('-'), response);
    }
  })
  }

  private setResponse(response: HttpResponse<userApp[]>){
    this.paginatedResult.set({
      items: response.body as userApp[],
      pagination: JSON.parse(response.headers.get('Pagination')!)
    })
  }

  private setPaginationHeader(pageNumber: number, pageSize: number) {
    let params = new HttpParams();
    params = params.append('pageNumber', pageNumber);
    params = params.append('pageSize', pageSize);
    return params;
  }

  getUsersapp_username(username: string) {
    const userApp = this.usersApp().find(x => x.userName === username);
    if (userApp !== undefined) {
      return  of(userApp);
    }
    return this.http.get<userApp>(this.baseUrl + 'User/username/' + username);
  }

  getUserAppDtoByUsername(username: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}User/userappdto/username/${username}`).pipe(
      tap((response) => {
        console.log('Raw Response:', response); // Debug raw response
      }),
      catchError((error) => {
        console.error('Error in API call:', error);
        throw error;
      })
    );
  }
  

  getUserappById(id: number): Observable<userApp | null> {
    return this.http.get<userApp>(`${this.baseUrl}User/${id}`).pipe(
      tap((user) => console.log('Fetched User:', user)),
      catchError((error) => {
        console.error('Error in getUserappById:', error);
        return of(null); // Return null on error
      })
    );
  }
  

  
  

  updateUserapp(userapp: userApp) {
    return this.http.put(this.baseUrl + 'User', userapp).pipe(
      tap(() => {
        this.usersApp.update(usersApp => usersApp.map(x => x.userName === userapp.userName ? userapp : x));
    })
   )
  }

  getPhotoUrl(): Observable<string> {
    return this.http.get<{ url: string }>(`${this.baseUrl}User/photo-url`).pipe(
      tap((response) => console.log('Fetched Photo URL:', response.url)),
      catchError((error) => {
        console.error('Error in getPhotoUrl:', error);
        return of(''); // Return an empty string on error
      }),
      map((response) => typeof response === 'string' ? '' : response.url) // Extract the URL from the response
    );
  }

  getPhotoUrlbyUsername(username: string): Observable<string> {
    return this.http.get<{ url: string }>(`${this.baseUrl}User/photo-url/${username}`).pipe(
      map((response) => {
        // Validate and handle empty URLs
        console.log('Backend Response:', response);
        return response.url && response.url.trim() !== '' ? response.url : 'assets/default-user.png';
      }),
      catchError((error) => {
        console.error('Error fetching photo URL:', error);
        return of('assets/default-user.png'); // Default image on error
      })
    );
  }
  
  deletePhoto(){
    return this.http.delete(this.baseUrl + 'User/delete-photo');
  }
  
}
