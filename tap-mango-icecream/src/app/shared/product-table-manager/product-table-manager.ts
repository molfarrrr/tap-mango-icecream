import { ChangeDetectionStrategy, Component, computed, inject, input, InputSignal } from '@angular/core';
import { Product, ProductFilter } from '../../models';
import { InventoryManagerStore } from '../../inventory-manager/inventory-manager.store';
import { ProductsTable } from '../products-table/products-table';

@Component({
  selector: 'app-product-table-manager',
  imports: [
    ProductsTable
  ],
  templateUrl: './product-table-manager.html',
  styleUrl: './product-table-manager.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductTableManager {
  #store = inject(InventoryManagerStore);

  productFilter: InputSignal<ProductFilter> = input.required();

  data = computed(() =>
    this.productFilter()
      ? this.#store.products()
      : this.#store.lowStockProducts()
  );

  editProduct(product: Product) {
    this.#store.updateProduct(product);
  }

  deleteProduct(product: number) {
    this.#store.deleteProduct(product);
  }
}
