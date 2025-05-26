import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaymentService } from '../../../services/payment.service';
import { Payment } from '../../../models/payment';
import { Member } from '../../../models/member';

@Component({
  selector: 'app-payment',
  imports: [ ReactiveFormsModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit {

  form!: FormGroup;

  payment: Payment | null = null;

  payments: Payment[] = [];
  member: Member | null = null;
  searched: boolean = false;

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
    /* this.paymentService.getPaymentById(code).subscribe({
      next: (data) => {
        this.payment = data;
        console.log(data);
      },
      error: (err) => {
        console.log(err);
      }
    }); */

    this.searched = true;
    this.paymentService.getPaymentsByMember(code).subscribe({
      next: (data) => {
        this.payments = data;
        if(this.payments.length > 0) {
          this.member = this.payments[0].member;
        }
        console.log(data);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }


}
