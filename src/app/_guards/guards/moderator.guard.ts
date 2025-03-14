import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AccountService } from '../../_services/account.service';
import { ToastrService } from 'ngx-toastr';

export const moderatorGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const toastr = inject(ToastrService);

  if (accountService.roles()?.includes('Moderator') || accountService.roles()?.includes('Admin')) {
    return true;
  } else {
    toastr.error('You do not have permission to access this page');
    return false;
  }
};
