import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  currentYear: number = new Date().getFullYear();
  showBackToTop = false;

  constructor() { }

  ngOnInit(): void {
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const threshold = 300;  // Le bouton apparaîtra après 300px de défilement
    const yPosition = window.pageYOffset || document.documentElement.scrollTop;
    this.showBackToTop = yPosition > threshold;
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'  // Défilement doux vers le haut
    });
  }

}
