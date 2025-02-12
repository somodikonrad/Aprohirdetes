import { Routes } from '@angular/router';
import { RegistrationComponent } from '../components/registration/registration.component';

export const routes: Routes = [
  {
    path: 'registration',  // Itt külön útvonalat adunk meg
    component: RegistrationComponent
  },
  {
    path: '',  // Ez az alapértelmezett útvonal, ami átirányít a /registration-ra
    redirectTo: '/registration', 
    pathMatch: 'full'
  }
];
