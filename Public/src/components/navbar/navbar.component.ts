import { Component, OnInit, HostListener } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

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
  categories: any[] = [];
  isLoggedIn$: Observable<boolean>;

  constructor(private api: ApiService, private auth: AuthService, private router: Router) {
    this.isLoggedIn$ = this.auth.isLoggedIn$; // Subscribe to the observable
  }

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
        console.log('Kategóriák betöltve:', res);  // Logoljuk a választ
        this.categories = res.categories;  // Ellenőrizd, hogy van-e 'categories' property a válaszban
      },
      error: (err: any) => {
        console.error('Hiba történt a kategóriák betöltésekor:', err);
      },
    });
  }
  

}
