import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { Router } from 'express';

export const authContactGuard: CanActivateFn = (route, state) => {
  const commonService =inject(CommonService)
  const router =inject(Router)
  
  if (commonService.isUserLoggedIn()) {
    return true;
  } else {
    router.navigate(['/']); 
    console.log("i am true")
    return false;
  }

};
