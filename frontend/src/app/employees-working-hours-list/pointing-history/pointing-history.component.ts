import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import jsPDF from 'jspdf';
import { UserAuthService } from 'src/app/sevices/user-auth.service';
import { Pointage, WorkScheduleServiceService } from 'src/app/sevices/work-schedule-service.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-pointing-history',
  templateUrl: './pointing-history.component.html',
  styleUrls: ['./pointing-history.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PointingHistoryComponent implements OnInit {
  pointages: Pointage[] = [];
  search: string = '';
  page: number = 1;
  userRoles: string[] = [];
  userId: number | null;

  constructor(private pointageService: WorkScheduleServiceService, private route: ActivatedRoute, private authService: UserAuthService) {
  }

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    if (this.userId) {
      this.getPointageHistory();
    } else {
      console.error('User ID not found in local storage');
    }
  }

  getPointageHistory(): void {
    if (this.userId !== null) {
      this.pointageService.getPointageHistoryByUserId(this.userId).subscribe(
        data => {
          this.pointages = data;
        },
        error => {
          console.error('Error fetching pointage history', error);
        }
      );
    }
  }

  updateSearch() {
    // Custom search logic if needed
  }

  clearSearch() {
    this.search = '';
    this.updateSearch();
  }

  downloadCSV() {
    const exportData = this.pointages.map(pointage => ({
      'Registration Number': pointage.user.username,
      'First Name': pointage.user.firstname,
      'Last Name': pointage.user.lastname,
      'Check-In Time': pointage.checkInTime,
      'Check-Out Time': pointage.checkOutTime,
      Status: pointage.completed ? 'Completed' : 'Not Completed'
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'pointages.xlsx');
  }

  downloadPDF() {
    const exportData = this.pointages.map(pointage => ({
      'Registration Number': pointage.user.username,
      'First Name': pointage.user.firstname,
      'Last Name': pointage.user.lastname,
      'Check-In Time': pointage.checkInTime,
      'Check-Out Time': pointage.checkOutTime,
      Status: pointage.completed ? 'Completed' : 'Not Completed'
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
      const columns = ['Registration Number', 'First Name', 'Last Name', 'Check-In Time', 'Check-Out Time', 'Status'];
      const rows = exportData.map(item => [
        item['Registration Number'], item['First Name'], item['Last Name'], item['Check-In Time'], item['Check-Out Time'], item.Status
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

      doc.save('pointages.pdf');
    };
  }
}
