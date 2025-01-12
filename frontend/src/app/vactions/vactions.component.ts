import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { VacationRequest, VactionsService } from '../sevices/vactions.service';
import { UserAuthService } from '../sevices/user-auth.service';


@Component({
  selector: 'app-vactions',
  templateUrl: './vactions.component.html',
  styleUrls: ['./vactions.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class VactionsComponent implements OnInit {
  vacationRequests: VacationRequest[] = [];
  filteredRequests: VacationRequest[] = [];
  currentPage: number = 1;
  userRole: string = '';
  registrationNumber: string = '';

  constructor(
    private vacationService: VactionsService,
    private router: Router,
    private userAuth: UserAuthService
  ) {}

  ngOnInit(): void {
    this.userRole = this.userAuth.getRoles()[0]; // Assuming a single role for simplicity
    this.registrationNumber = this.userAuth.getusername(); // Assuming the registration number is stored as the username
    this.getVacationRequests();
  }

  getImageUrl(image: string): string {
    return image ? `http://localhost:8086/employee/files/${image}` : 'assets/default-user.png';
  }

  getVacationRequests(): void {
    this.vacationService.getAllVacations().subscribe(requests => {
      this.vacationRequests = requests;
      this.filterRequests();
    });
  }

  filterRequests(): void {
    this.filteredRequests = this.vacationRequests.filter(request => request.registrationNumber !== this.registrationNumber);
  }

  viewRequest(request: VacationRequest): void {
    this.router.navigate(['/home/congeRequest'], { queryParams: { id: request.id } });
  }

  deleteRequest(id: number): void {
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
        this.vacationService.deleteVacationRequest(id).subscribe(() => {
          this.getVacationRequests();
          Swal.fire(
            'Deleted!',
            'The request has been deleted.',
            'success'
          );
        });
      }
    });
  }

  refreshRequests() {
    this.getVacationRequests();
  }
}
