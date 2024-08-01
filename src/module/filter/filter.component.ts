import { Component, ElementRef, EventEmitter, Input, output, Output, ViewChild, viewChild } from '@angular/core';
import {MatIconModule} from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button';
import {MatDrawer, MatSidenavModule} from '@angular/material/sidenav';
import { SidebarComponent } from '../../module/sidebar/sidebar/sidebar.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { CommonService } from '../../services/common.service';
import { ComponentService } from '../../services/component.service';
import { responseData, result } from '../../interface/result';
import { APIURL } from '../../environment/redirection';
import {MatSelectModule} from '@angular/material/select';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { constrainedMemory } from 'process';
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';
import { ValueCache } from 'ag-grid-community';


@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule, MatSelectModule,MatFormFieldModule,MatInputModule,MatIconModule,MatButtonModule,MatDrawer,MatSidenavModule,SidebarComponent],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})
export class FilterComponent {
  contactTypes = new FormControl('');
  currentPage:string;
  contactTypeList:responseData<string>[]
  checkPage:boolean =false;
  checkPageSearch:boolean = false;
  @Output()
  sideBarToggle :EventEmitter<boolean> = new EventEmitter<boolean>(true)
  
  constructor(private commonService :CommonService, private componentService:ComponentService){}
  ngOnInit(){
    this.contactTypes.valueChanges.subscribe(selectedContacts => {
      this.updatedSearchList()
    })
    this.sideBarToggle.emit()

    this.commonService.currentPage$.subscribe((value)=>{
      this.currentPage=value
      if(value == "Products" || value == "Category"){
        this.checkPage =true
      }
      else{
        this.checkPage=false;
      }
      if(value == "Payment Page" || value == "Payment Status"){
        this.checkPage=true;
        this.checkPageSearch=true
      }
      else{
        this.checkPageSearch=false
      }
    })
    
    this.componentService.get<string>(APIURL.getContactType).subscribe(
      (result)=>{
        this.contactTypeList = result.responseData
      }
    )
  }
  
  onClickToggle(){
    this.sideBarToggle.emit()
  }
  @ViewChild('searchInput') searchString :ElementRef;
  
  // @Output()
  // searchValue :EventEmitter<string> = new EventEmitter<string>();

  ngAfterViewInit(){
    fromEvent<any>(this.searchString.nativeElement ,'keyup').pipe(
      map(data => data.target.value),
      //debounce example
      debounceTime(1000),
      //distinct untilchnage
      distinctUntilChanged(),
      //switchmap
    ).subscribe((res)=>{
      
    const searchId = Number(this.searchString.nativeElement.value)
    if(!isNaN(searchId)){
      this.commonService.updatesearch(searchId)
    }
    else{
      this.commonService.updatesearch(this.searchString.nativeElement.value)
    }
    })
  }

  // searched(){
  //   // this.searchValue.emit(this.searchString.nativeElement.value);
  //   const searchId = Number(this.searchString.nativeElement.value)
  //   if(!isNaN(searchId)){
  //     this.commonService.updatesearch(searchId)
  //   }
  //   else{
  //     this.commonService.updatesearch(this.searchString.nativeElement.value)
  //   }
  //   //select search
  // }

  updatedSearchList(){
    // let contactTypeList :number[] = this.contactTypes.value.split(',').map(number)
    this.commonService.updateSearchContactList(this.contactTypes.value)
  }
}