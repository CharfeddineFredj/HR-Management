import { Component, OnInit } from '@angular/core';

import * as mapboxgl from 'mapbox-gl';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { Pointage, WorkScheduleServiceService } from '../sevices/work-schedule-service.service';
import { Router } from '@angular/router';
import { UserAuthService } from '../sevices/user-auth.service';

@Component({
  selector: 'app-employees-working-hours-list',
  templateUrl: './employees-working-hours-list.component.html',
  styleUrls: ['./employees-working-hours-list.component.css']
})
export class EmployeesWorkingHoursListComponent implements OnInit {
  pointages: Pointage[] = [];
  search: string = '';
  page: number = 1;
  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat = 37.75;
  lng = -122.41;
  zoom = 10;
  marker: mapboxgl.Marker;
  userRoles: string[] = [];

  constructor(private pointageService: WorkScheduleServiceService, private router: Router, private authService: UserAuthService,) {
    mapboxgl.accessToken = 'pk.eyJ1IjoibWVkemFvdWFsaSIsImEiOiJjbHd5MGc5MzcxaWljMmxyM3JmeGtobjRpIn0.gfR1b0A7roJVqDNTlV6ulg';
  }

  ngOnInit(): void {
    this.loadPointages();
    this.initializeMap();
    this.getUserRoles();
  }

  loadPointages() {
    this.pointageService.getPointages().subscribe(
      (data: Pointage[]) => {
        this.pointages = data;
      },
      (error: any) => {
        console.error('Error fetching pointages:', error);
      }
    );
  }

  initializeMap() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: this.zoom,
      center: [this.lng, this.lat]
    });

    this.map.on('load', () => {
      this.addMarker(this.lat, this.lng);
    });
  }

  addMarker(lat: number, lng: number) {
    this.marker = new mapboxgl.Marker({
      draggable: true
    })
      .setLngLat([lng, lat])
      .addTo(this.map);

    this.marker.on('dragend', () => {
      const lngLat = this.marker.getLngLat();
      console.log(`Marker dropped at: ${lngLat.lng}, ${lngLat.lat}`);
    });
  }

  showOnMap(latitude: number, longitude: number) {
    this.map.flyTo({
      center: [longitude, latitude],
      essential: true,
      zoom: 14
    });

    if (this.marker) {
      this.marker.setLngLat([longitude, latitude]);
    } else {
      this.addMarker(latitude, longitude);
    }
  }

  updateSearch() {
    // Custom search logic if needed
  }

  clearSearch() {
    this.search = '';
    this.updateSearch();
  }

  downloadCSV() {
    const exportData = this.pointages.map(pointage => ({
      'Registration Number': pointage.user.username,
      'First Name': pointage.user.firstname,
      'Last Name': pointage.user.lastname,
      'Check-In Time': pointage.checkInTime,
      'Check-Out Time': pointage.checkOutTime,
      Status: pointage.completed ? 'Completed' : 'Not Completed'
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'pointages.xlsx');
  }

  downloadPDF() {
    const exportData = this.pointages.map(pointage => ({
      Username: pointage.user.username,
      'First Name': pointage.user.firstname,
      'Last Name': pointage.user.lastname,
      'Check-In Time': pointage.checkInTime,
      'Check-Out Time': pointage.checkOutTime,
      Status: pointage.completed ? 'Completed' : 'Not Completed'
    }));

    const doc: any = new jsPDF();

    // Add logo
    const img = new Image();
    img.src = 'assets/img/Picture1.png'; // Path to your logo image
    img.onload = () => {
      doc.addImage(img, 'PNG', 160, 10, 30, 30); // Adjust the position and size as needed

      // Add text
      doc.setFontSize(18);
      doc.text('Digital Identity', 14, 22);
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text('Employee Pointing List', 14, 32);
      const currentDate = new Date();
      doc.text(`Generated on: ${currentDate.toLocaleDateString()} at ${currentDate.toLocaleTimeString()}`, 14, 40);

      // Add table
      const columns = ['Registration Number', 'First Name', 'Last Name', 'Check-In Time', 'Check-Out Time', 'Status'];
      const rows = exportData.map(item => [
        item.Username, item['First Name'], item['Last Name'], item['Check-In Time'], item['Check-Out Time'], item.Status
      ]);

      doc.autoTable({
        head: [columns],
        body: rows,
        startY: 60, // Adjust the starting Y position to fit the header
        styles: {
          fontSize: 8,
          cellPadding: 4,
          valign: 'middle',
          halign: 'center',
          overflow: 'linebreak'
        },
      });

      doc.save('pointages.pdf');
    };
  }

  editPointage(pointage: any) {
    this.router.navigate(['/home/edit-pointage', pointage.id]);
  }
  getUserRoles() {
    this.userRoles = this.authService.getRoles(); // Adjust based on your auth service implementation
  }

  isRoleAllowed(allowedRoles: string[]): boolean {
    return allowedRoles.some(role => this.userRoles.includes(role));
  }
}
