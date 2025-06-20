import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-payment-pending',
  imports: [],
  templateUrl: './payment-pending.component.html',
  styleUrl: './payment-pending.component.css'
})
export class PaymentPendingComponent implements OnInit {
  status: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.status = this.route.snapshot.queryParamMap.get('status');
  }
}