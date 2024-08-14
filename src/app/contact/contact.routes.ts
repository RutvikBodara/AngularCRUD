import { Route, Routes } from "@angular/router";
import { ContactComponent } from "./contact.component";
import { ContactlistComponent } from "../../module/contact/contactlist/contactlist.component";
import { FullscreenOverlayContainer } from "@angular/cdk/overlay";
import { NewContactComponent } from "../../module/contact/new-contact/new-contact.component";
import { ContactTypeComponent } from "../../module/contact/contact-type/contact-type.component";
import { NewContactTypeAccordionComponent } from "../../module/contact/new-contact-type-accordion/new-contact-type-accordion.component";
import { ProductComponent } from "../../module/procat/product/product.component";
import { CategoryComponent } from "../../module/procat/category/category.component";
import { NewProductComponent } from "../../module/procat/product/new-product/new-product.component";
import { ManipulateProductComponent } from "../../module/procat/product/manipulate-product/manipulate-product.component";
import { EditCategoryComponent } from "../../module/procat/category/edit-category/edit-category.component";
import { PaymentPageComponent } from "../../module/payment/payment-page/payment-page.component";
import { CompletePaymentComponent } from "../../module/payment/complete-payment/complete-payment.component";
import { BestPracticesComponent } from "../../module/Knowledge/best-practices/best-practices.component";
import { ProductMatComponent } from "../../module/procat/product-mat/product-mat.component";
import { authGuard } from "../../guard/guards/auth.guard";
import { ProfileComponent } from "../../module/account/profile/profile.component";
import { CategoryMatComponent } from "../../module/procat/category-mat/category-mat.component";


export const routes: Route[] = [
    {
        path:'',
        component:ContactlistComponent,
        pathMatch:"full",
        canActivate: [authGuard] 
    },
    {
        path:'contactdetails',
        component:ContactlistComponent,
        canActivate: [authGuard] 
    },
    {
        path:'newcontact',
        component:NewContactComponent,
        canActivate: [authGuard] 
    },
    {
        path:'contactType',
        component:ContactTypeComponent,
        canActivate: [authGuard] 
    },
    {
        path:'contactTypeAccordian',
        component:NewContactTypeAccordionComponent,
        canActivate: [authGuard] 

    },
    {
        path:'product',
        component:ProductComponent,
        canActivate: [authGuard] 
    },
    {
        path:'addproduct',
        component:NewProductComponent,
        canActivate: [authGuard] 
    },
    {
        path:'editproduct',
        component:ManipulateProductComponent,
        canActivate: [authGuard] 
    },
    {
        path:'category',
        component:CategoryComponent,
        canActivate: [authGuard] 
    },
    {
        path:'editcategory',
        component:EditCategoryComponent,
        canActivate: [authGuard] 
    },
    {
        path:'login',
        redirectTo:'/auth',
        pathMatch:"full"
    },
    {
        path:'paymentgateway',
        component:PaymentPageComponent,
        canActivate: [authGuard] 
    },
    {
        path:'paymentcompleted',
        component:CompletePaymentComponent,
        canActivate: [authGuard] 
    },
    {
        path:'knowledge',
        component:BestPracticesComponent,
        canActivate: [authGuard] 
    },
    {
        path:'productmat',
        component:ProductMatComponent,
        canActivate: [authGuard] 
    },
    {
        path:'myprofile',
        component:ProfileComponent,
        canActivate:[authGuard]
    },
    {
        path:'categorymat',
        component:CategoryMatComponent,
        canActivate:[authGuard]
    },
    {
        path:'**',
        redirectTo:'/auth',
        pathMatch:'full',
    },
    
];