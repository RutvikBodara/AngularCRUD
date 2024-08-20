import { Component } from '@angular/core';
import { category } from '../../../../../interface/common';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonService } from '../../../../../services/common.service';
import { ComponentSelector } from 'ag-grid-community';
import { ComponentService } from '../../../../../services/component.service';
import { APIURL } from '../../../../../environment/redirection';

@Component({
  selector: 'app-delete-category',
  standalone: true,
  imports: [],
  templateUrl: './delete-category.component.html',
  styleUrl: './delete-category.component.css'
})
export class DeleteCategoryComponent {
  constructor(private dialogRef:MatDialogRef<DeleteCategoryComponent>, private router:Router,private commonService:CommonService,private componentService:ComponentService){}
  CategoryDetails:category;
  delete(){
    this.commonService.categoryDetails$.subscribe((res)=>{
      console.log(res)
      this.CategoryDetails = res
    });
    if(this.CategoryDetails.totalProducts  > 0){
      this.commonService.showSnackBar("can not delete because this category contains products")
      // this.dialogRef.close()
    }
    else{
      this.commonService.deleteDataChange(true);
      // this.deleteProduct();
    }
    this.dialogRef.close()
  }
  // deleteProduct(){
  //   this.componentService.delete<string>(this.CategoryDetails.id,APIURL.deleteCategory).subscribe(
  //     (res)=>{
  //       if(res.code  == 100){
  //         this.commonService.showSnackBar(res.message + "deleted success")
  //         this.dialogRef.close()
  //         this.commonService.navigateOnSamePage()
  //       }
  //       else{
  //         this.commonService.showSnackBar(res.message)
  //       }

  //     },
  //     (error)=>{
  //       console.error(error);
  //     }
  //   )

  // }

}
