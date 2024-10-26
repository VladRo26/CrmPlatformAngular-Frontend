import { Injectable, inject} from '@angular/core';
import { ImageDTO } from '../_models/image';
import { HttpClient } from '@angular/common/http';


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

}
