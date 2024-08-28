import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { demoInterceptor } from '../interseptor/demo.interceptor';
import { provideStore } from '@ngxs/store';
import { withNgxsLoggerPlugin } from '@ngxs/logger-plugin';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withInterceptors([demoInterceptor])),
    provideHttpClient(withFetch()),
    provideAnimationsAsync(),
    //ngxs
    provideStore([]),
    withNgxsLoggerPlugin(),
    // provideAnimationsAsync(),
    // provideAnimationsAsync(),
    // provideAnimationsAsync(),
    // provideAnimationsAsync(),
    // provideAnimationsAsync(),
    // provideAnimationsAsync(),
    // provideAnimationsAsync(),
    // provideAnimationsAsync(),
    provideAnimationsAsync(),
    provideAnimationsAsync(),
  ],
};
