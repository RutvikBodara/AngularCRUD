import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { product } from '../interface/result';
import { Router } from '@angular/router';
import { category } from '../interface/common';
import Swal from 'sweetalert2';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  private searchValue: BehaviorSubject<string | number> = new BehaviorSubject<
    string | number
  >(null);
  searchstring$ = this.searchValue.asObservable();

  // private searchValue:AsyncSubject<string|number> = new AsyncSubject<string|number>();
  // searchstring$ = this.searchValue.asObservable()
  //subject example
  // private demoSubject : Subject<string> = new Subject();
  //replay subject

  private currentPage: BehaviorSubject<string> = new BehaviorSubject<string>(
    'DashBoard'
  );
  currentPage$ = this.currentPage.asObservable();

  private backgroundColor: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(true);
  backgroundColor$ = this.backgroundColor.asObservable();

  private serchContactType: BehaviorSubject<string> =
    new BehaviorSubject<string>(null);
  searchContactType$ = this.serchContactType.asObservable();

  private productDetails: BehaviorSubject<product> =
    new BehaviorSubject<product>(null);
  product$ = this.productDetails.asObservable();

  private categoryDetails: BehaviorSubject<category> =
    new BehaviorSubject<category>(null);
  categoryDetails$ = this.categoryDetails.asObservable();

  private loaderVisibility: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  private isSessionActive: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  isSessionActive$ = this.isSessionActive.asObservable();

  loaderVisibility$ = this.loaderVisibility.asObservable();

  private deleteTagLine: BehaviorSubject<string> = new BehaviorSubject<string>(
    'no data to delete'
  );
  deleteTagLine$ = this.deleteTagLine.asObservable();

  private deleteTitle: BehaviorSubject<string> = new BehaviorSubject<string>(
    'delete title'
  );

  deleteTitle$ = this.deleteTitle.asObservable();

  private deleteData: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  deleteData$ = this.deleteData.asObservable();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {
    // const localStorage = document.defaultView?.localStorage;
  }

  LoaderVisibilityUpdate(visible: boolean) {
    this.loaderVisibility.next(visible);
  }
  backgroundColorChange(value: boolean) {
    this.backgroundColor.next(value);
  }
  updatesearch(value: number | string) {
    this.searchValue.next(value);
  }
  deleteDataChange(value: boolean) {
    this.deleteData.next(value);
  }
  unSubscribeProduct() {
    this.searchValue.unsubscribe();
  }
  updatePage(value: string) {
    this.currentPage.next(value);
  }
  updateSearchContactList(value: string) {
    this.serchContactType.next(value);
  }
  updateProductDetails(prod: product) {
    this.productDetails.next(prod);
  }
  updateCategory(cat: category) {
    this.categoryDetails.next(cat);
  }
  showSnackBar(value: string, defaultclass = 'success') {
    this._snackBar.open(value, 'close', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }
  setLocal(value: string, name: string): void {
    const expirationTime = new Date().getTime() + 360000 * 2;
    const item = {
      value: value,
      expirationTime: expirationTime,
    };
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(name, JSON.stringify(item));
    }
  }
  getLocal(name: string) {
    // if (isPlatformBrowser(this.platformId))
    // if (isPlatformBrowser(this.platformId)) {
    return localStorage.getItem(name);
    // }
    return null;
    // else return null;
  }
  removeLocal(name: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(name);
      return true;
    }
    return false;
  }

  navigateOnSamePage() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  showAlert(title: string, text: string, icon: any) {
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      confirmButtonText: 'OK',
      timer: 10000,
    });
  }
  updateDeleteTagLine(value: string) {
    this.deleteTagLine.next(value);
  }
  updateDeleteTitle(value: string) {
    this.deleteTitle.next(value);
  }

  login(): void {}

  logout(): void {
    // this.removeLocal('jwt');
    // this.removeLocal('userName');
    // this.removeLocal('email');
    localStorage.clear();
    //remove alll local values
  }

  isUserLoggedIn() {
    const itemStr: string = this.getLocal('jwt');
    // console.log(itemStr)

    // if(itemStr == null){
    //   console.log("i am null")
    //   return false;
    // }
    // return true;
    if (itemStr == null) {
      return false; // Item does not exist
    }
    try {
      const item = JSON.parse(itemStr);
      const currentTime = new Date().getTime();
      if (currentTime > item.expirationTime) {
        this.removeLocal('jwt');
        return false;
      }
      return true;
    } catch (e) {
      console.error('Error parsing localStorage item', e);
      return false;
    }
  }
}
