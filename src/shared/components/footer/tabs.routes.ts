import { Routes } from "@angular/router";
import { FooterComponent } from "./footer.component";

export const TABS_ROUTES: Routes = [
    { path: 'tabs', component: FooterComponent, 
        children: [{ path: '', loadChildren: () => import('../../../app/home/home.routes').then(m => m.HOME_ROUTES) }] }
]
