import { Routes } from '@angular/router';
import { Home } from './home/home';
import { About } from './about/about';
import { Register } from './register/register';
import { Login } from './login/login';
import { Dashboard } from './dashboard/dashboard';


export const routes: Routes = [
    { path:'', component: Home },
    { path: 'home', component: Home },
    { path: 'about', component: About },
    { path: 'register', component: Register },
    { path: 'login', component: Login },
    { path: 'dashboard', component: Dashboard },
];