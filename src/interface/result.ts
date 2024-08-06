import { Sort } from "@angular/material/sort";

export class result<T>{
    code:number
    message:T
    responseData:responseData<string>[]
}
export class responseData<T>{
    id:number;
    name:T;
    surname:T;
    count?:number
}
export class genericResponeDemo<T>{
    code:number
    message:string
    responseData:T
    maxPage?
    dataCount?
}

export class LoginDataResponse<T>{
    UserName:T
    MobileNumber:number
    JWTToken:T
    AccountId:number
    EmailId:T
}
export class LoginDataRequest<T>{
    UserName :  T
    Password:T
}
export class product
{
    id:number;
    name:string;
    description:string;
    categoryId:number;
    launchDate:string;
    file:File;
    createddate:Date;
    updatedDate:Date;
    rating:number;
    image:Blob;
    helplineNumber:string;
    lastDate:string;
    availableForSale:boolean;
    price;
    countryServed:Sort[]
}
export class productEdit{
    id:number;
    name:string;
    description:string;
    categoryId:number;
    launchDate:string;
    file:string;
    helplineNumber:string;
    lastDate:string;
    availableForSale:Boolean;
    price;
    countryServed:Sort[]
}