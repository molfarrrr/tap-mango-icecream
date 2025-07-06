import { Component, inject, Signal } from '@angular/core';
import { InventoryManagerStore } from '../../inventory-manager/inventory-manager.store';
import { ProductTableManager } from '../../shared/product-table-manager/product-table-manager';
import { Spinner } from '../../shared/spinner/spinner';
import { ProductFilter } from '../../models';

@Component({
  selector: 'app-low-stock',
  imports: [
    ProductTableManager,
    Spinner,
  ],
  templateUrl: './low-stock.component.html',
  styleUrl: './low-stock.component.scss',
  providers: [
    InventoryManagerStore,
  ],
})
export class LowStockComponent {
  readonly loading: Signal<boolean> = inject(InventoryManagerStore).loading;

  readonly productFilter: ProductFilter = ProductFilter.low;
}
