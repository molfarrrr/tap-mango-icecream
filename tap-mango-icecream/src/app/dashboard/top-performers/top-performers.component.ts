import { Component, inject, Signal } from '@angular/core';
import { DashboardStore } from '../dashboard.store';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-top-performers',
  imports: [
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    FormsModule,
    MatFormFieldModule,
    BaseChartDirective
  ],
  templateUrl: './top-performers.component.html',
  styleUrl: './top-performers.component.scss'
})
export class TopPerformersComponent {
  #store = inject(DashboardStore);
  selectedMonth: Signal<string> = this.#store.selectedMonth;
  topPerformers: Signal<ChartData<'pie', number[], string | string[]>> = this.#store.topPerformersChart;
  months: Signal<string[]> = this.#store.months;

  readonly pieChartOptions: ChartOptions = {
    responsive: false,
  };

  selectMonth(value: any) {
    this.#store.setMonths(value);
  }
}
