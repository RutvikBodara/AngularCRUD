import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComponentService } from '../../../services/component.service';
import {
  MatSnackBar,
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarLabel,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
import { responseData } from '../../../interface/result';
import { APIURL } from '../../../environment/redirection';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
@Component({
  selector: 'app-new-contact-type',
  imports: [CommonModule, FormsModule, ReactiveFormsModule,MatInputModule,MatFormFieldModule,MatIconModule,MatDividerModule,MatButtonModule],
  standalone: true,
  templateUrl: './new-contact-type.component.html',
  styleUrl: './new-contact-type.component.css'
})
export class NewContactTypeComponent {
  constructor(private router:Router,private dialogRef: MatDialogRef<NewContactTypeComponent>,private formbuilderinstance:FormBuilder ,private componentServices:ComponentService,private _snackBar:MatSnackBar){}
  contactTypeForm: FormGroup;
  requestValue:responseData<string>
  ngOnInit(){
    this.contactTypeForm =this.formbuilderinstance.group({
      name:['',[Validators.required]]
    });
  }
  onSubmit(){

    if(this.contactTypeForm.valid){
      const formValue = this.contactTypeForm.value;
      // const jsonString = JSON.stringify(value);
      this.requestValue = {
        id:null,
        name:formValue.name,
        surname:null
      }


      this.componentServices.add<string>(this.requestValue,APIURL.AddContactType).subscribe(
        (result)=>{
          this._snackBar.open("Add Contact List successfully","CLOSE", {
            duration: 3000
          })
          this.dialogRef.close()
          const currentUrl = this.router.url;
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
               this.router.navigate([currentUrl]);
          });
        },
        (error)=>{
          console.log(error)
        }
      )
    } 
  }
}
