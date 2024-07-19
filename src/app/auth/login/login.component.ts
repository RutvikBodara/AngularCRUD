import { Component } from '@angular/core';
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
  ngOnInit(){
    this.contactForm =this.formbuilderinstance.group({
      username:['',[Validators.required,Validators.minLength(3)]],
      password:['',[Validators.required,Validators.minLength(3)]]
    });
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
          if(result.code == 100){
            //store token in local host
            this.commonService.setLocal(result.responseData.JWTToken , "jwt")
            this.router.navigate(["/contact"])
          }
          else {
            this.commonService.showSnackBar(result.message)
          }
        }
      )
    }
  }
}
