import { Injectable } from '@angular/core';
import { AsyncSubject, BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor() { }

  private transactionId:BehaviorSubject<string> = new BehaviorSubject<string>(null);
  transactionId$ = this.transactionId.asObservable()
  
  updatetransactionId(value:string){
    this.transactionId.next(value)
  }
}
