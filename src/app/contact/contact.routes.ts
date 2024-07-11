import { Route, Routes } from "@angular/router";
import { EditComponent } from "./edit/edit.component";
import { DeleteComponent } from "./delete/delete.component";
import { CreateComponent } from "./create/create.component";
import { ListComponent } from "./list/list.component";
import { LoginComponent } from "../auth/login/login.component";

export const routes: Route[] = [
    {
        path:'',
        redirectTo:'list' ,
        pathMatch:"full"

    },
    {
        path:'edit',
        component:EditComponent
    },
    {
        path:'delete',
        component:DeleteComponent
    },
    {
        path:'create',
        component:CreateComponent
    },
    {
        path:'list',
        component:ListComponent
    },
    {
        path:'login',
        redirectTo:'/auth',
        pathMatch:"full"
    }
];