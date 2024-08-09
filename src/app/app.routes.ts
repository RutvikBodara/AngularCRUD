import { RouterModule, Routes } from '@angular/router';
import { ContactComponent } from './contact/contact.component';
import { AuthComponent } from './auth/auth.component';
import { authGuard } from '../guard/guards/auth.guard';
import { authGuardLoginGuard } from '../guard/guards/auth-guard-login.guard';

export const routes: Routes = [
    {
        path:'',
        redirectTo:'/auth',
        pathMatch:'full',
    },
    {
        path:'contact',
        component:ContactComponent,
        canActivate: [authGuard], 
        loadChildren:()=> import('./contact/contact.routes').then((m)=>m.routes),
    },
    {
        path:'auth',
        component:AuthComponent,
        loadChildren:()=> import('./auth/auth.route').then((m)=> m.routes) ,
        canActivate :[authGuardLoginGuard]
    },
    {
        path:'**',
        redirectTo:'/auth',
        pathMatch:'full',
    }
];
