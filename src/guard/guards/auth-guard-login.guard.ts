import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CommonService } from '../../services/common.service';

export const authGuardLoginGuard: CanActivateFn = (route, state) => {
  const commonService =inject(CommonService)
  const router =inject(Router)
  
  if (commonService.isUserLoggedIn()) {
    router.navigate(['/contact']); // Redirect to login page
    return false;
  } else {
    console.log("i am true")
    return true;
  }
};
