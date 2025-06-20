import { Component, inject, Input, OnInit } from '@angular/core';
import { PaymentDto, translatePaymentMethod, translatePaymentStatus } from '../../../models/payment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment-detail',
  imports: [CommonModule],
  templateUrl: './payment-detail.component.html',
  styleUrl: './payment-detail.component.css'
})
export class PaymentDetailComponent {

  @Input() selectedPayment: PaymentDto | null = null;

  translatePaymentStatus = translatePaymentStatus
  translatePaymentMethod = translatePaymentMethod


}
