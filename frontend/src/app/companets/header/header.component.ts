import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PayrollService } from 'src/app/sevices/payroll.service';
import { UserAuthService } from 'src/app/sevices/user-auth.service';
import { UserProfile, UserService } from 'src/app/sevices/user.service';
import { WebSocketServicePayslip } from 'src/app/sevices/web-socket-service-payslip.service';
import { WebSocketService } from 'src/app/sevices/web-socket.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  profile: UserProfile | null = null;
  error: string | null = null;
  imageUrl: string = '';
  notifications: { id: string, message: string, read: boolean, timestamp: number }[] = [];
  payslipNotifications: { message: string, downloadLink: string, read: boolean, timestamp: number }[] = [];
  isOpen: boolean = false;

  constructor(
    private userAuthService: UserAuthService,
    private router: Router,
    public userService: UserService,
    private webSocketService: WebSocketService,
    private webSocketServicePayslip: WebSocketServicePayslip,
    private payrollService: PayrollService
  ) { }

  ngOnInit(): void {
    this.loadNotifications(); // Load notifications from localStorage
    this.loadPayslipNotifications(); // Load payslip notifications from localStorage

    this.userService.UserProfileById().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.imageUrl = profile.image ? `http://localhost:8086/employee/files/${profile.image}` : '';
      },
      error: (err) => this.error = 'Failed to load user profile'
    });

    this.webSocketService.notifications.subscribe(notification => {
      console.log('Notification received:', notification);
      this.notifications.push({
        id: notification.id,
        message: notification.message,
        read: false,
        timestamp: Date.now()
      });
      this.saveNotifications(); // Save notifications after adding a new one
      this.sortNotifications(); // Sort notifications after adding
    });

    this.webSocketServicePayslip.notifications.subscribe(notification => {
      console.log('Payslip notification received:', notification);
      this.payslipNotifications.push({
        message: notification.message,
        downloadLink: notification.downloadLink,
        read: false,
        timestamp: Date.now()
      });
      this.savePayslipNotifications(); // Save payslip notifications after adding a new one
      this.sortPayslipNotifications(); // Sort payslip notifications after adding
    });
  }

  toggleSidebar(): void {
    this.isOpen = !this.isOpen;
  }

  public isLoggedIn() {
    return this.userAuthService.isLoggedIn();
  }

  public logout(): void {
    this.userService.signout().subscribe(() => {
      this.userAuthService.clear(); // Clear user authentication
      this.router.navigate(['/login']); // Navigate to the login page
    }, error => {
      console.error('Logout error:', error);
    });
  }

  viewAnnouncement(id: string, index: number): void {
    this.notifications[index].read = true;
    this.saveNotifications(); // Save notifications after modification

    // Navigate to the announcement page with the announcement ID
    this.router.navigate(['/home/announcementNotification'], { queryParams: { id } });

    // Clear read notifications after navigation
    setTimeout(() => {
      this.clearReadNotifications();
    }, 500); // Adjust delay as necessary
  }

  downloadPayslip(downloadLink: string, index: number): void {
    this.payslipNotifications[index].read = true;
    this.savePayslipNotifications(); // Save payslip notifications after modification
    this.clearReadPayslipNotifications(); // Clear read notifications after modification

    // Use the payroll service to download the file
    const fileName = downloadLink.split('/').pop();
    this.payrollService.downloadFile(fileName).subscribe(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }, error => {
        console.error('Error downloading file', error);
    });
}


  navigateToAnnouncements(): void {
    if (this.isLoggedIn()) {
      this.notifications.forEach(notification => notification.read = true); // Mark all notifications as read
      this.saveNotifications();
      this.clearReadNotifications(); // Clear read notifications
      this.router.navigate(['/home/announcementNotification']); // Use Router for navigation
    } else {
      console.warn('User is not authenticated');
      this.router.navigate(['/login']); // Navigate to login if not authenticated
    }
  }

  getUnreadNotificationCount(): number {
    return this.notifications.filter(notification => !notification.read).length;
  }

  getUnreadPayslipNotificationCount(): number {
    return this.payslipNotifications.filter(notification => !notification.read).length;
  }

  saveNotifications(): void {
    console.log('Saving notifications:', this.notifications);
    localStorage.setItem('notifications', JSON.stringify(this.notifications));
  }

  loadNotifications(): void {
    const savedNotifications = localStorage.getItem('notifications');
    console.log('Loaded notifications from localStorage:', savedNotifications);
    if (savedNotifications) {
      this.notifications = JSON.parse(savedNotifications);
      this.sortNotifications(); // Sort notifications after loading
    }
  }

  savePayslipNotifications(): void {
    console.log('Saving payslip notifications:', this.payslipNotifications);
    localStorage.setItem('payslipNotifications', JSON.stringify(this.payslipNotifications));
  }

  loadPayslipNotifications(): void {
    const savedPayslipNotifications = localStorage.getItem('payslipNotifications');
    console.log('Loaded payslip notifications from localStorage:', savedPayslipNotifications);
    if (savedPayslipNotifications) {
      this.payslipNotifications = JSON.parse(savedPayslipNotifications);
      this.sortPayslipNotifications(); // Sort payslip notifications after loading
    }
  }

  clearReadNotifications(): void {
    this.notifications = this.notifications.filter(notification => !notification.read);
    this.saveNotifications(); // Save after deleting read notifications
  }

  clearReadPayslipNotifications(): void {
    this.payslipNotifications = this.payslipNotifications.filter(notification => !notification.read);
    this.savePayslipNotifications(); // Save after deleting read payslip notifications
  }

  sortNotifications(): void {
    this.notifications.sort((a, b) => b.timestamp - a.timestamp);
  }

  sortPayslipNotifications(): void {
    this.payslipNotifications.sort((a, b) => b.timestamp - a.timestamp);
  }

  formatTimestamp(timestamp: number): string {
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) {
      return `il y a ${years} ${years > 1 ? 'années' : 'année'}`;
    } else if (months > 0) {
      return `il y a ${months} ${months > 1 ? 'mois' : 'mois'}`;
    } else if (days > 0) {
      return `il y a ${days} ${days > 1 ? 'jours' : 'jour'}`;
    } else if (hours > 0) {
      return `il y a ${hours} ${hours > 1 ? 'heures' : 'heure'}`;
    } else if (minutes > 0) {
      return `il y a ${minutes} ${minutes > 1 ? 'minutes' : 'minute'}`;
    } else {
      return `il y a ${seconds} ${seconds > 1 ? 'secondes' : 'seconde'}`;
    }
  }
}
