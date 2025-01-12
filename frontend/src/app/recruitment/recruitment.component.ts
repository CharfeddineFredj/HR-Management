import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import Swal from 'sweetalert2';
import { EmployeeService } from '../sevices/employee.service';
import { UserProfile, UserService } from '../sevices/user.service';
import { UserAuthService } from '../sevices/user-auth.service';
import { CandidateService } from '../sevices/candidate.service';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-recruitment',
  templateUrl: './recruitment.component.html',
  styleUrls: ['./recruitment.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class RecruitmentComponent implements OnInit {

  listcandidate
  e: number = 1;
  search: string = '';
  isInputFocused = false;
  imageUrl: string | ArrayBuffer = '';
  currentUser: UserProfile;

  constructor(
    private service: CandidateService,
  ) { }

  ngOnInit(): void {
   this.allCandidate();
  }


  allCandidate() {
    this.service.getAllCandidates().subscribe((res: any) => {
      this.listcandidate = res.map((candidate: any) => {
        // Assurez-vous que l'URL du CV est complète
        candidate.cv = this.completeUrl(candidate.cv);
        return candidate;
      });
    });
  }

  completeUrl(cv: string): string {
    const baseUrl = 'http://localhost:8086/candidate/download/'; // Modifiez l'URL de base ici
    return `${baseUrl}${cv}`;
  }


  updateSearch(): void {
    // This method is triggered on each input event
    // It can contain logic to filter data or simply trigger Angular's change detection
  }

  clearSearch(): void {
    this.search = '';  // Clears the search input
    this.updateSearch();  // Optionally update list or icons
  }

  generateFileName(firstname: string, lastname: string): string {
    return `${firstname}_${lastname}_CV.pdf`;
  }

  deletecandidate(id:any){
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.removeCandidate(id).subscribe((res:any)=>{
            console.log("candidate supprimer",res);
            this.allCandidate();

        })
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
      }
    })

  }


  downloadCSV() {
    const filteredData = this. listcandidate.map(e => {
      return {
        id: e.id,
        email: e.email,
        firstname: e.firstname,
        lastname: e.lastname,
        date_birth: e.date_birth,
        phone: e.phone,
      };
    });

    const csvData = this.convertToCSV(filteredData);
    const blob = new Blob([csvData], { type: 'text/csv' });
    saveAs(blob, 'candidates.csv');
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
    doc.text('Candidates Data Report', 14, 32);
    const currentDate = new Date();
    doc.text(`Generated on: ${currentDate.toLocaleDateString()} at ${currentDate.toLocaleTimeString()}`, 14, 40);



    const pageWidth = doc.internal.pageSize.getWidth();
    doc.addImage('assets/img/Picture1.png', 'PNG', pageWidth - 50, 10, 20, 20);

    const filteredData = this. listcandidate.map(e => [
      e.id,
      e.firstname,
      e.lastname,
      e.email,
      e.date_birth,
      e.phone,

    ]);

    // Define the columns
    const columns = [
      { header: 'ID', dataKey: 'id' },
      { header: 'First Name', dataKey: 'firstname' },
      { header: 'Last Name', dataKey: 'lastname' },
      { header: 'Email', dataKey: 'email' },
      { header: 'Date of Birth', dataKey: 'date_birth' },
      { header: 'Phone', dataKey: 'phone' },
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

    doc.save('employees.pdf');
  }



}
