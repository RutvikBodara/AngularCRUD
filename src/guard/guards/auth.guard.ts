import { inject, Injectable, NgModule } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  CanActivateFn,
  RouterModule,
} from '@angular/router';
import { CommonService } from '../../services/common.service';
import { NgModel } from '@angular/forms';


export const authGuard: CanActivateFn = (route, state) => {
  const commonService = inject(CommonService);
  const router = inject(Router);
  if (commonService.isUserLoggedIn()) {
    return true;
  } else {
    router.navigate(['/auth/login']); // Redirect to login page
    return false;
  }
};

// export class authGuard implements CanActivate {
//   constructor(private commonService: CommonService, private router: Router) {}

//   canActivate(
//     next: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot
//   ): boolean {
//     if (this.commonService.isUserLoggedIn()) {

//       return true;
//     } else {
//       this.router.navigate(['/auth/login']); // Redirect to login page
//       return false;
//     }
//   }
// }
