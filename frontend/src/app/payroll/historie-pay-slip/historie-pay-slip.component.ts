import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Payroll, PayrollService } from 'src/app/sevices/payroll.service';
import { UserAuthService } from 'src/app/sevices/user-auth.service';


@Component({
  selector: 'app-historie-pay-slip',
  templateUrl: './historie-pay-slip.component.html',
  styleUrls: ['./historie-pay-slip.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HistoriePaySlipComponent implements OnInit {

  payrolls: Payroll[] = [];
  year: number = new Date().getFullYear();
  month: number = new Date().getMonth() + 1;
  username: string = '';  // Store the logged-in user's username
  currentPage: number = 1;  // Track the current page number for pagination
  itemsPerPage: number = 5;  // Number of items to display per page

  constructor(
    private payrollService: PayrollService,
    private authService: UserAuthService
  ) { }

  ngOnInit(): void {
    // Fetch the username from the AuthService when the component initializes
    this.username = this.authService.getusername();
    this.fetchPayrolls();  // Fetch initial payroll data
  }

  fetchPayrolls(): void {
    if (this.username) {
      // Fetch payrolls for the current user based on the year and month
      this.payrollService.getPayrollsByUserAndMonth(this.username, this.year, this.month).subscribe(
        (data: Payroll[]) => {
          this.payrolls = data;
        },
        (error) => {
          console.error('Failed to fetch payroll data:', error);
        }
      );
    }
  }

  // Handle page change event for pagination
  pageChanged(newPage: number): void {
    this.currentPage = newPage;
  }

  // Function to generate and download the PDF for a specific pay slip
  downloadPDF(payslip: Payroll): void {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const today = new Date();
    const currentTime = `${today.toLocaleDateString('en-GB')} ${today.getHours()}:${today.getMinutes().toString().padStart(2, '0')}`;

    // Company Information
    const companyName = 'Digital Identity';
    const taxID = 'Tax ID: DIGID*******';
    const companyAddress = 'Address: ************';

    // Title
    doc.setFontSize(22);
    doc.text('PAYSLIP', pageWidth / 2, 20, { align: 'center' });

    doc.setFontSize(14);
    doc.setTextColor(105, 105, 105);  // Gray color
    doc.text(`Issued on: ${currentTime}`, pageWidth / 2, 30, { align: 'center' });

    // Reset text color for content
    doc.setTextColor(0, 0, 0);

    // Company Info
    doc.setFontSize(15);
    doc.text('Company Information', 20, 50);

    const infoStartY = 55;
    const infoHeight = 30;
    const infoPadding = 5;
    doc.setDrawColor(105, 105, 105);  // Gray border
    doc.rect(20, infoStartY, pageWidth - 40, infoHeight);

    let y = infoStartY + infoPadding;
    doc.setFontSize(12);
    doc.text(companyName, 25, y);
    y += 10;
    doc.text(taxID, 25, y);
    y += 10;
    doc.text(companyAddress, 25, y);

    // Employee Info (Left)
    y = infoStartY + infoHeight + 10;
    doc.text(`Registration Number: ${payslip.user.username}`, 20, y);
    y += 10;
    doc.text(`Last Name: ${payslip.user.lastname}`, 20, y);
    y += 10;
    doc.text(`First Name: ${payslip.user.firstname}`, 20, y);
    y += 10;
    doc.text(`Position: ${payslip.user.job}`, 20, y);
    y += 10;
    doc.text(`Department: ${payslip.user.department}`, 20, y);

    // Employee Info (Right)
    const x = pageWidth / 2 + 20;
    y = infoStartY + infoHeight + 10;
    doc.text(`Year: ${this.getYear(payslip.payrollDate)}`, x, y);
    y += 10;
    doc.text(`Month: ${this.getMonth(payslip.payrollDate)}`, x, y);
    y += 10;
    doc.text(`Pay Type: Monthly Salary`, x, y);
    y += 10;
    doc.text(`Work Regime: 48`, x, y);
    y += 10;
    doc.text(`Basic Salary: ${payslip.user.salary.toFixed(2)}`, x, y);

    // Payroll Table
    (doc as any).autoTable({
      startY: y + 20,
      head: [['Code', 'Label', 'Amount', 'Earnings', 'Deductions']],
      body: [
        ['100', 'Basic Salary', `${this.convertHoursToDays(payslip.totalHoursWorkedBeforeAdjustment)} days`, this.calculateBaseSalary(payslip).toFixed(2), '0.00'],
        ['160', 'Performance Bonus', '7%', this.calculatePrimeRendement(this.calculateBaseSalary(payslip)).toFixed(2), '0.00'],
        ['160', 'Overtime', `${this.convertMinutesToDays(payslip.overtimeMinutes)} days`, this.calculateOvertimePay(payslip).toFixed(2), '0.00'],
        ['200', 'Gross Salary', `${this.convertHoursToDays(payslip.totalHoursWorkedBeforeAdjustment)} days`, this.calculateGrossSalary(payslip).toFixed(2), '0.00'],
        ['210', 'C.N.S.S.', '10%', '0.00', this.calculateCNSS(this.calculateGrossSalary(payslip)).toFixed(2)],
        ['240', 'Taxable Salary', '0.00', this.calculateTaxableSalary(payslip).toFixed(2), '0.00'],
        ['400', 'Social Contribution', '1%', '0.00', this.calculateContributionSolidaire(this.calculateGrossSalary(payslip)).toFixed(2)],
        ['450', 'Source Deduction', '6%', '0.00', this.calculateSourceDeduction(this.calculateGrossSalary(payslip)).toFixed(2)],
        ['500', 'Net Pay', '0.00', this.calculateNetSalary(payslip).toFixed(2), '0.00']
      ],
      styles: {
        cellPadding: 3,
        fontSize: 12,
        lineColor: 0,  // Border color
        lineWidth: 0.5  // Border width
      },
      headStyles: {
        fillColor: [230, 230, 230],  // Light gray background color
        textColor: [0, 0, 0],  // Black text color
      },
      bodyStyles: {
        fillColor: [255, 255, 255],  // White cell background
        textColor: [0, 0, 0],  // Black text color
      }
    });

    // Save the PDF
    doc.save(`payslip-${payslip.user.username}-${this.getYear(payslip.payrollDate)}-${this.getMonth(payslip.payrollDate)}.pdf`);
  }

  // Utility methods
  getMonth(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('default', { month: 'long' });
  }

  getYear(dateString: string): number {
    const date = new Date(dateString);
    return date.getFullYear();
  }

  convertHoursToDays(hours: number): number {
    return hours / 8;
  }

  convertMinutesToDays(minutes: number): number {
    const hours = minutes / 60;
    return this.convertHoursToDays(hours);
  }

  calculateBaseSalary(payslip: Payroll): number {
    const totalDaysWorked = this.convertHoursToDays(payslip.totalHoursWorkedBeforeAdjustment);
    const dailyRate = payslip.user.salary / 22;  // Assuming 22 working days in a month
    return dailyRate * totalDaysWorked;
  }

  calculatePrimeRendement(baseSalary: number): number {
    return baseSalary * 0.07;  // Example: 7% performance bonus
  }

  calculateOvertimePay(payslip: Payroll): number {
    const dailyRate = payslip.user.salary / 22;
    return this.convertMinutesToDays(payslip.overtimeMinutes) * dailyRate;
  }

  calculateGrossSalary(payslip: Payroll): number {
    const baseSalary = this.calculateBaseSalary(payslip);
    const primeRendement = this.calculatePrimeRendement(baseSalary);
    const overtimePay = this.calculateOvertimePay(payslip);
    return baseSalary + primeRendement + overtimePay;
  }

  calculateCNSS(grossSalary: number): number {
    return grossSalary * 0.1;  // Example: 10% CNSS deduction
  }

  calculateContributionSolidaire(grossSalary: number): number {
    return grossSalary * 0.01;  // Example: 1% social contribution
  }

  calculateSourceDeduction(grossSalary: number): number {
    return grossSalary * 0.06;  // Example: 6% tax deduction
  }

  calculateTaxableSalary(payslip: Payroll): number {
    const grossSalary = this.calculateGrossSalary(payslip);
    const CNSS = this.calculateCNSS(grossSalary);
    const socialContribution = this.calculateContributionSolidaire(grossSalary);
    const sourceDeduction = this.calculateSourceDeduction(grossSalary);
    return grossSalary - CNSS - socialContribution - sourceDeduction;
  }

  calculateNetSalary(payslip: Payroll): number {
    const taxableSalary = this.calculateTaxableSalary(payslip);
    return taxableSalary;
  }
}
