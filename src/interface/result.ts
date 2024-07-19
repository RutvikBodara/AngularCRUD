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