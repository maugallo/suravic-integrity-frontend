import { Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";

export const AUTH_ROUTES: Routes = [
    { path: 'dueno-login', component: LoginComponent },
    { path: 'encargado-login', component: LoginComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent }
]