import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import { ComponentService } from '../../../services/component.service';
import { CommonService } from '../../../services/common.service';
import { Router } from '@angular/router';
import { fromEvent } from 'rxjs';
import { genericResponeDemo, LoginDataRequest, LoginDataResponse, RegisterDataRequest, result } from '../../../interface/result';
import { APIURL } from '../../../environment/redirection';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,MatInputModule,MatFormFieldModule,MatIconModule,MatDividerModule,MatButtonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  @ViewChild('LoginLink') LoginLink :ElementRef;
  // @ViewChild('registerForm') registerForm :ElementRef;
  registerForm :FormGroup;
  requestRegisterData: RegisterDataRequest;
  constructor(private router :Router, private formbuilderinstance:FormBuilder ,private componentService:ComponentService,private commonService :CommonService){}

  ngOnInit(){
  
    this.registerForm =this.formbuilderinstance.group({
      username:['',[Validators.required,Validators.minLength(3)]],
      email:['',[Validators.required,Validators.email]],
      firstname:['',[Validators.required]],
      lastname:['',[Validators.required]],
      password:['',[Validators.required,Validators.minLength(3)]],
      confirmpassword:['',[Validators.required]]
    },
    {
      validator:this.confirmedValidator('password','confirmpassword')
    }
  );
  }
  ngAfterViewInit(){
    fromEvent(this.LoginLink.nativeElement,"click").subscribe((Res)=>{
      this.router.navigate(['auth/login'])
    })
    // this.commonService.backgroundColorChange(false)
  }
  confirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (
        matchingControl.errors &&
        !matchingControl!.errors?.['confirmedValidator']
      ) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  onSubmit(){
    if(this.registerForm.valid){
      const formValue = this.registerForm.value

      this.requestRegisterData = {
        UserName : formValue.username,
        Password:formValue.password,
        Email:formValue.email,
        FirstName:formValue.firstname,
        LastName:formValue.lastname
      }
      
      this.componentService.login<LoginDataResponse<string>>(this.requestRegisterData , APIURL.Register).subscribe(
        (result:result<string>)=>{
          console.log(result)
          if(result.code == 100){
            this.commonService.showSnackBar("registered")
            this.router.navigate(["/auth/login"])
          }
          else {
            this.commonService.showSnackBar(result.message)
          }
        }
      )
    }
  }
}
