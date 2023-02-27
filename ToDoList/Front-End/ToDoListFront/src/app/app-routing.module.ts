import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdministrativeListComponent } from './components/administrative-list/administrative-list.component';
import { LoginComponent } from './components/login/login.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { PrivateListComponent } from './components/private-list/private-list.component';
import { SharedListComponent } from './components/shared-list/shared-list.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { PrivateListDetailsComponent } from './components/private-list-details/private-list-details.component';
import { SharedListDetailsComponent } from './components/shared-list-details/shared-list-details.component'; 
import { ProfileDetailsComponent } from './components/profile-details/profile-details.component'; 
import { AdministrativeListDetailsComponent } from './components/administrative-list-details/administrative-list-details.component';
import { AuthGuard } from './helpers/auth-guard';
import { UserRole } from './models/User/UserRole';
import { RoleGuard } from './helpers/role-guard';
import { SortFilterExportComponent } from './components/sort-filter-export/sort-filter-export.component';
import { UserManagerComponent } from './components/user-manager/user-manager.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';

const routes: Routes = [
  {
    path:'login', 
    component: LoginComponent
  },
  {
    path:'',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path:'home', 
    component: MainPageComponent, 
    canActivate: [AuthGuard]
  },
  {
    path:'private-list',
    component: PrivateListComponent, 
    canActivate: [AuthGuard]
  },
  {
    path:'shared-list', 
    component: SharedListComponent, 
    canActivate: [AuthGuard]
  },
  {
    path:'administrative-list', 
    component: AdministrativeListComponent, 
    canActivate: [AuthGuard],
  },
  {
    path:'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'reset-password/:token',
    component: ResetPasswordComponent
  },
  {
    path:'private-list-details/:assignmentListId',
    component: PrivateListDetailsComponent, 
    canActivate: [AuthGuard]
  },
  {
    path:'shared-list-details/:assignmentListId',
    component: SharedListDetailsComponent, 
    canActivate: [AuthGuard]
  },
  {
    path:'profile-details',
    component: ProfileDetailsComponent, 
    canActivate: [AuthGuard]
  },
  {
    path:'administrative-list-details/:assignmentListId',
    component: AdministrativeListDetailsComponent, 
    canActivate: [AuthGuard]
  },
  { path: 'sort-filter-export/:assignmentListId', 
    component: SortFilterExportComponent,
    canActivate: [RoleGuard],
    data: { roles: UserRole.AdminRole }
  },
  {
    path: 'user-manager',
    component: UserManagerComponent,
    canActivate: [RoleGuard],
    data: { roles: UserRole.AdminRole}
  },
  {
    path:'user-manager',
    component: UserManagerComponent,
    canActivate:[AuthGuard]
  },
  {
    path:'page-not-found',
    component: PageNotFoundComponent,
  },
  {
    path:'**',
    redirectTo:'/page-not-found',
    pathMatch:'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
