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


export const routes: Route[] = [
    {
        path:'',
        component:ContactlistComponent,
        pathMatch:"full"
    },
    {
        path:'contactdetails',
        component:ContactlistComponent
    },
    {
        path:'newcontact',
        component:NewContactComponent,
    },
    {
        path:'contactType',
        component:ContactTypeComponent
    },
    {
        path:'contactTypeAccordian',
        component:NewContactTypeAccordionComponent

    },
    {
        path:'product',
        component:ProductComponent
    },
    {
        path:'addproduct',
        component:NewProductComponent
    },
    {
        path:'editproduct',
        component:ManipulateProductComponent
    },
    {
        path:'category',
        component:CategoryComponent
    },
    {
        path:'editcategory',
        component:EditCategoryComponent

    },
    {
        path:'login',
        redirectTo:'/auth',
        pathMatch:"full"
    }
];