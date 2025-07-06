import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { Spinner } from '../shared/spinner/spinner';
import { DashboardStore } from './dashboard.store';
import { TopProduct } from '../models';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LowStockComponent } from './low-stock/low-stock.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  standalone: true,
  imports: [
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    FormsModule,
    MatFormFieldModule,
    Spinner,
    LowStockComponent
  ],
  providers: [
    DashboardStore
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  #store = inject(DashboardStore);

  selectedMonth: Signal<string> = this.#store.selectedMonth;
  topPerformers: Signal<TopProduct[]> = this.#store.topPerformers;
  loading: Signal<boolean> = this.#store.loading;
  months: Signal<string[]> = this.#store.months;

  selectMonth(value: any) {
    this.#store.setMonths(value);
  }
}
