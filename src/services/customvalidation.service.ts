import { Injectable, input, numberAttribute } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CustomvalidationService {

  constructor() { }

  requiredCheck<T>(inputvalue:T){
    if(inputvalue instanceof String){
      return (inputvalue ? true :false)
    }
    else if(inputvalue instanceof Number){
      return (inputvalue !== null)?true:false
    }
    else if(inputvalue instanceof Date){
      return true;
    }
    return true;
  }
}
