
// MEMBERS REPORT
export interface MemberReportDto {
    totalMembers: number;
    byAgeGroup: { [range: string]: number };
    newThisMonth: number;
}

export interface MonthlyCountDto {
    month: string;
    count: number;
}

export interface SportCountDto {
    sport: string;
    count: number;
}


// PAYMENTS REPORT

export interface FullPaymentReportDto {
    monthlyTotals: MonthlyPaymentDto[];
    statusSummary: PaymentStatusSummaryDto[];
    methodSummary: PaymentMethodSummaryDto[];
    collectionRate: CollectionRateDto;
}


export interface MonthlyPaymentDto {
    month: string;
    year: number;
    totalIssued: number;
    totalPaid: number;
}

export interface PaymentStatusSummaryDto {
    status: string;
    count: number;
}

export interface PaymentMethodSummaryDto {
    method: string;
    count: number;
}

export interface CollectionRateDto {
    totalIssued: number;
    totalPaid: number;
    percentage: number;
}

export interface FeeCollectionReport {
  feeId: number;
  feeLabel: string;
  issuedCount: number;
  paidCount: number;
  totalCollected: number;
  expectedTotal: number;
  collectionRate: number; // porcentaje
  statusSummary: PaymentStatusSummaryDto[];
  methodSummary: PaymentMethodSummaryDto[];
}