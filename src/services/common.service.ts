import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { product } from '../interface/result';
import { Router } from '@angular/router';
import { category } from '../interface/common';
import Swal from 'sweetalert2';
import { isPlatformBrowser } from '@angular/common';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

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

  private clearSelection :BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  clearSelection$ = this.clearSelection.asObservable();


  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {
    // const localStorage = document.defaultView?.localStorage;
  }

  clearSelectionUpdate(value:boolean){
    this.clearSelection.next(value);
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
    //around 1 hour 
    const expirationTime = new Date().getTime() + 1000000*4;
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

  downloadExcelBase64(base64Data) {
    // Step 1: Decode the Base64 string
    const binaryString = atob(base64Data);
    const binaryLen = binaryString.length;
    const bytes = new Uint8Array(binaryLen);

    for (let i = 0; i < binaryLen; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Step 2: Create a Blob from the binary data
    const blob = new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    // Step 3: Create a download link and trigger the download
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'your_file_name.xlsx'; // Change to your desired file name
    link.click();

    // Optionally, revoke the object URL after download
    window.URL.revokeObjectURL(link.href);
  }

  generateExcel(data: any[]): string {
    // Create a new workbook
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Generate Excel file as base64 string
    const wbout: string = XLSX.write(wb, { bookType: 'xlsx', type: 'base64' });
    return wbout;
  }

  downloadExcel(base64String: string, fileName: string): void {
    const binary = atob(base64String);
    const arrayBuffer = new ArrayBuffer(binary.length);
    const view = new Uint8Array(arrayBuffer);
    for (let i = 0; i < binary.length; i++) {
      view[i] = binary.charCodeAt(i);
    }
    //base6
    const blob = new Blob([arrayBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `${fileName}.xlsx`);
  }

  downloadPdf(base64String:string,fileName:string):void{
    const linkSource = `data:application/pdf;base64,${base64String}`;
    const downloadLink = document.createElement("a");
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }
}
