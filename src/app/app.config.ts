import { ApplicationConfig } from "@angular/core";
import { PreloadAllModules, provideRouter, RouteReuseStrategy, withPreloading } from "@angular/router";
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { routes } from "./app.routes";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { tokenInterceptor } from "./shared/interceptors/token.interceptor";
import { loaderInterceptor } from "./shared/interceptors/loader.interceptor";
import { catchErrorInterceptor } from "./shared/interceptors/catch-error.interceptor";

export const appConfig: ApplicationConfig = {
    providers: [
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        provideIonicAngular(),
        provideHttpClient(withInterceptors([tokenInterceptor, loaderInterceptor, catchErrorInterceptor])),
        provideRouter(routes, withPreloading(PreloadAllModules))
    ]
  };