import { Component, OnInit } from '@angular/core';
import { UserProfile, UserService } from 'src/app/sevices/user.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  profile: UserProfile | null = null;
  isSidebarExpanded = true;
  imageUrl: string = '';
  error: string | null = null;
  userId: number;

  toggleSidebar(): void {
    this.isSidebarExpanded = !this.isSidebarExpanded;
  }

  constructor(public userService: UserService) { }

  ngOnInit(): void {
    this.userService.UserProfileById().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.imageUrl = profile.image ? `http://localhost:8086/employee/files/${profile.image}` : '';
      },
      error: (err) => this.error = 'Failed to load user profile'
    });
  }

}
