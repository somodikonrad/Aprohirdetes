import { Routes } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';
import { RegistrationComponent } from '../components/registration/registration.component';




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
   
  {
    path: '', component:, canActivate: [UserAuthGuard]
  },
*/

  /**
   * Other routes
   */

  {
    path: '', redirectTo: 'rooms', pathMatch: 'full'
  },
 
];
