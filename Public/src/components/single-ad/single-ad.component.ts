import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Advertisement } from '../../interfaces/Advertisment';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';  // MatTooltip importálása


@Component({
  selector: 'app-single-ad',
  templateUrl: './single-ad.component.html',
  styleUrls: ['./single-ad.component.scss'],
  imports: [ReactiveFormsModule, 
    MatButtonModule, MatFormFieldModule, 
    MatInputModule, MatSnackBarModule, 
    CommonModule, MatCardModule, 
    MatExpansionModule, 
    MatIconModule, 
    FormsModule, 
    MatTooltipModule,
    
   
   
   ]
})
export class SingleAdComponent implements OnInit {

  advertisement: Advertisement | null = null;
  categories: any[] = [];

  constructor(
    private api: ApiService,
    private route: ActivatedRoute, 
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get the advertisement ID from the route parameters
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      console.error('Hibás ID!', id);
      return;
    }

    // Fetch the advertisement details by ID
    this.api.getAdById(id).subscribe({
      next: (data) => {
        console.log('Egy hirdetés:', data);
        this.advertisement = data;
      },
      error: (err) => {
        console.error('Hiba történt a hirdetés lekérésekor:', err);
      },
    });

    // Load categories when component is initialized
    this.categorieLoad();
  }

  // Fetch categories from the API
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
