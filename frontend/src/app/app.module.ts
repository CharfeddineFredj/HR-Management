import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HomeComponent } from './companets/home/home.component';
import { HeaderComponent } from './companets/header/header.component';
import { SidebarComponent } from './companets/sidebar/sidebar.component';
import { FooterComponent } from './companets/footer/footer.component';
import { LayoutComponent } from './companets/layout/layout.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AcceuilComponent } from './companets/acceuil/acceuil.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './companets/acceuil/login/login.component';
import { EmployeeComponent } from './employee/employee.component';
import { AddemployeeComponent } from './employee/addemployee/addemployee.component';
import { EditemployeeComponent } from './employee/editemployee/editemployee.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { LoaderComponent } from './companets/loader/loader.component';
import { AuthGuard } from './companets/auth/auth.guard';
import { UserService } from './sevices/user.service';
import { AuthInterceptor } from './companets/auth/auth.interceptor';
import { ProfileComponent } from './profile/profile.component';
import { TokenExpirationService } from './sevices/token-expiration.service';
import { RechercheEmployeePipe } from './pipes/recherche-employee.pipe';
import { CommonModule } from '@angular/common';
import { DetailsComponent } from './employee/details/details.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ScrollToTopComponent } from './scroll-to-top/scroll-to-top.component';
import { MatIconModule } from '@angular/material/icon';
import { EspaceCandidatComponent } from './companets/acceuil/espace-candidat/espace-candidat.component';
import { RecruitmentComponent } from './recruitment/recruitment.component';
import { CandidatPipe } from './pipes/candidat.pipe';
import { DetailscandidatComponent } from './recruitment/detailscandidat/detailscandidat.component';
import { NgChartsModule } from 'ng2-charts';
import { AppRoutingModule } from './app-routing.module';
import { NgApexchartsModule } from 'ng-apexcharts';

import { ContractChartComponent } from './statistics/contract-chart/contract-chart.component';
import { EmployeePerYearChartComponent } from './statistics/employee-per-year-chart/employee-per-year-chart.component';
import { GenderChartComponent } from './statistics/gender-chart/gender-chart.component';
import { StatusChartComponent } from './statistics/status-chart/status-chart.component';
import { EmployeeService } from './sevices/employee.service';
import { EmployeesWorkingHoursListComponent } from './employees-working-hours-list/employees-working-hours-list.component';
import { SearchPointagePipePipe } from './pipes/search-pointage-pipe.pipe';
import { WorkScheduleComponent } from './work-schedule/work-schedule.component';
import { AddWorkSheduleComponent } from './work-schedule/add-work-shedule/add-work-shedule.component';
import { EditWorkScheduleComponent } from './work-schedule/edit-work-schedule/edit-work-schedule.component';
import { SearchschedulePipe } from './pipes/searchschedule.pipe';
import { EditPointingComponent } from './employees-working-hours-list/edit-pointing/edit-pointing.component';
import { VactionsComponent } from './vactions/vactions.component';
import { AddVactionComponent } from './vactions/add-vaction/add-vaction.component';
import { DetailsVactionComponent } from './vactions/details-vaction/details-vaction.component';
import { PointingHistoryComponent } from './employees-working-hours-list/pointing-history/pointing-history.component';
import { SortPointagePipe } from './pipes/sort-pointage.pipe';
import { ReviewOfVacationsComponent } from './vactions/review-of-vacations/review-of-vacations.component';
import { SearchReviewVactionPipe } from './pipes/search-review-vaction.pipe';
import { RequestForVactionComponent } from './vactions/request-for-vaction/request-for-vaction.component';
import { AnnouncementsComponent } from './announcements/announcements.component';
import { AnnouncementListComponent } from './announcements/announcement-list/announcement-list.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { HolidaysComponent } from './holidays/holidays.component';
import { AddholidayComponent } from './holidays/addholiday/addholiday.component';
import { PayrollComponent } from './payroll/payroll.component';
import { PayrolllistComponent } from './payroll/payrolllist/payrolllist.component';
import { SearchpayrollPipe } from './pipes/searchpayroll.pipe';
import { PaymentBillDetailsComponent } from './payroll/payment-bill-details/payment-bill-details.component';
import { SearchHolidayPipe } from './pipes/search-holiday.pipe';
import { EditholidayComponent } from './holidays/editholiday/editholiday.component';
import { HistoriePaySlipComponent } from './payroll/historie-pay-slip/historie-pay-slip.component';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    LayoutComponent,
    AcceuilComponent,
    LoginComponent,
    EmployeeComponent,
    AddemployeeComponent,
    EditemployeeComponent,
    DetailsComponent,
    LoaderComponent,
    ProfileComponent,
    RechercheEmployeePipe,
    ScrollToTopComponent,
    EspaceCandidatComponent,
    RecruitmentComponent,
    CandidatPipe,
    DetailscandidatComponent,
    ContractChartComponent,
    GenderChartComponent,
    EmployeePerYearChartComponent,
    StatusChartComponent,
    EmployeesWorkingHoursListComponent,
    SearchPointagePipePipe,
    WorkScheduleComponent,
    AddWorkSheduleComponent,
    EditWorkScheduleComponent,
    SearchschedulePipe,
    EditPointingComponent,
    VactionsComponent,
    AddVactionComponent,
    DetailsVactionComponent,
    PointingHistoryComponent,
    SortPointagePipe,
    ReviewOfVacationsComponent,
    SearchReviewVactionPipe,
    RequestForVactionComponent,
    AnnouncementsComponent,
    AnnouncementListComponent,
    HolidaysComponent,
    AddholidayComponent,
    PayrollComponent,
    PayrolllistComponent,
    SearchpayrollPipe,
    PaymentBillDetailsComponent,
    SearchHolidayPipe,
    EditholidayComponent,
    HistoriePaySlipComponent



  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgxPaginationModule,
    CommonModule,
    BrowserAnimationsModule,
    MatIconModule,
    NgChartsModule,
    NgApexchartsModule,
    AngularEditorModule,








  ],

  providers: [
    AuthGuard,EmployeeService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    UserService,
    TokenExpirationService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule {

}
