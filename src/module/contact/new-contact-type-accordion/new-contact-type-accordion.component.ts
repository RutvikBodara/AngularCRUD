import { Component } from '@angular/core';
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
import { error } from 'console';


@Component({
  selector: 'app-new-contact-type-accordion',
  standalone: true,
  imports: [MatMenuModule,MatExpansionModule,MatIconModule,CommonModule,FormsModule,MatButtonModule],
  templateUrl: './new-contact-type-accordion.component.html',
  styleUrl: './new-contact-type-accordion.component.css'
})
export class NewContactTypeAccordionComponent {
  constructor(private commonService :CommonService,public dialog: MatDialog,private componentServices:ComponentService,private _snackBar: MatSnackBar){}
  dataSource :responseData<string>[];
  editedRowIndex: number = -1;
  editedRow:responseData<string>; 
  name:string ="";
  id:number=undefined;
  contactList:string=""
  currentIndex = 0;
  countrow:number;
  errorMessage:String = "No Data Found";

  ngOnInit(){
    // this.getContactType()
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
    },
    (error)=>{
      this.commonService.showSnackBar(error);
    },
    ()=>{
      console.log("completed")
    }
  
  );

    this.commonService.searchContactType$.subscribe((value:string)=>{
      this.contactList=value
      this.getContactType()
    })

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
    console.log(this.contactList)
    this.componentServices.get<string>(APIURL.getContactType,this.name,null,this.id,this.contactList).subscribe(
      (result)=>{

        if(result.code ==106){
          this.errorMessage = "You Are Not Authorized To Do This Action"
          this.countrow =0;
        }
        else{
          this.commonService.showSnackBar(`${result.message}`)
          this.dataSource =result.responseData
          this.countrow =result.responseData.length
        }
      },
      (error)=>{
        this.commonService.showSnackBar(error)
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
        if(result.code === 102){
          this.commonService.showSnackBar("invalid data")
        }
        else{
          this.getContactType()
          this.commonService.showSnackBar("Updated record successfully")
          this.cancelEdit();
        }
      },
      (error)=>{
        this.commonService.showSnackBar("something went wrong")
      }
    )
  }

  deleteContact(row:responseData<string>){
    if(row.count > 0){
      this.commonService.showSnackBar("this list has a contacts,delete contacts first")
    }
    else{
      this.componentServices.delete<string>(row.id,APIURL.deleteContacttype).subscribe(
        ()=>{
          this.getContactType()
          this.commonService.showSnackBar("deleted record successfully")
        },
        (error)=>{
          this.commonService.showSnackBar("something went wrong")
        }
      )
    }
    
  }
  setStep(index: number) {
    this.currentIndex = index;
  }

  nextStep() {
    this.currentIndex++;
  }

  prevStep() {
    this.currentIndex--;
  }
}
