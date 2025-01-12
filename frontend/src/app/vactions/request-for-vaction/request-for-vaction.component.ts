import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VacationRequest, VactionsService } from 'src/app/sevices/vactions.service';
import { ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-request-for-vaction',
  templateUrl: './request-for-vaction.component.html',
  styleUrls: ['./request-for-vaction.component.css']
})
export class RequestForVactionComponent implements OnInit {
  selectedRequest: VacationRequest;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vacationService: VactionsService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const requestId = params['id'];
      if (requestId) {
        this.getVacationRequestById(requestId);
      }
    });
  }

  getImageUrl(image: string): string {
    const url = image ? `http://localhost:8086/employee/files/${image}` : 'assets/default-user.png';
    return url;
  }

  getMedicalCertificateUrl(filename: string): string {
    return `http://localhost:8086/vactions/download/${filename}`;
  }

  getVacationRequestById(id: number): void {
    this.vacationService.getVacationById(id).subscribe(
      (request: VacationRequest) => {
        console.log('Vacation request fetched:', request); // Log data
        request.imageUrl = this.getImageUrl(request.imageUrl);
        this.selectedRequest = request;
        this.cd.detectChanges(); // Force change detection
        console.log('Selected request:', this.selectedRequest); // Log data
      },
      error => {
        console.error('Error fetching vacation request:', error);
      }
    );
  }

  approveRequest(id: number): void {
    Swal.fire({
      icon: 'warning',
      title: 'Approve Request',
      text: 'Are you sure you want to approve this vacation request?',
      showCancelButton: true,
      confirmButtonText: 'Yes, approve it!',
      cancelButtonText: 'No, cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.vacationService.approveVacation(id).subscribe(
          () => {
            Swal.fire({
              icon: 'success',
              title: 'Request Approved',
              text: 'The vacation request has been approved successfully.'
            }).then(() => {
              this.router.navigate(['/home/listvactions']);
            });
          },
          error => {
            console.error('Error approving vacation request:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'An error occurred while approving the request. Please try again later.'
            });
          }
        );
      }
    });
  }

  rejectRequest(id: number): void {
    Swal.fire({
      icon: 'warning',
      title: 'Reject Request',
      text: 'Are you sure you want to reject this vacation request?',
      showCancelButton: true,
      confirmButtonText: 'Yes, reject it!',
      cancelButtonText: 'No, cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.vacationService.rejectVacation(id).subscribe(
          () => {
            Swal.fire({
              icon: 'success',
              title: 'Request Rejected',
              text: 'The vacation request has been rejected successfully.'
            }).then(() => {
              this.router.navigate(['/home/listvactions']);
            });
          },
          error => {
            console.error('Error rejecting vacation request:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'An error occurred while rejecting the request. Please try again later.'
            });
          }
        );
      }
    });
  }
}
