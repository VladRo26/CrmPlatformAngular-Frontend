import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toastr = inject(ToastrService);
  
  return next(req).pipe(
    catchError(error => {
      if (error) {
        switch (error.status) {
          case 400:
            if(error.error.errors) {
              const modalStateErrors = [];
              for (const key in error.error.errors) {
                if (error.error.errors[key]) {
                  modalStateErrors.push(error.error.errors[key]);
                }
              }
              throw modalStateErrors.flat();
            }
            else{
              toastr.error('Bad Request');
            }
            break;
          case 401:
            toastr.error('Unauthorized');
            break;
          case 404:
            toastr.error('Not Found');
            router.navigateByUrl('/not-found');
            break;
          case 500:
            const navigationExtras = {state: {error: error.error}};
            router.navigateByUrl('/server-error', navigationExtras);
            toastr.error('Internal Server Error');
            break;
          default:
            toastr.error('Something unexpected went wrong');
            console.log(error);
            break;
        }
      }
       throw error;
    }
  ));
};
