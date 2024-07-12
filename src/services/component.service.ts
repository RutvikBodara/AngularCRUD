
import { Injectable, QueryList } from '@angular/core';
import { result } from '../interface/result';
import { contact, webAPIURL } from '../environment/commonValues';
import { APIURL } from '../environment/redirection';
import { HttpClient, HttpClientModule } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ComponentService {

  constructor(private http:HttpClient) { }
  //passs perameter
  //output will be result of string
  //method will be string
  getContacts<T>
  (
    name?:T,
    surname?:T
  )
  {
    return this.http.get<result<T>[]>(webAPIURL + APIURL.getContact)
  }

  deleteContact(id:number){
    return this.http.delete<boolean>(webAPIURL + APIURL.deleteContact +id)
  }
  UpdateContact<T>(id:number ,data:result<T>){
    return this.http.patch<boolean>(webAPIURL+APIURL.editContact +id , data)
  }
}
