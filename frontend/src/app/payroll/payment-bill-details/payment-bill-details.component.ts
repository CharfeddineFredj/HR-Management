import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import jsPDF from 'jspdf';

import 'jspdf-autotable';
import { Payroll, PayrollService } from 'src/app/sevices/payroll.service';

@Component({
  selector: 'app-payment-bill-details',
  templateUrl: './payment-bill-details.component.html',
  styleUrls: ['./payment-bill-details.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PaymentBillDetailsComponent implements OnInit {
  payroll: Payroll = null;
  payrollId: number;
  today: Date = new Date();
  isPayslipNotificationSent: boolean = false;

  constructor(private route: ActivatedRoute, private payrollService: PayrollService) {}

  ngOnInit(): void {
    this.payrollId = +this.route.snapshot.paramMap.get('id');
    this.fetchPayrollDetails();
  }

  fetchPayrollDetails(): void {
    this.payrollService.getPayrollById(this.payrollId).subscribe(
      (data: Payroll) => {
        this.payroll = data;
      },
      (error) => {
        console.error('Failed to fetch payroll details', error);
      }
    );
  }

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

  calculateCNSS(grossSalary: number): number {
    return grossSalary * 0.1;
  }

  calculateContributionSolidaire(grossSalary: number): number {
    return grossSalary * 0.01;
  }

  calculateSourceDeduction(grossSalary: number): number {
    return grossSalary * 0.06;
  }

  calculatePrimeRendement(baseSalary: number): number {
    return baseSalary * 0.07;
  }

  calculateBaseSalary(): number {
    const totalDaysWorked = this.convertHoursToDays(this.payroll.totalHoursWorkedBeforeAdjustment) - this.convertMinutesToDays(this.payroll.overtimeMinutes);
    const dailyRate = (this.payroll.user.salary) / 22; // Assuming 22 working days in a month
    return dailyRate * totalDaysWorked;
  }

  calculateOvertimePay(): number {
    const dailyRate = (this.payroll.user.salary) / 22;
    return this.convertMinutesToDays(this.payroll.overtimeMinutes) * dailyRate;
  }

  calculateGrossSalary(): number {
    const baseSalary = this.calculateBaseSalary();
    const primeRendement = this.calculatePrimeRendement(baseSalary);
    const overtimePay = this.calculateOvertimePay();
    return baseSalary + primeRendement + overtimePay;
  }

  calculateTaxableSalary(): number {
    const grossSalary = this.calculateGrossSalary();
    const CNSS = this.calculateCNSS(grossSalary);
    const solidarityContribution = this.calculateContributionSolidaire(grossSalary);
    const sourceDeduction = this.calculateSourceDeduction(grossSalary);
    return grossSalary - CNSS - solidarityContribution - sourceDeduction;
  }

  calculateNetSalary(): number {
    const grossSalary = this.calculateGrossSalary();
    const CNSS = this.calculateCNSS(grossSalary);
    const solidarityContribution = this.calculateContributionSolidaire(grossSalary);
    const sourceDeduction = this.calculateSourceDeduction(grossSalary);
    return grossSalary - CNSS - solidarityContribution - sourceDeduction;
  }

  downloadPDF(): void {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const today = new Date();
    const currentTime = `${today.toLocaleDateString('en-GB')} ${today.getHours()}:${today.getMinutes().toString().padStart(2, '0')}`;

    // Company Information
    const companyInfoTitle = 'Company Information';
    const companyName = 'Company Name: Digital Identity';
    const taxID = 'Tax ID: DIGID*******';
    const companyAddress = 'Address: ************';

    doc.setFontSize(22);
    doc.text('PAYSLIP', pageWidth / 2, 20, { align: 'center' });

    doc.setFontSize(14);
    doc.setTextColor(105, 105, 105); // Dark gray color
    doc.text(`Issued on: ${currentTime}`, pageWidth / 2, 30, { align: 'center' });

    // Reset text color to black for other text
    doc.setTextColor(0, 0, 0);

    doc.setFontSize(15);
    doc.text(companyInfoTitle, 20, 50);

    // Draw border for company information
    const infoStartY = 55;
    const infoHeight = 30;
    const infoPadding = 5;
    doc.setDrawColor(105, 105, 105); // Dark gray color
    doc.rect(20, infoStartY, pageWidth - 40, infoHeight);

    // Company name, Tax ID, and Address inside the border
    doc.setFontSize(12);
    let y = infoStartY + infoPadding;
    doc.text(companyName, 25, y);
    y += 10;
    doc.text(taxID, 25, y);
    y += 10;
    doc.text(companyAddress, 25, y);

    // Employee details left
    y = infoStartY + infoHeight + 10;
    doc.text(`Registration Number: ${this.payroll.user.username}`, 20, y);
    y += 10;
    doc.text(`Last Name: ${this.payroll.user.lastname}`, 20, y);
    y += 10;
    doc.text(`First Name: ${this.payroll.user.firstname}`, 20, y);
    y += 10;
    doc.text(`Status: ${this.payroll.user.roles.map(role => role.name).join(', ')}`, 20, y);
    y += 10;
    doc.text(`Position: ${this.payroll.user.job}`, 20, y);
    y += 10;
    doc.text(`Department: ${this.payroll.user.department}`, 20, y);

    // Employee details right
    y = infoStartY + infoHeight + 10;
    let x = pageWidth / 2 + 20;
    doc.text(`Year: ${this.getYear(this.payroll.payrollDate)}`, x, y);
    y += 10;
    doc.text(`Month: ${this.getMonth(this.payroll.payrollDate)}`, x, y);
    y += 10;
    doc.text(`Pay Type: Monthly Salary`, x, y);
    y += 10;
    doc.text(`Work Regime: 48`, x, y);
    y += 10;
    doc.text(`Basic Salary: ${this.payroll.user.salary.toFixed(2)}`, x, y);

    (doc as any).autoTable({
        startY: y + 20,
        head: [['Code', 'Label', 'Amount', 'Earnings', 'Deductions']],
        body: [
            ['100', 'Basic Salary', `${this.convertHoursToDays(this.payroll.totalHoursWorkedBeforeAdjustment) - this.convertMinutesToDays(this.payroll.overtimeMinutes)} days`, this.calculateBaseSalary().toFixed(2), '0.00'],
            ['160', 'Performance Bonus', '7%', this.calculatePrimeRendement(this.calculateBaseSalary()).toFixed(2), '0.00'],
            ['160', 'Overtime', `${this.convertMinutesToDays(this.payroll.overtimeMinutes)} days`, this.calculateOvertimePay().toFixed(2), '0.00'],
            ['200', 'Gross Salary', `${this.convertHoursToDays(this.payroll.totalHoursWorkedBeforeAdjustment)} days`, this.calculateGrossSalary().toFixed(2), '0.00'],
            ['210', 'C.N.S.S.', '10%', '0.00', this.calculateCNSS(this.calculateGrossSalary()).toFixed(2)],
            ['240', 'Taxable Salary', '0.00', this.calculateTaxableSalary().toFixed(2), '0.00'],
            ['400', 'Social Contribution', '1%', '0.00', this.calculateContributionSolidaire(this.calculateGrossSalary()).toFixed(2)],
            ['450', 'Source Deduction', '6%', '0.00', this.calculateSourceDeduction(this.calculateGrossSalary()).toFixed(2)],
            ['500', 'Net Pay', '0.00', this.calculateNetSalary().toFixed(2), '0.00']
        ],
        styles: {
            cellPadding: 3,
            fontSize: 12,
            lineColor: 0, // Border color
            lineWidth: 0.5 // Border width
        },
        headStyles: {
            fillColor: [230, 230, 230], // Light gray background color
            textColor: [0, 0, 0], // Black text color
            lineColor: 0, // Border color
            lineWidth: 0.2 // Border width
        },
        bodyStyles: {
            fillColor: [255, 255, 255], // White cell background
            textColor: [0, 0, 0], // Black text color
            lineColor: 0, // Border color
            lineWidth: 0.2 // Border width
        },
        alternateRowStyles: {
            fillColor: [255, 255, 255] // Ensure alternate rows are also white
        },
    });

   // Trigger download of the PDF
   doc.save('payslip.pdf');
  }

  sendPayslipNotification(): void {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const today = new Date();
    const currentTime = `${today.toLocaleDateString('en-GB')} ${today.getHours()}:${today.getMinutes().toString().padStart(2, '0')}`;

    // Company Information
    const companyInfoTitle = 'Company Information';
    const companyName = 'Company Name: Digital Identity';
    const taxID = 'Tax ID: DIGID*******';
    const companyAddress = 'Address: ************';

    doc.setFontSize(22);
    doc.text('PAYSLIP', pageWidth / 2, 20, { align: 'center' });

    doc.setFontSize(14);
    doc.setTextColor(105, 105, 105); // Dark gray color
    doc.text(`Issued on: ${currentTime}`, pageWidth / 2, 30, { align: 'center' });

    // Reset text color to black for other text
    doc.setTextColor(0, 0, 0);

    doc.setFontSize(15);
    doc.text(companyInfoTitle, 20, 50);

    // Draw border for company information
    const infoStartY = 55;
    const infoHeight = 30;
    const infoPadding = 5;
    doc.setDrawColor(105, 105, 105); // Dark gray color
    doc.rect(20, infoStartY, pageWidth - 40, infoHeight);

    // Company name, Tax ID, and Address inside the border
    doc.setFontSize(12);
    let y = infoStartY + infoPadding;
    doc.text(companyName, 25, y);
    y += 10;
    doc.text(taxID, 25, y);
    y += 10;
    doc.text(companyAddress, 25, y);

    // Employee details left
    y = infoStartY + infoHeight + 10;
    doc.text(`Registration Number: ${this.payroll.user.username}`, 20, y);
    y += 10;
    doc.text(`Last Name: ${this.payroll.user.lastname}`, 20, y);
    y += 10;
    doc.text(`First Name: ${this.payroll.user.firstname}`, 20, y);
    y += 10;
    doc.text(`Status: ${this.payroll.user.roles.map(role => role.name).join(', ')}`, 20, y);
    y += 10;
    doc.text(`Position: ${this.payroll.user.job}`, 20, y);
    y += 10;
    doc.text(`Department: ${this.payroll.user.department}`, 20, y);

    // Employee details right
    y = infoStartY + infoHeight + 10;
    let x = pageWidth / 2 + 20;
    doc.text(`Year: ${this.getYear(this.payroll.payrollDate)}`, x, y);
    y += 10;
    doc.text(`Month: ${this.getMonth(this.payroll.payrollDate)}`, x, y);
    y += 10;
    doc.text(`Pay Type: Monthly Salary`, x, y);
    y += 10;
    doc.text(`Work Regime: 48`, x, y);
    y += 10;
    doc.text(`Basic Salary: ${this.payroll.user.salary.toFixed(2)}`, x, y);

    (doc as any).autoTable({
        startY: y + 20,
        head: [['Code', 'Label', 'Amount', 'Earnings', 'Deductions']],
        body: [
            ['100', 'Basic Salary', `${this.convertHoursToDays(this.payroll.totalHoursWorkedBeforeAdjustment) - this.convertMinutesToDays(this.payroll.overtimeMinutes)} days`, this.calculateBaseSalary().toFixed(2), '0.00'],
            ['160', 'Performance Bonus', '7%', this.calculatePrimeRendement(this.calculateBaseSalary()).toFixed(2), '0.00'],
            ['160', 'Overtime', `${this.convertMinutesToDays(this.payroll.overtimeMinutes)} days`, this.calculateOvertimePay().toFixed(2), '0.00'],
            ['200', 'Gross Salary', `${this.convertHoursToDays(this.payroll.totalHoursWorkedBeforeAdjustment)} days`, this.calculateGrossSalary().toFixed(2), '0.00'],
            ['210', 'C.N.S.S.', '10%', '0.00', this.calculateCNSS(this.calculateGrossSalary()).toFixed(2)],
            ['240', 'Taxable Salary', '0.00', this.calculateTaxableSalary().toFixed(2), '0.00'],
            ['400', 'Social Contribution', '1%', '0.00', this.calculateContributionSolidaire(this.calculateGrossSalary()).toFixed(2)],
            ['450', 'Source Deduction', '6%', '0.00', this.calculateSourceDeduction(this.calculateGrossSalary()).toFixed(2)],
            ['500', 'Net Pay', '0.00', this.calculateNetSalary().toFixed(2), '0.00']
        ],
        styles: {
            cellPadding: 3,
            fontSize: 12,
            lineColor: 0, // Border color
            lineWidth: 0.5 // Border width
        },
        headStyles: {
            fillColor: [230, 230, 230], // Light gray background color
            textColor: [0, 0, 0], // Black text color
            lineColor: 0, // Border color
            lineWidth: 0.2 // Border width
        },
        bodyStyles: {
            fillColor: [255, 255, 255], // White cell background
            textColor: [0, 0, 0], // Black text color
            lineColor: 0, // Border color
            lineWidth: 0.2 // Border width
        },
        alternateRowStyles: {
            fillColor: [255, 255, 255] // Ensure alternate rows are also white
        },
    });

    // Save the PDF to a Blob
    const pdfBlob = doc.output('blob');

    // Send the PDF to the backend
    this.payrollService.sendPayslip(pdfBlob, this.payroll.user.username)
        .subscribe(response => {
            console.log('PDF sent to backend successfully.');
            this.isPayslipNotificationSent = true; // Disable the button after sending
        }, error => {
            console.error('Error sending PDF to backend:', error);
        });
  }
}
