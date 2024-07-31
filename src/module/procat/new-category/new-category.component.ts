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
import { CommonService } from '../../../services/common.service';
import { exhaustMap, of } from 'rxjs';
@Component({
  selector: 'app-new-category',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,MatInputModule,MatFormFieldModule,MatIconModule,MatDividerModule,MatButtonModule],
  templateUrl: './new-category.component.html',
  styleUrl: './new-category.component.css'
})
export class NewCategoryComponent {
  constructor(private commonService :CommonService,private router:Router,private dialogRef: MatDialogRef<NewCategoryComponent>,private formbuilderinstance:FormBuilder ,private componentServices:ComponentService,private _snackBar:MatSnackBar){}
  CategoryForm: FormGroup;
  requestValue:responseData<string>
  ngOnInit(){
    this.CategoryForm =this.formbuilderinstance.group({
      name:['',[Validators.required]]
    });
  }
  onSubmit(){
    if(this.CategoryForm.valid){
      const formValue = this.CategoryForm.value;
      // const jsonString = JSON.stringify(value);
      this.requestValue = {
        id:null,
        name:formValue.name,
        surname:null
      }
      this.componentServices.add<string>(this.requestValue,APIURL.AddCategory).pipe(exhaustMap(
        (result)=>{
          if(result.code == 107){
            this.commonService.showSnackBar("Category Already Exists");
            return of(result);
          }
          else{
            this.commonService.showSnackBar("Add category successfully")
            this.dialogRef.close()
            this.commonService.navigateOnSamePage()
            return of(result);
          }
            // this.router.getCurrentNavigation();
        }
       ) ).subscribe()
    } 
  }
}
