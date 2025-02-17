import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; // Angular Material MessageService
import { ApiService } from '../../services/api.service';
import { User } from '../../interfaces/User';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSnackBarModule, CommonModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent {

  registrationForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    address: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required]) // Kötelezővé tesszük a confirmPassword mezőt
  }, { validators: this.passwordMatchValidator });

  invalidFields: string[] = [];

  constructor(private api: ApiService, private snackBar: MatSnackBar) {}

  // Egyedi validátor, amely ellenőrzi, hogy a jelszavak megegyeznek
  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    
    // Ha a confirmPassword mező nincs kitöltve vagy nem egyezik a password-dal, akkor hibát adunk
    if (!confirmPassword) {
      return { confirmPasswordRequired: true }; // Ha nincs kitöltve a confirmPassword
    }
    if (password !== confirmPassword) {
      return { passwordMismatch: true }; // Ha nem egyeznek a jelszavak
    }
    return null; // Ha minden rendben
  }

  submit() {
    if (this.registrationForm.invalid) {
      this.showMessage('Kérjük, töltsd ki az összes mezőt helyesen!', 'error');
      return;
    }
  
    const formData = {
      username: this.registrationForm.value.name,
      email: this.registrationForm.value.email,
      password: this.registrationForm.value.password,
      address: this.registrationForm.value.address,
      confirmPassword: this.registrationForm.value.confirmPassword,
      role: 'user'
    };
  
    // API hívás
    this.api.registration(formData).subscribe(
      (res: any) => {
        this.invalidFields = res.invalid || [];
  
        if (this.invalidFields.length === 0) {
          this.showMessage('Sikeres regisztráció!', 'success');
          this.registrationForm.reset();
        } else {
          this.showMessage('HIBA: ' + (res.message || 'Ismeretlen hiba'), 'error');
        }
      },
      (error) => {
        // Backend hibák kezelése
        if (error.status === 400 && error.error && error.error.message) {
          this.showMessage('HIBA: ' + error.error.message, 'error');
        } else {
          this.showMessage('Ismeretlen hiba történt.', 'error');
        }
      }
    );
  }
  
  // Ellenőrizzük, hogy az adott mező érvénytelen
  isInvalid(field: string) {
    return this.invalidFields.includes(field) || this.registrationForm.get(field)?.invalid;
  }

  // Üzenet megjelenítése
  showMessage(message: string, type: 'success' | 'error') {
    this.snackBar.open(message, 'OK', {
      duration: 3000,
      panelClass: type === 'success' ? 'snackbar-success' : 'snackbar-error'
    });
  }
}
