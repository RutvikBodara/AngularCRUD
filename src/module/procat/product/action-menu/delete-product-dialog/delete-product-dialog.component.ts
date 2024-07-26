import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../../../../../services/common.service';
import { ComponentSelector } from 'ag-grid-community';
import { ComponentService } from '../../../../../services/component.service';
import { product } from '../../../../../interface/result';
import { APIURL } from '../../../../../environment/redirection';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-product-dialog',
  standalone: true,
  imports: [],
  templateUrl: './delete-product-dialog.component.html',
  styleUrl: './delete-product-dialog.component.css'
})
export class DeleteProductDialogComponent {
  constructor(private dialogRef:MatDialogRef<DeleteProductDialogComponent>, private router:Router,private commonService:CommonService,private componentService:ComponentService){}
  productDetails:product;
  delete(){
    this.commonService.product$.subscribe((res)=>{
      this.productDetails = res
      console.log(res)
    });
    this.deleteProduct();
  }
  deleteProduct(){
    this.componentService.delete<string>(this.productDetails.id,APIURL.deleteProduct).subscribe(
      (res)=>{
        if(res.code  == 100){
          this.commonService.showSnackBar(res.message + "deleted success")
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


}
