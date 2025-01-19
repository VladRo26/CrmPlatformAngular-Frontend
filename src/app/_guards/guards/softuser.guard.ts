import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../../_services/account.service';
import { ToastrService } from 'ngx-toastr';

export const softuserGuard: CanActivateFn = (route, state) => {

  const accountService = inject(AccountService);
  const toastr = inject(ToastrService);
  const router = inject(Router);

  const currentUser = accountService.currentUser();
  if (currentUser && currentUser.userType === 'SoftwareCompanyUser') {
    return true;
  } else {
    toastr.error('Access Denied! Software Company Users only.');
    router.navigateByUrl('/');
    return false;
  }
};
