import { inject, Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingCount = 0;
  private spinnerService = inject(NgxSpinnerService);

  loading() {
    this.loadingCount++;
    this.spinnerService.show(undefined,{
      type: 'pacman',
      bdColor: 'rgba(255,255,255,255)',
      color:'#333333',
    });

  }

  idle() {
    this.loadingCount--;
    if (this.loadingCount <= 0) {
      this.loadingCount = 0;
      this.spinnerService.hide();
    }
  }
}
