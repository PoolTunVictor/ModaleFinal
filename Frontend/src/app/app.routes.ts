import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AccountSummaryComponent } from './pages/users_pages/user_resume/account-summary.component';
import { MiPerfilComponent } from './pages/users_pages/user_perfil/mi-perfil.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'resume',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path:'resume',
        component: AccountSummaryComponent
    },
    {
        path: 'perfil',
        component: MiPerfilComponent
    }
];
