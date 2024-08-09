import { Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { authGuard } from "../../guard/guards/auth.guard";
import { authGuardLoginGuard } from "../../guard/guards/auth-guard-login.guard";
import { RegisterComponent } from "./register/register.component";

export const routes:Routes=[
    {
        path:'',
        component:LoginComponent,
        canActivate:[authGuardLoginGuard]
    },
    {
        path:'login',
        component:LoginComponent,
        canActivate:[authGuardLoginGuard]
    },
    {
        path:'register',
        component:RegisterComponent,
        canActivate:[authGuardLoginGuard]
    },
    {
        path:'**',
        redirectTo:'/auth',
        pathMatch:'full',
    }
]