import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-payment-failure',
  imports: [],
  templateUrl: './payment-failure.component.html',
  styleUrl: './payment-failure.component.css'
})
export class PaymentFailureComponent implements OnInit {
  status: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.status = this.route.snapshot.queryParamMap.get('status');
  }

  translateStatus(status: string | null) {
    switch(status) {
      case 'approved':
        return 'Aprobado';
      case 'failure':
        return 'Fallado';
      case 'pending':
        return 'Pendiente'
      default:
        return status;
    }
  }
}