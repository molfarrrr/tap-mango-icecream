import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { Spinner } from '../shared/spinner/spinner';
import { DashboardStore } from './dashboard.store';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LowStockComponent } from './low-stock/low-stock.component';
import { TopPerformersComponent } from './top-performers/top-performers.component';

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
    LowStockComponent,
    TopPerformersComponent
  ],
  providers: [
    DashboardStore
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  #store = inject(DashboardStore);
  loading: Signal<boolean> = this.#store.loading;
}
