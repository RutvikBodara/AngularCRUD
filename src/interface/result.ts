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