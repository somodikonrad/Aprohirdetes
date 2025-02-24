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
  imports: [ReactiveFormsModule, MatChipsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSnackBarModule, CommonModule, MatCardModule, MatExpansionModule, MatIconModule, FormsModule, MatChipsModule, MatCardModule],  
})
export class AdsComponent implements OnInit {
  advertisements: any[] = []; // Hirdetések
  categories: any[] = []; // Kategóriák listája
  addAdFormVisible = false; // A form láthatósága
  newAd = {
    title: '',
    price: 0, // null helyett 0
    category: '',
    description: '',
    image: null as File | null, // Fájl vagy null
  };

  selectedCategories: string[] = []; // Hozzáadva a kiválasztott kategóriák tárolására
  
  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.api.getAds().subscribe({
      next: (data) => {
        console.log(data);
        this.advertisements = data;
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

  // A kiválasztott kategóriák alapján történő hirdetés szűrés
  filterAds() {
    if (this.selectedCategories.length === 0) {
      return this.advertisements; // Ha nincs kiválasztva kategória, minden hirdetés látható
    }
    return this.advertisements.filter(ad => 
      this.selectedCategories.includes(ad.category.name) // Csak azok az hirdetések, amelyek kategóriája a kiválasztottak között van
    );
  }

  // Kategória kiválasztásának logikája (toggling)
  toggleCategorySelection(categoryName: string) {
    const index = this.selectedCategories.indexOf(categoryName);
    if (index === -1) {
      this.selectedCategories.push(categoryName);
    } else {
      this.selectedCategories.splice(index, 1);
    }
  }

  navigate(adId: number) {
    this.router.navigate(['/singleAd', adId]);
  }

  toggleAddAdForm() {
    this.addAdFormVisible = !this.addAdFormVisible;
  }

  saveAd() {
    const adData = {
      title: this.newAd.title,
      price: this.newAd.price,
      categoryID: this.getSelectedCategoryId(),
      description: this.newAd.description,
      image: this.newAd.image
    };
    
    console.log('AdData:', adData);
  
    this.api.saveAd(adData).subscribe({
      next: (response) => {
        console.log('Hirdetés sikeresen mentve:', response);
  
        const newAd = response.advertisement;
        newAd.imageUrl = response.imageUrl;
  
        this.advertisements.push(newAd);
        this.addAdFormVisible = false;
      },
      error: (err) => {
        console.error('Hiba történt a hirdetés mentésekor:', err);
        if (err.error && err.error.invalidFields) {
          console.log('Érvénytelen mezők:', err.error.invalidFields);
        }
      },
    });
  }

  getSelectedCategoryId() {
    const selectedCategory = this.categories.find(category => category.name === this.newAd.category);
    return selectedCategory ? selectedCategory.id : null;
  }

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      console.log("Kiválasztott fájl:", file);
      this.newAd.image = file;
    } else {
      this.newAd.image = null;
    } 
  }
  
  cancelAddAd() {
    this.addAdFormVisible = false;
  }
}