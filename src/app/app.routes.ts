import { Routes } from '@angular/router';
import { HomeComponent } from './components/core/home/home.component';
import { MemberFormComponent } from './components/members/member-form/member-form.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'member-form', component: MemberFormComponent },
];
