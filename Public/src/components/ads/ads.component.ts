import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-ads',
  templateUrl: './ads.component.html',
  styleUrls: ['./ads.component.scss'],
  imports: [ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSnackBarModule, CommonModule, MatCardModule, MatExpansionModule, MatIconModule,],  
})
export class AdsComponent implements OnInit {
  advertisements: any[] = []; // Adatok tárolása

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    // Hirdetések lekérése
    this.apiService.getAds().subscribe({
      next: (data) => {
        this.advertisements = data; // Beállítjuk a hirdetéseket
      },
      error: (err) => {
        console.error('Hiba történt a hirdetések lekérésekor:', err);
      },
    });
  }
}
