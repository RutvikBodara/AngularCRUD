import { Injectable } from '@angular/core';
import { equal } from 'assert';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  MatSnackBar,
} from '@angular/material/snack-bar';
import { ThisReceiver } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class CommonService{
  private searchValue:BehaviorSubject<string | number> = new BehaviorSubject<string |number>(null);
  searchstring$ = this.searchValue.asObservable()

  private currentPage:BehaviorSubject<string> = new BehaviorSubject<string>('DashBoard');
  currentPage$ = this.currentPage.asObservable()

  private serchContactType :BehaviorSubject<string> = new BehaviorSubject<string>(null);
  searchContactType$ = this.serchContactType.asObservable()

  constructor(private _snackBar:MatSnackBar) { }
  updatesearch(value: number |string){
      this.searchValue.next(value)
  }
  updatePage(value:string){
    this.currentPage.next(value);
  }
  updateSearchContactList(value : string){
    this.serchContactType.next(value)
  }

  showSnackBar(value :string){
    this._snackBar.open(value,"close",{duration:3000})
  }
}
