import {LiveAnnouncer} from '@angular/cdk/a11y';
import {AfterViewInit, Component, Pipe, PipeTransform, ViewChild} from '@angular/core';
import {MatSort, Sort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import { catchError, delay, retryWhen, scan, Subscription, throwError } from 'rxjs';
import { ComponentService } from '../../../services/component.service';
import { APIURL } from '../../../environment/redirection';
import { CommonService } from '../../../services/common.service';
import { columnFields, genericResponeDemo, product, result } from '../../../interface/result';
import { DatePipe } from '@angular/common';
import { CommonTableGridComponent } from '../../common/common-table-grid/common-table-grid.component';
import { Router } from '@angular/router';
import { DeleteProductDialogComponent } from '../product/action-menu/delete-product-dialog/delete-product-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-product-mat',
  standalone: true,
  imports: [MatTableModule, MatSortModule,MatPaginatorModule,DatePipe,CommonTableGridComponent],
  templateUrl: './product-mat.component.html',
  styleUrl: './product-mat.component.css'
})


export class ProductMatComponent  {

  authorized:boolean=false;
  commonSearch=null;
  errorMessage:String = "No Data Found";
  searchStringSubscription:Subscription;
  getProductSubscription : Subscription;
  paginatorLength = 5;
  // displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  displayedColumns : string[] = ['id','name','createddate','updatedDate','categoryName','helplineNumber', 'rating', 'action']
  dataSource = new MatTableDataSource();
  retryCount : number =1;
  pagenumber:number;
  pagesize:number;
  sortedcolumn:string;
  sorteddirection:string;
  deleteId:number;
  deleteDataSubscription :Subscription;
  searchTerms;
  passedData;
  editable:boolean=true
  expandableGrid:boolean=false
  actionBtnAllowed :boolean =true;
  paginationAllowed:boolean=true;
  columnValues:columnFields[] ;
  bulkDeleteEnable:boolean =true;
  bulkDelete:boolean =false;
  bulkDeleteData : number[];
  constructor(private dialog:MatDialog,private router:Router,private _liveAnnouncer: LiveAnnouncer,private componentServices :ComponentService,private commonService : CommonService) {}

  // @ViewChild(MatSort) sort: MatSort;
  
  // @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(){
    this.commonService.updatePage("Products Grid")
    this.searchStringSubscription = this.commonService.searchstring$.subscribe((value:number|string)=>{
        this.commonSearch =value
        if(typeof value == 'string'){
          this.searchTerms =value.split('')
        }
        this.getProduct()
    });
    this.deleteDataSubscription= this.commonService.deleteData$.subscribe((Res : Boolean)=>{
      if(Res){
        console.log(Res)
        console.log("hey whats app")
        if(this.bulkDelete){
          this.deleteBulkProducts()
        }
        else{
          this.deleteProduct()
        }
      }
    });
  }

  
  // ngAfterViewInit() {

  //   // this.paginator.page.subscribe((event: PageEvent) => {
  //   //   console.log('Page Index:', event.pageIndex);
  //   //   this.pagenumber=event.pageIndex+1;
  //   //   this.pagesize =event.pageSize
  //   //   this.getProduct()
  //   // });
  //   // // this.dataSource.paginator = this.paginator;
  //   // this.dataSource.sort = this.sort;
  // }

  paginationChanged(event){
    console.log(event)
    this.pagenumber=event[0];
    this.pagesize =event[1];
    this.getProduct();
  }
  orderChanged(event){
    this.sortedcolumn = event[0];
    this.sorteddirection =event[1];
    console.log(event)
    this.getProduct();
  }

  onEditButtonClick(data:product): void {
    // console.log(this.params.data)
    // this.commonService.updateProductDetails(data)
    if(data.name && data.name.trim() !== "" && data.helplineNumber != null && data.helplineNumber.length == 10)
    this.postEditProduct(data)
    else
    this.commonService.showAlert("validation error","name and helpline number must required, helpline number must be 10 digits","error")
    // this.router.navigate(['/contact/editproduct'])
    // Access row data via this.params.data
    // console.log('Row Data:',data);
    // Or access specific field value
    // console.log('Specific Value:', this.params.data.fieldName);
  }

  postEditProduct(requestData) {
    this.componentServices
      .updateProduct(requestData, APIURL.editProduct)
      .subscribe((res) => {
        if (res.code == 100) {
          this.commonService.showSnackBar('product edited');
          this.commonService.navigateOnSamePage()
        } else {
          this.commonService.showSnackBar(res.message.toString());
        }
      });
  }
  onDeleteBulkProduct(deletedata:product[]){
    console.log(deletedata)
    // this.bulkDeleteData=deletedata;
   this.bulkDeleteData = deletedata.map(item => item.id);
   console.log(this.bulkDeleteData)
    this.bulkDelete=true;
    this.commonService.updateDeleteTagLine("once you delete selected products,this products no longer available to see")
    this.commonService.updateDeleteTitle("Delete Products?")
    this.commonDeletePopup()
  }
 
  commonDeletePopup(){
    this.openDeleteDialog('0','0');
  }
  deletePopUp(data){
    this.bulkDelete =false;
    this.deleteId=data.id;
    this.commonService.updateDeleteTagLine("once you delete product,this product no longer")
    this.commonService.updateDeleteTitle("Delete Product?")
    this.commonDeletePopup()
  }
  // this is what i wanna say 
  ngOnDestroy(){
    this.deleteDataSubscription.unsubscribe()
  }
  openDeleteDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(DeleteProductDialogComponent, {
      width: '500px',
      height:'300px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

  deleteBulkProducts(){
    this.componentServices.delete<string>(APIURL.deleteBulkProduct,null,this.bulkDeleteData).subscribe(
      (res)=>{
        if(res.code  == 100){
          this.commonService.showSnackBar(res.message + "deleted success")
          this.commonService.navigateOnSamePage()
          this.commonService.deleteDataChange(false);
        }
        else{
          this.commonService.deleteDataChange(false);
          this.commonService.showSnackBar(res.message)
        }
      },
      (error)=>{
        console.error(error);
      }
    )
  }
  deleteProduct(){
    console.log(this.deleteId)
    this.componentServices.delete<string>(APIURL.deleteProduct,this.deleteId).subscribe(
      (res)=>{
        if(res.code  == 100){
          this.commonService.showSnackBar(res.message + "deleted success")
          this.commonService.navigateOnSamePage()
          this.commonService.deleteDataChange(false);
          // this.commonService.clearSelectionUpdate(true);
        }
        else{
          this.commonService.deleteDataChange(false);
          this.commonService.showSnackBar(res.message)
        }
      },
      (error)=>{
        console.error(error);
      }
    )
  }

  // int? pagenumber, int? pagesize, string? sortedcolumn, string? sorteddirection
  // announceSortChange(sortState: Sort) {
  //   if (sortState.direction) {
  //     console.log(sortState.direction)
  //     this.sortedcolumn = sortState.active;
  //     this.sorteddirection =sortState.direction
  //     this.getProduct()
  //     this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
  //   } else {
  //     this.sortedcolumn = null;
  //     this.sorteddirection =null;
  //     this.getProduct()
  //     console.log(this.sortedcolumn +" " +this.sorteddirection )
  //     this._liveAnnouncer.announce('Sorting cleared');
  //   }
  // }

  // onPageChange(): void {
  //   const pageIndex = this.paginator.pageIndex;
  //   const pageSize = this.paginator.pageSize;
  //   console.log(`Page index: ${pageIndex}`);
  //   console.log(`Page size: ${pageSize}`);
    
  //   // Fetch new data or update data source based on page index and size
  //   // e.g., this.fetchData(pageIndex, pageSize);
  // }
  
  getProduct(){
    this.getProductSubscription = this.componentServices.get<string>(APIURL.getProduct,null,null,null,null,this.commonSearch,this.sortedcolumn,this.sorteddirection,this.pagenumber,this.pagesize).pipe(retryWhen(arr => arr.pipe(delay(1000), scan((retryCount) =>{
      // retryCount = retryCount + 1;
      // console.log(retryCount)
      if(this.retryCount % 2 == 0){
        this.commonService.showSnackBar("please make sure you have proper internet connection")
        this.getProductSubscription.unsubscribe()
        // throw arr;
      }
      else{
        console.log(this.retryCount)
      }
      this.retryCount++;
    },0)))).pipe(
      catchError((err) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status == 401) {
            this.errorMessage ="You Are Not Authorized To Do This Action"
            this.authorized =false;
          } else {
            console.error('http error', err);
          }
        }
        return throwError(() => err);
      }),
    ).subscribe(
      (result:genericResponeDemo<product[]>)=>{
        if(result.code == 106){
          this.errorMessage ="You Are Not Authorized To Do This Action"
        }
        else{
          this.authorized =true;
          // result.responseData.map((products:any)=>{
          //   products.image = this.blobToFile(products.image,products.imagename)
          // }
          // )
          // this.convertToMatTableDataSource(result)
          this.paginatorLength = result.dataCount
          this.passedData = result.responseData
          this.columnValues=result.columnCredits
          this.dataSource =new MatTableDataSource(result.responseData);
        }
      }
    )
  }

  convertToMatTableDataSource(data){
  }
}
