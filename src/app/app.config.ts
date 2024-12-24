import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideToastr, ToastrModule } from 'ngx-toastr';
import { errorInterceptor } from './_interceptors/error.interceptor';
import { tokenInterceptor } from './_interceptors/token.interceptor';
import { NgxSpinnerModule } from 'ngx-spinner';
import { loadingInterceptor } from './_interceptors/loading.interceptor';


export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
     provideRouter(routes),
     provideHttpClient(withInterceptors([errorInterceptor,tokenInterceptor,loadingInterceptor])), //am adaugat serviciul de httpclient, folosind dependecyinjection
     provideAnimations(),
      provideAnimationsAsync(),
      provideToastr({
        positionClass: 'toast-bottom-right'
    }),
    importProvidersFrom(NgxSpinnerModule)
    ]
};
