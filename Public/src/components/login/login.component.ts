import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';  // Import MatFormFieldModule
import { MatInputModule } from '@angular/material/input';            // Import MatInputModule
import { ReactiveFormsModule } from '@angular/forms';               // Import ReactiveFormsModule

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    RouterModule,
    MatFormFieldModule,  // Add MatFormFieldModule here
    MatInputModule,      // Add MatInputModule here
    ReactiveFormsModule, // Add ReactiveFormsModule here
  ],
})
export class LoginComponent {

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  invalidFields: string[] = [];

  constructor(private api: ApiService, 
              private snackBar: MatSnackBar,
              private auth: AuthService,
              private router: Router) {}

  submit() {
    if (this.loginForm.invalid) {
      this.showMessage('Kérjük, töltsd ki az összes mezőt helyesen!', 'error');
      return;
    }

    const formData = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };

    // API hívás
    this.api.login(formData).subscribe(
      (res: any) => {
        this.invalidFields = res.invalid || [];

        if (this.invalidFields.length === 0) {
          this.showMessage('Sikeres bejelentkezés!', 'success');
          this.auth.login(res.token);
          this.router.navigateByUrl('/registration');
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
    return this.invalidFields.includes(field) || this.loginForm.get(field)?.invalid;
  }

  // Üzenet megjelenítése
  showMessage(message: string, type: 'success' | 'error') {
    this.snackBar.open(message, 'OK', {
      duration: 3000,
      panelClass: type === 'success' ? 'snackbar-success' : 'snackbar-error'
    });
  }
}
