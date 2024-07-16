import { Component, Input, input } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import { ComponentService } from '../../../services/component.service';
import { responseData, result } from '../../../interface/result';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import {
  MatSnackBar,
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarLabel,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { stringify } from 'querystring';
import { APIURL } from '../../../environment/redirection';
import { CommonService } from '../../../services/common.service';
@Component({
  selector: 'app-contactlist',
  standalone: true,
  imports: [MatTableModule,MatMenuModule,MatIconModule,CommonModule,FormsModule,MatButtonModule,MatDividerModule],
  templateUrl: './contactlist.component.html',
  styleUrl: './contactlist.component.css'
})
export class ContactlistComponent {

  constructor(private commonService :CommonService,private componentServices:ComponentService,private _snackBar: MatSnackBar){}
  @Input()
  dataSource :responseData<string>[];
  editedRowIndex: number = -1;
  editedRow:responseData<string>;
  contactList:string=""
  dataSourceCount:number=-1;
  name:string ="";
  surname:string="";
  id:number=undefined;
  ngOnInit(){
    // this.getContact()
    this.commonService.updatePage("Dashboard")
    this.commonService.searchstring$.subscribe((value:number|string)=>{
      if(typeof value === 'number'){
        if(value !== 0){
          this.id=value
        }
        else{
          //default
          this.id=undefined
          this.name=""
        }
      }
      else{
        this.name =value
      }
      this.getContact()
    });
    this.commonService.searchContactType$.subscribe((value:string)=>{
      this.contactList=value
      this.getContact()
    })
  }
  displayedColumns: string[] = ['Id', 'Name', 'Surname', 'Action'];
  // onRowClick(row:result<string>){
  //   console.log(row)
  // }
 
  getContact(){
    this.componentServices.get<string>(APIURL.getContact,this.name,this.surname,this.id,this.contactList).subscribe(
      (result:result<string>)=>{
         this.dataSource =result.responseData
         this.dataSourceCount =result.responseData.length
         console.log(this.dataSourceCount)
      },
      (error)=>{
        console.log(error)
      }
    )
  }

  startEdit(row: responseData<string>, index: number) {
    console.log(index)
    this.editedRowIndex = index;
    this.editedRow = row;
  }

  cancelEdit() {
    this.editedRowIndex = -1;
  }

  editContact(row:responseData<string>) {
    this.componentServices.update(row,APIURL.editContact).subscribe(
      (result:result<string>)=>{
        if(result.code === 102 ){
          this._snackBar.open("invalid data","CLOSE")
        }
        else{
          this.getContact()
          this._snackBar.open("Updated record successfully","CLOSE")
          this.cancelEdit();
        }
      },
      (error)=>{
        console.log("something went wrong")
      }
    )
  }

  deleteContact(id:number) {
    this.componentServices.delete<string>(id,APIURL.deleteContact).subscribe(
      ()=>{
        this.getContact()
        this._snackBar.open("deleted record successfully","CLOSE")
      },
      (error)=>{
        console.log("something went wrong")
      }
    )
  }
}
