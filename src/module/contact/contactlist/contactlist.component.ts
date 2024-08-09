import { Component, Input, input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { ComponentService } from '../../../services/component.service';
import {
  genericResponeDemo,
  responseData,
  result,
} from '../../../interface/result';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
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
// import {CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray} from '@angular/cdk/drag-drop';
import {
  DragDropModule,
  CdkDragDrop,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { combineLatest, map, shareReplay, Subscription } from 'rxjs';
import { SortController } from 'ag-grid-community';
import { CommonTableGridComponent } from '../../common/common-table-grid/common-table-grid.component';
import { contact } from '../../../environment/commonValues';

@Component({
  selector: 'app-contactlist',
  standalone: true,
  imports: [
    CommonTableGridComponent,
    DragDropModule,
    MatTableModule,
    MatMenuModule,
    MatIconModule,
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatDividerModule,
  ],
  templateUrl: './contactlist.component.html',
  styleUrl: './contactlist.component.css',
})
export class ContactlistComponent {
  constructor(
    private commonService: CommonService,
    private componentServices: ComponentService,
    private _snackBar: MatSnackBar
  ) {}
  @Input()
  dataSource: responseData<string>[];
  editedRowIndex: number = -1;
  editedRow: responseData<string>;
  contactList: string = '';
  dataSourceCount: number = -1;
  name: string = '';
  surname: string = '';
  id: number = undefined;
  errorMessage: String = 'No Data Found';
  pagenumber: number;
  pagesize: number;
  sortedcolumn: string;
  sorteddirection: string;
  searchStringSubscription;
  searchTypeSubscription;
  combineLatestSubscription: Subscription;

  ngOnInit() {
    // this.getContact()
    this.commonService.updatePage('Dashboard');

    this.searchStringSubscription = this.commonService.searchstring$.pipe(
      (data) => data
    );
    this.searchTypeSubscription = this.commonService.searchContactType$.pipe(
      map((data) => data)
    );

    this.combineLatestSubscription = combineLatest(
      this.searchStringSubscription,
      this.searchTypeSubscription
    ).subscribe(
      (value) => {
        if (typeof value[0] === 'number') {
          if (value[0] !== 0) {
            this.id = value[0];
          } else {
            //default
            this.id = undefined;
            this.name = '';
          }
        } else {
          this.name = value[0];
        }
        this.contactList = value[1];
        console.log('hittedd');
        this.getContact();
      },
      (error) => {
        this.commonService.showSnackBar(error);
      },
      () => {
        console.log('completed');
      }
    );
  }

  // filterContact() {
  //   if (this.getContacts) {
  //     console.log('All contacts:', this.getContacts);
  //     // const surnameValue = this.surname.toLowerCase();
  //     console.log(this.contactList)
  //     // console.log(nameValue +" " + surnameValue + " " + idValue)
  //     this.dataSource = this.getContacts.responseData.filter(x => {
  //       const matchesName = !this.name || x.name.toLowerCase().includes(this.name.toLowerCase());
  //       const matchesSurname = !this.name || x.surname.toLowerCase().includes(this.name.toLowerCase());
  //       const matchesId = !this.id || x.id === this.id;
  //       return ( (matchesName || matchesSurname) && matchesId);
  //     });

  //     this.dataSourceCount = this.dataSource.length;
  //   } else {
  //     console.log('No contacts to filter.');
  //   }
  // }
  displayedColumns: string[] = ['id', 'name', 'surname', 'action'];
  // onRowClick(row:result<string>){
  //   console.log(row)
  // // }
  // drop(event: CdkDragDrop<any[]>) {
  //   // const previousIndex = this.dataSource.findIndex((d) => d === event.item.data);
  //   moveItemInArray(this.dataSource, event.previousIndex, event.currentIndex);
  // }

  paginationChanged(event) {
    console.log(event);
    this.pagenumber = event[0];
    this.pagesize = event[1];
    this.getContact();
  }
  orderChanged(event) {
    this.sortedcolumn = event[0];
    this.sorteddirection = event[1];
    console.log(event);
    this.getContact();
  }

  // commonsearch?,
  // sortcolumn?,
  // sortdirection?,
  // pageNumber?,
  // pageSize?
  getContact() {
    this.componentServices
      .get<string>(
        APIURL.getContact,
        this.name,
        this.surname,
        this.id,
        this.contactList,
        null,
        this.sortedcolumn,
        this.sorteddirection,
        this.pagenumber,
        this.pagesize
      )
      .pipe(shareReplay(1))
      .subscribe(
        (result: genericResponeDemo<contact[]>) => {
          if (result.code == 106) {
            this.errorMessage = 'You Are Not Authorized To Do This Action';
            this.dataSourceCount = 0;
          } else {
            console.log('this');
            console.log(result);
            this.dataSource = result.responseData;
            this.dataSourceCount = result.dataCount;
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }

  startEdit(row: responseData<string>, index: number) {
    console.log(index);
    this.editedRowIndex = index;
    this.editedRow = row;
  }

  cancelEdit() {
    this.editedRowIndex = -1;
  }

  editContact(row: responseData<string>) {
    this.componentServices.update(row, APIURL.editContact).subscribe(
      (result: result<string>) => {
        if (result.code === 102) {
          this.commonService.showSnackBar(result.message);
        } else if (result.code == 106) {
          this.errorMessage = 'You Are Not Authorized To Do This Action';
        } else if (result.code == 107) {
          this.commonService.showSnackBar('this contact have already exists');
        } else {
          this.getContact();
          this.commonService.showSnackBar('Updated record successfully');
          this.cancelEdit();
        }
      },
      (error) => {
        console.log('something went wrong');
      }
    );
  }

  deleteContact(id: number) {
    //show popup

    this.componentServices.delete<string>(id, APIURL.deleteContact).subscribe(
      (result) => {
        if (result.code == 106) {
          this.commonService.showSnackBar(result.message);
        } else {
          this.getContact();
          this.commonService.showSnackBar('deleted record successfully');
        }
      },
      (error) => {
        console.log('something went wrong');
      }
    );
  }
}
