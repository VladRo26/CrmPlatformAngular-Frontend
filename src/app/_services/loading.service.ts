import { inject, Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  count = 0;
  private spinnerService = inject(NgxSpinnerService);

  loading() {
    this.count++;
    this.spinnerService.show(undefined, {
      type: 'pacman',
      size: 'large',
      bdColor: 'rgba(255, 255, 255, 0)',
      color: 'grey',
    });
  }

  idle() {
    this.count--;
    if (this.count <= 0) {
      this.count = 0;
      this.spinnerService.hide();
   }
 }
}
