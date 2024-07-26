import { Injectable } from '@angular/core';
import { equal } from 'assert';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  MatSnackBar,
} from '@angular/material/snack-bar';
import { ThisReceiver } from '@angular/compiler';
import { product } from '../interface/result';
import { Router } from '@angular/router';
import { category } from '../interface/common';

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

  private productDetails :BehaviorSubject<product> = new BehaviorSubject<product>(null);
  product$ = this.productDetails.asObservable()
  
  private categoryDetails :BehaviorSubject<category> = new BehaviorSubject<category>(null);
  categoryDetails$ = this.categoryDetails.asObservable()


  constructor(private _snackBar:MatSnackBar,private router:Router) { }
  updatesearch(value: number |string){
      this.searchValue.next(value)
  }
  updatePage(value:string){
    this.currentPage.next(value);
  }
  updateSearchContactList(value : string){
    this.serchContactType.next(value)
  }
  updateProductDetails(prod:product){
    this.productDetails.next(prod)
  }
  updateCategory(cat:category){
    this.categoryDetails.next(cat)
  }

  showSnackBar(value :string){
    this._snackBar.open(value,"close",{duration:3000})
  }
  setLocal(value:string , name :string):void{
    localStorage.setItem(name,value);
  }
  getLocal(name:string):string{
    return localStorage.getItem(name);
  }

  navigateOnSamePage(){
    const currentUrl = this.router.url;
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate([currentUrl]);
            });
  }
}
