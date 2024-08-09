import { Injectable } from '@angular/core';
import { CanActivateChild, Router } from '@angular/router';
import { CommonService } from '../../services/common.service';


@Injectable({
  providedIn: 'root'
})
export class contactAuth implements CanActivateChild {
  
  constructor(private authService: CommonService, private router: Router) {}

  canActivateChild(): boolean {
    if (this.authService.isUserLoggedIn()) {
      return true;
    } else {
      console.log("i am navigating")
      // this.router.navigate(['//login']); // Redirect to login page
      return false;
    }
  }
}