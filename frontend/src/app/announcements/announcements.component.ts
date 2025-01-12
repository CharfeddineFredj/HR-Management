import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnnouncementService } from '../sevices/announcement.service';

@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AnnouncementsComponent implements OnInit {
  announcements: any[] = [];
  sortedAnnouncements: any[] = [];
  e: number = 1;
  highlightedAnnouncementId: string | null = null;

  constructor(private announcementService: AnnouncementService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.highlightedAnnouncementId = params['id'];
      this.loadAnnouncements();
    });
  }

  loadAnnouncements(): void {
    this.announcementService.getAllAnnouncements().subscribe(
      (data: any) => {
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

    this.sortedAnnouncements = this.announcements
      .map(announcement => {
        if (announcement.id.toString() === this.highlightedAnnouncementId) {
          return { ...announcement, highlighted: true };
        }
        return { ...announcement, highlighted: false };
      })
      .sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
  }

  onPageChange(event: number): void {
    this.e = event;
    this.sortAnnouncements();
  }
}
