import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { APIURL } from '../environment/redirection';
import { webAPIKey } from '../environment/commonValues';
import { catchError, delay, finalize, interval, throwError } from 'rxjs';
import { environment } from '../environment/environment';
import { inject} from '@angular/core';
import { CommonService } from '../services/common.service';

export const demoInterceptor: HttpInterceptorFn = (req, next) => {
  const url = req.url.startsWith('http')
    ? req.url
    : `${environment.apiUrl}${req.url}`;

  const loadingService = inject(CommonService);
  loadingService.LoaderVisibilityUpdate(false);
  const reqClone = req.clone({
    url: url,
    setHeaders: {
      'API-KEY': webAPIKey,
    },
  });

  return next(reqClone).pipe(
    delay(250),
    catchError((err) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status == 401) {
          console.error('Unauthorized request:', err);
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
