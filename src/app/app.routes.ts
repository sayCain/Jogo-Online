import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'snake',
    loadComponent: () => import('./snake/snake.page').then( m => m.SnakePage)
  },
];
export const appRouterProviders = [provideRouter(routes)];