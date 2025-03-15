import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AccountService } from '../../_services/account.service';
import { ToastrService } from 'ngx-toastr';

export const notDefaultGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const toastr = inject(ToastrService);
  const roles = accountService.roles();

  if (roles?.includes('User') || roles?.includes('Admin') || roles?.includes('Moderator')) {
    return true;
  } else {
    toastr.error('Your account needs to be approved by the moderator to access all the functionalities');
    return false;
  }
};
