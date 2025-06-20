import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-payment-success',
  imports: [],
  templateUrl: './payment-success.component.html',
  styleUrl: './payment-success.component.css'
})
export class PaymentSuccessComponent implements OnInit {
  paymentId: string | null = null;
  status: string | null = null;
  externalReference: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.paymentId = this.route.snapshot.queryParamMap.get('payment_id');
    this.status = this.route.snapshot.queryParamMap.get('status');
    this.externalReference = this.route.snapshot.queryParamMap.get('external_reference');
  }
}