import { ApplicationConfig, provideZoneChangeDetection, provideAppInitializer, inject } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { LoginService } from './services/login.service';
import {
provideCharts,
withDefaultRegisterables,
} from 'ng2-charts';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withFetch()
    ),

    provideAppInitializer(() => {
      const loginService = inject(LoginService);
      return loginService.loadUserFromToken();
    }),

    provideCharts(withDefaultRegisterables()),
  ]
};
