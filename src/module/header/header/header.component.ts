import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import {
  LoginDataRequest,
  LoginDataResponse,
  RegisterDataRequest,
} from '../../../interface/result';
import { CommonService } from '../../../services/common.service';
import { MatListModule } from '@angular/material/list';
import { from, fromEvent } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatMenuModule, MatButtonModule, MatListModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  userName;
  email;
  @ViewChild('logout') logout: ElementRef;
  @ViewChild('myProfile') myProfile :ElementRef;

  constructor(private commonService: CommonService, private router: Router) {}
  ngAfterViewInit() {
    this.userName = this.commonService.getLocal('username');
    this.userName = this.userName.split('"')[3];
    this.email = this.commonService.getLocal('email');
    this.email = this.email.split('"')[3];

    fromEvent(this.logout.nativeElement, 'click').subscribe(
      (Res) => {
        this.commonService.logout();
        this.router.navigate(['/auth']);
        this.commonService.showSnackBar('Logout Successfull');
      },
      (error) => {
        this.commonService.showSnackBar(error.toString());
      }
    );
    fromEvent(this.myProfile.nativeElement,'click').subscribe(()=>{
      this.router.navigate(['contact/myprofile'])
    });
  }
}
