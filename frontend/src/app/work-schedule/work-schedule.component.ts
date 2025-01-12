import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { WorkSchedule, WorkScheduleServiceService } from '../sevices/work-schedule-service.service';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import 'jspdf-autotable'; // Ensure this import for autoTable to work
import { Router } from '@angular/router';

@Component({
  selector: 'app-work-schedule',
  templateUrl: './work-schedule.component.html',
  styleUrls: ['./work-schedule.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class WorkScheduleComponent implements OnInit {

  workSchedules: WorkSchedule[] = [];
  search: string = '';
  page = 1;

  constructor(private workScheduleService: WorkScheduleServiceService,private router: Router) { }

  navigateToWorkSchedule() {
    this.router.navigateByUrl('/home', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/home/AddWorkShedule']);
    });
  }

  ngOnInit(): void {
    this.workScheduleService.getWorkSchedules().subscribe(data => {
      this.workSchedules = data;
    });
  }

  updateSearch(): void {
    // Custom search logic
  }

  clearSearch(): void {
    this.search = '';
  }

  getWorkDaysString(workDays: any): string {
    return workDays.map((day: any) => day.dayOfWeek).join(', ');
  }

  downloadCSV() {
    const exportData = this.workSchedules.map(schedule => ({
      'Registration Number': schedule.user.username,
      'First Name': schedule.user.firstname,
      'Last Name': schedule.user.lastname,
      'Start Date Time': schedule.scheduledCheckInTime,
      'End Date Time': schedule.scheduledCheckOutTime,
      'Work Days': this.getWorkDaysString(schedule.workDays)
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'schedules.xlsx');
  }

  downloadPDF() {
    const exportData = this.workSchedules.map(schedule => ({
      Username: schedule.user.username,
      'First Name': schedule.user.firstname,
      'Last Name': schedule.user.lastname,
      'Start Date Time': schedule.scheduledCheckInTime,
      'End Date Time': schedule.scheduledCheckOutTime,
      'Work Days': this.getWorkDaysString(schedule.workDays)
    }));

    const doc: any = new jsPDF();

    // Add logo
    const img = new Image();
    img.src = 'assets/img/Picture1.png'; // Path to your logo image
    img.onload = () => {
      doc.addImage(img, 'PNG', 160, 10, 30, 30); // Adjust the position and size as needed

      // Add text
      doc.setFontSize(18);
      doc.text('Digital Identity', 14, 22);
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text('Employee Pointing List', 14, 32);
      const currentDate = new Date();
      doc.text(`Generated on: ${currentDate.toLocaleDateString()} at ${currentDate.toLocaleTimeString()}`, 14, 40);

      // Add table
      const columns = ['Registration Number', 'First Name', 'Last Name', 'Start Date Time', 'End Date Time', 'Work Days'];
      const rows = exportData.map(item => [
        item.Username, item['First Name'], item['Last Name'], item['Start Date Time'], item['End Date Time'], item['Work Days']
      ]);

      doc.autoTable({
        head: [columns],
        body: rows,
        startY: 60, // Adjust the starting Y position to fit the header
        styles: {
          fontSize: 8,
          cellPadding: 4,
          valign: 'middle',
          halign: 'center',
          overflow: 'linebreak'
        },
      });

      doc.save('schedules.pdf');
    };
  }

}
