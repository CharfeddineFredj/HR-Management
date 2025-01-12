import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './companets/home/home.component';
import { LayoutComponent } from './companets/layout/layout.component';
import { AcceuilComponent } from './companets/acceuil/acceuil.component';
import { LoginComponent } from './companets/acceuil/login/login.component';
import { EmployeeComponent } from './employee/employee.component';
import { AddemployeeComponent } from './employee/addemployee/addemployee.component';
import { EditemployeeComponent } from './employee/editemployee/editemployee.component';
import { DetailsComponent } from './employee/details/details.component';
import { AuthGuard } from './companets/auth/auth.guard';
import { ProfileComponent } from './profile/profile.component';
import { EspaceCandidatComponent } from './companets/acceuil/espace-candidat/espace-candidat.component';
import { RecruitmentComponent } from './recruitment/recruitment.component';
import { DetailscandidatComponent } from './recruitment/detailscandidat/detailscandidat.component';
import { EmployeesWorkingHoursListComponent } from './employees-working-hours-list/employees-working-hours-list.component';
import { AddWorkSheduleComponent } from './work-schedule/add-work-shedule/add-work-shedule.component';
import { WorkScheduleComponent } from './work-schedule/work-schedule.component';
import { EditWorkScheduleComponent } from './work-schedule/edit-work-schedule/edit-work-schedule.component';
import { EditPointingComponent } from './employees-working-hours-list/edit-pointing/edit-pointing.component';
import { AddVactionComponent } from './vactions/add-vaction/add-vaction.component';
import { DetailsVactionComponent } from './vactions/details-vaction/details-vaction.component';
import { PointingHistoryComponent } from './employees-working-hours-list/pointing-history/pointing-history.component';
import { ReviewOfVacationsComponent } from './vactions/review-of-vacations/review-of-vacations.component';
import { VactionsComponent } from './vactions/vactions.component';
import { RequestForVactionComponent } from './vactions/request-for-vaction/request-for-vaction.component';
import { AnnouncementsComponent } from './announcements/announcements.component';
import { AnnouncementListComponent } from './announcements/announcement-list/announcement-list.component';
import { HolidaysComponent } from './holidays/holidays.component';
import { AddholidayComponent } from './holidays/addholiday/addholiday.component';
import { PayrollComponent } from './payroll/payroll.component';
import { PayrolllistComponent } from './payroll/payrolllist/payrolllist.component';
import { PaymentBillDetailsComponent } from './payroll/payment-bill-details/payment-bill-details.component';
import { EditholidayComponent } from './holidays/editholiday/editholiday.component';
import { HistoriePaySlipComponent } from './payroll/historie-pay-slip/historie-pay-slip.component';





const routes: Routes = [
  { path: '', redirectTo: "acceuil", pathMatch: "full" },
  { path: 'acceuil', component: AcceuilComponent },
  { path: 'login', component: LoginComponent },
  { path: 'candidat', component: EspaceCandidatComponent },

  {
    path: "home", component: HomeComponent, canActivate: [AuthGuard], data: { roles: ['Administrateur', 'Responsable', 'Employee','Recruteur'] }, children: [
      { path: "", component: LayoutComponent },
      { path: "listemployee", component: EmployeeComponent, canActivate: [AuthGuard], data: { roles: ['Administrateur','Responsable'] } },
      { path: "detailsemployee/:id", component: DetailsComponent, canActivate: [AuthGuard], data: { roles: ['Administrateur', 'Responsable', 'Employee'] } },
      { path: "addemployee", component: AddemployeeComponent, canActivate: [AuthGuard], data: { roles: ['Administrateur','Responsable'] } },
      { path: "editemployee/:id", component: EditemployeeComponent, canActivate: [AuthGuard], data: { roles: ['Administrateur','Responsable'] } },
      { path: "profile/:id", component: ProfileComponent, canActivate: [AuthGuard], data: { roles: ['Administrateur', 'Responsable', 'Employee','Recruteur'] } },
      { path: "recruitment", component: RecruitmentComponent, canActivate: [AuthGuard], data: { roles: ['Administrateur','Recruteur'] } },
      { path: "detailscandidat/:id", component: DetailscandidatComponent, canActivate: [AuthGuard], data: { roles: ['Administrateur','Recruteur'] } },
      { path: "Work-timeTable", component: WorkScheduleComponent, canActivate: [AuthGuard], data: { roles: ['Administrateur','Responsable'] } },
      { path: "AddWorkShedule", component: AddWorkSheduleComponent, canActivate: [AuthGuard], data: { roles: ['Administrateur','Responsable'] } },
      { path: "EditWorkShedule/:id", component: EditWorkScheduleComponent, canActivate: [AuthGuard], data: { roles: ['Administrateur','Responsable'] } },
      { path: "pointinglist", component: EmployeesWorkingHoursListComponent, canActivate: [AuthGuard], data: { roles: ['Administrateur','Responsable'] } },
      { path: "edit-pointage/:id", component: EditPointingComponent, canActivate: [AuthGuard], data: { roles: ['Administrateur','Responsable'] } },
      { path: "addvaction", component: AddVactionComponent, canActivate: [AuthGuard], data: { roles: ['Administrateur', 'Responsable', 'Employee','Recruteur'] } },
      { path: "conge-employee", component: DetailsVactionComponent, canActivate: [AuthGuard], data: { roles: ['Administrateur', 'Responsable', 'Employee','Recruteur'] } },
      { path: 'pointing-history', component: PointingHistoryComponent, canActivate: [AuthGuard], data: { roles: ['Administrateur', 'Responsable', 'Employee', 'Recruteur'] } },
      { path: 'review-vacations', component: ReviewOfVacationsComponent, canActivate: [AuthGuard], data: { roles: ['Administrateur', 'Responsable'] } },
      { path: 'listvactions', component: VactionsComponent, canActivate: [AuthGuard], data: { roles: ['Administrateur', 'Responsable'] } },
      { path: 'congeRequest', component: RequestForVactionComponent, canActivate: [AuthGuard], data: { roles: ['Administrateur', 'Responsable'] } },
      { path: 'announcement', component: AnnouncementListComponent, canActivate: [AuthGuard], data: { roles: ['Administrateur', 'Responsable'] } },
      { path: 'announcementNotification', component: AnnouncementsComponent, canActivate: [AuthGuard], data: { roles: ['Administrateur', 'Responsable', 'Employee', 'Recruteur'] } },
      { path: 'listHolidays', component: HolidaysComponent, canActivate: [AuthGuard], data: { roles: ['Administrateur', 'Responsable'] } },
      { path: 'addHoliday', component: AddholidayComponent, canActivate: [AuthGuard], data: { roles: ['Administrateur', 'Responsable'] } },
      { path: 'editHoliday/:id', component: EditholidayComponent, canActivate: [AuthGuard], data: { roles: ['Administrateur', 'Responsable'] } },
      { path: 'payroll', component: PayrollComponent, canActivate: [AuthGuard], data: { roles: ['Administrateur', 'Responsable'] } },
      { path: 'payrolllist', component: PayrolllistComponent, canActivate: [AuthGuard], data: { roles: ['Administrateur', 'Responsable'] } },
      { path: 'paymentbilldetails/:id', component: PaymentBillDetailsComponent, canActivate: [AuthGuard], data: { roles: ['Administrateur', 'Responsable'] } },
      { path: 'pay-history', component: HistoriePaySlipComponent, canActivate: [AuthGuard], data: { roles: ['Administrateur', 'Responsable','Employee', 'Recruteur'] } },

    ]
  },
  // Ajoutez un chemin de route spécifique pour afficher uniquement le LoginComponent
  { path: 'acceuil/login', component: LoginComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
