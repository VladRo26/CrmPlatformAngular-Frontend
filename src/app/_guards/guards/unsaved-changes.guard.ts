import { CanDeactivateFn } from '@angular/router';
import { UserappEditComponent } from '../../feautures/userapp/userapp-edit/userapp-edit.component';

export const unsavedChangesGuard: CanDeactivateFn<UserappEditComponent> = (component, currentRoute, currentState, nextState) => {
  if (component.isFormDirty()) {  // ✅ Check actual changes
    return confirm('Are you sure you want to continue? Any unsaved changes will be lost.');
  }
  return true;
};
