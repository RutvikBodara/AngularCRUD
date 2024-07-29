
import { Injectable, QueryList } from '@angular/core';
import { genericResponeDemo, product, productEdit, responseData, result } from '../interface/result';
import { contact, webAPIURL } from '../environment/commonValues';
import { APIURL } from '../environment/redirection';
import { HttpClient, HttpClientModule, HttpHeaders, HttpParams } from '@angular/common/http';
import { delay, Observable, retryWhen, scan } from 'rxjs';
import { error } from 'node:console';
@Injectable({
  providedIn: 'root'
})
export class ComponentService {

  constructor(private http:HttpClient) { }
  //passs perameter
  //output will be result of string
  //method will be string
  get<T extends string>
  (
    suburl:string,
    name?:T,
    surname?:T,
    id?:number,
    typeList?:string,
    commonsearch?
  ):Observable<any>
  {
    let parameters =new HttpParams()
    
    if(name){
      parameters= parameters.set('name',name)
    }
    if(surname){
      parameters= parameters.set('surname',surname)
    }
    if(id !== undefined){
      parameters=parameters.set('id',id)
    }
    if(typeList){
      parameters= parameters.set('typeList',typeList)
    }
    if(commonsearch){
      parameters =parameters.set('commonsearch',commonsearch)
    }

    return this.http.get(suburl,{params:parameters})
  }

  delete<T>(id:number,suburl:string){
    let parameters =new HttpParams()
    if(id != undefined && id != null && id > 0){
      parameters=parameters.set("id",id)
    }
    console.log(parameters)
    return this.http.delete<result<T>>(suburl,{params:parameters})
  }
  update<T>(data:responseData<T>,suburl:string){
    return this.http.patch<result<T>>(suburl,data)
  }
  updateProduct<T>(data:productEdit,suburl:string){
    return this.http.patch<result<T>>(suburl,data);
  }
  // updateContactType<T>(data:responseData<T>){
  //   return this.http.patch<result<T>>(webAPIURL +APIURL.editContactType,data)
  // }
  add<T>(data:responseData<T>,suburl:string):Observable<any>{
    console.log(suburl);
    return this.http.post<result<T>>(suburl,data)
  }

  login<T>(data,suburl:string){
    return this.http.post<genericResponeDemo<T>>(suburl,data)
  }
  
  // getContactsType<T>
  // (
  //   name?:string ,id?:number
  // )
  // {
  //   let parameters =new HttpParams()

  //   if(name){
  //     parameters= parameters.set('name',name)
  //   }
  //   if(id !== undefined){
  //     parameters=parameters.set('id',id)
  //   }
  //   return this.http.get<result<T>>(webAPIURL + APIURL.getContactType,{params:parameters})
  // }
}
