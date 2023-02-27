import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AgGridModule } from 'ag-grid-angular';
import { DragDropModule } from '@angular/cdk/drag-drop'

import { NgChartsModule } from 'ng2-charts';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdministrativeListComponent } from './components/administrative-list/administrative-list.component';
import { LoginComponent } from './components/login/login.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { PrivateListComponent } from './components/private-list/private-list.component';
import { SharedListComponent } from './components/shared-list/shared-list.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { SharedListDetailsComponent } from './components/shared-list-details/shared-list-details.component';
import { ProfileDetailsComponent } from './components/profile-details/profile-details.component';
import { AdministrativeListDetailsComponent } from './components/administrative-list-details/administrative-list-details.component';
import { SortFilterExportComponent } from './components/sort-filter-export/sort-filter-export.component'
import { AuthenticationInterceptor } from './helpers/auth-interceptor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorInterceptor } from './helpers/error-interceptor';
import { GoBackHeaderComponent } from './components/go-back-header/go-back-header.component';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
import { UserManagerComponent } from './components/user-manager/user-manager.component';
import { HeaderComponent } from './components/header/header.component';
import { DeleteButtonCellComponent } from './components/user-manager/delete-button-cell/delete-button-cell.component';
import { ArchiveButtonCellComponent } from './components/user-manager/archive-button-cell/archive-button-cell.component';
import { PrivateListDetailsComponent } from './components/private-list-details/private-list-details.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';


@NgModule({
  declarations: [
    AppComponent,
    PrivateListComponent,
    SharedListComponent,
    AdministrativeListComponent,
    MainPageComponent,
    LoginComponent,
    PageNotFoundComponent,
    ForgotPasswordComponent,
    SharedListDetailsComponent,
    ProfileDetailsComponent,
    AdministrativeListDetailsComponent,
    SortFilterExportComponent,
	  HeaderComponent,
    GoBackHeaderComponent,
    UserManagerComponent,
    DeleteButtonCellComponent,
    ArchiveButtonCellComponent,
    PrivateListDetailsComponent,
    ResetPasswordComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
	  AgGridModule,
	  MdbCollapseModule,
	  DragDropModule,
    NgChartsModule,
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthenticationInterceptor,
    multi: true
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
