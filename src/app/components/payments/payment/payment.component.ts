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
  loading: boolean = false;


  private paymentService = inject(PaymentService)

  constructor(
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      memberDni: ['', [Validators.required]],
    });
  }

  searchPayment() {
    const code = this.form.get('memberDni')?.value;

    console.log("code: ", code)

    this.searched = true;
    this.loading = true;
    this.paymentService.getPaymentsByMember(code).subscribe({
      next: (data) => {
        this.payments = data;
        if(this.payments.length > 0) {
          this.member = this.payments[0].member;
        }
        this.loading = false;
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      }
    });
  }


}
