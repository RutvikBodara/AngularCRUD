import { Component } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';

import { CommonService } from '../../../services/common.service';
import { MatDialog } from '@angular/material/dialog';
import { ComponentService } from '../../../services/component.service';
import { APIURL } from '../../../environment/redirection';
import { columnFields, genericResponeDemo, product, result } from '../../../interface/result';
import { NewCategoryComponent } from '../new-category/new-category.component';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import 'ag-grid-enterprise';
import {
  catchError,
  delay,
  retryWhen,
  scan,
  Subscription,
  throwError,
} from 'rxjs';
import { CommonTableGridComponent } from '../../common/common-table-grid/common-table-grid.component';
import { EditCategoryComponent } from '../category/edit-category/edit-category.component';
import { DeleteCategoryComponent } from '../category/action-menu/delete-category/delete-category.component';
import { category } from '../../../interface/common';
import { HttpErrorResponse } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { DeleteProductDialogComponent } from '../product/action-menu/delete-product-dialog/delete-product-dialog.component';
@Component({
  selector: 'app-category-mat',
  standalone: true,
  imports: [CommonTableGridComponent],
  templateUrl: './category-mat.component.html',
  styleUrl: './category-mat.component.css',
})
export class CategoryMatComponent {
  pagination: boolean = true;
  commonSearch;
  searchStringSubscription: Subscription;
  paginatorLength = 5;
  expandableGrid: boolean = true;
  actionBtnAllowed: boolean = true;
  paginationAllowed: boolean = true;
  pagenumber: number;
  pagesize: number;
  sortedcolumn: string;
  sorteddirection: string;
  deleteId: number;
  childTable?;
  childPaginatorLength = 0;
  columnValues:columnFields[]
  childColumnValues:columnFields[]
  deleteDataSubscription: Subscription;
  displayedColumns: string[] = [
    'id',
    'name',
    'createdDate',
    'totalProducts',
    'action',
  ];

  childDisplayColumns: string[] = [
    'id',
    'name',
    'createddate',
    'updatedDate',
    'categoryName',
    'helplineNumber',
    'rating',
    'action',
  ];
  
  constructor(
    private commonservice: CommonService,
    public dialog: MatDialog,
    private commonService: CommonService,
    private componentServices: ComponentService
  ) {}

  // displayedColumns: string[] = ['id', 'name', 'createddate', 'countproducts'];
  // ELEMENT_DATA:category[];
  // @ViewChild(MatSort) sort: MatSort;
  dataSource;
  childdataSource;
  errorMessage = 'no data found';
  // // @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    // this.getContact()
    this.commonService.updatePage('Category Mat');
    this.searchStringSubscription = this.commonService.searchstring$.subscribe(
      (value: number | string) => {
        this.commonSearch = value;
        this.getCategory();
      }
    );

    this.deleteDataSubscription= this.commonService.deleteData$.subscribe((Res : Boolean)=>{
      if(Res){
        this.deleteCategory()
      }
    });
  }

  deleteCategory(){
    this.componentServices.delete<string>(APIURL.deleteCategory,this.deleteId).subscribe(
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
  
  ngOnDestroy() {
    this.searchStringSubscription.unsubscribe();
    this.deleteDataSubscription.unsubscribe();
  }

  // announceSortChange(sortState: Sort) {
  //   if (sortState.direction) {
  //     console.log("in")
  //     this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
  //   } else {
  //     this._liveAnnouncer.announce('Sorting cleared');
  //   }
  // }

  openDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ): void {
    this.dialog.open(NewCategoryComponent, {
      width: '500px',
      height: '300px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

  sendChildTable(categoryData) {
    if (categoryData) this.getProduct(categoryData.id);
    else this.childTable = null;
  }

  paginationChanged(event) {
    console.log(event);
    this.pagenumber = event[0];
    this.pagesize = event[1];
    this.getCategory();
  }

  orderChanged(event) {
    this.sortedcolumn = event[0];
    this.sorteddirection = event[1];
    console.log(event);
    this.getCategory();
  }

  onEditButtonClick(data): void {
    // console.log(this.params.data)
    console.log("hey")
    console.log(data)
    this.commonservice.updateCategory(data);
    this.openEditDialog('0ms', '0ms');
    // Access row data via this.params.data
    console.log('Row Data:', data);
    // Or access specific field value
    // console.log('Specific Value:', this.params.data.fieldName);
  }

  deletePopUp(data) {
    this.deleteId = data.id;
    this.commonservice.updateCategory(data);
    this.commonService.updateDeleteTagLine(
      'once you delete category,this category no longer available'
    );
    this.commonService.updateDeleteTitle('Delete Category?');
    this.openDeleteDialog('0', '0');
  }

  openDeleteDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ): void {
    this.dialog.open(DeleteCategoryComponent, {
      width: '500px',
      height: '300px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

  openEditDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ): void {
    this.dialog.open(EditCategoryComponent, {
      width: '500px',
      height: '500px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

  getProduct(categoryId) {
    this.componentServices
      .get<string>(APIURL.getProductByCategoryId, null, null, categoryId)
      .pipe(
        retryWhen((arr) =>
          arr.pipe(
            scan((retryCount) => {
              // retryCount = retryCount + 1;
              // console.log(retryCount)
            }, 0)
          )
        )
      )
      .pipe(
        catchError((err) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status == 401) {
              this.errorMessage = 'You Are Not Authorized To Do This Action';
            } else {
              console.error('http error', err);
            }
          }
          return throwError(() => err);
        })
      )
      .subscribe((result: genericResponeDemo<product[]>) => {
        if (result.code == 106) {
          this.errorMessage = 'You Are Not Authorized To Do This Action';
        } else {
          // result.responseData.map((products:any)=>{
          //   products.image = this.blobToFile(products.image,products.imagename)
          // }
          // )
          // this.paginatorLength = result.dataCount
          this.childPaginatorLength = result.responseData.length ? 1 : 0;
          this.childColumnValues=result.columnCredits;
          console.log(result)
          this.childTable = new MatTableDataSource(result.responseData);
        }
      });
  }

  getCategory() {
    this.componentServices
      .get<string>(
        APIURL.getCategory,
        null,
        null,
        null,
        null,
        this.commonSearch,
        this.sortedcolumn,
        this.sorteddirection,
        this.pagenumber,
        this.pagesize
      )
      .pipe(
        retryWhen((arr) =>
          arr.pipe(
            delay(10000),
            scan((retryCount) => {
              // retryCount = retryCount + 1;
              // console.log(retryCount)
            }, 0)
          )
        )
      )
      .pipe(
        catchError((err) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status == 401) {
              this.errorMessage = 'You Are Not Authorized To Do This Action';
            } else {
              console.error('http error', err);
            }
          }
          return throwError(() => err);
        })
      )
      .subscribe((result: genericResponeDemo<category[]>) => {
        if (result.code == 106) {
          this.errorMessage = 'You Are Not Authorized To Do This Action';
        } else {
          // result.responseData.map((products:any)=>{
          //   products.image = this.blobToFile(products.image,products.imagename)
          // }
          // )
          this.paginatorLength = result.dataCount;
          this.columnValues=result.columnCredits
          this.dataSource = new MatTableDataSource(result.responseData);
        }
      });
  }
}
