import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { provideAuth0 } from '@auth0/auth0-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),
    provideHttpClient(),
    provideAuth0({
      domain: 'dev-h1akqwp5consne5a.us.auth0.com',

      clientId: 'VFaUrHhufqrpqtM819qkH1WCKknC5t0t',

      authorizationParams: {

      redirect_uri: window.location.origin,

  },

  }),
  ]
};
