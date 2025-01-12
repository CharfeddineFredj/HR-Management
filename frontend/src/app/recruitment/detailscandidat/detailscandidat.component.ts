import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Candidate, CandidateService } from 'src/app/sevices/candidate.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detailscandidat',
  templateUrl: './detailscandidat.component.html',
  styleUrls: ['./detailscandidat.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DetailscandidatComponent implements OnInit {
  candidate: any;
  isFullTextVisible: boolean = false;
  truncatedExperience: string = '';
  isLoading: boolean = false;






  @ViewChild('experienceSection') experienceSection: ElementRef;
  @ViewChild('civilitySection') civilitySection: ElementRef;
  @ViewChild('studyLevelSection') studyLevelSection: ElementRef;
  @ViewChild('documentsSection') documentsSection: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private candidateService: CandidateService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.candidateService.getCandidate(+id).subscribe((data: Candidate) => {
        this.candidate = data;
      });
    }
  }
  generateFileName(firstname: string, lastname: string): string {
    return `${firstname}_${lastname}_CV`;
  }

  completeUrl(cv: string): string {
    const baseUrl = 'http://localhost:8086/candidate/download/'; // Modify the base URL here
    return `${baseUrl}${cv}`;
  }

  truncateText(text: string, wordLimit: number = 1): string {
    const words = text.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return text;
  }

  toggleFullText(): void {
    this.isFullTextVisible = !this.isFullTextVisible;
  }

  scrollAllSections(): void {
    [this.civilitySection, this.studyLevelSection, this.experienceSection, this.documentsSection].forEach(section => {
      section.nativeElement.scrollTop = 0;
    });
  }


  sendConfirmationEmail() {
    this.isLoading = true;
    console.log('Sending confirmation email...');

    this.candidateService.sendConfirmationEmail(this.candidate).subscribe(() => {
      console.log('Confirmation email sent, now updating status...');

      this.candidateService.updateCandidateStatus(this.candidate.id, 'Confirmed').subscribe({
        next: (response) => {
          console.log('Status update successful', response);
          this.isLoading = false;
          if (response && response.message === 'Status updated successfully') {
            Swal.fire({
              title: 'Success!',
              text: 'Confirmation email sent and status updated.',
              icon: 'success',
              confirmButtonText: 'OK'
            });
          } else {
            Swal.fire({
              title: 'Error!',
              text: 'Confirmation email sent but status update response was not as expected.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        },
        error: (error) => {
          console.error('Error updating status:', error);
          this.isLoading = false;
          Swal.fire({
            title: 'Error!',
            text: 'Confirmation email sent but failed to update status.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      });
    }, error => {
      console.error('Error sending confirmation email:', error);
      this.isLoading = false;
      Swal.fire({
        title: 'Error!',
        text: 'Failed to send confirmation email.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    });
  }

  sendRejectionEmail() {
    this.isLoading = true;
    console.log('Sending rejection email...');

    this.candidateService.sendRejectionEmail(this.candidate).subscribe(() => {
      console.log('Rejection email sent, now updating status...');

      this.candidateService.updateCandidateStatus(this.candidate.id, 'Rejected').subscribe({
        next: (response) => {
          console.log('Status update successful', response);
          this.isLoading = false;
          if (response && response.message === 'Status updated successfully') {
            Swal.fire({
              title: 'Success!',
              text: 'Rejection email sent and status updated.',
              icon: 'success',
              confirmButtonText: 'OK'
            });
          } else {
            Swal.fire({
              title: 'Error!',
              text: 'Rejection email sent but status update response was not as expected.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        },
        error: (error) => {
          console.error('Error updating status:', error);
          this.isLoading = false;
          Swal.fire({
            title: 'Error!',
            text: 'Rejection email sent but failed to update status.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      });
    }, error => {
      console.error('Error sending rejection email:', error);
      this.isLoading = false;
      Swal.fire({
        title: 'Error!',
        text: 'Failed to send rejection email.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    });
  }


}
