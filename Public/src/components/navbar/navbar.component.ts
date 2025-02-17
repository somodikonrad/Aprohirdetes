import { Component, HostListener, OnInit } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [MatButtonModule, MatMenuModule, CommonModule, MatIconModule, RouterModule],
})
export class NavbarComponent implements OnInit {
  isMobile: boolean = false;
  isMenuOpen: boolean = false;
  categories: any[] = []; // Kategóriák tárolása

  constructor(private api: ApiService, private router: Router) {} // Inject Router) {} // API injektálása

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    const width = (event.target as Window).innerWidth;
    this.isMobile = width <= 825;
  }

  ngOnInit() {
    this.isMobile = window.innerWidth <= 600;
    this.categorieLoad();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  categorieLoad() {
    this.api.getCategories().subscribe({
      next: (res: any) => {
        this.categories = res.categories; // Kategóriák elmentése
      },
      error: (err:any) => {
        console.error('Hiba történt a kategóriák betöltésekor:', err);
      },
    });
  }
}
