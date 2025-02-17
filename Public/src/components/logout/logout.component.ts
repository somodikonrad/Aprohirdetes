import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-logout',
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss'
})
export class LogoutComponent {
  constructor(
    private auth: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ){}

  ngOnInit(): void {
    this.auth.logout();
    this.showMessage('Sikeres kijelentkezés', 'success');
    this.router.navigateByUrl('/login');
  }

  // Üzenet megjelenítése
  showMessage(message: string, type: 'success' | 'error') {
    this.snackBar.open(message, 'OK', {
      duration: 3000,
      panelClass: type === 'success' ? 'snackbar-success' : 'snackbar-error'
    });
  }
}
