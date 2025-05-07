import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaymentService } from '../../../services/payment.service';

@Component({
  selector: 'app-payment',
  imports: [ ReactiveFormsModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit {

  form!: FormGroup;

  fee: any | null = null;

  private paymentService = inject(PaymentService)

  constructor(
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      feeCode: ['', [Validators.required]],
    });
  }

  searchFee() {
    const code = this.form.get('feeCode')?.value;
    this.paymentService.getFee(code).subscribe({
      next: (data) => {
        this.fee = data;
        console.log(data);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  pagarCuota() {
    
  }


}
