import {LiveAnnouncer} from '@angular/cdk/a11y';
import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatSort, Sort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import { delay, retryWhen, scan, Subscription } from 'rxjs';
import { ComponentService } from '../../../services/component.service';
import { APIURL } from '../../../environment/redirection';
import { CommonService } from '../../../services/common.service';
import { genericResponeDemo, product, result } from '../../../interface/result';
import { DatePipe } from '@angular/common';
import { CommonTableGridComponent } from '../../common/common-table-grid/common-table-grid.component';

@Component({
  selector: 'app-product-mat',
  standalone: true,
  imports: [MatTableModule, MatSortModule,MatPaginatorModule,DatePipe,CommonTableGridComponent],
  templateUrl: './product-mat.component.html',
  styleUrl: './product-mat.component.css'
})

export class ProductMatComponent {

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

  constructor(private _liveAnnouncer: LiveAnnouncer,private componentServices :ComponentService,private commonService : CommonService) {}

  // @ViewChild(MatSort) sort: MatSort;
  
  // @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(){
    this.commonService.updatePage("Products Grid")
    this.searchStringSubscription = this.commonService.searchstring$.subscribe((value:number|string)=>{
        this.commonSearch =value
        this.getProduct()
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
    this.getProductSubscription = this.componentServices.get<string>(APIURL.getProduct,null,null,null,null,this.commonSearch,this.sortedcolumn,this.sorteddirection,this.pagenumber,this.pagesize).pipe(retryWhen(arr => arr.pipe(delay(10000), scan((retryCount) =>{
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
    },0)))).subscribe(
      (result:genericResponeDemo<product[]>)=>{
        if(result.code == 106){
          this.errorMessage ="You Are Not Authorized To Do This Action"
        }
        else{
         
          // result.responseData.map((products:any)=>{
          //   products.image = this.blobToFile(products.image,products.imagename)
          // }
          // )
          this.convertToMatTableDataSource(result)
          this.paginatorLength = result.dataCount
          console.log(result.responseData)
          this.dataSource =new MatTableDataSource(result.responseData);
        }
      },
      (error)=>{
        console.log(error)
      }
    )
  }

  convertToMatTableDataSource(data){
    console.log(data)
  }
}
