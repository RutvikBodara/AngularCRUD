import { Component, EventEmitter, Output, output } from '@angular/core';
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
  tagLineDelete:string = "nothing have to delete"
  deleteTitle:string = "title"
  constructor(private dialogRef:MatDialogRef<DeleteProductDialogComponent>, private router:Router,private commonService:CommonService,private componentService:ComponentService){}
  productDetails:product;
  
  ngOnInit(){
    this.commonService.deleteTagLine$.subscribe((Res)=>{
      this.tagLineDelete= Res
    })
    this.commonService.deleteTitle$.subscribe((res)=>{
      this.deleteTitle = res
    })
  }
  delete(){
    // want id here to transmit
    console.log("hey hii")
    this.commonService.deleteDataChange(true);
    this.dialogRef.close()
  }

}
