import { ApplicationConfig } from "@angular/core";
import { PreloadAllModules, provideRouter, RouteReuseStrategy, withPreloading } from "@angular/router";
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { routes } from "./app.routes";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { tokenInterceptor } from "src/shared/interceptors/token.interceptor";
import { loaderInterceptor } from "src/shared/interceptors/loader.interceptor";

export const appConfig: ApplicationConfig = {
    providers: [
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        provideIonicAngular(),
        provideHttpClient(withInterceptors([tokenInterceptor, loaderInterceptor])),
        provideRouter(routes, withPreloading(PreloadAllModules))
    ]
  };