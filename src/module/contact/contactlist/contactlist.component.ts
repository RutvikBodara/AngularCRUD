import { Component } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import { ComponentService } from '../../../services/component.service';
import { result } from '../../../interface/result';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import {
  MatSnackBar,
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarLabel,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-contactlist',
  standalone: true,
  imports: [MatTableModule,MatMenuModule,MatIconModule,CommonModule,FormsModule],
  templateUrl: './contactlist.component.html',
  styleUrl: './contactlist.component.css'
})
export class ContactlistComponent {

  constructor(private componentServices:ComponentService,private _snackBar: MatSnackBar){}
  dataSource :result<string>[];
  editedRowIndex: number = -1;
  editedRow:result<string>;
  ngOnInit(){
    this.getContact()
  }
  displayedColumns: string[] = ['Id', 'Name', 'Surname', 'Action'];
  // onRowClick(row:result<string>){
  //   console.log(row)
  // }

  getContact(){
    this.componentServices.getContacts<string>().subscribe(
      (result)=>{
        this.dataSource =result
      },
      (error)=>{
        console.log(error)
      }
    )
  }

  startEdit(row: result<string>, index: number) {
    console.log(index)
    this.editedRowIndex = index;
    this.editedRow = row;
  }

  cancelEdit() {
    this.editedRowIndex = -1;
  }

  editContact(row:result<string>) {
    this.componentServices.UpdateContact(row.id,row).subscribe(
      ()=>{
        this.getContact()
        this._snackBar.open("Updated record successfully","CLOSE")
      },
      (error)=>{
        console.log("something went wrong")
      }
    )
  }
  deleteContact(id:number) {
    this.componentServices.deleteContact(id).subscribe(
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
