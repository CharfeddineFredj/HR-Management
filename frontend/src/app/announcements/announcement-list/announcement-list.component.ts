import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Announcement, AnnouncementService } from 'src/app/sevices/announcement.service';

import { AngularEditorConfig } from '@kolkov/angular-editor';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-announcement-list',
  templateUrl: './announcement-list.component.html',
  styleUrls: ['./announcement-list.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AnnouncementListComponent implements OnInit {
  announcements: Announcement[] = [];
  sortedAnnouncements: Announcement[] = [];
  e: number = 1;

  announcement: Announcement = {
    id: null,
    title: '',
    content: ''
  };

  isEditMode: boolean = false;

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '11rem',
    width: '59rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    enableToolbar: true,
    showToolbar: true,
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['insertImage','insertVideo','insertHorizontalRule','removeFormat','toggleEditorMode'],
    ]
  };

  @ViewChild('addAnnouncementModal', { static: true }) addAnnouncementModal;

  constructor(private announcementService: AnnouncementService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.loadAnnouncements();
  }

  loadAnnouncements(): void {
    this.announcementService.getAllAnnouncements().subscribe(
      (data: Announcement[]) => {
        this.announcements = data;
        this.sortAnnouncements();
      },
      (error: any) => {
        console.error('Error fetching announcements', error);
      }
    );
  }

  sortAnnouncements(): void {
    if (this.announcements.length === 0) {
      this.sortedAnnouncements = this.announcements;
      return;
    }

    this.sortedAnnouncements = this.announcements.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  onPageChange(event: number): void {
    this.e = event;
    this.sortAnnouncements();
  }

  openAddAnnouncementModal(content): void {
    this.isEditMode = false;
    this.announcement = { id: null, title: '', content: '' }; // Reset the form
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  onSubmit(modal): void {
    if (!this.announcement.title || !this.announcement.content) {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Form',
        text: 'Please fill in all required fields.'
      });
      return;
    }

    if (this.isEditMode) {
      this.updateAnnouncement(modal);
    } else {
      this.addAnnouncement(modal);
    }
  }

  addAnnouncement(modal): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to add this announcement?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, add it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.announcementService.addAnnouncements(this.announcement).subscribe(
          response => {
            Swal.fire(
              'Added!',
              'The announcement has been added.',
              'success'
            );
            this.loadAnnouncements(); // Refresh the announcements list
            modal.close();
          },
          error => {
            Swal.fire(
              'Error!',
              'There was an error adding the announcement.',
              'error'
            );
          }
        );
      }
    });
  }

  editAnnouncement(announcement: Announcement): void {
    this.isEditMode = true;
    this.announcementService.getAnnouncementById(announcement.id!).subscribe(
      (data: Announcement) => {
        this.announcement = data; // Load the announcement data into the form
        this.modalService.open(this.addAnnouncementModal); // Open the modal for editing
      },
      (error: any) => {
        console.error('Error fetching announcement', error);
      }
    );
  }

  updateAnnouncement(modal): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to update this announcement?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, update it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.announcementService.updateAnnouncement(this.announcement).subscribe(
          response => {
            Swal.fire(
              'Updated!',
              'The announcement has been updated.',
              'success'
            );
            this.loadAnnouncements(); // Refresh the announcements list
            modal.close();
          },
          error => {
            Swal.fire(
              'Error!',
              'There was an error updating the announcement.',
              'error'
            );
          }
        );
      }
    });
  }

  deleteAnnouncement(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to delete this announcement?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.announcementService.removeannounce(id).subscribe(
          () => {
            Swal.fire(
              'Deleted!',
              'The announcement has been deleted.',
              'success'
            );
            this.loadAnnouncements(); // Re-fetch the list of announcements after deletion
          },
          error => {
            Swal.fire(
              'Error!',
              'There was an error deleting the announcement.',
              'error'
            );
          }
        );
      }
    });
  }
}
