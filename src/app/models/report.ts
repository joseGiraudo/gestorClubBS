

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