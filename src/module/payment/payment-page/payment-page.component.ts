import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { Router } from '@angular/router';
import { PaymentService } from '../../../services/payment.service';

@Component({
  selector: 'app-payment-page',
  standalone: true,
  imports: [],
  templateUrl: './payment-page.component.html',
  styleUrl: './payment-page.component.css',
})

export class PaymentPageComponent {
  amount: number = 100;
  constructor(private payment : PaymentService,private commonService :CommonService,private router:Router){}
  @ViewChild('paymentRef', { static: true }) paymentRef: ElementRef;

  clicked(){
    this.router.navigate(['/contact/paymentcompleted'])
  }
  ngOnInit() {
    this.commonService.updatePage('Payment Page');
    this.payment.updatetransactionId("deXoXXXX12XXXXza")
    window.paypal
      .Buttons({
        style: {
          layout: 'horizontal',
          color: 'gold',
          shape: 'pill',
          label: 'pay',
        },
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value :this.amount.toString(),
                  currency_code :'USD'
                },
              },
            ],
          });
        },
        onApprove:(data:any,actions:any) =>{
          return actions.order.capture().then((result) => {
           if(result.status === 'COMPLETED')
            this.payment.updatetransactionId(result.id)
            this.router.navigate(['/contact/paymentcompleted'])
          }).catch((err) => {
            this.commonService.showSnackBar("Payment Failed!")
          });
        }
      })
      .render(this.paymentRef.nativeElement);
  }
}
