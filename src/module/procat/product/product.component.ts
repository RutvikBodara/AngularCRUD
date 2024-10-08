import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { APIURL } from '../../../environment/redirection';
import { product, responseData, result } from '../../../interface/result';
import { CommonModule } from '@angular/common';
import { ComponentService } from '../../../services/component.service';
import {
  MatSnackBar,
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarLabel,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import { AgGridAngular } from "ag-grid-angular";
import {ColDef} from "ag-grid-community"
import { CommonService } from "../../../services/common.service";
import { MatDialog } from "@angular/material/dialog";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css'
import 'ag-grid-enterprise'
import { debounceTime, delay, distinctUntilChanged, fromEvent, retry, retryWhen, scan, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ActionMenuComponent } from './action-menu/action-menu.component';
@Component({
  selector: 'app-product',
  standalone: true,
  imports: [AgGridAngular,CommonModule,FormsModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {
    
  constructor(private router: Router ,private commonService :CommonService,private componentServices:ComponentService,private _snackBar: MatSnackBar){}
  @Input()
  dataSource;
  commonSearch;
  id:number=undefined;
  searchStringSubscription:Subscription;
  getProductSubscription : Subscription;
  errorMessage:String = "No Data Found";
  pagination:boolean=true;
  paginationPageSize:number= 10;
  retryCount : number =1;
  paginationPageSizeSelector = [1,10,20,50,100,200]
  resizeColumn :ColDef={
    filter:true,
    floatingFilter:true,
    // editable:true,
    flex:1
  }
  colDefs:ColDef[]=[
    
    {
      field:'id',
    },
    {
      field:'name',
      cellRenderer: (dataSource) => `<img style="height: 25px; width: 25px" src="data:image/jpeg;base64,${dataSource.data.image}" alt='product image'/>   ${dataSource.data.name}`
  
    },
    {
      field:'createddate'
    },
    {
      field:'updatedDate',
      cellRenderer:(dataSource) => (dataSource.data.updatedDate == null)? "-":dataSource.data.updatedDate
    },
    {
      field:'categoryName'
    },
    {
      field:'helplineNumber'
    },
    {
      field:'rating',
      cellRenderer:(dataSource) => (dataSource.data.rating == null)? "-":dataSource.data.rating,
      enableRowGroup:true
    },
    {
      headerName:'Action',
      cellRenderer:ActionMenuComponent,
      sortable:false
    }
  ]

  ngOnInit(){
    // this.getContact()
    this.commonService.updatePage("Products")
    this.searchStringSubscription = this.commonService.searchstring$.subscribe((value:number|string)=>{
        this.commonSearch =value
        console.log(this.commonSearch)
        console.log("hey i am here")
        this.getProduct()
    });
  }

  ngOnDestroy(){
    this.searchStringSubscription.unsubscribe()
    this.getProductSubscription.unsubscribe()
  }
  displayedColumns: string[] = ['Id', 'Name', 'Surname', 'Action'];
  
  getProduct(){
    this.getProductSubscription = this.componentServices.get<string>(APIURL.getProduct,null,null,null,null,this.commonSearch).pipe(retryWhen(arr => arr.pipe(delay(1000), scan((retryCount) =>{
      // retryCount = retryCount + 1;
      // console.log(retryCount)
      if(this.retryCount % 2 == 0){
        this.commonService.showSnackBar("please make sure you have proper internet connection")
        // throw arr;
      }
      else{
        console.log(this.retryCount)
        //this.getProductSubscription.unsubscribe()
      }
      this.retryCount++;
    },0)))).subscribe(
      (result:result<string>)=>{
        if(result.code == 106){
          this.errorMessage ="You Are Not Authorized To Do This Action"
        }
        else{
         
          // result.responseData.map((products:any)=>{
          //   products.image = this.blobToFile(products.image,products.imagename)
          // }
          // )
          this.dataSource =result.responseData
        }
      },
      (error)=>{
        console.log(error)
      }
    )
  }
  @ViewChild('addProduct')addProductBtnInstance :ElementRef;

  public blobToFile = (theBlob: Blob, fileName:string): File => {
    const b: any = theBlob;
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    b.lastModifiedDate = new Date();
    b.name = fileName;
      
    //Cast to a File() type
    return theBlob as File;
  }

  ngAfterViewInit(){
    fromEvent(this.addProductBtnInstance.nativeElement, "click").subscribe((responseData)=>{
      this.router.navigate(['/contact/addproduct'])
    })
  }
}