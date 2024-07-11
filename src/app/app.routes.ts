import { Routes } from '@angular/router';
import { EditComponent } from './contact/edit/edit.component';
import { ContactComponent } from './contact/contact.component';
import { AuthComponent } from './auth/auth.component';

export const routes: Routes = [

    {
        path:'',
        redirectTo:'/contact',
        pathMatch:'full'
    },
    {
        path:'contact',
        component:ContactComponent,
        loadChildren:()=> import('./contact/contact.routes').then((m)=>m.routes)
    },
    {
        path:'auth',
        component:AuthComponent,
        loadChildren:()=> import('./auth/auth.route').then((m)=> m.routes)
    }
];
