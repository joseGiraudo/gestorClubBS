import { Component, inject, OnInit } from '@angular/core';
import { Payment } from '../../../models/payment';
import { PaymentService } from '../../../services/payment.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-payment-list',
  imports: [DatePipe],
  templateUrl: './payment-list.component.html',
  styleUrl: './payment-list.component.css'
})
export class PaymentListComponent implements OnInit {

  paymentsArray: Payment[] = [];

  private paymentService = inject(PaymentService);

  ngOnInit() {
    this.paymentService.getPayments().subscribe((response) => {
      console.log(response);
      this.paymentsArray = response
    })
  }
}
