import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-ads',
  templateUrl: './ads.component.html',
  styleUrls: ['./ads.component.scss'],
  imports: [ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSnackBarModule, CommonModule, MatCardModule, MatExpansionModule, MatIconModule, FormsModule, MatChipsModule],  
})
export class AdsComponent implements OnInit {
  advertisements: any[] = []; 
  filteredAdvertisements: any[] = [];  // Szűrt hirdetések
  categories: any[] = [];
  selectedCategory: string = '';  // Kiválasztott kategória

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.api.getAds().subscribe({
      next: (data) => {
        console.log(data);
        this.advertisements = data;
        this.filteredAdvertisements = data; // Alapból az összes hirdetést megjeleníti
      },
      error: (err) => {
        console.error('Hiba történt a hirdetések lekérésekor:', err);
      },
    });

    this.categorieLoad();
  }

  categorieLoad() {
    this.api.getCategories().subscribe({
      next: (res: any) => {
        console.log('Kategóriák betöltve:', res);
        this.categories = res.categories;
      },
      error: (err: any) => {
        console.error('Hiba történt a kategóriák betöltésekor:', err);
      },
    });
  }

  filterByCategory(category: any) {
    if (this.selectedCategory === category.name) {
      // Ha ugyanarra a kategóriára kattint újra, akkor mutassa az összeset
      this.selectedCategory = '';
      this.filteredAdvertisements = this.advertisements;
    } else {
      // Ha más kategóriára kattint, akkor csak az adott kategóriát mutassa
      this.selectedCategory = category.name;
      this.filteredAdvertisements = this.advertisements.filter(ad => ad.category?.name === category.name);
    }
  }
  

  navigate(adId: number) {
    this.router.navigate(['/singleAd', adId]);
  }
}
