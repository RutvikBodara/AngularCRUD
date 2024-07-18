import { Component, importProvidersFrom } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import { ComponentService } from '../../../services/component.service';
import { responseData, result } from '../../../interface/result';
import {
  MatSnackBar,
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarLabel,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { APIURL } from '../../../environment/redirection';
import { MatDialogRef } from '@angular/material/dialog';
import { NewContactTypeComponent } from '../new-contact-type/new-contact-type.component';
import { CommonService } from '../../../services/common.service';
@Component({
  selector: 'app-new-contact',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,MatInputModule,MatFormFieldModule,MatIconModule,MatDividerModule,MatButtonModule],
  templateUrl: './new-contact.component.html',
  styleUrl: './new-contact.component.css'
})
export class NewContactComponent {
  constructor(private commonService: CommonService,private router :Router, private formbuilderinstance: FormBuilder, private componentServices:ComponentService,private _snackBar:MatSnackBar){}
  contactForm: FormGroup;
  requestValue:responseData<string>
  errorMessage:string ="Something Went Wrong"
  authorized:boolean =true;
  ngOnInit(){
    this.commonService.updatePage("Create New Cotact")
    this.contactForm =this.formbuilderinstance.group({
      name:['',[Validators.required,Validators.minLength(3)]],
      surname:['',[Validators.required,Validators.minLength(3)]]
    });
  }
  onSubmit(){
    if(this.contactForm.valid){
      const formvValue = this.contactForm.value;
      // const jsonString = JSON.stringify(value);
       
      this.requestValue = {
        id:null,
        name:formvValue.name,
        surname:formvValue.surname
      }

      this.componentServices.add<string>(this.requestValue,APIURL.AddContact).subscribe(
        (result)=>{
          if(result.code ==106){
                this.authorized=false;
                this.errorMessage ="You Are Not Authorized To Do This Action"
          }
          else if(result.code == 107){
            this.commonService.showSnackBar("This Contact Already Exists")
          }
          else{
            this.commonService.showSnackBar("Add Contact successfully")
            this.router.navigate(['']);
          }
        },
        (error)=>{
          this.commonService.showSnackBar(error)
        }
      )
    } 
  }
}
