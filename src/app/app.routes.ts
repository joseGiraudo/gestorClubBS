import { Routes } from '@angular/router';
import { HomeComponent } from './components/core/home/home.component';
import { MemberFormComponent } from './components/members/member-form/member-form.component';
import { NewsCardComponent } from './components/news/news-card/news-card.component';
import { authGuard, rolesGuard } from './guards/auth.guard';
import { NewsListComponent } from './components/news/news-list/news-list.component';
import { MemberListComponent } from './components/members/member-list/member-list.component';
import { LoginComponent } from './components/core/login/login.component';
import { PaymentComponent } from './components/payments/payment/payment.component';
import { NewsFormComponent } from './components/news/news-form/news-form.component';
import { PaymentListComponent } from './components/payments/payment-list/payment-list.component';
import { UserFormComponent } from './components/users/user-form/user-form.component';
import { UserListComponent } from './components/users/user-list/user-list.component';
import { TeamListComponent } from './components/teams/team-list/team-list.component';
import { TeamFormComponent } from './components/teams/team-form/team-form.component';
import { TeamsViewComponent } from './components/teams/teams-view/teams-view.component';
import { UnauthorizedComponent } from './components/core/unauthorized/unauthorized.component';
import { NotFoundComponent } from './components/core/not-found/not-found.component';
import { MemberReportComponent } from './components/reports/member-report/member-report.component';
import { PaymentReportComponent } from './components/reports/payment-report/payment-report.component';
import { PaymentSuccessComponent } from './components/mp/payment-success/payment-success.component';
import { PaymentPendingComponent } from './components/mp/payment-pending/payment-pending.component';
import { PaymentFailureComponent } from './components/mp/payment-failure/payment-failure.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },

    // MEMBERS
    { path: 'member-form', component: MemberFormComponent },
    { path: 'members', component: MemberListComponent, 
        canActivate: [rolesGuard], data: { roles: ['ADMIN', 'COMMITTEE'] } 
    },

    // NEWS
    { path: 'news/create', component: NewsFormComponent },
    { path: 'news/:id', component: NewsCardComponent },
    { path: 'news', component: NewsListComponent },

    // PAYMENTS
    { path: 'payments/pay', component: PaymentComponent },
    { path: 'payments', component: PaymentListComponent,
        canActivate: [rolesGuard], data: { roles: ['ADMIN', 'TREASURER'] }
     },
    
    // TEAMS
    { path: 'teams', component: TeamsViewComponent },
    { path: 'teams/create', component: TeamFormComponent,
        canActivate: [rolesGuard], data: { roles: ['ADMIN'] }
    },
    { path: 'teams/:sport', component: TeamListComponent },
    { path: 'teams/:id/edit', component: TeamFormComponent,
        canActivate: [rolesGuard], data: { roles: ['ADMIN'] } },


    // USERS
    { path: 'users/create', component: UserFormComponent },
    { path: 'users', component: UserListComponent },

    //REPORTS
    { path: 'reports/members', component: MemberReportComponent },
    { path: 'reports/payments', component: PaymentReportComponent },

    // MP PAYMENTS
    { path: 'payment/success', component: PaymentSuccessComponent },
  { path: 'payment/pending', component: PaymentPendingComponent },
  { path: 'payment/failure', component: PaymentFailureComponent },

    // AUTH
    { path: 'login', component: LoginComponent },

    // Pages
    { path: 'unauthorized', component: UnauthorizedComponent },
    { path: '**', component: NotFoundComponent }
];
