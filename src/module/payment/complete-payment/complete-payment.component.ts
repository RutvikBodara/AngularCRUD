import { Component } from '@angular/core';
import { PaymentService } from '../../../services/payment.service';
import { interval, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CommonService } from '../../../services/common.service';


@Component({
  selector: 'app-complete-payment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './complete-payment.component.html',
  styleUrl: './complete-payment.component.css'
})
export class CompletePaymentComponent {
  transactionIdValue="";
  transIdSubscribe :Subscription;
  redirectionSubscription :Subscription;
  redirectionTime = 30;
  seconds:number = 30;
  timeOut:boolean=false;
  constructor(private payment:PaymentService,private router:Router,private commonService :CommonService){}
  ngOnInit(){ 
    this.commonService.updatePage('Payment Status');
    this.transIdSubscribe = this.payment.transactionId$.subscribe((res)=>{
      console.log(res)
      this.transactionIdValue = res
    })    
  
    let redirection  = interval(1000);
    this.redirectionSubscription =  redirection.subscribe((res)=>{
      if(res > 30){
        this.router.navigate([''])
      }
      else if(res>20){
        this.timeOut=true
      }
      this.seconds = this.redirectionTime - res
    })
  }

  ngOnDestroy(){
    this.redirectionSubscription.unsubscribe()
    this.transIdSubscribe.unsubscribe()
  }
}
