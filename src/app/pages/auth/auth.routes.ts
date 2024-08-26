import { Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { WelcomeComponent } from "./welcome/welcome.component";

export const AUTH_ROUTES: Routes = [
    { path: 'welcome', component: WelcomeComponent },
    { path: 'dueno-login', component: LoginComponent },
    { path: 'encargado-login', component: LoginComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent }
]