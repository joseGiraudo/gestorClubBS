import { Routes } from '@angular/router';
import { HomeComponent } from './components/core/home/home.component';
import { MemberFormComponent } from './components/members/member-form/member-form.component';
import { NewsCardComponent } from './components/news/news-card/news-card.component';
import { adminGuard, authGuard } from './guards/auth.guard';
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

export const routes: Routes = [
    { path: '', component: HomeComponent },

    // MEMBERS
    { path: 'member-form', component: MemberFormComponent },
    { path: 'members', component: MemberListComponent },

    // NEWS
    { path: 'news/create', component: NewsFormComponent },
    { path: 'news/:id', component: NewsCardComponent },
    { path: 'news', component: NewsListComponent },

    // PAYMENTS
    { path: 'payments/pay', component: PaymentComponent },
    { path: 'payments', component: PaymentListComponent },
    
    // TEAMS
    { path: 'teams', component: TeamsViewComponent },
    { path: 'teams/create', component: TeamFormComponent },
    { path: 'teams/:sport', component: TeamListComponent },


    // USERS
    { path: 'users/create', component: UserFormComponent },
    { path: 'users', component: UserListComponent },

    // AUTH
    { path: 'login', component: LoginComponent },

    // Pages
    { path: 'unauthorized', component: UnauthorizedComponent },
    { path: '**', component: NotFoundComponent }
];
