import {LiveAnnouncer} from '@angular/cdk/a11y';
import {AfterViewInit, Component, EventEmitter, Input, input, Output, ViewChild} from '@angular/core';
import {MatSort, Sort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import { delay, retryWhen, scan, Subscription } from 'rxjs';
import { ComponentService } from '../../../services/component.service';
import { APIURL } from '../../../environment/redirection';
import { CommonService } from '../../../services/common.service';
import { genericResponeDemo, product, result } from '../../../interface/result';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-common-table-grid',
  standalone: true,
  imports: [CommonModule,MatTableModule, MatSortModule,MatPaginatorModule,DatePipe,CommonTableGridComponent],
  templateUrl: './common-table-grid.component.html',
  styleUrl: './common-table-grid.component.css'
})
export class CommonTableGridComponent {

  commonSearch=null;
  errorMessage:String = "No Data Found";
  searchStringSubscription:Subscription;
  getProductSubscription : Subscription;
  // displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  
  @Input()
  displayedColumns : string[];
  
  @Input()
  data;
  
  @Input()
  paginatorLength = 5;

  pageNumber;

  retryCount:number =1;

  pagenumber:number;
  @Input()
  pagesize:number;
  sortedcolumn:string;
  sorteddirection:string;

  @Output()
  paginationChanged :EventEmitter<number[]> = new EventEmitter<number[]>()

  @Output()
  orderChanged :EventEmitter<string[]> = new EventEmitter<string[]>()


  constructor(private _liveAnnouncer: LiveAnnouncer,private componentServices :ComponentService,private commonService : CommonService) {}

  @ViewChild(MatSort) sort: MatSort;
  
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(){
    this.data =this.data;
    // this.paginator.length =this.paginatorLength;
  }
  
  ngAfterViewInit() {
    this.paginator.page.subscribe((event: PageEvent) => {
      console.log('Page Index:', event.pageIndex);
      this.pagenumber=event.pageIndex+1;
      this.pagesize =event.pageSize
      this.paginationChanged.emit([this.pagenumber,this.pagesize])
    });
    // this.dataSource.paginator = this.paginator;
    // this.data.sort = this.sort;
  }

  // int? pagenumber, int? pagesize, string? sortedcolumn, string? sorteddirection
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      console.log(sortState.direction)
      this.sortedcolumn = sortState.active;
      this.sorteddirection =sortState.direction
      this.orderChanged.emit([this.sortedcolumn,this.sorteddirection])
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this.sortedcolumn = null;
      this.sorteddirection =null;
      this.orderChanged.emit([this.sortedcolumn,this.sorteddirection])
      console.log(this.sortedcolumn +" " +this.sorteddirection )
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  // onPageChange(): void {
  //   const pageIndex = this.paginator.pageIndex;
  //   const pageSize = this.paginator.pageSize;
  //   console.log(`Page index: ${pageIndex}`);
  //   console.log(`Page size: ${pageSize}`);
    
  //   // Fetch new data or update data source based on page index and size
  //   // e.g., this.fetchData(pageIndex, pageSize);
  // }

  isDateColumn(column: string): boolean {
    // Define your logic to identify date columns
    // For example, you might have a list of date columns
    const dateColumns = ['updatedDate', 'createddate']; // Adjust based on your data
    return dateColumns.includes(column);
  }
  
  convertToMatTableDataSource(data){
    console.log(data)
  }
}
