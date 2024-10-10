import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { HomeComponent } from './components/main-flow/home/home.component';
import { LiveComponent } from './components/main-flow/live/live.component';
import { RefereeHlsComponent } from './components/main-flow/referee-hls/referee-hls.component';
import { RefereeHlsLocalStorageComponent } from './components/main-flow/referee-hls-use-localStorage/referee-hls-use-localStorage.component';

export const routes: Routes = [
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'live',
        component: LiveComponent
    },
    {
        path: 'referee',
        component: RefereeHlsComponent
    },
    {
        path: 'referee-localStorage',
        component: RefereeHlsLocalStorageComponent
    }
];
