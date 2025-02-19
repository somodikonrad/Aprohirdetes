import { Routes } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';
import { RegistrationComponent } from '../components/registration/registration.component';
import { AdsComponent } from '../components/ads/ads.component';
import { UserAuthGuard } from '../guards/user-auth.guard';
import { LogoutComponent } from '../components/logout/logout.component';
import { SingleAdComponent } from '../components/single-ad/single-ad.component';



export const routes: Routes = [

  /**
   *  logged out routes
   */
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'registration', component: RegistrationComponent
  },

  /**
   * user routes
   */
  {
    path: 'ads/:category', component: AdsComponent, canActivate: [UserAuthGuard]  // Kategória paramétert várunk
  },

  {
    path: 'ads', component: AdsComponent, canActivate: [UserAuthGuard] // Alapértelmezett route
  },

  {
    path: 'singleAd/:id', component: SingleAdComponent, canActivate: [UserAuthGuard]
  },

  {
    path: 'logout', component: LogoutComponent, canActivate: [UserAuthGuard]
  },

  /**
   * Other routes
   */
  {
    path: '', redirectTo: 'ads', pathMatch: 'full'
  },
];

