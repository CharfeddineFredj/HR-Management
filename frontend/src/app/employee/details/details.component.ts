import { Component, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import 'jspdf-autotable';
import { EmployeeService } from 'src/app/sevices/employee.service';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import jsPDF from 'jspdf';





@NgModule({
  imports: [CommonModule],
  schemas:  [NO_ERRORS_SCHEMA],
})

export class DetailsModule {}

interface Role {
  id: number;
  name: string;
}

interface Employee {
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  job: string;
  address: string;
  department: string;
  phone: string;
  id_card: string;
  salary: number;
  date_birth: string;
  hire_date: string;
  image: string;
  roles: Role[];
  gender:string;
  contract_type:string;
}

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
  providers: [DatePipe]
})



export class DetailsComponent implements OnInit {
  oneemployee: Employee ; // Initialize as null for better null checks
  imageUrl: string | ArrayBuffer = '';

  constructor(
    private employeeService: EmployeeService,
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe// Changed to a more standard naming convention
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loadEmployeeDetails(id);
      }
    });
  }

  loadEmployeeDetails(id: string): void {
    this.employeeService.getemployee(id).subscribe({
      next: (res: Employee) => {
        this.oneemployee = res;
        this.imageUrl = `http://localhost:8086/employee/files/${this.oneemployee.image}`;
        // console.log("Employee details:", this.oneemployee);
      },
      error: (error) => {
        console.error('Failed to load employee details', error);
        // Optionally handle user feedback here
      }
    });
  }
  downloadProfile(): void {
    const doc: any = new jsPDF();
    const imgData = this.imageUrl as string; // Ensure the imageUrl is valid
    const imgWidth = 30;
    const imgHeight = imgWidth; // Simplified proportion calculation
    const imgX = 14;
    const imgY = 10;

    // Add the header image
    doc.addImage(imgData, 'JPEG', imgX, imgY, imgWidth, imgHeight);

    // Add the additional logo at the top right of the page
    const logoData = 'assets/img/Picture1.png';
    const logoWidth = 26;
    const logoHeight = logoWidth; // Assuming square logo
    const pageWidth = doc.internal.pageSize.getWidth();
    const logoX = pageWidth - logoWidth - 14; // Positioned 14 units from the right edge
    const logoY = 10; // Same vertical position as the first image

    doc.addImage(logoData, 'PNG', logoX, logoY, logoWidth, logoHeight);

    // Add the header text aligned with the image
    const headerTextX = imgX + imgWidth + 10; // Adjust spacing between image and text
    const headerTextY = imgY + imgHeight / 2 + 5; // Center the text vertically with the image

    doc.setFontSize(20);
    doc.text('Digital Identity', headerTextX, imgY + 5); // Adjusted Y position for better alignment
    doc.setFontSize(13);
    doc.text('Employee Profile', headerTextX, imgY + 15); // Adjusted Y position for better alignment

    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Generated on: ${this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm')}`, headerTextX, imgY + 30); // Adjusted Y position

    // Add a line break
    doc.setLineWidth(0.5);
    doc.line(14, imgY + imgHeight + 5, doc.internal.pageSize.getWidth() - 14, imgY + imgHeight + 5);

    // Define the y position for the table start
    const tableStartY = imgY + imgHeight + 10;

    const formattedHireDate = this.datePipe.transform(this.oneemployee?.hire_date, 'yyyy-MM-dd HH:mm');
    const profileDetails = [
        ['Registration Number', this.oneemployee?.username],
        ['Full Name', `${this.oneemployee?.firstname} ${this.oneemployee?.lastname}`],
        ['Email', this.oneemployee?.email],
        ['Gender', this.oneemployee?.gender],
        ['Job', this.oneemployee?.job],
        ['Address', this.oneemployee?.address],
        ['Department', this.oneemployee?.department],
        ['Phone', this.oneemployee?.phone],
        ['Identity Card', this.oneemployee?.id_card],
        ['Salary', `${this.oneemployee?.salary}`],
        ['Date of Birth', this.oneemployee?.date_birth],
        ['Contract Type', this.oneemployee?.contract_type],
        ['Hiring Date', formattedHireDate],
        ['Role', this.oneemployee?.roles.map(role => role.name).join(', ')]
    ];

    // Add employee profile details
    doc.autoTable({
        startY: tableStartY,
        head: [['Field', 'Details']],
        body: profileDetails,
        theme: 'grid',
        headStyles: {
            fillColor: [22, 160, 133], // Change header color
            textColor: [255, 255, 255],
            fontSize: 14,
            halign: 'center'
        },
        bodyStyles: {
            fillColor: [245, 245, 245], // Change body color
            textColor: [0, 0, 0],
            fontSize: 12
        },
        alternateRowStyles: {
            fillColor: [255, 255, 255]
        },
        styles: {
            lineColor: [189, 195, 199],
            cellPadding: 3
        },
        columnStyles: {
            0: { cellWidth: 50 }, // Adjusted width for better readability
            1: { cellWidth: 100 } // Adjusted width for better readability
        }
    });

    // Add footer
    const pageCount = doc.internal.getNumberOfPages();
    doc.setFontSize(10);
    doc.setTextColor(150);
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
    }

    doc.save('profile_details.pdf');
}


}
