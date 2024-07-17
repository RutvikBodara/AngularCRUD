import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { APIURL } from '../environment/redirection';
import { webAPIKey } from '../environment/commonValues';
import { catchError, throwError } from 'rxjs';
import { error } from 'console';

export const demoInterceptor: HttpInterceptorFn = (req, next) => {
  const reqClone = req.clone({
    setHeaders:{
      "API-KEY" :webAPIKey
    }
  })

  return next(reqClone).pipe(
    catchError((err) =>{
      if(err instanceof HttpErrorResponse){
        if(err.status == 401){
          console.error('Unauthorized request:', err);
        }
        else{
          console.error("http error",err)
        }
      }
      return throwError(() => err); 
    })
  );
};
