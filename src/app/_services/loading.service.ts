import { inject, Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class LoadingService {
  private _loadingCount = 0;
  private _loading = new BehaviorSubject<boolean>(false);
  // Expose an observable for other components
  loading$ = this._loading.asObservable();

  private spinnerService = inject(NgxSpinnerService);

  loading() {
    this._loadingCount++;
    if (this._loadingCount === 1) {
      this._loading.next(true);
      this.spinnerService.show(undefined, {
        type: 'pacman',
        size: 'large',
        bdColor: '#fff', // white backdrop
        color: 'grey',  // black pacman
      });
    }
  }

  idle() {
    this._loadingCount--;
    if (this._loadingCount <= 0) {
      this._loadingCount = 0;
      this._loading.next(false);
      this.spinnerService.hide();
    }
  }
}
