import { ChangeDetectorRef, Component, computed, inject, OnInit, Signal } from '@angular/core';
import { ActivatedRoute, Route, Router, RouterLink, RouterLinkActive, RouterOutlet, Routes } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, shareReplay } from 'rxjs';
import { map } from 'rxjs/operators';
import { routes } from '../app.routes';
import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { ToolbarData } from '../models';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-layout2',
  standalone: true,
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    NgOptimizedImage,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent{
  readonly #breakpointObserver = inject(BreakpointObserver);
  readonly #router: Router = inject(Router);
  readonly #route: ActivatedRoute = inject(ActivatedRoute);

  routes: Route[] = routes[1]?.children?.filter(r => r.path && r.path !== '**') as Route[];
  eventSignal = toSignal(this.#router.events);

  isHandset: Signal<boolean> = toSignal(this.#breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay(),
    ));

  toolbarData = computed<ToolbarData>(() => {
    this.eventSignal();
    const { data } = this.routes.find(r => r.path === this.#route.snapshot.firstChild?.routeConfig?.path) as any;

    return {
      icon: data?.icon,
      title: data?.title,
    }
  })
}
