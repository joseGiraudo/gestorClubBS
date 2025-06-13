import { Component, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaymentService } from '../../../services/payment.service';
import { Payment, PaymentDto, translatePaymentMethod } from '../../../models/payment';
import { CommonModule } from '@angular/common';
import { translateMemberStatus } from '../../../models/member';

@Component({
  selector: 'app-payment-detail',
  imports: [CommonModule],
  templateUrl: './payment-detail.component.html',
  styleUrl: './payment-detail.component.css'
})
export class PaymentDetailComponent {

  @Input() selectedPayment: PaymentDto | null = null;

  translatePaymentStatus = translateMemberStatus
  translatePaymentMethod = translatePaymentMethod


}
