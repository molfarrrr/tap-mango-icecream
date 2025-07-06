import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { InventoryManagerStore } from './inventory-manager.store';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProductFilter } from '../models';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Spinner } from '../shared/spinner/spinner';
import { MatToolbar } from '@angular/material/toolbar';
import { ProductTableManager } from '../shared/product-table-manager/product-table-manager';

@Component({
  selector: 'app-inventory-manager',
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatProgressSpinnerModule, MatIconModule, MatButtonModule, Spinner, MatToolbar, ProductTableManager],
  templateUrl: './inventory-manager.component.html',
  styleUrl: './inventory-manager.component.scss',
  providers: [
    InventoryManagerStore
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InventoryManagerComponent {
  #store = inject(InventoryManagerStore);
  loading: Signal<boolean> = this.#store.loading;

  readonly productFilter: ProductFilter = ProductFilter.all;
}
