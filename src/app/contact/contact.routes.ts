import { Route, Routes } from "@angular/router";
import { ContactComponent } from "./contact.component";
import { ContactlistComponent } from "../../module/contact/contactlist/contactlist.component";
import { FullscreenOverlayContainer } from "@angular/cdk/overlay";
import { NewContactComponent } from "../../module/contact/new-contact/new-contact.component";
import { ContactTypeComponent } from "../../module/contact/contact-type/contact-type.component";
import { NewContactTypeAccordionComponent } from "../../module/contact/new-contact-type-accordion/new-contact-type-accordion.component";


export const routes: Route[] = [
    {
        path:'',
        component:ContactlistComponent,
        pathMatch:"full"
    },
    {
        path:'contact',
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
        path:'login',
        redirectTo:'/auth',
        pathMatch:"full"
    }
];