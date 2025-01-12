import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PayrollService } from 'src/app/sevices/payroll.service';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payrolllist',
  templateUrl: './payrolllist.component.html',
  styleUrls: ['./payrolllist.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PayrolllistComponent implements OnInit {
  search: string = '';
  page: number = 1;
  year: number;
  month: number;
  payrolls: any[] = [];
  loading: boolean = false;
  error: string | null = null;

  constructor(private payrollService: PayrollService,private router: Router) {
    // Use unique keys for localStorage to avoid conflicts
    this.year = localStorage.getItem('selectedYearPayrollList') ? +localStorage.getItem('selectedYearPayrollList')! : new Date().getFullYear();
    this.month = localStorage.getItem('selectedMonthPayrollList') ? +localStorage.getItem('selectedMonthPayrollList')! : new Date().getMonth() + 1;
  }

  ngOnInit(): void {
    // Fetch data for the current year and month on initialization
    this.fetchPayrollData();
  }

  onYearOrMonthChange(): void {
    // Save the values of year and month to localStorage with unique keys
    localStorage.setItem('selectedYearPayrollList', this.year.toString());
    localStorage.setItem('selectedMonthPayrollList', this.month.toString());

    // Fetch data when year or month fields change
    this.fetchPayrollData();
  }

  fetchPayrollData(): void {
    if (!this.year || !this.month) {
      return;
    }

    this.loading = true;
    this.error = null;

    this.payrollService.getPayrollsByMonth(this.year, this.month).subscribe(
      (data: any[]) => {
        this.payrolls = data;
        this.loading = false;
      },
      (error) => {
        this.error = 'Failed to load payroll data';
        this.loading = false;
      }
    );
  }

  updateSearch(): void {
    // Function to update results based on the search
  }

  clearSearch(): void {
    this.search = '';
  }

  get noResultsFound(): boolean {
    // Clean up the search term
    const searchTerm = this.search.trim().toLowerCase();

    if (searchTerm.length === 0) {
      return false; // No search term entered
    }

    // Filter payrolls based on the search term
    const filteredPayrolls = this.payrolls.filter(payroll => {
      // Clean up the values for comparison
      const firstName = payroll.user.firstname.toLowerCase().trim();
      const lastName = payroll.user.lastname.toLowerCase().trim();
      const fullName = `${firstName} ${lastName}`;
      const username = payroll.user.username.toLowerCase().trim();

      // Compare the values after cleaning up
      return (
        firstName.includes(searchTerm) ||
        lastName.includes(searchTerm) ||
        fullName.includes(searchTerm) ||
        username.includes(searchTerm)
      );
    });

    // Check if no results match the search
    return this.payrolls.length > 0 && filteredPayrolls.length === 0;
  }

  get noDataAvailable(): boolean {
    return this.payrolls.length === 0;
  }
  downloadCSV() {
    const filteredData = this.payrolls.map(p => {
      return {
        id: p.id,
        username: p.user.username,
        firstname: p.user.firstname,
        lastname: p.user.lastname,
        totalHoursWorkedBeforeAdjustment: p.totalHoursWorkedBeforeAdjustment,
        totalSalary: p.totalSalary,
        overtimeMinutes: p.overtimeMinutes,
        undertimeMinutes: p.undertimeMinutes
      };
    });

    const csvData = this.convertToCSV(filteredData);
    const blob = new Blob([csvData], { type: 'text/csv' });
    saveAs(blob, 'payrolls.csv');
  }

  convertToCSV(objArray: any[]): string {
    const header = Object.keys(objArray[0]);
    const csvRows = objArray.map(row => {
      return header.map(fieldName => {
        return JSON.stringify(row[fieldName], (key, value) => (value === null ? '' : value));
      }).join(',');
    });

    return [header.join(','), ...csvRows].join('\r\n');
  }
  downloadPDF() {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [440, 180]
    });

    // Add a header
    doc.setFontSize(18);
    doc.text('Digital Identity', 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text('Payroll Data Report', 14, 32);
    const currentDate = new Date();
    doc.text(`Generated on: ${currentDate.toLocaleDateString()} at ${currentDate.toLocaleTimeString()}`, 14, 40);

    const pageWidth = doc.internal.pageSize.getWidth();
    doc.addImage('assets/img/Picture1.png', 'PNG', pageWidth - 50, 10, 20, 20);

    const filteredData = this.payrolls.map(p => [
      p.id,
      p.user.username,
      p.user.firstname,
      p.user.lastname,
      p.totalHoursWorkedBeforeAdjustment,
      p.totalSalary,
      p.overtimeMinutes,
      p.undertimeMinutes
    ]);

    // Define the columns
    const columns = [
      { header: 'ID', dataKey: 'id' },
      { header: 'Username', dataKey: 'username' },
      { header: 'First Name', dataKey: 'firstname' },
      { header: 'Last Name', dataKey: 'lastname' },
      { header: 'Total Hours Worked', dataKey: 'totalHoursWorkedBeforeAdjustment' },
      { header: 'Total Salary', dataKey: 'totalSalary' },
      { header: 'Overtime Minutes', dataKey: 'overtimeMinutes' },
      { header: 'Undertime Minutes', dataKey: 'undertimeMinutes' }
    ];

    // Auto-table configuration
    (doc as any).autoTable({
      head: [columns.map(col => col.header)],
      body: filteredData,
      startY: 50,
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 5,
        valign: 'middle',
        halign: 'center',
        overflow: 'linebreak'
      },
      headStyles: {
        fillColor: [0, 57, 107], // Custom header color
        textColor: [255, 255, 255], // White text color
        fontStyle: 'bold'
      },
      footStyles: {
        fillColor: [0, 57, 107], // Custom footer color
        textColor: [255, 255, 255], // White text color
        fontStyle: 'bold'
      },
      didDrawPage: function (data) {
        // Footer
        var str = 'Page ' + data.pageNumber;
        doc.setFontSize(10);
        var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
        doc.text(str, data.settings.margin.left, pageHeight - 10);
      }
    });

    doc.save('payrolls.pdf');
  }

  viewPayroll(payrollId: number): void {
    this.router.navigate(['/home/paymentbilldetails', payrollId]);
  }

}
