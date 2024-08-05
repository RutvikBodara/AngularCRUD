import { Component } from '@angular/core';
import { PaymentPageComponent } from '../../payment/payment-page/payment-page.component';
import { CommonService } from '../../../services/common.service';
@Component({
  selector: 'app-best-practices',
  standalone: true,
  imports: [PaymentPageComponent],
  templateUrl: './best-practices.component.html',
  styleUrl: './best-practices.component.css',
})
export class BestPracticesComponent {
  constructor(private commonService :CommonService){}
  ngOnInit() {
    this.commonService.updatePage('Blog');
  }
}
