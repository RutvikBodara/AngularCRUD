import { Component } from "@angular/core"; 
import { AgGridAngular } from "ag-grid-angular";
import {ColDef} from "ag-grid-community"

import { CommonService } from "../../../services/common.service";
import { MatDialog } from "@angular/material/dialog";
import { ComponentService } from "../../../services/component.service";
import { APIURL } from "../../../environment/redirection";
import { result } from "../../../interface/result";
import { NewCategoryComponent } from "../new-category/new-category.component";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css'
import 'ag-grid-enterprise'
import { ActionMenuComponent } from "./action-menu/action-menu.component";
import { Subscription } from "rxjs";
@Component({
  selector: 'app-category',
  standalone: true,
  imports: [AgGridAngular],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent {
  pagination:boolean=true;
  commonSearch;
  searchStringSubscription :Subscription;
  paginationPageSize:number= 10;
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
      // rowGroup:true
    },
    {field:'name'},
    {field: 'createdDate',
      flex:2,
      enableRowGroup:true
    },
    {
      field: 'totalProducts',
      filter:false,
      valueFormatter:x=> x.value + " items",
      cellClassRules:{
        "green-cell": x=> x.value > 0
      }
    },
    {
      headerName:'Action',
      cellRenderer:ActionMenuComponent,
      sortable:false
    }
  ]
  constructor( public dialog: MatDialog, private commonService :CommonService,private componentServices:ComponentService){}

  // displayedColumns: string[] = ['id', 'name', 'createddate', 'countproducts'];
  // ELEMENT_DATA:category[];
  // @ViewChild(MatSort) sort: MatSort;
    dataSource;
    errorMessage="no data found"
  // // @ViewChild(MatPaginator) paginator: MatPaginator;
  
  ngOnInit(){
    // this.getContact()
    this.commonService.updatePage("Category")
    this.searchStringSubscription = this.commonService.searchstring$.subscribe((value:number|string)=>{
        this.commonSearch = value
      this.getCategory()
    });
  }
  ngOnDestroy(){
    this.searchStringSubscription.unsubscribe();
  }
  // announceSortChange(sortState: Sort) {
  //   if (sortState.direction) {
  //     console.log("in")
  //     this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
  //   } else {
  //     this._liveAnnouncer.announce('Sorting cleared');
  //   }
  // }
  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(NewCategoryComponent, {
      width: '500px',
      height:'300px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }


  getCategory(){
    this.componentServices.get<string>(APIURL.getCategory,null,null,null,null,this.commonSearch).subscribe(
      (result:result<string>)=>{
        if(result.code == 106){
          this.errorMessage ="You Are Not Authorized To Do This Action"
        }
        else{
          console.log(result);
          this.dataSource =result.responseData
        }
      },
      (error)=>{
        console.log(error)
      }
    )
  }
}
