import { Injectable, inject} from '@angular/core';
import { ImageDTO } from '../_models/image';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;


  getImages() {
    console.log(this.http.get<ImageDTO[]>(this.baseUrl + 'HomeImage'));
    return this.http.get<ImageDTO[]>(this.baseUrl + 'HomeImage');
  }

  deleteImage(publicId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}HomeImage/${publicId}`);
  }

}
