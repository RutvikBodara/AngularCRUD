import { Route, Routes } from "@angular/router";
import { ContactComponent } from "./contact.component";
import { ContactlistComponent } from "../../module/contact/contactlist/contactlist.component";


export const routes: Route[] = [
    {
        path:'',
        component:ContactlistComponent,
        pathMatch:"full"
    },
    {
        path:'login',
        redirectTo:'/auth',
        pathMatch:"full"
    }
];