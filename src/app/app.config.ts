import { ApplicationConfig } from "@angular/core";
import { PreloadAllModules, provideRouter, RouteReuseStrategy, withPreloading } from "@angular/router";
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { routes } from "./app.routes";
import { provideHttpClient } from "@angular/common/http";

export const appConfig: ApplicationConfig = {
    providers: [
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        provideIonicAngular(),
        provideHttpClient(),
        provideRouter(routes, withPreloading(PreloadAllModules))
    ]
  };