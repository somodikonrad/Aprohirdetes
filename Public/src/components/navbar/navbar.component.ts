import {Component, HostListener} from '@angular/core';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';  // <-- Importáld ezt a modult
import { CommonModule } from '@angular/common';
/**
 * @title Nested menu
 */

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [MatButtonModule, MatMenuModule, CommonModule, MatIconModule]  
})
export class NavbarComponent {
  isMobile: boolean = false;
  isMenuOpen: boolean = false;

  
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {  // Típus hozzáadása
    const width = (event.target as Window).innerWidth; 
    this.isMobile = width <= 600;
  }

  // Menü megjelenítése/elrejtése
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  ngOnInit() {
    // Kezdeti ellenőrzés a képernyő szélesség alapján
    this.isMobile = window.innerWidth <= 600;
  }
}