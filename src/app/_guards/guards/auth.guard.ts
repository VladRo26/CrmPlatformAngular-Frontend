import { CanActivateFn } from '@angular/router';
import { AccountService } from '../../_services/account.service';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const toastr = inject(ToastrService);
  const router = inject(Router);

  if(accountService.currentUser()){
    return true;
  }else{
    toastr.error('Access Denied!');
    router.navigateByUrl('/');
    return false;
  }
  return true;
};
