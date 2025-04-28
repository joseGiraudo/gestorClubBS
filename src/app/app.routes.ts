import { Routes } from '@angular/router';
import { HomeComponent } from './components/core/home/home.component';
import { MemberFormComponent } from './components/members/member-form/member-form.component';
import { NewsCardComponent } from './components/news/news-card/news-card.component';
import { adminGuard, authGuard } from './guards/auth.guard';
import { NewsListComponent } from './components/news/news-list/news-list.component';
import { MemberListComponent } from './components/members/member-list/member-list.component';
import { LoginComponent } from './components/core/login/login.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'member-form', component: MemberFormComponent },
    { path: 'members', component: MemberListComponent },
    { path: 'news/:id', component: NewsCardComponent },
    { path: 'news', component: NewsListComponent },


    { path: 'login', component: LoginComponent },

    { path: 'admin', canActivate: [authGuard, adminGuard], component: MemberFormComponent}
];
