import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';  // Ha gombokat is használsz
import { ReactiveFormsModule } from '@angular/forms'; 



@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent,CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule, ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',

})
export class AppComponent {
  title = 'Public';
}
