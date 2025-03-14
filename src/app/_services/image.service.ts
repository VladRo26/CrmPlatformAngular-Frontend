import { Injectable, inject} from '@angular/core';
import { ImageDTO } from '../_models/image';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private http = inject(HttpClient);
  baseUrl = 'https://localhost:7057/api/';

  getImages() {
    console.log(this.http.get<ImageDTO[]>(this.baseUrl + 'HomeImage'));
    return this.http.get<ImageDTO[]>(this.baseUrl + 'HomeImage');
  }

  deleteImage(publicId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}HomeImage/${publicId}`);
  }

}
