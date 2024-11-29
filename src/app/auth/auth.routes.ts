import { Routes } from "@angular/router";
import { LoginComponent } from "./components/login/login.component";
import { ForgotPasswordComponent } from "./components/forgot-password/forgot-password.component";
import { WelcomeComponent } from "./components/welcome/welcome.component";

export const AUTH_ROUTES: Routes = [
    { path: 'welcome', component: WelcomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent }
]