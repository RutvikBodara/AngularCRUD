import { Component } from '@angular/core';
import { category, categoryEdit } from '../../../../interface/common';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { ComponentService } from '../../../../services/component.service';
import { APIURL } from '../../../../environment/redirection';
import { CommonModule, FormStyle } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { responseData } from '../../../../interface/result';

@Component({
  selector: 'app-edit-category',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,MatInputModule,MatFormField,MatIconModule,MatDividerModule,MatButtonModule],
  templateUrl: './edit-category.component.html',
  styleUrl: './edit-category.component.css'
})
export class EditCategoryComponent {
  
  constructor(private dialogRef:MatDialogRef<EditCategoryComponent>,private formbuilderinstance:FormBuilder, private router:Router,private commonService:CommonService,private componentService:ComponentService){}
  CategoryForm: FormGroup;
  CategoryDetails:category;
  requestData : responseData<string>;
  
  ngOnInit(){
    this.commonService.categoryDetails$.subscribe((res)=>{
      this.CategoryDetails = res
    });
    this.CategoryForm =this.formbuilderinstance.group({
      name:[this.CategoryDetails.name,[Validators.required]]
    });
  }

  editCategory(requestData){

    console.log(this.CategoryDetails)
    this.componentService.update<string>(this.requestData,APIURL.editCategory).subscribe(
      (res)=>{
        if(res.code  == 100){
          this.commonService.showSnackBar("changes applied")
          this.dialogRef.close()
          this.commonService.navigateOnSamePage()
        }
        else{
          this.commonService.showSnackBar(res.message)
        }

      },
      (error)=>{
        console.error(error);
      }
    )

  }
  onSubmit(){
    if(this.CategoryForm.valid){
      const data = this.CategoryForm.value;
      this.requestData = {
        id:this.CategoryDetails.id,
        name:data.name,
        surname:null
      }
      this.editCategory(this.requestData)
    } 
  }
}
