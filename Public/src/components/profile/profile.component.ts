import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../services/auth.service'; // Bejelentkezett user ellenőrzése
import { Advertisement } from '../../interfaces/Advertisment';

@Component({
  selector: 'app-profile',
  imports: [
    ReactiveFormsModule, MatButtonModule, MatFormFieldModule, 
    MatInputModule, MatSnackBarModule, CommonModule, 
    MatCardModule, MatExpansionModule, MatIconModule, 
    FormsModule, MatTooltipModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  advertisements: Advertisement[] = []; // 🚀 Tömbként kezeljük!
  categories: any[] = [];
  userId: string | null = null; // Bejelentkezett user ID

  constructor(
    private api: ApiService,
    private authService: AuthService, // AuthService hozzáadva
    private router: Router
  ) {}

  ngOnInit(): void {
    // Bejelentkezett felhasználó lekérése
    const user = this.authService.loggedUser(); // 🚀 Ezt kell használni a `getUserId()` helyett
    console.log('vauu',user.id)
  
    if (!user || !user.id) {
      console.error('Nincs bejelentkezett felhasználó!');
      return;
    }
  
    this.userId = user.id; // 🚀 Stringből számmá alakítás
  
    // Get all advertisements and filter by the logged-in user
    this.api.getAds().subscribe({
      next: (data: Advertisement[]) => {
        console.log('Összes hirdetés a profileban:', data);
        // 🚀 Filter the advertisements to show only those belonging to the logged-in user
        this.advertisements = data.filter(ad => ad.user?.id === this.userId);
      },
      error: (err) => {
        console.error('Hiba történt a hirdetések lekérésekor:', err);
      },
    });
  
    // Kategóriák betöltése
    this.categorieLoad();
  }
  
    // Törlés módszer
    deleteAdvertisement(adId: string): void {
      if (confirm('Biztosan törölni szeretnéd ezt a hirdetést?')) {
        this.api.deleteAd(adId).subscribe({
          next: () => {
            // Frissítjük a hirdetések listáját, miután töröltük
            this.advertisements = this.advertisements.filter(ad => ad.id !== Number(adId));
            console.log('Hirdetés törölve:', adId);
    
            // Hirdetések újra lekérése a törlés után
            this.api.getAds().subscribe({
              next: (data: Advertisement[]) => {
                // Az összes hirdetést betöltjük, és kiszűrjük azokat, amelyek a bejelentkezett felhasználóhoz tartoznak
                this.advertisements = data.filter(ad => ad.user?.id === this.userId);
                console.log('Frissített hirdetések:', this.advertisements);
              },
              error: (err) => {
                console.error('Hiba történt a hirdetések újratöltésekor:', err);
              }
            });
          },
          error: (err) => {
            console.error('Hiba történt a hirdetés törlésekor:', err);
          }
        });
      }
    }
    


  // Kategóriák lekérése
  categorieLoad(): void {
    this.api.getCategories().subscribe({
      next: (res: any) => {
        this.categories = res.categories;
      },
      error: (err: any) => {
        console.error('Hiba történt a kategóriák betöltésekor:', err);
      },
    });
  }
}
