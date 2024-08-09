import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { APIURL } from '../environment/redirection';
import { webAPIKey } from '../environment/commonValues';
import { catchError, delay, finalize, interval, throwError } from 'rxjs';
import { environment } from '../environment/environment';
import { inject} from '@angular/core';
import { CommonService } from '../services/common.service';
import { Router } from '@angular/router';

export const demoInterceptor: HttpInterceptorFn = (req, next) => {
  const url = req.url.startsWith('http')
    ? req.url
    : `${environment.apiUrl}${req.url}`;

  const loadingService = inject(CommonService);
  const routeService =inject(Router)
  loadingService.LoaderVisibilityUpdate(false);

  const reqClone = req.clone({
    url: url,
    setHeaders: {
      'API-KEY': webAPIKey,
      'jwt':(loadingService.isUserLoggedIn())? loadingService.getLocal("jwt"):""
    },
  });
  // console.log(loadingService.getLocal("jwt"))
  // console.log("my token is ths")

  return next(reqClone).pipe(
    // delay(250),
    catchError((err) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status == 401) {
          loadingService.showSnackBar("you are unauthorized to view this page")
          routeService.navigate(['/auth'])
        } else {
          console.error('http error', err);
        }
      }
      return throwError(() => err);
    }),
    finalize(() => {
      loadingService.LoaderVisibilityUpdate(true);
    })
  );
};
