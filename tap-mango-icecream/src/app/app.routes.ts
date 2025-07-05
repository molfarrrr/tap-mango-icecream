import {Routes} from '@angular/router'
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
    {path: '', pathMatch: 'full', redirectTo: 'dashboard'},
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: 'dashboard',
                title: 'Dashboard',
                data: {
                    icon: 'desktop_windows',
                    title: 'Dashboard'

                },
                loadChildren: () => import('./dashboard/dashboard.routes')
            },
            {
                path:'inventory',
                title: 'Inventory',
                data: {
                    icon: 'home',
                    title: 'Inventory'
                },
                loadChildren: () => import('./inventory-manager/inventory-manager.routes')
            },
            {path: '**', redirectTo: 'dashboard', pathMatch: 'full'}
        ]
    },
]
