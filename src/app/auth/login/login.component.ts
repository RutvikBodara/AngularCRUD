import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import { ComponentService } from '../../../services/component.service';
import { timeStamp } from 'console';
import { genericResponeDemo, LoginDataRequest, LoginDataResponse, result } from '../../../interface/result';
import { APIURL } from '../../../environment/redirection';
import { CommonService } from '../../../services/common.service';
import { Router } from '@angular/router';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,MatInputModule,MatFormFieldModule,MatIconModule,MatDividerModule,MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  constructor(private router :Router, private formbuilderinstance:FormBuilder ,private componentService:ComponentService,private commonService :CommonService){}
  contactForm: FormGroup;
  requestLoginData : LoginDataRequest<string>;
  @ViewChild('registerLink') registerLink :ElementRef;
  ngOnInit(){
    this.contactForm =this.formbuilderinstance.group({
      username:['',[Validators.required,Validators.minLength(3)]],
      password:['',[Validators.required,Validators.minLength(3)]]
    });
  }
  ngAfterViewInit(){
    fromEvent(this.registerLink.nativeElement,"click").subscribe((Res)=>{
      this.router.navigate(['auth/register'])
    })
    // this.commonService.backgroundColorChange(false)
  }
  onSubmit()
  {
    if(this.contactForm.valid){
      const formValue = this.contactForm.value

      this.requestLoginData = {
        UserName : formValue.username,
        Password:formValue.password
      }

      this.componentService.login<LoginDataResponse<string>>(this.requestLoginData , APIURL.login).subscribe(
        (result:genericResponeDemo<LoginDataResponse<string>>)=>{

          console.log(result)
          if(result.code == 100){
            console.log(result)
            this.commonService.setLocal(result.responseData.jwtToken , "jwt")
            this.commonService.setLocal(result.responseData.userName,'username')
            // this.commonService.setLocal(result.responseData.UserName,'FirstName')
            this.commonService.setLocal(result.responseData.emailId,'email')
            this.commonService.setLocal(result.responseData.accountId.toString(),'AccountId')
            console.log(this.commonService.getLocal("AccountId"))
            console.log("local val")
            this.commonService.showSnackBar("login successfull")
            this.router.navigate(["/contact"])
          }
          else {
            this.commonService.showSnackBar(result.message,"mat-accent")
          }
        }
      )
    }
  }
}
