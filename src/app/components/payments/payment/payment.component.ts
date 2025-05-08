import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaymentService } from '../../../services/payment.service';
import { Payment } from '../../../models/payment';

@Component({
  selector: 'app-payment',
  imports: [ ReactiveFormsModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit {

  form!: FormGroup;

  payment: Payment | null = null;

  private paymentService = inject(PaymentService)

  constructor(
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      paymentCode: ['', [Validators.required]],
    });
  }

  searchPayment() {
    const code = this.form.get('paymentCode')?.value;
    this.paymentService.getPaymentById(code).subscribe({
      next: (data) => {
        this.payment = data;
        console.log(data);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }


}
