import { ChangeDetectionStrategy, Component, Inject, input } from '@angular/core';
import { ComponentService } from '../../../services/component.service';
import { responseData, result } from '../../../interface/result';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import {MatTableModule} from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  MatSnackBar,
} from '@angular/material/snack-bar';
import {
  MatDialog,
} from '@angular/material/dialog';
import { APIURL } from '../../../environment/redirection';
import { NewContactTypeComponent } from '../new-contact-type/new-contact-type.component';
import { CommonService } from '../../../services/common.service';
import {MatExpansionModule} from '@angular/material/expansion';

@Component({
  selector: 'app-contact-type',
  standalone: true,
  imports: [MatExpansionModule,MatTableModule,MatMenuModule,MatIconModule,CommonModule,FormsModule,MatButtonModule,MatDividerModule],
  templateUrl: './contact-type.component.html',
  styleUrl: './contact-type.component.css'
})
export class ContactTypeComponent {
  constructor(private commonService :CommonService,public dialog: MatDialog,private componentServices:ComponentService,private _snackBar: MatSnackBar){}
  dataSource :responseData<string>[];
  editedRowIndex: number = -1;
  editedRow:responseData<string>; 
  name:string ="";
  id:number=undefined;
  

  ngOnInit(){
    // this.getContactType()
    console.log("enter in the contact type")
    this.commonService.updatePage("Contact Type")
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
      this.getContactType()
    });
  }
  // ngOnChange(){
  //   this.getContactType()
  // }
  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(NewContactTypeComponent, {
      width: '500',
      height:'500',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }
  displayedColumns: string[] = ['Id', 'Name', 'Count', 'Action'];

  getContactType(){
    this.componentServices.get<string>(APIURL.getContactType,this.name,null,this.id).subscribe(
      (result)=>{
        console.log(result)
        this._snackBar.open(`${result.message}`,"close", {
          duration: 3000
        })
         this.dataSource =result.responseData
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
    this.componentServices.update(row,APIURL.editContactType).subscribe(
      (result:result<string>)=>{
        if(result.code === 102 ){
          this._snackBar.open("invalid data","CLOSE")
        }
        else{
          this.getContactType()
          this._snackBar.open("Updated record successfully","CLOSE")
          this.cancelEdit();
        }
      },
      (error)=>{
        console.log("something went wrong")
      }
    )
  }
  
  deleteContact(row:responseData<string>){
    if(row.count > 0){
      this._snackBar.open("this list has a contacts","CLOSE", {
        duration: 3000
      })
    }
    else{
      this.componentServices.delete<string>(row.id,APIURL.deleteContacttype).subscribe(
        ()=>{
          this.getContactType()
          this._snackBar.open("deleted record successfully","CLOSE", {
            duration: 3000
          })
        },
        (error)=>{
          console.log("something went wrong")
        }
      )
    }
    
  }
  
}
